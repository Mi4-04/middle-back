import { ConfigService } from '@nestjs/config'
import { parse } from 'cookie'
import { type Request } from 'express'

const configService = new ConfigService()

function getToken(cookieString: unknown): string | null {
  const cookieObject = parse(typeof cookieString === 'string' ? cookieString : '')
  return cookieObject[configService.get('USER_AUTH_TOKEN_KEY')] ?? null
}

export function cookieExtractor(req: Request): string | null {
  if (req.headers.cookie != null) {
    return getToken(req.headers.cookie)
  }
  return null
}
