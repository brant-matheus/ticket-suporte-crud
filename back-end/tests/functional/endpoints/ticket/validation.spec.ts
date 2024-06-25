import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import Ticket from '#models/ticket'
import { UserFactory } from '#database/factories/user_factory'
import { faker } from '@faker-js/faker'
import TicketCategory from '#models/ticket_category'
import TicketPriority from '#models/ticket_priority'
import { TicketFactory } from '#database/factories/ticket_factory'

test.group('ticket crud validation', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('it should not be able to store a ticket with description over 500 characters').run(
    async ({ assert, client, route }) => {
      const user = await UserFactory.create()

      const subject = faker.lorem.words({ min: 5, max: 25 })
      const request = {
        subject: subject,
        description: faker.lorem.words({ min: 501, max: 510 }),
        category: (await TicketCategory.first())?.name,
        priority: (await TicketPriority.first())?.name,
      }

      const response = await client.post(route('ticket.store')).json(request).loginAs(user)

      response.assertStatus(422)

      assert.isNull(await Ticket.findBy('subject', subject))
    }
  )

  test('it should not be able to store a ticket without required data').run(
    async ({ assert, client, route }) => {
      const user = await UserFactory.create()

      const request = {
        subject: 2,
      }

      const response = await client.post(route('ticket.store')).json(request).loginAs(user)

      response.assertStatus(422)
    }
  )

  test('it should not be able to update a ticket by guest user if in progress').run(
    async ({ assert, client, route }) => {
      const user = await UserFactory.create()

      const subject = faker.lorem.words({ min: 5, max: 25 })
      const request = {
        subject: subject,
        description: faker.lorem.words({ min: 501, max: 510 }),
        category: (await TicketCategory.first())?.name,
        priority: (await TicketPriority.first())?.name,
      }

      await TicketFactory
      const response = await client.post()
    }
  )
})
