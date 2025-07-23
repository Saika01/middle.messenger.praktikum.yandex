import UserApi from '../../api/user';
import { Store } from '../../core/store';

class ChangePasswordController {
    private api: UserApi;
    private store: Store;

    constructor() {
        this.api = new UserApi();
        this.store = window.store;
    }

    async changePassword(data: { oldPassword: string, newPassword: string}) {
        try {
            await this.api.putPassword(data);
            window.router.go('/profile');
        } catch (error) {
            console.error('Change password error:', error);
            this.store.set({ error: 'Ошибка соединения' });
        }
    }
}

export const changePasswordController = new ChangePasswordController();