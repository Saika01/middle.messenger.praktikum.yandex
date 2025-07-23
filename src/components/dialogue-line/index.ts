// import './dialogue-line.css';
import { Block } from '../../core/block.ts';
import template from './dialogue-line.hbs?raw';

export class DialogueLine extends Block {
    render() {
        return this._compile(template, this.props);
    }
}
