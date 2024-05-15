import factory from '@adonisjs/lucid/factories'
import User from '#models/user'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      email: `${faker.person.firstName().toLocaleLowerCase()}${faker.person.lastName().toLocaleLowerCase()}@sagatechbrasil.com`,
      fullName: `${faker.person.firstName().toLocaleLowerCase()} ${faker.person.lastName().toLocaleLowerCase()}`,
      password: 'Testing@123',
      isAdmin: true,
    }
  })
  .build()
