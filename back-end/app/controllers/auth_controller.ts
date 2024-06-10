import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'

export default class AuthController {
  async login({ request }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.verifyCredentials(email, password) //status 400 error
    const token = await User.accessTokens.create(user)
    return { token: token, user: user }
  }
  async logout({ auth }: HttpContext) {
    //delete all tokenable id
    //get user ID
    const userId = auth.user?.id! as number
    //delete from table, where column id equals user id
    await db.from('auth_access_tokens').where('tokenable_id', userId).delete()
  }
}
