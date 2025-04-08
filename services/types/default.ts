import { UserBaseData } from "./users";

export const DefaultUserData: UserBaseData = {
    id: '',
    username: '',
    email: '',
    role: 'user',
    is_staff: false,
    is_active: true,
    date_joined: new Date(),
    last_login: null,
    post_count: 0,
    followers_count: 0,
    following_count: 0,
    name: "",
    avatar: ""
};