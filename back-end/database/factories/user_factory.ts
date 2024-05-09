import factory from '@adonisjs/lucid/factories'
import User from '#models/user'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      email: 'suporte@sagatech.com',
      fullName: 'suporte sagatech',
      password: 'Testing@123',
      isAdmin: true,
    }
  })
  .build()
