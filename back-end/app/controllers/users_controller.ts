import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { PasswordValidator, PutUserValidator, StoreUserValidator } from '#validators/user'

export default class UsersController {
  async index({ request, response, auth }: HttpContext) {
    const { page, pageSize, isProfile } = request.only(['page', 'pageSize', 'isProfile'])

    if (isProfile) {
      const data = await User.findOrFail(auth.user?.id)
      return response.ok(data)
    }
    const data = await User.query().paginate(page, pageSize)
    return response.ok(data)
  }

  async store({ request, auth, response }: HttpContext) {
    const data = request.all()
    const alreadyExistUser = await User.findBy('email', data.email)
    if (alreadyExistUser) {
      return response.conflict('user already exists in our database')
    }

    data.isAdmin ??= false

    const payload = await StoreUserValidator.validate(data)
    const createdUser = await User.create(payload)

    if (!auth.isAuthenticated) {
      const token = await User.accessTokens.create(createdUser)
      return response.created({
        token: token,
        user: createdUser,
      })
    }

    return response.created(createdUser)
  }

  async update({ params, request, auth, response }: HttpContext) {
    if (!auth.user?.isAdmin && auth.user?.id != params.id) {
      return response.badRequest('cannot update anything besides itself')
    }
    const data = request.all()
    const user = await User.findOrFail(params.id)

    if (data.hasOwnProperty('password')) {
      console.log(request.all())
      const payload = await request.validateUsing(PasswordValidator)
      console.log(payload)
      const updatedUser = await user.merge(payload).save()
      return response.ok(updatedUser)
    }

    if (data.hasOwnProperty('email')) {
      data.isAdmin ??= auth.user?.isAdmin
      const payload = await PutUserValidator.validate(data)
      const updatedUser = await user.merge(payload).save()
      return response.ok(updatedUser)
    }
  }

  async destroy({ params, auth, response }: HttpContext) {
    if (!auth.user?.isAdmin && auth.user?.id != params.id) {
      return response.badRequest('guest should not be able to delete another user, beside itself.')
    }

    const user = await User.findOrFail(params.id)
    await user.delete()
    return response.noContent()
  }
}
