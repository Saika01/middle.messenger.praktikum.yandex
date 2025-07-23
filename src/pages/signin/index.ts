import './signin.css';
import { Block } from '../../core/block.ts';
import template from './signin.hbs?raw';
import { connect } from '../../utils/connect';

class SignInPageBase extends Block {
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

// Подключаем стор для отображения ошибок
const withError = connect((state) => ({
    error: state.error,
}));

export const SignInPage = withError(SignInPageBase);