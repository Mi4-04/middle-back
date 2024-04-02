import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { GlobalExceptionFilter } from './global-exeption-filter'
import { type ValidationError as CoreValidationError } from 'class-validator'
import { ValidationError } from './shared/errors'
import { ValidationPipe } from '@nestjs/common'
import * as bonjour from 'bonjour'
import 'dotenv/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  app.enableCors({
    origin: configService.get('FRONTEND_URL'),
    credentials: true
  })

  app.useGlobalFilters(new GlobalExceptionFilter())
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (errors: CoreValidationError[]) => {
        return new ValidationError('Validation error', errors)
      }
    })
  )

  const currentPort = configService.get<number>('PORT') as number
  const host = configService.get<string>('BACKEND_URL')
  const localAddress = configService.get('LOCAL_ADDRESS') as string | undefined

  const bonjourInstance = bonjour()
  bonjourInstance.publish({ name: 'nest-app', host: localAddress, type: 'http', port: currentPort })
  bonjourInstance.find({ type: 'http' }, function (service) {
    console.log('Found an HTTP server:', service)
  })

  await app.listen(currentPort)
  console.log(`The graphql sandbox is available at: ${host}:${currentPort}/graphql`)
}
bootstrap()
