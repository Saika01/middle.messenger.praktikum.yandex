import AuthApi from '../../api/auth';

export class ProfileController {
    private api: AuthApi;

    constructor() {
        this.api = new AuthApi();
    }

    async setUserInformation() {
        const userInfo = await this.api.user();
        if (!userInfo) {
            return;
        }
        return userInfo;
    }
}
