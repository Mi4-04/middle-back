import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const currentPort = configService.get<number>('PORT') as number;
  const host = configService.get<string>('BACKEND_URL') as string;
  await app.listen(currentPort);
  console.log(
    `The graphql sandbox is available at: ${host}:${currentPort}/graphql`,
  );
}
bootstrap();
