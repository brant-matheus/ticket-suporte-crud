import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    if (!ctx.auth.user?.isAdmin) {
      await next()
    } else {
      throw new Exception()
    }
  }
}
