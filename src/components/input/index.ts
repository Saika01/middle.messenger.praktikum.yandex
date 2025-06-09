import './input.css';
import { Block } from '../../core/block.ts';
import template from './input.hbs?raw';

export class Input extends Block {
    render() {
        return this._compile(template, this.props);
    }
}