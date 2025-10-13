/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname + '..' + 'public'), {prefix: '/public/'});

  const config = new DocumentBuilder()
    .setTitle('API ofraud')
    .setDescription(
      'API to manage, users, reports, and more for the ofraud application',
    )
    .setVersion('1.0')
    .addTag('ofraud')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    jsonDocumentUrl: 'api/json',
  });

  console.log(join(__dirname + '..' + 'public'))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
