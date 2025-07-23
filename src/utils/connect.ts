import { StoreEvents } from '../core/store';
import { Block } from '../core/block';
import { isEqual } from './isEqual';

export type Indexed<T = unknown> = {
  [key in string]: T;
};

export function connect(mapStateToProps: (state: Indexed) => Indexed) {
    return function(Component: new (props: Record<string, unknown>) => Block) {
        return class extends Component {
            private __unsubscribe: () => void;

            constructor(props?: Record<string, unknown>) {
                const store = window.store;

                if (!store) {
                    throw new Error('Store is not initialized. Make sure you assign window.store before creating components.');
                }
                
                let state = mapStateToProps(store.getState());

                super({...props, ...state});
                let currentState = state;

                this.__unsubscribe = store.on(StoreEvents.Updated, () => {
                    const newState = mapStateToProps(store.getState());
                
                    if (!isEqual(state, newState)) {
                        this.setProps({...newState});
                        currentState = newState;
                    }
                });
            }

            componentWillUnmount() {
                if (this.__unsubscribe) {
                    this.__unsubscribe();
                }
            }
        };
    };
}
