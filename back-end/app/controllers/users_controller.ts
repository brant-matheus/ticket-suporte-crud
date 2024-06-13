import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import {
  ExternalUserValidator,
  InternalUserValidator,
  PutUserValidator,
  PutPasswordValidator,
  PutProfileValidator,
} from '#validators/user'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import { Exception } from '@adonisjs/core/exceptions'

export default class UsersController {
  async index({ request }: HttpContext) {
    const { page, pageSize } = request.only(['page', 'pageSize'])

    return await User.query().paginate(parseInt(page), parseInt(pageSize))
  }

  async store({ request, auth, response }: HttpContext) {
    const { email } = request.only(['email'])
    const user = await User.findBy('email', email)
    if (user?.$isPersisted) {
      return response.badRequest({ message: 'user already exists in our database' })
    }

    if (auth.user?.isAdmin) {
      const payload = await request.validateUsing(InternalUserValidator)
      const createdUser = await User.create(payload)
      return response.created({ message: 'user creation sucessed', user: createdUser })
    } else {
      const payload = await request.validateUsing(ExternalUserValidator)
      const user = await User.create(Object.assign(payload, { isAdmin: false }))
      const token = await User.accessTokens.create(user)
      return response.created({ message: 'user creation sucessed', token: token, user: user })
    }
  }

  async update({ params, request, auth }: HttpContext) {
    const user = await User.findOrFail(params.id)
    // update update at
    const updatedAt = { updatedAt: DateTime.local() }
    const { isProfile } = request.only(['isProfile'])
    const isPassword = request.all().hasOwnProperty('password') //check if has the key password in obj
    const isAdmin = auth.user?.isAdmin
    const isUserProfileValid = auth.user?.id === parseInt(params.id)
    if (isProfile && isUserProfileValid) {
      if (isPassword) {
        const passwordObj = request.only(['password', 'passwordConfirmation'])
        const payload = await PutPasswordValidator.validate(passwordObj)
        return await user.merge(Object.assign(payload, updatedAt)).save()
      }
      //request is a general information
      else {
        const data = request.only(['email', 'fullName'])

        for (let key in data) {
          // avoid typescript error
          const keyProperty = key as keyof typeof data
          if (data[keyProperty] === null || data[keyProperty] === 'null') {
            data[keyProperty] = user[keyProperty]
          }
        }
        // validate input
        const payload = await PutProfileValidator.validate(data) //error 400
        // save modification, payload data to be edit original data, update update at
        return await user.merge(Object.assign(payload, updatedAt)).save()
      }
    }
    //user managment
    else if (!isProfile && isAdmin) {
      if (isPassword) {
        const passwordObj = request.only(['password', 'passwordConfirmation'])
        const payload = await PutPasswordValidator.validate(passwordObj)
        await user.merge(Object.assign(payload, updatedAt)).save()
      } else {
        // validate input
        const data = request.only(['email', 'fullName', 'isAdmin'])
        const payload = await PutUserValidator.validate(data) //error 400
        // save modification, payload data to be edit original data, update update at
        return await user.merge(Object.assign(payload, updatedAt)).save()
      }
    }
  }

  async destroy({ params, auth, response }: HttpContext) {
    if (!auth.user?.isAdmin && auth.user?.id != params.id) {
      return response.unauthorized(
        'guest should not be able to delete another user, beside itself.'
      )
    }
    const user = await User.findOrFail(params.id)
    await db.from('auth_access_tokens').where('tokenable_id', auth.user?.id!).delete()
    await user.delete()
    return response.noContent()
  }
}
