// src/main.ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Sports Complex API')
    .setDescription('API for managing sports classes')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const seedService = app.get(SeedService);
  await seedService.run();

  await app.listen(3005);
  console.log(`Server running on http://localhost:3005`);
}

bootstrap();
