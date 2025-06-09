import './navigation.css';
import { Block } from '../../core/block.ts';
import template from './navigation.hbs?raw';

export class Navigation extends Block {
    constructor(props: any) {
        super(props);
    }

    render() {
        return this._compile(template, this.props);
    }
}
