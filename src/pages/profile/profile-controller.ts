// import AuthApi from '../../api/auth';
// import { Store } from '../../core/store';

// class SigninController {
//     private api: AuthApi;
//     private store: Store;

//     constructor() {
//         this.api = new AuthApi();
//         this.store = window.store;
//     }

//     async signin(data: { email: string, login: string, first_name: string, second_name: string, phone: string, password: string }) {
//         try {
//             await this.api.create(data);
//             try {
//                 const response = await this.api.user();
//                 this.store.set({ user: response });
//                 window.router.go('/messenger');
//             } catch (error) {
//                 console.error('Get user info:', error);
//                 this.store.set({ error: 'Ошибка соединения' });
//             }
//         } catch (error) {
//             console.error('Signin error:', error);
//             this.store.set({ error: 'Ошибка соединения' });
//         }
//     }
// }

// export const signinController = new SigninController();