import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfilesController {
  async index({ request }: HttpContext) {
    const userId = request.only(['id'])
    const user = await User.findByOrFail(userId)
    return [user.email, user.fullName]
  }

  async update({ params, request }: HttpContext) {}

  async destroy({ params }: HttpContext) {}
}
