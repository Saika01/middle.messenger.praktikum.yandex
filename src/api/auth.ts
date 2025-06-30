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
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (response.status !== 200) {
            throw new Error(JSON.parse(response.responseText).reason);
        }
        
        return JSON.parse(response.responseText) as SignUpResponse;
    }

    async login(data: LoginRequestData): Promise<void> {
        const response = await authApi.post('/signin', { 
            data: JSON.stringify(data),
            headers: { 
                'Content-Type': 'application/json',
            },
        });
        
        if (response.status !== 200) {
            throw new Error(JSON.parse(response.responseText).reason);
        }
    }

    async me(): Promise<UserDTO> {
        const response = await authApi.get('/user', {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
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