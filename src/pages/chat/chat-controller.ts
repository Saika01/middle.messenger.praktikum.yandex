import ChatApi from '../../api/chats';
import UserApi from '../../api/user';
import AuthApi from '../../api/auth';
import * as Types from '../../api/type';
import { Store } from '../../core/store';
import { DialogueLine } from '../../components/dialogue-line';
import { WSHandler } from '../../core/webSocketHandler';
import { Block } from '../../core/block';

type BlockClass = new (props?: Record<string, unknown>) => Block;
type ChatData = [BlockClass, { [key: string]: Object | Block; }];

export class ChatController {
    private api: ChatApi;
    private store: Store;

    constructor() {
        this.api = new ChatApi();
        this.store = window.store;
    }

    async setCurrentChat(chatId: number, title: string) {
        const currentUser = window.store.getState().user;
        if (!currentUser) {
            return;
        }

        const userId = currentUser.id;
        const tokenValue = JSON.parse((await this.api.getChatToken({id: chatId})).responseText).token;
        const ws = new WSHandler(`wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${tokenValue}`);
        await ws.connect();

        this.store.set({ currentChatInfo: {
            id: chatId,
            title: title,
            ws: ws
        }});

        ws.send({
            type: 'get old',
            content: '0'
        });

        const messagesRecieved = ws.on('message', async (data: Types.Messages) => {
            if (data.length < 0) {
                return;
            }

            const users = JSON.parse((await this.api.getUsers({id: chatId})).responseText);
            const talkingAreaParam = {
                name: users[0].first_name,
                messages: data.map(message => {
                    return {
                        isMine: message.user_id === userId,
                        message: message.content,
                        time: message.time
                    };
                })
            };

            const currentState = this.store.getState();
            const updatedProps = {...currentState.props};
            const chatData : ChatData = [...updatedProps.chat];
            const chatConfig = { ...chatData[1] };
            chatConfig.talkingAreaInfo = talkingAreaParam;
            chatConfig.isMock = false;
            chatData[1] = chatConfig;
            updatedProps.chat = chatData;
            
            this.store.set({props: updatedProps});
            messagesRecieved();
        });

        ws.on('message', async (data: Types.Message) => {
            if (data.type !== 'message') {
                return;
            }

            type Message = {
                isMine: boolean;
                message: string;
                time: string;
            }
            
            const currentState = this.store.getState();
            const updatedProps = {...currentState.props};
            const chatData : ChatData = [...updatedProps.chat];
            const chatConfig = { ...chatData[1] };
            const talkingAreaInfo = {...chatConfig.talkingAreaInfo} as { messages?: Message[] };
            let messages = talkingAreaInfo.messages;
            
            messages = [
                {
                    isMine: data.user_id === userId,
                    message: data.content,
                    time: data.time
                },
                ...(messages || []),
            ];

            talkingAreaInfo.messages = messages;
            chatConfig.talkingAreaInfo = talkingAreaInfo;
            chatData[1] = chatConfig;
            updatedProps.chat = chatData;
            
            this.store.set({props: updatedProps});
        });
    }

    async createChat() {
        const chatName = prompt('Choose chat name', 'my-chat');

        if (chatName === null) {
            return;
        }

        const data: Types.CreateChat = { title: chatName };

        try {
            await this.api.createChat(data);
            window.location.reload();
        } catch (error) {
            console.error('Chat error:', error);
            this.store.set({ error: 'Ошибка соединения' });
        }
    }

    async addUser() {
        const userLogin = prompt('Type in user login to add user', '');

        if (userLogin === null) {
            return;
        }

        const userApi = new UserApi();
        const userInformation = await userApi.postSearch({login: userLogin});

        const currentChatInfo = this.store.getState().currentChatInfo;
        if (!currentChatInfo) {
            return;
        }

        const data: Types.DataToAddUserToChat = { users: [ userInformation.id ], chatId: Number(currentChatInfo.id) };

        try {
            await this.api.addUsersToChat(data);
            window.router.go('/messenger');
            window.location.reload();
        } catch (error) {
            console.error('Chat error:', error);
            this.store.set({ error: 'Ошибка соединения' });
        }
    }

    async deleteUser() {
        const userLogin = prompt('Type in user login to delete user', '');

        if (userLogin === null) {
            return;
        }

        const userApi = new UserApi();
        const userInformation = await userApi.postSearch({login: userLogin});

        const currentChatInfo = this.store.getState().currentChatInfo;
        
        if (!currentChatInfo) {
            return;
        }

        const data: Types.DataToAddUserToChat = { users: [ userInformation.id ], chatId: Number(currentChatInfo.id) };

        try {
            await this.api.deleteUsersFromChat(data);
            window.router.go('/messenger');
            window.location.reload();
        } catch (error) {
            console.error('Chat error:', error);
            this.store.set({ error: 'Ошибка соединения' });
        }
    }

    async allChats(data?: Types.GetChatRequest) {
        const authApi = new AuthApi();
        const currentUser = await authApi.user();
        if (!currentUser) {
            return;
        }

        try {
            const response = await this.api.getAllChats(data);

            const dialogues = response.map(dialogue => { 
                return new DialogueLine({
                    id: dialogue.id,
                    title: dialogue.title,
                    name: dialogue.last_message && dialogue.last_message.user.login || 'name',
                    time: dialogue.last_message && dialogue.last_message.time || 'time',
                    isYou: dialogue.last_message && (dialogue.last_message.user.login === currentUser.login) || false,
                    message: dialogue.last_message && dialogue.last_message.content || 'No messages',
                    isShowQuantity: !!dialogue.unread_count,
                    quantity: dialogue.unread_count,
                    isCurrent: false
                });
            });

            return dialogues;
        } catch (error) {
            console.error('Chat error:', error);
            this.store.set({ error: 'Ошибка соединения' });
        }
    }
}
