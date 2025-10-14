/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { Request } from 'express';
import { TokensService } from "src/auth/tokens.service";
import { AuthenticatedRequest } from "src/interfaces/authenticated_request";

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private readonly tokenService: TokensService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers.authorization ?? "";
        const bearer = authHeader.split(' ')[0];
        const token = authHeader.split(' ')[1];
        
        if (bearer !== 'Bearer' || !token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
            const payload = await this.tokenService.verifyAccessToken(token);
            (request as AuthenticatedRequest).user = {
                id: payload.sub,
                profile: payload.profile,
                raw: payload
            };

            if (payload.profile && payload.profile.admin) {
                return true;
            }
        } catch {
            throw new UnauthorizedException('Invalid token');
        }

        throw new ForbiddenException('You do not have permission to access this resource');
    }
}
