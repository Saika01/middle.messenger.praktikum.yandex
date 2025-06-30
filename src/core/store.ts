// import { EventBus } from '../core/event';

// export enum StoreEvents {
//   Updated = 'updated',
// }

// class Store extends EventBus {
//     private state: Indexed = {};

//     public getState() {
//         // copy state and return in
//         return this.state;
//     }

//     public set(path: string, value: unknown) {
//         set(this.state, path, value);
//         this.emit(StoreEvents.Updated);
//     };
// }

// export default new Store(); 


import { EventBus } from './event';

export const StoreEvents = {
    Updated : 'Updated',
} as const;

type State = {
    isLoading: boolean;
    user: null | Record<string, unknown>;
    loginError: null | string;
};

export class Store extends EventBus {
    private state: State = {
        isLoading: false,
        user: null,
        loginError: null,
    };
    private static __instance: Store;

    constructor(defaultState: State) {
        if (Store.__instance) {
            return Store.__instance;
        }
        super();

        this.state = defaultState;
        // this.set(defaultState);

        Store.__instance = this;
    }

    public getState(): State {
        return this.state;
    }

    public set(nextState: Partial<State>) {
        const prevState = { ...this.state };

        this.state = { ...this.state, ...nextState };

        this.emit(StoreEvents.Updated, prevState, nextState);
    }
}

export default Store;
