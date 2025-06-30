import './chat.css';
import { Block } from '../../core/block.ts';
import template from './chat.hbs?raw';
import store, { StoreEvents } from '../../core/store.ts';
import { HTTPTransport } from '../../core/http';
import { BaseAPI } from '../../core/baseApi';

type User = {
  id: number;
  login: string;
  firstName: string;
  secondName: string;
  displayName: string;
  avatar: string;
  phone: string;
  email: string;
};

type ChatData = {
  id: number;
  title: string;
  avatar: string;
  createdBy: number;
  unreadCount: number;
  lastMessage?: {
    user: User;
    time: string;
    content: string;
  };
};

interface StoreState {
  user?: User;
  chats?: ChatData[];
  [key: string]: unknown;
};

class ChatController {
    public getUser(): Promise<void> {
        return ChatAPI.getUser()
            .then((data: User) => store.set('user', data));
    }

    public static getChat(): void {
        // Implement your chat fetching logic here
    }
}

const chatAPIInstance = new HTTPTransport('api/v1/chats');

class ChatAPI extends BaseAPI {
    public static getUser(): Promise<User> {
        // Implement actual user fetching logic
        return Promise.resolve({} as User);
    }

    create() {
        // Здесь уже не нужно писать полный путь /api/v1/chats/
        // return chatAPIInstance.post('/', {title: 'string'});
    }

    request() {
        // Здесь уже не нужно писать полный путь /api/v1/chats/
        return chatAPIInstance.get('/full');
    }

    update() { 
        return chatAPIInstance.put('/');
    }

    delete() { throw new Error('Not implemented'); }
}

export class Chat extends Block {
    constructor(props: StoreState) {
        super(props);

        // запрашиваем данные у контроллера
        ChatController.getChat();

        // подписываемся на событие
        store.on(StoreEvents.Updated, () => {
            // вызываем обновление компонента, передав данные из хранилища
            this.setProps(store.getState());
        });
    }

    render() {
        return this._compile(template, this.props);
    }
}
