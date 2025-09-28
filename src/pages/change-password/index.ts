import './change-password.scss';
import { Block } from '../../core/block.ts';
import template from './change-password.hbs?raw';
import { connect } from '../../utils/connect';

export class ChangePasswordBase extends Block {
    constructor(props?: Record<string, unknown>) {
        super(props || {});
    }

    render(): DocumentFragment {
        return this._compile(template, this.props);
    }

    componentDidMount() {
        super.componentDidMount?.();
    }
}

const withChangePasswordError = connect((state) => ({
    error: state.ChangeProfileError,
}));

export const ChangePassword = withChangePasswordError(ChangePasswordBase);
