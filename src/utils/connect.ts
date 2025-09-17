import { StoreEvents } from '../core/store';
import { Block } from '../core/block';

export type Indexed<T = unknown> = {
  [key in string]: T;
};

type BlockClass = new (props?: Record<string, unknown>) => Block;

export function connect(mapStateToProps: (state: Record<string, [BlockClass, { [key: string]: Block | Object }]>) => Indexed) {
    return function(Component: new (props: Record<string, unknown>) => Block) {
        return class extends Component {
            private __unsubscribe: () => void;

            constructor(props?: Record<string, unknown>) {
                const store = window.store;

                if (!store) {
                    throw new Error('Store is not initialized. Make sure you assign window.store before creating components.');
                }
                
                let state = mapStateToProps(store.getState().props);

                super({...props, ...state});

                this.__unsubscribe = store.on(StoreEvents.Updated, () => {
                    const newState = mapStateToProps(store.getState().props);
                    this.setProps({...newState});
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
