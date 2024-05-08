import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { ExternalUserValidator, PostUserValidator } from '#validators/user'
import db from '@adonisjs/lucid/services/db'
export default class UsersController {
  async index() {}

  async store({ request, auth }: HttpContext) {
    // check if email already exists in our database.
    const { email } = request.only(['email'])
    const user = await User.findBy('email', email)
    // isPersisted true, user exist
    if (user?.$isPersisted) {
      throw new Error('user already exists in our database') //status 500 error
    }

    //next auth
    if (auth.isAuthenticated && auth.user?.isAdmin) {
      // validate input
      const payload = await request.validateUsing(PostUserValidator) //status 422 error
      // create user
      await User.create(payload)
    } else {
      // guest creating itself. MUST HAVE BY DEFAULT isAdmin's flag false.
      const user = Object.assign(request.all(), { isAdmin: false })
      // validate input
      const payload = await ExternalUserValidator.validate(user) //status 422 error

      // create user
      await User.create(payload)
    }
  }

  async update({ params, request, auth }: HttpContext) {}

  async destroy({ params, auth }: HttpContext) {
    const userId = auth.user?.id! as number
    if (auth.isAuthenticated && auth.user?.isAdmin) {
      return 'caiu no if'
    } else if (
      auth.isAuthenticated &&
      !auth.user?.isAdmin &&
      parseInt(params.id) === auth.user?.id
    ) {
      await db.from('auth_access_tokens').where('tokenable_id', userId).delete()
      await db.from('users').where('id', userId).delete()
    }
  }
}
