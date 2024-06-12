import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import { TicketFactory } from './ticket_factory.js'
import { CommentFactory } from './comment_factory.js'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      email: faker.internet.email().toLowerCase(),
      fullName: faker.person.fullName(),
      password: 'Testing@123',
      isAdmin: false,
    }
  })
  .relation('ticket', () => TicketFactory)
  .build()
