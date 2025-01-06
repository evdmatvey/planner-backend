import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as CookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const PORT = configService.getOrThrow<number>('APPLICATION_PORT');
  const HOST = configService.getOrThrow<number>('APPLICATION_HOST');

  app.setGlobalPrefix('api');
  app.use(CookieParser());
  app.enableCors({
    origin: configService.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });

  const config = new DocumentBuilder()
    .setTitle('Planner API')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(PORT, () => {
    console.log(`API url: http://${HOST}:${PORT}/api`);
    console.log(`SWAGGER url: http://${HOST}:${PORT}/swagger`);
  });
}
bootstrap();
