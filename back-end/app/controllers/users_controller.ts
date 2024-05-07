import auth from '@adonisjs/auth/services/main'
import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

export default class UsersController {
  async index() {}

  async store({ request, auth }: HttpContext) {}

  async update({ params, request, auth }: HttpContext) {}

  async destroy({ params, auth }: HttpContext) {}
}
