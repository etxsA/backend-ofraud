/* eslint-disable prettier/prettier */

export class UserProfile {
    id: number;
    name: string;
    email: string;
    admin?: boolean;
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
