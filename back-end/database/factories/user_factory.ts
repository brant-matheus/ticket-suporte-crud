import factory from '@adonisjs/lucid/factories'
import User from '#models/user'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      email: `${faker.person.firstName()}${faker.person.lastName()}@sagatechbrasil.com`,
      fullName: `${faker.person.firstName()} ${faker.person.lastName()}`,
      password: 'Testing@123',
      isAdmin: false,
    }
  })
  .build()
