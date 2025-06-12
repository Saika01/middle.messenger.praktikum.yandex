import './chat.css';
import { Block } from '../../core/block.ts';
import template from './chat.hbs?raw';

export class Chat extends Block {
    render() {
        return this._compile(template, this.props);
    }
}
