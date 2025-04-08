export interface UserBaseData {
    id: string;
    name: string;
    username: string;
    email: string;
    avatar: string;
    role: string;
    is_staff: boolean;
    is_active: boolean;
    date_joined: Date;
    last_login: Date | null;
    post_count: number;
    followers_count: number;
    following_count: number;
}
