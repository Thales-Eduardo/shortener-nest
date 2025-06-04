import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(process.env.PORT ?? 3000);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos não definidos no DTO
      forbidNonWhitelisted: true, // rejeita se houver campo extra
      transform: true, // ativa transformação (class-transformer)
    }),
  );

  console.log(`http://localhost:${process.env.PORT ?? 3000}`);
}
void bootstrap();
