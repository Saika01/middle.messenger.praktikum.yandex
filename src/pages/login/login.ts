import { BaseAPI } from '../../core/baseApi';
import { Block } from '../../core/block';
import { connect } from '../../utils/connect';

interface LoginData {
  login: string;
  password: string;
}

export class LoginAPI extends BaseAPI {
    constructor() {
        super('/auth'); // Базовый URL для всех запросов LoginAPI
    }

    // Переопределяем метод `create` для логина
    async create(data: LoginData) {
        return this.http.post('/signin', { 
            data: JSON.stringify(data),
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    }
}

type UserProfileProps = {
  user: {
    name: string;
    avatar: string;
  };
  className?: string;
};

class UserProfile extends Block {
    render() {
        console.log('khb');
    }
}

const mapStateToProps = (state: Indexed): UserProfileProps => ({
    user: {
        name: state.user?.name || '',
        avatar: state.user?.avatar || '',
    }
});

export default connect(mapStateToProps)(UserProfile);
