import factory from '@adonisjs/lucid/factories'
import User from '#models/user'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      email: faker.internet.email(),
      fullName: faker.person.fullName(),
      password: 'password',
      isAdmin: false,
    }
  })
  .build()
