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
    // return await User.query().orderBy('id', 'desc').paginate(page, pageSize)

    const { page, pageSize } = request.only(['page', 'pageSize'])

    return await User.query().paginate(page, pageSize)
  }

  async store({ request, auth }: HttpContext) {
    // check if email already exists in our database.
    const { email } = request.only(['email'])

    const user = await User.findBy('email', email)
    // isPersisted true, user exist
    if (user?.$isPersisted) {
      throw new Error('user already exists in our database') //status 500 error
    }

    //next auth
    if (auth.user?.isAdmin) {
      // validate input
      const payload = await request.validateUsing(InternalUserValidator) //status 400 error
      // create user
      await User.create(payload)
      // guest creating itself. MUST HAVE BY DEFAULT isAdmin's flag false. merge before validation, to make sure isAdmin is false
    } else {
      const user = Object.assign(request.all(), { isAdmin: false })
      // validate input
      const payload = await ExternalUserValidator.validate(user) //status 400 error, bad request

      // create user
      return (await User.create(payload)).isAdmin
    }
  }

  async update({ params, request, auth }: HttpContext) {
    // check if the params sent is valid
    const user = await User.findOrFail(params.id) //error 500
    // update update at
    const updatedAt = { updatedAt: DateTime.local() } //update updateAt
    // check if the request is profile edit or user managment edit
    const { isProfile } = request.only(['isProfile'])
    const isPassword = request.all().hasOwnProperty('password') //check if has the key password in obj
    // for admin actions
    const isAdmin = auth.user?.isAdmin
    // for profile, the user MUST edit itself.
    const isUserProfileValid = auth.user?.id === parseInt(params.id)
    // profile logic
    if (isProfile && isUserProfileValid) {
      // request is password
      if (isPassword) {
        const passwordObj = request.only(['password', 'passwordConfirmation'])
        const payload = await PutPasswordValidator.validate(passwordObj)
        await user.merge(Object.assign(payload, updatedAt)).save()
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
        await user.merge(Object.assign(payload, updatedAt)).save()
      }
    }
    //user managment
    else if (!!isProfile && isAdmin) {
      if (isPassword) {
        const passwordObj = request.only(['password', 'passwordConfirmation'])
        const payload = await PutPasswordValidator.validate(passwordObj)
        await user.merge(Object.assign(payload, updatedAt)).save()
      } else {
        // validate input
        const data = request.only(['email', 'fullName', 'isAdmin'])
        const payload = await PutUserValidator.validate(data) //error 400
        console.log(payload)
        // save modification, payload data to be edit original data, update update at
        await user.merge(Object.assign(payload, updatedAt)).save()
      }
    } else {
      throw new Error() //status 500
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
