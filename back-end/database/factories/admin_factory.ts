import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import Operation from '#models/operation'
import { OperationFactory } from './operation_factory.js'

export const AdminFactory = factory
  .define(User, async ({ faker }) => {
    return {
      email: faker.internet.email().toLowerCase(),
      fullName: faker.person.fullName(),
      password: 'Testing@123',
      isAdmin: true,
    }
  })
  .build()
