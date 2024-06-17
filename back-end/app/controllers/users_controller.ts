import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { PasswordValidator, PutUserValidator, StoreUserValidator } from '#validators/user'
import db from '@adonisjs/lucid/services/db'

export default class UsersController {
  async index({ request }: HttpContext) {
    const { page, pageSize } = request.only(['page', 'pageSize'])

    return await User.query().paginate(parseInt(page), parseInt(pageSize))
  }

  async store({ request, auth, response }: HttpContext) {
    const data = request.all()
    const user = await User.findBy('email', data.email)
    if (user?.$isPersisted) {
      return response.conflict({ message: 'user already exists in our database' })
    }

    data.isAdmin = data.isAdmin ?? false

    const payload = await StoreUserValidator.validate(data)
    const createdUser = await User.create(payload)

    if (!auth.isAuthenticated) {
      const token = await User.accessTokens.create(createdUser)
      return response.created({
        message: 'user creation succeeded',
        token: token,
        user: createdUser,
      })
    } else {
      return response.created({ message: 'user creation succeeded', user: createdUser })
    }
  }

  async update({ params, request, auth, response }: HttpContext) {
    if (!auth.user?.isAdmin && auth.user?.id != params.id) {
      return response.forbidden('cannot update anything besides itself')
    }
    const data = request.all()
    const user = await User.findOrFail(params.id)

    if (data.hasOwnProperty('password')) {
      const payload = await request.validateUsing(PasswordValidator)
      const updatedUser = await user.merge(payload).save()
      return response.ok({ message: 'User update succeeded', user: updatedUser })
    } else {
      data.isAdmin = data.isAdmin ?? user.isAdmin
      const payload = await PutUserValidator.validate(data)
      const updatedUser = await user.merge(payload).save()
      return response.ok({ message: 'User update succeeded', user: updatedUser })
    }
  }

  async destroy({ params, auth, response }: HttpContext) {
    if (!auth.user?.isAdmin && auth.user?.id != params.id) {
      return response.forbidden('guest should not be able to delete another user, beside itself.')
    }
    const user = await User.findOrFail(params.id)
    await db.from('auth_access_tokens').where('tokenable_id', auth.user?.id!).delete()
    await user.delete()
    return response.noContent()
  }
}
