import './change-profile.css';
import template from './change-profile.hbs?raw';
import { Block } from '../../core/block.ts';
import { connect } from '../../utils/connect';

class ChangeProfileBase extends Block {
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

const withLoginError = connect((state) => ({
    error: state.loginError,
}));

export const ChangeProfile = withLoginError(ChangeProfileBase);
