import './signin.css';
import { Block } from '../../core/block.ts';
import template from './signin.hbs?raw';

export class SignInPage extends Block {
    render() {
        return this._compile(template, this.props);
    }
}
