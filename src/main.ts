import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
