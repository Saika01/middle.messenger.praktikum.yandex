import { HTTPTransport } from '../core/http';
import type {
    CreateChat,
    GetChatRequest,
    IdResponse,
    UserDTO,
    ChatInfo,
    DataToAddUserToChat
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

    async getChat(data: GetChatRequest): Promise<ChatInfo> {
        const response = await chatApi.get('', { 
            data: data
        });
        
        if (response.status !== 200) {
            throw new Error(JSON.parse(response.responseText).reason);
        }
        
        return JSON.parse(response.responseText) as ChatInfo;
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

    async addUsersToChat(data: DataToAddUserToChat): Promise<XMLHttpRequest> {
        const response = await chatApi.put('/users', { 
            data: data
        });
        
        if (response.status !== 200) {
            throw new Error(JSON.parse(response.responseText).reason);
        }
        
        return response;
    }
}