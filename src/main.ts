import './style.css';
import { Block } from './core/block';
import { checkIsFormValid } from './core/validation';
import * as Components from './components';
import * as Pages from './pages';
import { Router } from './core/router';
import { Store } from './core/store';
import { LoginController } from './pages/login/login-controller';
import { signinController } from './pages/signin/signin-controller';
import { ChangeProfileController } from './pages/change-profile/change-profile-controller';
import { changePasswordController } from './pages/change-password/change-password-controller';
import { ChatController } from './pages/chat/chat-controller';
import AuthApi from './api/auth';

type BlockClass = new (props?: Record<string, unknown>) => Block;

const props: Record<string, [BlockClass, { [key: string]: Block | Object }]> = {
    login: [Pages.LoginPage, {
        loginInput: new Components.Input({
            type: 'text',
            label: 'Логин',
            name: 'login'
        }),
        passwordInput: new Components.Input({
            type: 'password',
            label: 'Пароль',
            name: 'password'
        }),
        authButton: new Components.Button({
            type: 'confirm',
            text: 'Авторизоваться',
            isSubmit: true
        }),
        registerButton: new Components.Button({
            type: 'cancel',
            text: 'Нет аккаунта?'
        }),
        events: {
            'submit form': (e: Event) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                if (checkIsFormValid(form)) {
                    const formData = new FormData(form);
                    const data = {
                        login: formData.get('login') as string,
                        password: formData.get('password') as string,
                    };
                    const loginController = new LoginController();
                    loginController.login(data);
                }
            },
            'click .button-cancel': () => {
                window.router.go('/sign-up');
            }
        }
    }],
    signin: [Pages.SignInPage, {
        mailInput: new Components.Input({
            type: 'text',
            label: 'Почта',
            name: 'email'
        }),
        loginInput: new Components.Input({
            type: 'text',
            label: 'Логин',
            name: 'login'
        }),
        firstNameInput: new Components.Input({
            type: 'text',
            label: 'Имя',
            name: 'first_name'
        }),
        secondNameInput: new Components.Input({
            type: 'text',
            label: 'Фамилия',
            name: 'second_name'
        }),
        phoneInput: new Components.Input({
            type: 'text',
            label: 'Телефон',
            name: 'phone'
        }),
        passwordInput: new Components.Input({
            type: 'password',
            label: 'Пароль',
            name: 'password'
        }),
        secondPassword: new Components.Input({
            type: 'password',
            label: 'Пароль (ещё раз)',
            name: ''
        }),
        registerButton: new Components.Button({
            type: 'confirm',
            text: 'Зарегистрироваться',
            isSubmit: true
        }),
        logInButton: new Components.Button({
            type: 'cancel',
            text: 'Войти'
        }),
        events: {
            'submit form': (e: Event) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                if (checkIsFormValid(form)) {
                    const formData = new FormData(form);
                    const data = {
                        email: formData.get('email') as string,
                        login: formData.get('login') as string,
                        first_name: formData.get('first_name') as string,
                        second_name: formData.get('second_name') as string,
                        phone: formData.get('phone') as string,
                        password: formData.get('password') as string
                    };
                    signinController.signin(data);
                }
            },
            'click .button-cancel': () => {
                window.router.go('/');
            }
        }
    }],
    error500: [Pages.Error, {
        number: '500',
        message: 'Мы уже фиксим',
        events: {
            'click .error__button': () => {
                window.router.go('/messenger');
            }
        }
    }],
    error404: [Pages.Error, {
        number: '404',
        message: 'Что-то пошло не так',
        events: {
            'click .error__button': () => {
                window.router.go('/messenger');
            }
        }
    }],
    chat: [Pages.Chat, {
        dialogues: [],
        isMock: true,
        talkingArea: {},
        talkingAreaInfo: {
            messages: []
        },
        events: {
            'click .menu__plus': () => {
                const chatController = new ChatController();
                chatController.createChat();
            },
            'click .talk__profile__menu': () => {
                const chatController = new ChatController();
                const isAddUser = prompt('If you want to add user to chat, type +. If you want to delete user from chat, type -', '');
                switch (isAddUser) {
                case '+':
                    chatController.addUser();
                    break;
                case '-':
                    chatController.deleteUser();
                    break;
                default:
                    break;
                }
            },
            'click .menu__profile': () => {
                window.router.go('/profile');
            },
            'click .managing-area__dialogues': (e: Event) => {
                document.querySelectorAll('.dialogues__dialogue').forEach(dialogue => dialogue.classList.remove('dialogues__dialogue--isCurrent'));

                if (!e.target) {
                    return;
                }

                const target = e.target as HTMLElement;
                const currentDialogue = target && target.closest('.dialogues__dialogue') as HTMLElement;

                if (!currentDialogue) {
                    return;
                }

                currentDialogue.classList.add('dialogues__dialogue--isCurrent');
                const chatController = new ChatController();
                chatController.setCurrentChat(Number(currentDialogue.dataset.chatid), currentDialogue.dataset.title as string);
            },
            'submit form': (e: Event) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                if (checkIsFormValid(form)) {
                    const formData = new FormData(form);
                    const data = {
                        content: formData.get('message') as string,
                        type: 'message',
                    };

                    const currentChatInfo = window.store.getState().currentChatInfo;
                    if (!currentChatInfo) {
                        return;
                    }

                    currentChatInfo.ws.send(data);
                }
            },
        },
    }],
    userProfile: [Pages.Profile, {
        photo: false,
        name: 'Иван',
        profileDescription: [
            {
                attribute: 'Почта',
                value: 'pochta@yandex.ru',
            },
            {
                attribute: 'Логин',
                value: 'ivanivanov',
            },
            {
                attribute: 'Имя',
                value: 'Иван',
            },
            {
                attribute: 'Фамилия',
                value: 'Иванов',
            },
            {
                attribute: 'Имя в чате',
                value: 'Иван',
            },
            {
                attribute: 'Телефон',
                value: '+7 (909) 967 30 30',
            },
        ],
        changeDataButton: new Components.Button({
            type: 'line',
            text: 'Изменить данные',
            color: 'blue'
        }),
        changePasswordButton: new Components.Button({
            type: 'line',
            text: 'Изменить пароль',
            color: 'blue'
        }),
        logoutButton: new Components.Button({
            type: 'line',
            text: 'Выйти',
            color: 'red'
        }),
        events: {
            'click .info__manage-buttons .wrapper:nth-of-type(1) .button-line.button--blue': () => {
                window.router.go('/settings');
            },
            'click .info__manage-buttons .wrapper:nth-of-type(2) .button-line.button--blue': () => {
                window.router.go('/change-password');
            },
            'click .button-line.button--red': () => {
                const loginController = new LoginController();
                loginController.logout();
            },
            'click .profile__back': () => {
                window.router.back();
            }
        }
    }],
    changeUserProfile: [Pages.ChangeProfile, {
        photo: false,
        name: 'Иван',
        profileDescription: [
            {
                input: new Components.Input({
                    type: 'text',
                    attribute: 'Почта',
                    name: 'email',
                }),
                value: 'pochta@yandex.ru',
            },
            {
                input: new Components.Input({
                    type: 'text',
                    attribute: 'Логин',
                    name: 'login',
                }),
                value: 'ivanivanov',
            },
            {
                input: new Components.Input({
                    type: 'text',
                    attribute: 'Имя',
                    name: 'first_name',
                }),
                value: 'Иван',
            },
            {
                input: new Components.Input({
                    type: 'text',
                    attribute: 'Фамилия',
                    name: 'second_name',
                }),
                value: 'Иванов',
            },
            {
                input: new Components.Input({
                    type: 'text',
                    attribute: 'Имя в чате',
                    name: 'display_name',
                }),
                value: 'Иван',
            },
            {
                input: new Components.Input({
                    type: 'text',
                    attribute: 'Телефон',
                    name: 'phone',
                }),
                value: '+7 (909) 967 30 30',
            },
        ],
        avatarInput: new Components.Input({
            type: 'file',
            label: 'Выбрать изображение',
            name: 'avatar'
        }),
        saveButton: new Components.Button({
            type: 'confirm',
            text: 'Сохранить',
            isSubmit: true
        }),
        events: {
            'submit form': (e: Event) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                if (checkIsFormValid(form)) {
                    const formData = new FormData(form);
                    const profileData = {
                        first_name: formData.get('first_name') as string,
                        second_name: formData.get('second_name') as string,
                        display_name: formData.get('display_name') as string,
                        login: formData.get('login') as string,
                        email: formData.get('email') as string,
                        phone: formData.get('phone') as string
                    };
                    const avatarData = { avatar: formData.get('avatar') as File };
                    const controller = new ChangeProfileController();
                    controller.changeProfile(profileData);
                    controller.changeAvatar(avatarData);
                }
            },
            'click .profile__back': () => {
                window.router.back();
            }
        }
    }],
    changePassword: [Pages.ChangePassword, {
        oldPasswordInput: new Components.Input({
            type: 'password',
            label: 'Старый пароль',
            name: 'oldPassword'
        }),
        newPasswordInput: new Components.Input({
            type: 'password',
            label: 'Новый пароль',
            name: 'newPassword'
        }),
        saveButton: new Components.Button({
            type: 'confirm',
            text: 'Сохранить',
            isSubmit: true
        }),
        events: {
            'submit form': (e: Event) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                if (checkIsFormValid(form)) {
                    const formData = new FormData(form);
                    const profileData = {
                        oldPassword: formData.get('oldPassword') as string,
                        newPassword: formData.get('newPassword') as string
                    };
                    changePasswordController.changePassword(profileData);
                }
            },
            'click .profile__back': () => {
                window.router.back();
            }
        }
    }],
    navigation: [Pages.Navigation, {
        pages: [
            {
                systemName: 'login',
                readableName: 'Login',
            },
            {
                systemName: 'signin',
                readableName: 'Sign-in',
            },
            {
                systemName: 'error404',
                readableName: '404',
            },
            {
                systemName: 'error500',
                readableName: '500',
            },
            {
                systemName: 'chat',
                readableName: 'Messages',
            },
            {
                systemName: 'userProfile',
                readableName: 'Profile',
            },
            {
                systemName: 'changeUserProfile',
                readableName: 'Change user information',
            },
            {
                systemName: 'changePassword',
                readableName: 'Change password',
            },
        ],
    }],
};

declare global {
    interface Window {
        router: Router,
        store: Store
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const userApi = new AuthApi();
    const userInfo = await userApi.user();

    window.store = new Store({
        isLoading: false,
        user: userInfo || null,
        error: null,
        props: props
    });

    initRouter(props);

    if (!userInfo && !window.location.href.includes('sign-up')) {
        window.router.go('/');
    }

    if (userInfo && window.location.pathname.length === 1) {
        window.router.go('/messenger');
    }
});

const initRouter = (props: Record<string, [BlockClass, { [key: string]: Block | Object }]>) => {
    const APP_ROOT_ELEMENT = '#app';
    window.router = new Router(APP_ROOT_ELEMENT);

    window.router
        .use('/', Pages.LoginPage, props.login[1])
        .use('/sign-up', Pages.SignInPage, props.signin[1])
        .use('/messenger', Pages.Chat, props.chat[1])
        .use('/profile', Pages.Profile, props.userProfile[1])
        .use('/chat', Pages.Chat, props.chat[1])
        .use('/settings', Pages.ChangeProfile, props.changeUserProfile[1])
        .use('/change-password', Pages.ChangePassword, props.changePassword[1])
        .use('/500', Pages.Error, props.error500[1])
        .use('/404', Pages.Error, props.error404[1])
        .start();
};
