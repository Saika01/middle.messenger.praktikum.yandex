import './error.css';
import { Block } from '../../core/block.ts';
import template from './error.hbs?raw';
import { connect } from '../../utils/connect';

export class ErrorBase extends Block {
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

const withErrorError = connect((state) => ({
    error: state.ChangeProfileError,
}));

export const Error = withErrorError(ErrorBase);