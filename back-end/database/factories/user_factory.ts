import factory from '@adonisjs/lucid/factories'
import User from '#models/user'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      email: 'cliente@sagatech.com',
      fullName: 'cliente saga',
      password: 'Testing@123',
      isAdmin: false,
    }
  })
  .build()
