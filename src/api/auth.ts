import { HTTPTransport } from '../core/http';
import type {
    APIError,
    CreateUser,
    LoginRequestData,
    SignUpResponse,
    UserDTO,
} from './type';

const authApi = new HTTPTransport('/auth');

export default class AuthApi {
    async create(data: CreateUser): Promise<SignUpResponse> {
        const response = await authApi.post('/signup', { 
            data: data
        });
        
        if (response.status !== 200) {
            throw new Error(JSON.parse(response.responseText).reason);
        }
        
        return JSON.parse(response.responseText) as SignUpResponse;
    }

    async login(data: LoginRequestData): Promise<XMLHttpRequest> {
        const response = await authApi.post('/signin', { 
            data: data
        });

        return response;
    }

    async user(): Promise<UserDTO> {
        const response = await authApi.get('/user');
        
        if (response.status !== 200) {
            throw new Error(JSON.parse(response.responseText).reason);
        }
        
        return JSON.parse(response.responseText) as UserDTO;
    }

    async logout(): Promise<void> {
        const response = await authApi.post('/logout', {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (response.status !== 200) {
            throw new Error(JSON.parse(response.responseText).reason);
        }
    }
}