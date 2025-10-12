/*eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './auth.dto';
import { UserModel } from 'src/user/user.model';
import { TokensService } from './tokens.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/interfaces/authenticated_request';

@Controller('auth')
export class AuthController {
    constructor(private readonly userService: UserService, private readonly tokenService: TokensService) {}

    @Post('login')
    async login(@Body() dto: LoginDto) {
        try {
            const user: UserModel = await this.userService.login(dto);
            const accessToken = await this.tokenService.generateAccessToken(user);
            const refreshToken = await this.tokenService.generateRefreshToken(user);
            
            return {
            accessToken,
            refreshToken,
            };
            
        } catch (error) {
            if(error instanceof UnauthorizedException) {
                return { message: error.message };
            }
            return { message: 'No user with that email' };

        }        
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req: AuthenticatedRequest) {
        return req.user.profile;
    }

    @Post('refresh')
    async refresh(@Body('refreshToken') refreshToken: string) {
        try {
            const payload = await this.tokenService.verifyRefeshToken(refreshToken);
            const user: UserModel = await this.userService.findById(Number(payload.sub));
            if (!user) {
                throw new UnauthorizedException('User not found');
            }
            const accessToken = await this.tokenService.generateAccessToken(user);
            const newRefreshToken = await this.tokenService.generateRefreshToken(user);
            return {
                accessToken,
                refreshToken: newRefreshToken,
            };
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

}

