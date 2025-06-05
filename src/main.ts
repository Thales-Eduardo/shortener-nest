import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './modules/app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  //class validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos não definidos no DTO
      forbidNonWhitelisted: true, // rejeita se houver campo extra
      transform: true, // ativa transformação (class-transformer)
    }),
  );

  //Swagger http://localhost:3333/swagger/api
  const config = new DocumentBuilder()
    .setTitle('shortener-url')
    .setDescription('The shortener API description')
    .setVersion('1.0')
    .addTag('shortener')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Insira o token JWT no formato: Bearer <token>',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger/api', app, document);

  //helmet
  app.use(helmet());

  await app.listen(process.env.PORT ?? 3000);

  // 6. Logger profissional
  const logger = new Logger('Bootstrap');
  logger.log(`http://localhost:${process.env.PORT ?? 3000}`);
  logger.log(
    `Swagger: http://localhost:${process.env.PORT ?? 3000}/swagger/api`,
  );
}
void bootstrap();
