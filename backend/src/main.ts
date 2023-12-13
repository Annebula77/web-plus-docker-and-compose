import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // автоматически удаляет невалидные свойства
    forbidNonWhitelisted: true, // выбрасывает исключение, если встречаются невалидные свойства
    transform: true, // преобразует объекты в их соответствующие классы DTO
    disableErrorMessages: false, // отображение сообщений об ошибках
  }));
  app.enableCors({

    origin: 'https://happy.nomoredomainsmonster.ru', // Указать конкретный домен или использовать '*' для разрешения всех доменов
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const config = new DocumentBuilder()
    .setTitle('GiftService API')
    .setDescription('Service for gifts and wishlists')
    .setVersion('1.0')
    .addTag('api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Использование ConfigService для получения порта
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000; // Значение по умолчанию, если PORT не установлен

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
