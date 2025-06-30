// import { LoginAPI } from './login';
// import { Router } from '../../core/router';
// import { Store } from '../../core/store';

// // interface LoginFormModel {
// //   email: string;
// //   password: string;
// // }

// const loginApi = new LoginAPI();
// const router = new Router('#app');
// const store = new Store({
//     isLoading: false,
//     user: null,
//     loginError: null,
//     // other initial state properties
// });

// class UserLoginController {
//     public async login(data: { login: string; password: string }) {
//         try {
//             store.set({'isLoading': true});
            
//             const response = await loginApi.create(data);

//             if (response.status === 200) {
//                 const userData = JSON.parse(response.responseText);
//                 store.set({ user: userData });
//                 router.go('/chat');
//             } else {
//                 const errorData = JSON.parse(response.responseText);
//                 store.set({ loginError: errorData.reason || 'Login failed' });
//             }
//         } catch (error) {
//             console.error('Login failed:', error);
//             store.set({'loginError': 'Connection error'});
//         } finally {
//             store.set({'isLoading': false});
//         }
//     }
// }

// export const userLoginController = new UserLoginController();

// // const userLoginValidator = validateLoginFields(validateRules);

// // class UserLoginController {
// //     public async login(data: LoginFormModel) {
// //         try {
// //             // Запускаем крутилку            

// //             const validateData = userLoginValidator(data);

// //             if (!validateData.isCorrect) {
// //                 throw new Error(validateData);
// //             }
        
// //             const userID = loginApi.request(prepareDataToRequest(data));

// //             RouteManagement.go('/chats');

// //             // Останавливаем крутилку
// //         } catch (error) {
// //             // Логика обработки ошибок
// //         }
// //     }
// // }

// // c декораторами

// // class UserLoginController {
// //     @validate(userLoginValidateRules)
// //     @handleError(handler)
// //     public async login(data: LoginFormModel) {
// //         const userID = loginApi.request(prepareDataToRequest(data));
// //         RouteManagement.go('/chats');
// //     }
// // }


import AuthApi from '../../api/auth';
import { Store } from '../../core/store';

export class LoginController {
    private api: AuthApi;
    private store: Store;

    constructor() {
        this.api = new AuthApi();
        this.store = window.store;
    }

    async login(data: { login: string; password: string }) {
        try {
            const response = await this.api.login(data);

            if (response.status === 200) {
                // Успешная авторизация
                this.store.set({ user: JSON.parse(response.responseText) });
                window.router.go('/chat'); // Перенаправляем в чат
            } else {
                // Ошибка авторизации
                const error = JSON.parse(response.responseText).reason;
                this.store.set({ loginError: error });
            }
        } catch (error) {
            console.error('Login error:', error);
            this.store.set({ loginError: 'Ошибка соединения' });
        }
    }
}

export const loginController = new LoginController();