/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { TokensService } from './tokens.service';

@Module({
    imports: [UserModule],
    controllers: [AuthController],
    providers: [TokensService],
})
export class AuthModule { }
