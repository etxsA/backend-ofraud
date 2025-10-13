/*eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './auth.dto';
import { UserModel } from 'src/user/user.model';
import { TokensService } from './tokens.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/interfaces/authenticated_request';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication endpoints')
@Controller('auth')
export class AuthController {
    constructor(private readonly userService: UserService, private readonly tokenService: TokensService) {}

    @Post('login')
    @ApiOperation({ summary: 'User login, returns access and refresh tokens' })
    @ApiResponse({ status: 201, description: 'User logged in successfully.', example: { accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' } })
    @ApiResponse({ status: 401, description: 'Incorrect email or password', example: { message: 'No user with that email' } })
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
            if (error instanceof UnauthorizedException) {
                throw new UnauthorizedException(error.message);
            } else if(error instanceof Error) {
                throw new UnauthorizedException(error.message);
            }
        }
    }

    @Get('profile')
    @ApiBearerAuth('accessToken')
    @ApiOperation({ summary: 'Get user profile, requires a valid access token' })
    @ApiResponse({ status: 401, description: 'Unauthorized' ,  example: {
        message: "Invalid token",
        error: "Unauthorized",
        statusCode: 401
    }})
    @ApiResponse({ status: 200, description: 'The user profile', example: { 
        id: 1,
        name: 'Jose Torres',
        email: 'email@email.com',
        admin: null,
    }})
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req: AuthenticatedRequest) {
        return req.user.profile;
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Refresh access token using a valid refresh token' })
    @ApiResponse({ status: 201, description: 'Token refreshed successfully.', example: { accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' } })
    @ApiResponse({ status: 401, description: 'Invalid refresh token', example: {
        message: "Invalid refresh token",
        error: "Unauthorized",
        statusCode: 401
    }})
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

