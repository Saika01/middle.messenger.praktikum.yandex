import ChatApi from '../../api/chats';
import UserApi from '../../api/user';
import AuthApi from '../../api/auth';
import * as Types from '../../api/type';
import { Store } from '../../core/store';
import { DialogueLine } from '../../components/dialogue-line';

export class ChatController {
    private api: ChatApi;
    private store: Store;

    constructor() {
        this.api = new ChatApi();
        this.store = window.store;
    }

    async createChat() {
        const chatName = prompt('Choose chat name', 'my-chat');

        if (chatName === null) {
            return;
        }

        const data: Types.CreateChat = { title: chatName };

        try {
            const response = await this.api.createChat(data);
            // this.store.set({ user: response });
            // window.router.go('/messenger');
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
        console.log(userInformation.id);
        // const currentUserInformation = await userApi.

        // при тыке на чат выбираем id чата (в компонентах сделать компонент плашки чата,
        // в котором в дада-атрибутах прописывать ид чата. по клику кидать ид в стор)

        const data: Types.DataToAddUserToChat = { users: [ userInformation.id ], chatId: 0 };
    }

    async allChats(data: Types.GetChatRequest) {
        const authApi = new AuthApi();
        const currentUser = await authApi.user();

        try {
            const response = await this.api.getChat(data);
            // this.store.set({ user: response });
            // window.router.go('/messenger');
            console.log('response', response);
            const dialogues = response.map(dialogue => { 
                return new DialogueLine({
                    id: dialogue.id,
                    name: dialogue.last_message && dialogue.last_message.user.login || 'name',
                    time: dialogue.last_message && dialogue.last_message.time || 'time',
                    isYou: dialogue.last_message && (dialogue.last_message.user.login === currentUser.login) || false,
                    message: dialogue.last_message && dialogue.last_message.content || 'No messages',
                    isShowQuantity: !!dialogue.unread_count,
                    quantity: dialogue.unread_count,
                    isCurrent: false
                });
            });

            // this.store.set({ dialogues: dialogues});
            console.log('dial', dialogues);
            return dialogues;
        } catch (error) {
            console.error('Chat error:', error);
            this.store.set({ error: 'Ошибка соединения' });
        }
    }

    // async getChat(data: Types.GetChatRequest) {
    //     try {
    //         const response = await this.api.getChat(data);
    //         // this.store.set({ user: response });
    //         window.router.go(`/messenger/${response.id}`);
    //     } catch (error) {
    //         console.error('Chat error:', error);
    //         this.store.set({ error: 'Ошибка соединения' });
    //     }
    // }

    // TODO

    // async deleteChat(data: { avatar : File }) {
    //     try {
    //         const response = await this.api.deleteChat(data);
    //         this.store.set({ user: response });
    //         window.router.go('/settings');
    //     } catch (error) {
    //         console.error('Change avatar error:', error);
    //         this.store.set({ error: 'Ошибка соединения' });
    //     }
    // }
}

// export const chatController = new ChatController();