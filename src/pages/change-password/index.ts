import './change-password.css';
import { Block } from '../../core/block.ts';
import template from './change-password.hbs?raw';

export class ChangePassword extends Block {
    render() {
        return this._compile(template, this.props);
    }
}
