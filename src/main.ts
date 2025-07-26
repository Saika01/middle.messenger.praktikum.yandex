import './style.css';
import { Block } from './core/block';
import { checkIsFormValid } from './core/validation';
import * as Components from './components';
import * as Pages from './pages';
import { setupFormValidation } from './core/validation';
import { Route } from './core/route';
import { Router } from './core/router';
import { Store, StoreEvents } from './core/store';
import { LoginController } from './pages/login/login-controller';
import { signinController } from './pages/signin/signin-controller';
import { changeProfileController } from './pages/change-profile/change-profile-controller';
import { changePasswordController } from './pages/change-password/change-password-controller';
import { ChatController } from './pages/chat/chat-controller';
import AuthApi from './api/auth';
// import UserApi from './api/user';

type BlockClass = new (props?: Record<string, unknown>) => Block;

const pages: Record<string, [BlockClass, {[key:string]: Block | Object}]> = {
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
        })
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
        secondNamseInput: new Components.Input({
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
        })
    }],
    error500: [Pages.Error, {
        number: '500',
        message: 'Мы уже фиксим',
    }],
    error404: [Pages.Error, {
        number: '404',
        message: 'Что-то пошло не так',
    }],
    // chat: [Pages.Chat, {
    //     dialogues: [
    //         {
    //             name: 'Виктор',
    //             time: '16:30',
    //             isYou: false,
    //             message: 'Видео готово, проверьте',
    //             isShowQuantity: false,
    //             quantity: 0,
    //             isCurrent: true,
    //         },
    //         {
    //             name: 'Алиса',
    //             time: '14:00',
    //             isYou: true,
    //             message: 'Купила билеты в кино на субботу',
    //             isShowQuantity: false,
    //             quantity: 0,
    //             isCurrent: false,
    //         },
    //         {
    //             name: 'Киноклуб',
    //             time: '12:00',
    //             isYou: true,
    //             message: 'стикер',
    //             isShowQuantity: false,
    //             quantity: 999,
    //             isCurrent: false,
    //         },
    //         {
    //             name: 'Сергей',
    //             time: '11:30',
    //             isYou: true,
    //             message: 'Готово!',
    //             isShowQuantity: true,
    //             quantity: 1,
    //             isCurrent: false,
    //         },
    //         {
    //             name: 'Андрей Николаевич Смирнов-Петровский',
    //             time: '10:49',
    //             isYou: false,
    //             message: 'Добрый день! Хотел обсудить с вами важный вопрос касательно нашего совместного проекта по разработке мобильного приложения для iOS и Android. Когда вам будет удобно созвониться?',
    //             isShowQuantity: true,
    //             quantity: 2,
    //             isCurrent: false,
    //         },
    //         {
    //             name: 'Мария Петровна',
    //             time: 'Пт',
    //             isYou: false,
    //             message: 'Документы готовы, можете забирать',
    //             isShowQuantity: true,
    //             quantity: 5,
    //             isCurrent: false,
    //         },
    //         {
    //             name: 'Семейный чат',
    //             time: 'Вс',
    //             isYou: true,
    //             message: 'Приезжаем в гости в следующее воскресенье',
    //             isShowQuantity: true,
    //             quantity: 8,
    //             isCurrent: false,
    //         },
    //         {
    //             name: 'Ольга Дмитриевна (бухгалтерия)',
    //             time: 'Вт',
    //             isYou: false,
    //             message: 'Прошу предоставить до конца дня все отчетные документы за апрель 2023 года, включая акты выполненных работ, счета-фактуры и накладные. Это срочно нужно для подготовки квартального отчета в налоговую инспекцию.',
    //             isShowQuantity: true,
    //             quantity: 999,
    //             isCurrent: false,
    //         },
    //         {
    //             name: 'Иван Иванович Петров-Водкин (директор по развитию)',
    //             time: '3 Апреля 2021',
    //             isYou: false,
    //             message: 'Срочно! Сегодня в 14:30 в конференц-зале состоится внеочередное собрание с инвесторами. Подготовьте, пожалуйста, презентацию по текущим показателям проекта и прогнозам на следующий квартал. Особое внимание уделите финансовой части.',
    //             isShowQuantity: true,
    //             quantity: 10,
    //             isCurrent: false,
    //         },
    //         {
    //             name: 'Рабочий чат',
    //             time: '1 Мая 2020',
    //             isYou: false,
    //             message: 'Сегодня праздничный день, офис не работает',
    //             isShowQuantity: false,
    //             quantity: 0,
    //             isCurrent: false,
    //         },
    //         {
    //             name: 'Группа университета',
    //             time: '20 Декабря 2019',
    //             isYou: false,
    //             message: 'Напоминаю о завтрашней лекции в 10:00',
    //             isShowQuantity: true,
    //             quantity: 100000,
    //             isCurrent: false,
    //         },
    //     ],
    //     isMock: false,
    //     talkingArea: new Components.TalkingArea({ talkingData: {
    //         name: 'Вася',
    //         messages: [
    //             {
    //                 isMine: false,
    //                 message: `Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой.

    //   Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.`,
    //                 time: '11:56',
    //             },
    //             {
    //                 isMine: true,
    //                 message: 'Вау, не знал об этом! Получается, эти камеры так и остались на Луне как артефакты?',
    //                 time: '11:58',
    //             },
    //             {
    //                 isMine: false,
    //                 message: 'Именно так! 12 камер до сих пор там. Кстати, у NASA даже есть их точные координаты.',
    //                 time: '12:01',
    //             },
    //             {
    //                 isMine: true,
    //                 message: 'А почему они не забрали камеры? Вес экономили?',
    //                 time: '12:03',
    //             },
    //             {
    //                 isMine: false,
    //                 message: 'Да, каждый грамм на счету. Лунный модуль имел жёсткие ограничения по массе. Но пленка, конечно, была приоритетом 😊',
    //                 time: '12:05',
    //             },
    //             {
    //                 isMine: true,
    //                 message: 'Сорян, опаздываю на встречу! Продолжим позже?',
    //                 time: '12:07',
    //             },
    //             {
    //                 isMine: false,
    //                 message: 'Конечно! Как раз найду тебе фото той аукционной камеры. Удачи на встрече!',
    //                 time: '12:08',
    //             },
    //             {
    //                 isMine: true,
    //                 message: '👍',
    //                 time: '12:08',
    //             },
    //         ],
    //     }})
    // }],
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
            color: 'blu'
        }),
        logoutButton: new Components.Button({
            type: 'line',
            text: 'Выйти',
            color: 'red'
        })
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
        })
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
        })
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

const props: Record<string, [BlockClass, {[key:string]: Block | Object}]> = {
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
            'click .button-cancel': (e: Event) => {
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
            'click .button-cancel': (e: Event) => {
                window.router.go('/');
            }
        }
    }],
    error500: [Pages.Error, {
        number: '500',
        message: 'Мы уже фиксим',
        events: {
            'click .error__button': (e: Event) => {
                window.router.go('/messenger');
            }
        }
    }],
    error404: [Pages.Error, {
        number: '404',
        message: 'Что-то пошло не так',
        events: {
            'click .error__button': (e: Event) => {
                window.router.go('/messenger');
            }
        }
    }],
    chat: [Pages.Chat, {
        // dialogues: [
        //     new Components.DialogueLine({
        //         name: 'Виктор',
        //         time: '16:30',
        //         isYou: false,
        //         message: 'Видео готово, проверьте',
        //         isShowQuantity: false,
        //         quantity: 0,
        //         isCurrent: true,
        //     }),
        //     new Components.DialogueLine({
        //         name: 'Алиса',
        //         time: '14:00',
        //         isYou: true,
        //         message: 'Купила билеты в кино на субботу',
        //         isShowQuantity: false,
        //         quantity: 0,
        //         isCurrent: false,
        //     }),
        //     new Components.DialogueLine({
        //         name: 'Киноклуб',
        //         time: '12:00',
        //         isYou: true,
        //         message: 'стикер',
        //         isShowQuantity: false,
        //         quantity: 999,
        //         isCurrent: false,
        //     }),
        //     new Components.DialogueLine({
        //         name: 'Сергей',
        //         time: '11:30',
        //         isYou: true,
        //         message: 'Готово!',
        //         isShowQuantity: true,
        //         quantity: 1,
        //         isCurrent: false,
        //     }),
        //     new Components.DialogueLine({
        //         name: 'Андрей Николаевич Смирнов-Петровский',
        //         time: '10:49',
        //         isYou: false,
        //         message: 'Добрый день! Хотел обсудить с вами важный вопрос касательно нашего совместного проекта по разработке мобильного приложения для iOS и Android. Когда вам будет удобно созвониться?',
        //         isShowQuantity: true,
        //         quantity: 2,
        //         isCurrent: false,
        //     }),
        //     new Components.DialogueLine({
        //         name: 'Мария Петровна',
        //         time: 'Пт',
        //         isYou: false,
        //         message: 'Документы готовы, можете забирать',
        //         isShowQuantity: true,
        //         quantity: 5,
        //         isCurrent: false,
        //     }),
        //     new Components.DialogueLine({
        //         name: 'Семейный чат',
        //         time: 'Вс',
        //         isYou: true,
        //         message: 'Приезжаем в гости в следующее воскресенье',
        //         isShowQuantity: true,
        //         quantity: 8,
        //         isCurrent: false,
        //     }),
        //     new Components.DialogueLine({
        //         name: 'Ольга Дмитриевна (бухгалтерия)',
        //         time: 'Вт',
        //         isYou: false,
        //         message: 'Прошу предоставить до конца дня все отчетные документы за апрель 2023 года, включая акты выполненных работ, счета-фактуры и накладные. Это срочно нужно для подготовки квартального отчета в налоговую инспекцию.',
        //         isShowQuantity: true,
        //         quantity: 999,
        //         isCurrent: false,
        //     }),
        //     new Components.DialogueLine({
        //         name: 'Иван Иванович Петров-Водкин (директор по развитию)',
        //         time: '3 Апреля 2021',
        //         isYou: false,
        //         message: 'Срочно! Сегодня в 14:30 в конференц-зале состоится внеочередное собрание с инвесторами. Подготовьте, пожалуйста, презентацию по текущим показателям проекта и прогнозам на следующий квартал. Особое внимание уделите финансовой части.',
        //         isShowQuantity: true,
        //         quantity: 10,
        //         isCurrent: false,
        //     }),
        //     new Components.DialogueLine({
        //         name: 'Рабочий чат',
        //         time: '1 Мая 2020',
        //         isYou: false,
        //         message: 'Сегодня праздничный день, офис не работает',
        //         isShowQuantity: false,
        //         quantity: 0,
        //         isCurrent: false,
        //     }),
        //     new Components.DialogueLine({
        //         name: 'Группа университета',
        //         time: '20 Декабря 2019',
        //         isYou: false,
        //         message: 'Напоминаю о завтрашней лекции в 10:00',
        //         isShowQuantity: true,
        //         quantity: 100000,
        //         isCurrent: false,
        //     }),
        // ],
        // dialogues: window.store.dialogues,
        isMock: false,
        talkingArea: new Components.TalkingArea({ talkingData: {
            name: 'Вася',
            messages: [
                {
                    isMine: false,
                    message: `Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой.

      Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.`,
                    time: '11:56',
                },
                {
                    isMine: true,
                    message: 'Вау, не знал об этом! Получается, эти камеры так и остались на Луне как артефакты?',
                    time: '11:58',
                },
                {
                    isMine: false,
                    message: 'Именно так! 12 камер до сих пор там. Кстати, у NASA даже есть их точные координаты.',
                    time: '12:01',
                },
                {
                    isMine: true,
                    message: 'А почему они не забрали камеры? Вес экономили?',
                    time: '12:03',
                },
                {
                    isMine: false,
                    message: 'Да, каждый грамм на счету. Лунный модуль имел жёсткие ограничения по массе. Но пленка, конечно, была приоритетом 😊',
                    time: '12:05',
                },
                {
                    isMine: true,
                    message: 'Сорян, опаздываю на встречу! Продолжим позже?',
                    time: '12:07',
                },
                {
                    isMine: false,
                    message: 'Конечно! Как раз найду тебе фото той аукционной камеры. Удачи на встрече!',
                    time: '12:08',
                },
                {
                    isMine: true,
                    message: '👍',
                    time: '12:08',
                },
            ],
        }}),
        events: {
            'click .menu__plus': (e: Event) => {
                const chatController = new ChatController();
                chatController.createChat();
            },
            'click .talk__profile__menu': (e: Event) => {
                // window.store.currentChatId = e.target.querySelector('.dialogues__dialogue').dataset.chatId;
                // console.log(e.target);
                const chatController = new ChatController();
                chatController.addUser();
            },
            'click .menu__profile': (e: Event) => {
                window.router.go('/profile');
            },
        }

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
            'click .button-line.button--blue': (e: Event) => {
                window.router.go('/settings');
            },
            'click .info__manage-buttons .wrapper:nth-of-type(2) .button-line.button--blue': (e: Event) => {
                window.router.go('/change-password');
            },
            'click .button-line.button--red': (e: Event) => {
                const loginController = new LoginController();
                loginController.logout();
            },
            'click .profile__back': (e: Event) => {
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
                    changeProfileController.changeProfile(profileData);
                    changeProfileController.changeAvatar(avatarData);
                }
            },
            'click .profile__back': (e: Event) => {
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
            'click .profile__back': (e: Event) => {
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

const routes = {
    login: new Route('/', Pages.LoginPage, {
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
        })
    })
}; 

function navigate(page: string) {
    const [PageClass, props] = pages[page];
    const pageInstance = new PageClass(props);

    const container = document.getElementById('app')!;
    container.innerHTML = '';
    const content = pageInstance.getContent()!;
    container.appendChild(content);

    const form = content.querySelector('form');
    if (form) {
        setupFormValidation(content.querySelector('form') as HTMLFormElement);
    }
}

// document.addEventListener('DOMContentLoaded', () => navigate('navigation'));

declare global {
    interface Window { 
        router: Router,
        store: Store
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('hgc');

    window.store = new Store({
        isLoading: false,
        user: null,
        error: null,
    });
    console.log(window.store);

    window.store.on(StoreEvents.Updated, () => {
        const { user } = window.store.getState();
        
        if (user) {
            window.router.go('/messenger');
        }
    });

    initRouter(props);
});

const initRouter = (props: Record<string, [BlockClass, {[key:string]: Block | Object}]>) => {
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

// window.router = window.router || {};
// window.router = new Router('#app');
// window.router
// .use('/', Pages.LoginPage)
// .use('/signup', Pages.ListPage)
// .use('*', Pages.NavigatePage)
// .start();

// document.addEventListener('click', (e) => {
//     const { target } = e;
//     if (!(target instanceof HTMLElement)) {
//         return;
//     }

//     const page = target.closest('a')?.getAttribute('page');
//     if (page) {
//         navigate(page);

//         e.preventDefault();
//         e.stopImmediatePropagation();
//     }
// });

// const testData = {
//     first_name: 'Ivan',
//     second_name: 'Ivanov',
//     login: 'ivanivanov',
//     email: 'ivan@ya.ru',
//     password: 'strongpassword',
//     phone: '+79991234567',
// };

// Создаем транспорт и отправляем запрос
const api = new AuthApi();

async function testSignup() {
    // console.log('dffd');
    // const loginController = new LoginController();
    // await loginController.login({ login: 'nanaN', password: 'KakKik444' });
    // const userApi = new UserApi();
    // console.log(userApi.postSearch({ login: 'nanaN'}));
    api.logout();
}

// Запускаем тест
// testSignup();
