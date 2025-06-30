// types.ts
import { Store } from '../core/store';
export type Indexed<T = unknown> = {
  [key in string]: T;
};

export type ConnectProps<P extends Indexed> = P & {
  store?: typeof Store;
};

export type MapStateToProps<P extends Indexed> = (state: Indexed) => P;

// export type Indexed<T = unknown> = {
//   [key in string]: T;
// };

// export interface IStore {
//   on(event: string, callback: () => void): void;
//   off(event: string, callback: () => void): void;
//   getState(): Indexed;
// }

// export type ConnectProps<P extends Indexed> = P & {
//   store?: IStore;
// };

// export type MapStateToProps<P extends Indexed> = (state: Indexed) => P;