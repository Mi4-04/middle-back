import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './global-exeption-filter';
import { ValidationError as CoreValidationError } from 'class-validator';
import { ValidationError } from './shared/errors';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (errors: CoreValidationError[]) => {
        return new ValidationError('Validation error', errors);
      },
    }),
  );

  const configService = app.get(ConfigService);
  const currentPort = configService.get<number>('PORT') as number;
  const host = configService.get<string>('BACKEND_URL') as string;
  await app.listen(currentPort);
  console.log(
    `The graphql sandbox is available at: ${host}:${currentPort}/graphql`,
  );
}
bootstrap();
