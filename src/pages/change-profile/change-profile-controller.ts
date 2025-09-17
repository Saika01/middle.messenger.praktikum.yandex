import UserApi from '../../api/user';
import { Store } from '../../core/store';

export class ChangeProfileController {
    private api: UserApi;
    private store: Store;

    constructor() {
        this.api = new UserApi();
        this.store = window.store;
    }

    async changeProfile(data: {
            first_name: string,
            second_name: string,
            display_name: string,
            login: string,
            email: string,
            phone: string
        }) {
        try {
            const response = await this.api.putProfile(data);
            this.store.set({ user: response });
            window.router.go('/profile');
        } catch (error) {
            console.error('Change profile error:', error);
            this.store.set({ error: 'Ошибка соединения' });
        }
    }

    async changeAvatar(data: { avatar : File }) {
        try {
            console.log(data);
            const formData = new FormData();
            formData.append('avatar', data.avatar);
            const response = await this.api.putAvatar(formData);
            this.store.set({ user: response });
            window.router.go('/settings');
        } catch (error) {
            console.error('Change avatar error:', error);
            this.store.set({ error: 'Ошибка соединения' });
        }
    }
}
