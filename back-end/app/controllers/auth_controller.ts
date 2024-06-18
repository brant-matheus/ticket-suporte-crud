import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)
    return response.ok({ token: token, user: user })
  }
  async logout({ auth, response }: HttpContext) {
    const userId = auth.user?.id! as number
    await db.from('auth_access_tokens').where('tokenable_id', userId).delete()
    return response.noContent()
  }
}
