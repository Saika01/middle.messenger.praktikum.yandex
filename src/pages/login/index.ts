import './login.scss';
import template from './login.hbs?raw';
import { Block } from '../../core/block';
import { connect } from '../../utils/connect';

class LoginPageBase extends Block {
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

export const LoginPage = withLoginError(LoginPageBase);
