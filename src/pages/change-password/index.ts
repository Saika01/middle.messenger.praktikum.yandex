import './change-password.css'
export { default as ChangePassword } from './change-password.hbs?raw';
import { Block } from '../../block.ts';
import { ChangePassword } from './index.ts';

export class ChangePasswordPage extends Block {
    render() {
        return this._compile(ChangePassword, {});
    }
}