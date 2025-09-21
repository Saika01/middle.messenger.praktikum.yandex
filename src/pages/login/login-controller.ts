import AuthApi from '../../api/auth';
import { Store } from '../../core/store';

class LoginError extends Error {
    status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.status = status;
    }
}

export class LoginController {
    private api: AuthApi;
    private store: Store;

    constructor() {
        this.api = new AuthApi();
        this.store = window.store;
    }

    async login(data: { login: string; password: string }) {
        let response;
        try {
            response = await this.api.login(data);

            if (response.status !== 200) {
                const errorCastom = new LoginError(JSON.parse(response.responseText).reason, response.status);
                throw errorCastom;
            }

            try {
                const response = await this.api.user();
                this.store.set({ user: response });
                window.router.go('/messenger');
            } catch (error) {
                this.store.set({ error: 'Ошибка соединения' });
            }

        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'Ошибка соединения';

            if (error instanceof LoginError) {
                errorMessage = error.message;
                
                if (error.status === 401) {
                    errorMessage = 'Неверный логин или пароль';
                    window.router.go('/sign-up');
                }
            }

            this.store.set({ error: errorMessage });
        }
    }

    async logout() {
        try {
            await this.api.logout();
            this.store.set({ user: null });
            window.router.go('/');
        } catch(error) {
            console.error('Logout:', error);
            this.store.set({ error: 'Ошибка соединения' });
        }
    }
}
