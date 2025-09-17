import { HTTPTransport } from '../core/http';
import type {
    CreateUser,
    SignUpResponse,
    SearchUser,
    Passwords,
    PasswordResponse
} from './type';

const userApi = new HTTPTransport('/user');

export default class UserApi {
    async putProfile(data: CreateUser): Promise<SignUpResponse> {
        const response = await userApi.put('/profile', { 
            data: data
        });
        
        if (response.status !== 200) {
            throw new Error(JSON.parse(response.responseText).reason);
        }
        
        return JSON.parse(response.responseText) as SignUpResponse;
    }

    async putAvatar(data: FormData): Promise<PasswordResponse> {
        const response = await userApi.put('/profile/avatar', { 
            data: data
        });
        
        if (response.status !== 200) {
            throw new Error(JSON.parse(response.responseText).reason);
        }
        
        return response;
    }

    async putPassword(data: Passwords): Promise<PasswordResponse> {
        const response = await userApi.put('/password', { 
            data: data
        });
        
        if (response.status !== 200) {
            throw new Error(JSON.parse(response.responseText).reason);
        }
        
        return response;
    }

    async postSearch(data: SearchUser): Promise<SignUpResponse> {
        const response = await userApi.post('/search', { 
            data: data
        });
        
        if (response.status !== 200) {
            throw new Error(JSON.parse(response.responseText).reason);
        }
        
        return JSON.parse(response.responseText)[0];
    }
}
