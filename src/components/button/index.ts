import './button.css';
import { Block } from '../../core/block.ts';
import template from './button.hbs?raw';

export class Button extends Block {
    render() {
        return this._compile(template, this.props);
    }
}
