import { add } from 'date-fns'
import { type Response, type Request } from 'express'

export type Context = {
  res: Response
  req: Request
}
export const tokenSetter = (context: Context, key: string, token: string): void => {
  const date = add(new Date(), { days: 7 })

  context.res.cookie(key, token, {
    expires: date,
    path: '/',
    httpOnly: true
  })
}
