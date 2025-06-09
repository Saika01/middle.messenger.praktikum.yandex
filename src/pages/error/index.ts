import './error.css';
import { Block } from '../../core/block.ts';
import template from './error.hbs?raw';

export class Error extends Block {
    render() {
        return this._compile(template, this.props);
    }
}
