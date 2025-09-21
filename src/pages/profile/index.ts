import './profile.css';
import { Block } from '../../core/block.ts';
import template from './profile.hbs?raw';
import { connect } from '../../utils/connect';
import { ProfileController } from './profile-controller.ts';
import { HTTPTransport } from '../../core/http.ts';

const profileController = new ProfileController();

class ProfileBase extends Block {
    constructor(props?: Record<string, unknown>) {
        super(props || {});
    }

    private async loadProfileInfo() {
        try {
            type BlockClass = new (props?: Record<string, unknown>) => Block;
            type ProfileData = [BlockClass, { [key: string]: Object | Block; }];

            const userData = await profileController.setUserInformation();
            if (!userData) {
                return;
            }

            const currentState = window.store.getState();
            const updatedProps = {...currentState.props};
            const profileData : ProfileData = [...updatedProps.userProfile];
            const profileConfig = { ...profileData[1] };
            profileConfig.photo = (await new HTTPTransport('').get(`/resources/${encodeURIComponent(userData.avatar)}`)).responseURL;
            profileConfig.name = userData.display_name;
            profileConfig.profileDescription = [
                {
                    attribute: 'Почта',
                    value: userData.email,
                },
                {
                    attribute: 'Логин',
                    value: userData.login,
                },
                {
                    attribute: 'Имя',
                    value: userData.first_name,
                },
                {
                    attribute: 'Фамилия',
                    value: userData.second_name,
                },
                {
                    attribute: 'Имя в чате',
                    value: userData.display_name,
                },
                {
                    attribute: 'Телефон',
                    value: userData.phone,
                },
            ];
            profileData[1] = profileConfig;
            updatedProps.userProfile = profileData;

            window.store.set({props: updatedProps});
        
        } catch (error) {
            this.setProps({
                error: 'Ошибка загрузки чатов',
            });
        }
    }

    render(): DocumentFragment {
        return this._compile(template, this.props);
    }

    componentDidMount() {
        super.componentDidMount?.();
        this.loadProfileInfo();
    }
}

type BlockClass = new (props?: Record<string, unknown>) => Block;
const mapStateToProps = (props: Record<string, [BlockClass, { [key: string]: Block | Object }]>) => {
    return {
        photo: props.userProfile[1].photo,
        name: props.userProfile[1].name,
        profileDescription: props.userProfile[1].profileDescription
    };
};

export const Profile = connect(mapStateToProps)(ProfileBase);
