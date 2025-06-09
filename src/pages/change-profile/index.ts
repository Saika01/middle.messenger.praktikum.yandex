import './change-profile.css';
import { Block } from '../../core/block.ts';
import template from './change-profile.hbs?raw';

export class ChangeProfile extends Block {
    render() {
        return this._compile(template, this.props);
    }
}