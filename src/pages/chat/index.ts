import './chat.css';
import { Block } from '../../core/block.ts';
import template from './chat.hbs?raw';
import { connect } from '../../utils/connect';
import { Store } from '../../core/store';
import { ChatController } from './chat-controller.ts';

import AuthApi from '../../api/auth.ts';
import ChatApi from '../../api/chats.ts';

// const authApi = new AuthApi();
// const userInfo = await authApi.user();
// console.log(userInfo);
// const chatApi = new ChatApi();
// // const newChatId = await chatApi.createChat({title: 'chat3'}); // 72608
// const chatsInfo = await chatApi.getChat({offset: 0, limit: 10, title: 'my-chat'});
// console.log(chatsInfo);
// await chatApi.addUsersToChat({'users': [userInfo.id],'chatId': 72608});
// await chatApi.deleteChat({chatId: 72602});

// const props = {};

const chatController = new ChatController();
// const allChats = chatController.allChats({offset: 0, limit: 1, title: ''});
// console.log(allChats);

class ChatBase extends Block {
    constructor(props?: Record<string, unknown>) {
        // store: Store;
        super(props || {});
        // this.setProps({dialogues : allChats});
        // console.log('dfgdfg',this.props);
        // if (props) {
        //     props.dialogues = allChats;
        // }
        // store: Store;
        // this.store = new Store({
        //     chatPage: {
        //         dialogues: [],
        //         talkingArea: null
        //     }
        // });

        // this.store.on('chatPage', (state: any) => {
        //     this.setProps(state);
        // });
        
        // Загрузка данных при инициализации
        // this.addToProps();
        this.loadChats();
    }

    // async componentDidMount() {
    //     super.componentDidMount?.();
    //     await this.loadChats();
    // }

    private async loadChats() {
        try {
            // Загружаем данные асинхронно
            const chats = await chatController.allChats({
                offset: 0,
                limit: 10,
                title: ''
            });
            
            // Преобразуем данные для отображения
            // const mappedChats = chats.map(chat => this.mapChatToView(chat));
            
            // Обновляем состояние компонента
            console.log('chats 0', chats[0]);
            this.setProps({
                dialogues: chats,
                // isLoading: false
            });
        } catch (error) {
            this.setProps({
                error: 'Ошибка загрузки чатов',
                isLoading: false
            });
        }
    }

    render(): DocumentFragment {
        // await this.addToProps();
        console.log('chat props', this.props.dialogues);
        return this._compile(template, this.props);
    }

    componentDidMount() {
        super.componentDidMount?.();
    }

    // async addToProps() {
    //     const chatController = new ChatController();
    //     this.props.dialogues = await chatController.allChats({offset: 0, limit: 1, title: ''});
    // }
}

const withChatError = connect((state) => ({
    error: state.chatError,
}));

export const Chat = withChatError(ChatBase);

// type User = {
//   id: number;
//   login: string;
//   firstName: string;
//   secondName: string;
//   displayName: string;
//   avatar: string;
//   phone: string;
//   email: string;
// };

// type ChatData = {
//   id: number;
//   title: string;
//   avatar: string;
//   createdBy: number;
//   unreadCount: number;
//   lastMessage?: {
//     user: User;
//     time: string;
//     content: string;
//   };
// };

// interface StoreState {
//   user?: User;
//   chats?: ChatData[];
//   [key: string]: unknown;
// };

// class ChatController {
//     public getUser(): Promise<void> {
//         return ChatAPI.getUser()
//             .then((data: User) => store.set('user', data));
//     }

//     public static getChat(): void {
//         // Implement your chat fetching logic here
//     }
// }

// const chatAPIInstance = new HTTPTransport('api/v1/chats');

// class ChatAPI extends BaseAPI {
//     public static getUser(): Promise<User> {
//         // Implement actual user fetching logic
//         return Promise.resolve({} as User);
//     }

//     create() {
//         // Здесь уже не нужно писать полный путь /api/v1/chats/
//         // return chatAPIInstance.post('/', {title: 'string'});
//     }

//     request() {
//         // Здесь уже не нужно писать полный путь /api/v1/chats/
//         return chatAPIInstance.get('/full');
//     }

//     update() { 
//         return chatAPIInstance.put('/');
//     }

//     delete() { throw new Error('Not implemented'); }
// }

// export class Chat extends Block {
//     constructor(props: StoreState) {
//         super(props);

//         // запрашиваем данные у контроллера
//         ChatController.getChat();

//         // подписываемся на событие
//         store.on(StoreEvents.Updated, () => {
//             // вызываем обновление компонента, передав данные из хранилища
//             this.setProps(store.getState());
//         });
//     }

//     render() {
//         return this._compile(template, this.props);
//     }
// }
