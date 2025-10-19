/* eslint-disable prettier/prettier */

export class UserProfile {
    id: number;
    name: string;
    email: string;
    admin?: boolean;
    profile_pic_url?: string;
}

export class AccessPayload {
    sub: string;
    type: "access";
    profile: UserProfile;
}
export class RefreshPayload {
    sub: string
    type: "refresh";
}
