/* eslint-disable prettier/prettier */
import { Request } from "express";
import { AccessPayload, UserProfile } from "src/auth/tokens.interface";

export interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        profile: UserProfile
        raw: AccessPayload;
    };
}
