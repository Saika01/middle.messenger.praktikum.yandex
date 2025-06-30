// function connect(Component: typeof Block) {
//     // используем class expression
//     return class extends Component {
//         constructor(...args) {
//         // не забываем передать все аргументы конструктора
//             super(...args);

//             // подписываемся на событие
//             store.on(StoreEvents.Updated, () => {
//             // вызываем обновление компонента, передав данные из хранилища
//                 this.setProps({...store.getState()});
//             });
//         }
//     };
// }

// function mapUserToProps(state) {
//     return {
//         name: state.user.name,
//         avatar: state.user.avatar,
//     };
// }

// connect(UserProfile, mapUserToProps); 

// // UserProfile.ts
// export connect(UserProfile);

// // AccountPage.ts
// const userProfile = new UserProfile();


// function connect(mapStateToProps: (state: Indexed) => Indexed) {
//   return function(Component: typeof Block) {
//     return class extends Component {
//       ...
//     }
//     }
// }

// const withUser = connect(state => ({ user: state.user }));

// withUser(UserProfile);
// withUser(SettingsPage); 

import { Store, StoreEvents } from '../core/store';
import { Block } from '../core/block';
import { isEqual } from './isEqual';
// import { Indexed, ConnectProps, MapStateToProps } from './types';

export type Indexed<T = unknown> = {
  [key in string]: T;
};

export function connect(mapStateToProps: (state: Indexed) => Indexed) {
    return function(Component: typeof Block) {
        return class extends Component {
            // private onChangeStoreCallback: () => void;
            constructor(props?: Record<string, unknown>) {
                console.log('props: ', props);
                // сохраняем начальное состояние
                const store = window.store;
                if (!store) {
                    throw new Error('Store is not initialized. Make sure you assign window.store before creating components.');
                }
                let state = mapStateToProps(store.getState());

                super({...props, ...state});

                // подписываемся на событие
                store.on(StoreEvents.Updated, () => {
                    // при обновлении получаем новое состояние
                    const newState = mapStateToProps(store.getState());
                
                    // если что-то из используемых данных поменялось, обновляем компонент
                    if (!isEqual(state, newState)) {
                        this.setProps({...newState});
                    }

                    // не забываем сохранить новое состояние
                    state = newState;
                });
            }

            // componentWillUnmount() {
            //     super.componentWillUnmount();
            //     window.store.off(StoreEvents.Updated, this.onChangeStoreCallback);
            // }

            render(): DocumentFragment {
                // Создаем временный элемент для рендеринга
                const fragment = document.createDocumentFragment();
                // Получаем контент из родительского класса Block
                const content = super.getContent();
                if (content) {
                    fragment.appendChild(content.cloneNode(true));
                }
                return fragment;
            }
        };
    };
}
