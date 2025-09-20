// const pages: Record<string, [BlockClass, { [key: string]: Block | Object }]> = {
//     login: [Pages.LoginPage, {
//         loginInput: new Components.Input({
//             type: 'text',
//             label: 'Логин',
//             name: 'login'
//         }),
//         passwordInput: new Components.Input({
//             type: 'password',
//             label: 'Пароль',
//             name: 'password'
//         }),
//         authButton: new Components.Button({
//             type: 'confirm',
//             text: 'Авторизоваться',
//             isSubmit: true
//         }),
//         registerButton: new Components.Button({
//             type: 'cancel',
//             text: 'Нет аккаунта?'
//         })
//     }],
//     signin: [Pages.SignInPage, {
//         mailInput: new Components.Input({
//             type: 'text',
//             label: 'Почта',
//             name: 'email'
//         }),
//         loginInput: new Components.Input({
//             type: 'text',
//             label: 'Логин',
//             name: 'login'
//         }),
//         firstNameInput: new Components.Input({
//             type: 'text',
//             label: 'Имя',
//             name: 'first_name'
//         }),
//         secondNamseInput: new Components.Input({
//             type: 'text',
//             label: 'Фамилия',
//             name: 'second_name'
//         }),
//         phoneInput: new Components.Input({
//             type: 'text',
//             label: 'Телефон',
//             name: 'phone'
//         }),
//         passwordInput: new Components.Input({
//             type: 'password',
//             label: 'Пароль',
//             name: 'password'
//         }),
//         secondPassword: new Components.Input({
//             type: 'password',
//             label: 'Пароль (ещё раз)',
//             name: ''
//         }),
//         registerButton: new Components.Button({
//             type: 'confirm',
//             text: 'Зарегистрироваться',
//             isSubmit: true
//         }),
//         logInButton: new Components.Button({
//             type: 'cancel',
//             text: 'Войти'
//         })
//     }],
//     error500: [Pages.Error, {
//         number: '500',
//         message: 'Мы уже фиксим',
//     }],
//     error404: [Pages.Error, {
//         number: '404',
//         message: 'Что-то пошло не так',
//     }],
//     // chat: [Pages.Chat, {
//     //     dialogues: [
//     //         {
//     //             name: 'Виктор',
//     //             time: '16:30',
//     //             isYou: false,
//     //             message: 'Видео готово, проверьте',
//     //             isShowQuantity: false,
//     //             quantity: 0,
//     //             isCurrent: true,
//     //         },
//     //         {
//     //             name: 'Алиса',
//     //             time: '14:00',
//     //             isYou: true,
//     //             message: 'Купила билеты в кино на субботу',
//     //             isShowQuantity: false,
//     //             quantity: 0,
//     //             isCurrent: false,
//     //         },
//     //         {
//     //             name: 'Киноклуб',
//     //             time: '12:00',
//     //             isYou: true,
//     //             message: 'стикер',
//     //             isShowQuantity: false,
//     //             quantity: 999,
//     //             isCurrent: false,
//     //         },
//     //         {
//     //             name: 'Сергей',
//     //             time: '11:30',
//     //             isYou: true,
//     //             message: 'Готово!',
//     //             isShowQuantity: true,
//     //             quantity: 1,
//     //             isCurrent: false,
//     //         },
//     //         {
//     //             name: 'Андрей Николаевич Смирнов-Петровский',
//     //             time: '10:49',
//     //             isYou: false,
//     //             message: 'Добрый день! Хотел обсудить с вами важный вопрос касательно нашего совместного проекта по разработке мобильного приложения для iOS и Android. Когда вам будет удобно созвониться?',
//     //             isShowQuantity: true,
//     //             quantity: 2,
//     //             isCurrent: false,
//     //         },
//     //         {
//     //             name: 'Мария Петровна',
//     //             time: 'Пт',
//     //             isYou: false,
//     //             message: 'Документы готовы, можете забирать',
//     //             isShowQuantity: true,
//     //             quantity: 5,
//     //             isCurrent: false,
//     //         },
//     //         {
//     //             name: 'Семейный чат',
//     //             time: 'Вс',
//     //             isYou: true,
//     //             message: 'Приезжаем в гости в следующее воскресенье',
//     //             isShowQuantity: true,
//     //             quantity: 8,
//     //             isCurrent: false,
//     //         },
//     //         {
//     //             name: 'Ольга Дмитриевна (бухгалтерия)',
//     //             time: 'Вт',
//     //             isYou: false,
//     //             message: 'Прошу предоставить до конца дня все отчетные документы за апрель 2023 года, включая акты выполненных работ, счета-фактуры и накладные. Это срочно нужно для подготовки квартального отчета в налоговую инспекцию.',
//     //             isShowQuantity: true,
//     //             quantity: 999,
//     //             isCurrent: false,
//     //         },
//     //         {
//     //             name: 'Иван Иванович Петров-Водкин (директор по развитию)',
//     //             time: '3 Апреля 2021',
//     //             isYou: false,
//     //             message: 'Срочно! Сегодня в 14:30 в конференц-зале состоится внеочередное собрание с инвесторами. Подготовьте, пожалуйста, презентацию по текущим показателям проекта и прогнозам на следующий квартал. Особое внимание уделите финансовой части.',
//     //             isShowQuantity: true,
//     //             quantity: 10,
//     //             isCurrent: false,
//     //         },
//     //         {
//     //             name: 'Рабочий чат',
//     //             time: '1 Мая 2020',
//     //             isYou: false,
//     //             message: 'Сегодня праздничный день, офис не работает',
//     //             isShowQuantity: false,
//     //             quantity: 0,
//     //             isCurrent: false,
//     //         },
//     //         {
//     //             name: 'Группа университета',
//     //             time: '20 Декабря 2019',
//     //             isYou: false,
//     //             message: 'Напоминаю о завтрашней лекции в 10:00',
//     //             isShowQuantity: true,
//     //             quantity: 100000,
//     //             isCurrent: false,
//     //         },
//     //     ],
//     //     isMock: false,
//     //     talkingArea: new Components.TalkingArea({ talkingData: {
//     //         name: 'Вася',
//     //         messages: [
//     //             {
//     //                 isMine: false,
//     //                 message: `Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой.

//     //   Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.`,
//     //                 time: '11:56',
//     //             },
//     //             {
//     //                 isMine: true,
//     //                 message: 'Вау, не знал об этом! Получается, эти камеры так и остались на Луне как артефакты?',
//     //                 time: '11:58',
//     //             },
//     //             {
//     //                 isMine: false,
//     //                 message: 'Именно так! 12 камер до сих пор там. Кстати, у NASA даже есть их точные координаты.',
//     //                 time: '12:01',
//     //             },
//     //             {
//     //                 isMine: true,
//     //                 message: 'А почему они не забрали камеры? Вес экономили?',
//     //                 time: '12:03',
//     //             },
//     //             {
//     //                 isMine: false,
//     //                 message: 'Да, каждый грамм на счету. Лунный модуль имел жёсткие ограничения по массе. Но пленка, конечно, была приоритетом 😊',
//     //                 time: '12:05',
//     //             },
//     //             {
//     //                 isMine: true,
//     //                 message: 'Сорян, опаздываю на встречу! Продолжим позже?',
//     //                 time: '12:07',
//     //             },
//     //             {
//     //                 isMine: false,
//     //                 message: 'Конечно! Как раз найду тебе фото той аукционной камеры. Удачи на встрече!',
//     //                 time: '12:08',
//     //             },
//     //             {
//     //                 isMine: true,
//     //                 message: '👍',
//     //                 time: '12:08',
//     //             },
//     //         ],
//     //     }})
//     // }],
//     userProfile: [Pages.Profile, {
//         photo: false,
//         name: 'Иван',
//         profileDescription: [
//             {
//                 attribute: 'Почта',
//                 value: 'pochta@yandex.ru',
//             },
//             {
//                 attribute: 'Логин',
//                 value: 'ivanivanov',
//             },
//             {
//                 attribute: 'Имя',
//                 value: 'Иван',
//             },
//             {
//                 attribute: 'Фамилия',
//                 value: 'Иванов',
//             },
//             {
//                 attribute: 'Имя в чате',
//                 value: 'Иван',
//             },
//             {
//                 attribute: 'Телефон',
//                 value: '+7 (909) 967 30 30',
//             },
//         ],
//         changeDataButton: new Components.Button({
//             type: 'line',
//             text: 'Изменить данные',
//             color: 'blue'
//         }),
//         changePasswordButton: new Components.Button({
//             type: 'line',
//             text: 'Изменить пароль',
//             color: 'blu'
//         }),
//         logoutButton: new Components.Button({
//             type: 'line',
//             text: 'Выйти',
//             color: 'red'
//         })
//     }],
//     changeUserProfile: [Pages.ChangeProfile, {
//         photo: false,
//         name: 'Иван',
//         profileDescription: [
//             {
//                 input: new Components.Input({
//                     type: 'text',
//                     attribute: 'Почта',
//                     name: 'email',
//                 }),
//                 value: 'pochta@yandex.ru',
//             },
//             {
//                 input: new Components.Input({
//                     type: 'text',
//                     attribute: 'Логин',
//                     name: 'login',
//                 }),
//                 value: 'ivanivanov',
//             },
//             {
//                 input: new Components.Input({
//                     type: 'text',
//                     attribute: 'Имя',
//                     name: 'first_name',
//                 }),
//                 value: 'Иван',
//             },
//             {
//                 input: new Components.Input({
//                     type: 'text',
//                     attribute: 'Фамилия',
//                     name: 'second_name',
//                 }),
//                 value: 'Иванов',
//             },
//             {
//                 input: new Components.Input({
//                     type: 'text',
//                     attribute: 'Имя в чате',
//                     name: 'display_name',
//                 }),
//                 value: 'Иван',
//             },
//             {
//                 input: new Components.Input({
//                     type: 'text',
//                     attribute: 'Телефон',
//                     name: 'phone',
//                 }),
//                 value: '+7 (909) 967 30 30',
//             },
//         ],
//         avatarInput: new Components.Input({
//             type: 'file',
//             label: 'Выбрать изображение',
//             name: 'avatar'
//         }),
//         saveButton: new Components.Button({
//             type: 'confirm',
//             text: 'Сохранить',
//             isSubmit: true
//         })
//     }],
//     changePassword: [Pages.ChangePassword, {
//         oldPasswordInput: new Components.Input({
//             type: 'password',
//             label: 'Старый пароль',
//             name: 'oldPassword'
//         }),
//         newPasswordInput: new Components.Input({
//             type: 'password',
//             label: 'Новый пароль',
//             name: 'newPassword'
//         }),
//         saveButton: new Components.Button({
//             type: 'confirm',
//             text: 'Сохранить',
//             isSubmit: true
//         })
//     }],
//     navigation: [Pages.Navigation, {
//         pages: [
//             {
//                 systemName: 'login',
//                 readableName: 'Login',
//             },
//             {
//                 systemName: 'signin',
//                 readableName: 'Sign-in',
//             },
//             {
//                 systemName: 'error404',
//                 readableName: '404',
//             },
//             {
//                 systemName: 'error500',
//                 readableName: '500',
//             },
//             {
//                 systemName: 'chat',
//                 readableName: 'Messages',
//             },
//             {
//                 systemName: 'userProfile',
//                 readableName: 'Profile',
//             },
//             {
//                 systemName: 'changeUserProfile',
//                 readableName: 'Change user information',
//             },
//             {
//                 systemName: 'changePassword',
//                 readableName: 'Change password',
//             },
//         ],
//     }],
// };

// function navigate(page: string) {
//     const [PageClass, props] = pages[page];
//     const pageInstance = new PageClass(props);

//     const container = document.getElementById('app')!;
//     container.innerHTML = '';
//     const content = pageInstance.getContent()!;
//     container.appendChild(content);

//     const form = content.querySelector('form');
//     if (form) {
//         setupFormValidation(content.querySelector('form') as HTMLFormElement);
//     }
// }

// document.addEventListener('DOMContentLoaded', () => navigate('navigation'));
