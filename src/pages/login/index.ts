// import './login.css';
// import { Block } from '../../core/block';
// // import { userLoginController } from './login-controller';
// import template from './login.hbs?raw';
// import { connect } from '../../utils/connect';
// import * as Components from '../../components';

// interface LoginPageProps {
//   events?: {
//     submit: (e: Event) => void;
//   };
//   error?: string;
// }

// export class LoginPage extends Block {
//     constructor() {
//         super({
//             loginInput: new Components.Input({
//                 type: 'text',
//                 label: 'Логин',
//                 name: 'login'
//             }),
//             passwordInput: new Components.Input({
//                 type: 'password',
//                 label: 'Пароль',
//                 name: 'password'
//             }),
//             authButton: new Components.Button({
//                 type: 'confirm',
//                 text: 'Авторизоваться',
//                 isSubmit: true
//             }),
//             registerButton: new Components.Button({
//                 type: 'cancel',
//                 text: 'Нет аккаунта?'
//             })
//         });
//     }

//     protected render(): DocumentFragment {
//         return this._compile(template, this.props);
//     }
// }

// // const withLoginError = connect((state) => ({
// //     error: state.loginError,
// // }));

// // export const LoginPage = withLoginError(LoginPageBase);


import { Block } from '../../core/block';
import { loginController } from './login-controller';
import template from './login.hbs?raw';
import { connect } from '../../utils/connect';
import * as Components from '../../components';

interface LoginPageProps {
    events?: {
        submit: (e: Event) => void;
    };
    error?: string;
}

const props = {
    loginInput: new Components.Input({
        type: 'text',
        label: 'Логин',
        name: 'login',
    }),
    passwordInput: new Components.Input({
        type: 'password',
        label: 'Пароль',
        name: 'password',
    }),
    authButton: new Components.Button({
        type: 'confirm',
        text: 'Авторизоваться',
        isSubmit: true,
    }),
    registerButton: new Components.Button({
        type: 'cancel',
        text: 'Нет аккаунта?',
    }),
    events: {
        submit: (e: Event) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const data = {
                login: formData.get('login') as string,
                password: formData.get('password') as string,
            };
            loginController.login(data);
        },
    },
};

class LoginPageBase extends Block {
    // constructor(props?: Record<string, unknown>) {
    //     super(props || {});
    //     console.log('LoginPage props:', props);
    // }

    render(): DocumentFragment {
        console.log('Rendering LoginPage with template:', template);
        return this._compile(template, this.props);
    }
}

// Подключаем стор для отображения ошибок
const withLoginError = connect((state) => ({
    error: state.loginError,
}));

export const LoginPage = withLoginError(LoginPageBase);
