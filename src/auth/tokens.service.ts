/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from 'src/user/user.model';
import { AccessPayload, RefreshPayload } from './tokens.interface';

@Injectable()
export class TokensService {

    constructor (private readonly jwtService: JwtService) {}

    async generateAccessToken(profile: UserModel): Promise<string> {
        
        return await this.jwtService.signAsync(
            {
                sub: profile.id,
                type: "access",
                profile: {
                    id: profile.id,
                    name: profile.name,
                    email: profile.email,
                    admin: profile.admin
                }
            }, {
                expiresIn: "1m",
                secret: "supersecret",
            }
        );

        
    }

    async generateRefreshToken(profile: UserModel): Promise<string> {
        return await this.jwtService.signAsync(
            {
                sub: profile.id,
                type: "refresh",
            }, {
                expiresIn: "7d",
                secret: "supersecret",
            }
        );

     

    }

    async verifyAccessToken(token: string): Promise<AccessPayload> {

        const payload: AccessPayload = await this.jwtService.verifyAsync(token, {
            secret: "supersecret",
        });
        
        if (payload.type !== "access") {
            throw new Error("Invalid token type");
        }

        return payload;
    }

    async verifyRefeshToken(token: string): Promise<RefreshPayload> {
        const payload: RefreshPayload = await this.jwtService.verifyAsync(token, {
            secret: "supersecret",
        });

        if (payload.type !== "refresh") {
            throw new Error("Invalid token type");
        }

        return payload;
    }

}