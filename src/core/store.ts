import { EventBus } from './event';
import type { WSHandler } from './webSocketHandler';
import { Block } from './block';

type BlockClass = new (props?: Record<string, unknown>) => Block;

export const StoreEvents = {
    Updated : 'Updated',
} as const;

type State = {
    isLoading: boolean;
    user: null | Record<string, unknown>;
    error: null | string;
    currentChatInfo?: {
        id: number,
        title: string,
        ws: WSHandler
    },
    props: Record<string, [BlockClass, { [key: string]: Block | Object }]>
};

export class Store extends EventBus {
    private state: State = {
        isLoading: false,
        user: null,
        error: null,
        props: {}
    };
    private static __instance: Store;

    constructor(defaultState: State) {
        if (Store.__instance) {
            return Store.__instance;
        }
        super();

        this.state = defaultState;
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
