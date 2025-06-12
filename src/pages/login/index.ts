import './login.css';
import { Block } from '../../core/block.ts';
import template from './login.hbs?raw';

export class LoginPage extends Block {
    render() {
        return this._compile(template, this.props);
    }
}
