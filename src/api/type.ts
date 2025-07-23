export type APIError = {
    reason: string;
};

export type SignUpResponse = {
    id: number,
    status: number,
    responseText: string
}

export type UserDTO = {
    id: number;
    login: string;
    first_name: string;
    second_name: string;
    display_name: string;
    avatar: string;
    phone: string;
    email: string;
};

export type CreateUser = Omit<UserDTO, 'avatar' | 'display_name' | 'id'> & {
    // password: string
}

export type SearchUser = {
    login: string
}

export type LoginRequestData = {
    login: string,
    password: string
}

export type Passwords = {
    oldPassword: string,
    newPassword: string
}

export type PasswordResponse = {
    status: number,
    reason?: string
}

type LastMessage = {
    user: UserDTO,
    time: string,
    content: string
}

export type ChatDTO = {
    id: number,
    title: string,
    avatar: string | null,
    unread_count: number,
    last_message: LastMessage | null
}

export type CreateChat = {
    title: string
}

export type IdResponse = {
    id: number
}

export type GetChatRequest = {
    offset: number,
    limit: number,
    title: string
}

export type ChatInfo = {
    id: number,
    title: string,
    avatar: string,
    unread_count: number,
    created_by: number,
    last_message: {
        user: {
            first_name: string,
            second_name: string,
            avatar: string,
            email: string,
            login: string,
            phone: string
        },
        time: string,
        content: string
    }
}[]

export type DataToAddUserToChat = {
    'users': number[],
    'chatId': number
}