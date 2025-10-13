/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { TokensService } from 'src/auth/tokens.service';

@Module({
    controllers: [FileController],
    providers: [TokensService],
})
export class FileModule {}
