import './talking-area.css';
import { Block } from '../../core/block.ts';
import template from './talking-area.hbs?raw';

export class TalkingArea extends Block {
    render() {
        return this._compile(template, this.props);
    }
}
