import './profile.css';
import { Block } from '../../core/block.ts';
import template from './profile.hbs?raw';
import { connect } from '../../utils/connect';

class ProfileBase extends Block {
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

const withProfileError = connect((state) => ({
    error: state.profileError,
}));

export const Profile = withProfileError(ProfileBase);
