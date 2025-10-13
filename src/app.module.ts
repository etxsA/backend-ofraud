/*eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { FileModule } from './file/file.module';
import { TokensService } from './auth/tokens.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: "neverLeakSecrets",
    }),
    DbModule,
    UserModule,
    AuthModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService, TokensService],
})
export class AppModule {}
