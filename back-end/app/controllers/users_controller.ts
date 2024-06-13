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

export default class UsersController {
  async index({ request }: HttpContext) {
    const { page, pageSize } = request.only(['page', 'pageSize'])

    return await User.query().paginate(parseInt(page), parseInt(pageSize))
  }

  async store({ request, auth, response }: HttpContext) {
    // check if email already exists in our database.
    const { email } = request.only(['email'])

    const user = await User.findBy('email', email)
    // isPersisted true, user exist

    if (user?.$isPersisted) {
      return response.status(400).json({ message: 'user already exists in our database' })
    }

    //next auth
    if (auth.user?.isAdmin) {
      const payload = await request.validateUsing(InternalUserValidator)
      return await User.create(payload)
    } else {
      // response.status(201).json({ message: 'user creation sucessed' })

      const newUserData = Object.assign(request.all())
      const payload = await ExternalUserValidator.validate(newUserData) //status 422 error, bad request
      const user = await User.create(Object.assign(payload, { isAdmin: false }))
      const token = await User.accessTokens.create(user)
      return { token: token, user: user }
    }
  }

  async update({ params, request, auth }: HttpContext) {
    const user = await User.findOrFail(params.id) //error 500
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

  async destroy({ params, auth }: HttpContext) {
    //gets both parameter id and user id.
    const parameter = params.id
    const userId = auth.user?.id! as number
    // admin deleting users
    if (auth.user?.isAdmin) {
      // return { params: params, typeofparams: typeof params.id }
      const user = await User.findOrFail(parameter) //status 404 error, not found
      await user.delete()
    } //guest deleting itself.
    else if (!auth.user?.isAdmin && parseInt(parameter) === auth.user?.id) {
      await db.from('auth_access_tokens').where('tokenable_id', userId).delete()
      await db.from('users').where('id', userId).delete()
    }
  }
}
