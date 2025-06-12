import './profile.css';
import { Block } from '../../core/block.ts';
import template from './profile.hbs?raw';

export class Profile extends Block {
    render() {
        return this._compile(template, this.props);
    }
}
