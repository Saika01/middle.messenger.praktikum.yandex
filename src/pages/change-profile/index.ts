import './change-profile.css';
import template from './change-profile.hbs?raw';
import { Block } from '../../core/block.ts';
import { Input } from '../../components/input/index.ts';
import AuthApi from '../../api/auth.ts';
import { connect } from '../../utils/connect.ts';

class ChangeProfileBase extends Block {
    async updateProfileDescription() {
        const authApi = new AuthApi();
        const userData = await authApi.user();

        if (!userData) {
            return;
        }

        const profileDescription = [
            {
                input: new Input({
                    type: 'text',
                    attribute: 'Почта',
                    name: 'email',
                }),
                value: `${userData.email}`,
            },
            {
                input: new Input({
                    type: 'text',
                    attribute: 'Логин',
                    name: 'login',
                }),
                value: `${userData.login}`,
            },
            {
                input: new Input({
                    type: 'text',
                    attribute: 'Имя',
                    name: 'first_name'
                }),
                value: `${userData.first_name}`,
            },
            {
                input: new Input({
                    type: 'text',
                    attribute: 'Фамилия',
                    name: 'second_name'
                }),
                value: `${userData.second_name}`,
            },
            {
                input: new Input({
                    type: 'text',
                    attribute: 'Имя в чате',
                    name: 'display_name'
                }),
                value: `${userData.display_name}`,
            },
            {
                input: new Input({
                    type: 'text',
                    attribute: 'Телефон',
                    name: 'phone'
                }),
                value: `${userData.phone}`,
            },
        ];

        type BlockClass = new (props?: Record<string, unknown>) => Block;
        type ProfileData = [BlockClass, { [key: string]: Object | Block; }];

        const currentState = window.store.getState();
        const updatedProps = {...currentState.props};
        const profileUserData : ProfileData = [...updatedProps.changeUserProfile];
        const userConfig = { ...profileUserData[1] };

        userConfig.profileDescription = profileDescription;
        profileUserData[1] = userConfig as { [key: string]: Object | Block; };
        updatedProps.changeUserProfile = profileUserData;
        window.store.set({props : updatedProps});
    }

    render(): DocumentFragment {
        return this._compile(template, this.props);
    }

    componentDidMount() {
        super.componentDidMount?.();
        this.updateProfileDescription();
    }
}

type BlockClass = new (props?: Record<string, unknown>) => Block;
const mapStateToProps = (props: Record<string, [BlockClass, { [key: string]: Block | Object }]>) => {
    return {
        profileDescription: props.changeUserProfile[1].profileDescription,
    };
};

export const ChangeProfile = connect(mapStateToProps)(ChangeProfileBase);
