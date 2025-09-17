import { HTTPTransport } from '../core/http';
import { WSHandler } from '../core/webSocketHandler';
import type {
    CreateChat,
    GetChatRequest,
    IdResponse,
    ChatInfo,
    Messages,
    DataToAddUserToChat,
    DataToGetUsersInChat
} from './type';

const chatApi = new HTTPTransport('/chats');

export default class ChatApi {
    async createChat(data: CreateChat): Promise<IdResponse> {
        const response = await chatApi.post('', { 
            data: data
        });
        
        if (response.status !== 200) {
            throw new Error(JSON.parse(response.responseText).reason);
        }
        
        return JSON.parse(response.responseText) as IdResponse;
    }

    async getAllChats(data?: GetChatRequest): Promise<ChatInfo> {
        const response = await chatApi.get('', {
            data: data
        });
        
        if (response.status !== 200) {
            throw new Error(JSON.parse(response.responseText).reason);
        }
        
        return JSON.parse(response.responseText) as ChatInfo;
    }

    async getMessages(data: {content: string, type: string}, chatId: number) {
        const response = await chatApi.get(`/${chatId}/new`, {
            data: data
        });
        
        if (response.status !== 200) {
            throw new Error(JSON.parse(response.responseText).reason);
        }
        
        return JSON.parse(response.responseText) as Messages;
    }

    async deleteChat(data: {chatId: number}): Promise<XMLHttpRequest> {
        const response = await chatApi.delete('', { 
            data: data
        });
        
        if (response.status !== 200) {
            throw new Error(JSON.parse(response.responseText).reason);
        }
        
        return response;
    }

    async getUsers(data: DataToGetUsersInChat): Promise<XMLHttpRequest> {
        const response = await chatApi.get(`/${data.id}/users`, { 
            data: data
        });
        
        if (response.status !== 200) {
            throw new Error(JSON.parse(response.responseText).reason);
        }
        
        return response;
    }

    async addUsersToChat(data: DataToAddUserToChat): Promise<XMLHttpRequest> {
        const response = await chatApi.put('/users', { 
            data: data
        });
        
        if (response.status !== 200) {
            throw new Error(JSON.parse(response.responseText).reason);
        }
        
        return response;
    }

    async deleteUsersFromChat(data: DataToAddUserToChat): Promise<XMLHttpRequest> {
        const response = await chatApi.delete('/users', { 
            data: data
        });
        
        if (response.status !== 200) {
            throw new Error(JSON.parse(response.responseText).reason);
        }
        
        return response;
    }

    async getChatToken(data: DataToGetUsersInChat) {
        const response = await chatApi.post(`/token/${data.id}`, { 
            data: data
        });
        
        if (response.status !== 200) {
            throw new Error(JSON.parse(response.responseText).reason);
        }
        
        return response;
    }

    async setWebSocket(data: DataToGetUsersInChat) {
        const currentUser = window.store.getState().user;
        if (!currentUser) {
            return;
        }

        const userId = currentUser.id;
        const chatId = data.id;
        const tokenValue = JSON.parse((await this.getChatToken(data)).responseText).token;
        const ws = new WSHandler(`wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${tokenValue}`);
        ws.connect();
    }
}