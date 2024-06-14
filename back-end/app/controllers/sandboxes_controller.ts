import User from '#models/user'
import { StoreUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class SandboxesController {
  /**
   * Display a list of resource
   */
  async index({ request }: HttpContext) {
    // const passwordSandbox = await request.validateUsing(PasswordValidator)
    // return passwordSandbox
    // const userSandbox = await request.validateUsing(StoreUserValidator)
    // return userSandbox
    return request.all()
  }

  async store({ request, response }: HttpContext) {
    const userSandbox = await request.validateUsing(StoreUserValidator)
    const user = await User.create(userSandbox)
    return response.created(user)
    return userSandbox
  }

  async show({ params }: HttpContext) {}

  async update({ params, request }: HttpContext) {}

  async destroy({ params }: HttpContext) {}
}
