import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import {
  ExternalUserValidator,
  InternalUserValidator,
  PutUserValidator,
  PutPasswordValidator,
  PutGuestValidator,
} from '#validators/user'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class UsersController {
  async index() {
    return (await User.all()).reverse()
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
    if (auth.isAuthenticated && auth.user?.isAdmin) {
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
    const userId = auth.user?.id! as number
    const parameter = params.id //params= user id
    const user = await User.findOrFail(parameter) //status 404 error
    const updatedAt = { updatedAt: DateTime.local() } //update updateAt
    const firstKey = Object.keys(request.all())[0] //get first key property
    const notPassword = !(firstKey === 'password' || firstKey === 'passwordConfirmation') // if request not password

    if (auth.isAuthenticated && auth.user?.isAdmin) {
      // general update
      if (notPassword) {
        const payload = await request.validateUsing(PutUserValidator) //error 400

        await user.merge(Object.assign(payload, updatedAt)).save()
      }
      // password redefinition
      else {
        const payload = await request.validateUsing(PutPasswordValidator) //error 400
        await user.merge(Object.assign(payload, updatedAt)).save()
      }
    } //guest update
    else if (auth.isAuthenticated && !auth.user?.isAdmin && parseInt(parameter) === userId) {
      //general update
      if (notPassword) {
        const payload = await request.validateUsing(PutGuestValidator) //error 400
        await user.merge(Object.assign(payload, updatedAt)).save()
      } //password redefinition
      else {
        const payload = await request.validateUsing(PutPasswordValidator) //error 400
        await user.merge(Object.assign(payload, updatedAt)).save()
      }
    }
  }

  async destroy({ params, auth }: HttpContext) {
    //gets both parameter id and user id.
    const parameter = params.id
    const userId = auth.user?.id! as number
    // admin deleting users
    if (auth.isAuthenticated && auth.user?.isAdmin) {
      // return { params: params, typeofparams: typeof params.id }
      const user = await User.findOrFail(parameter) //status 404 error, not found
      await user.delete()
    } //guest deleting itself.
    else if (auth.isAuthenticated && !auth.user?.isAdmin && parseInt(parameter) === auth.user?.id) {
      await db.from('auth_access_tokens').where('tokenable_id', userId).delete()
      await db.from('users').where('id', userId).delete()
    }
  }
}
