import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import Ticket from '#models/ticket'
import { UserFactory } from '#database/factories/user_factory'
import { faker } from '@faker-js/faker'
import TicketCategory from '#models/ticket_category'
import TicketPriority from '#models/ticket_priority'
import { TicketFactory } from '#database/factories/ticket_factory'
import TicketStatus from '#models/ticket_status'

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

      const ticketNotStoreged = await Ticket.findBy('subject', 2)
      assert.isNull(ticketNotStoreged)
    }
  )

  test('it should not be able to update a ticket by guest user if in progress').run(
    async ({ assert, client, route }) => {
      const user = await UserFactory.create()
      const admin = await UserFactory.apply('admin').create()

      const subject = faker.lorem.words({ min: 5, max: 25 })
      const request = {
        subject: subject,
        description: faker.lorem.words({ min: 501, max: 510 }),
        category: (await TicketCategory.first())?.name,
        priority: (await TicketPriority.first())?.name,
      }

      const statuses = await TicketStatus.all()

      const ticket = await TicketFactory.merge({
        createdById: user.id,
        ticketStatusId: statuses.find((status) => status.name != 'pendente')?.id,
      })
        .with('ticketCategory', 1, (ticketCategory) =>
          ticketCategory.merge({ responsibleId: admin.id })
        )
        .with('ticketPriority', 1, (ticketPriority) =>
          ticketPriority.merge({ responsibleId: admin.id })
        )
        .create()
      const response = await client
        .put(route('ticket.update', [ticket.id]))
        .json(request)
        .loginAs(user)

      response.assertStatus(400)

      const ticketNotUpdated = await Ticket.find(ticket.id)
      assert.notInclude(ticketNotUpdated?.serialize(), request)
    }
  )

  test('it should not be able to delete a ticket as admin').run(
    async ({ assert, client, route }) => {
      const user = await UserFactory.create()
      const admin = await UserFactory.apply('admin').create()

      const ticket = await TicketFactory.merge({
        createdById: user.id,
      })
        .with('ticketStatus', 1, (ticketStatus) => ticketStatus.merge({ responsibleId: admin.id }))
        .with('ticketCategory', 1, (ticketCategory) =>
          ticketCategory.merge({ responsibleId: admin.id })
        )
        .with('ticketPriority', 1, (ticketPriority) =>
          ticketPriority.merge({ responsibleId: admin.id })
        )
        .create()

      const response = await client.delete(route('ticket.destroy', [ticket.id])).loginAs(admin)

      response.assertStatus(401)
    }
  )

  test('it should not be able to delete a ticket in progress').run(
    async ({ assert, client, route }) => {
      const user = await UserFactory.create()
      const admin = await UserFactory.apply('admin').create()

      const ticket = await TicketFactory.merge({
        createdById: user.id,
      })
        .with('ticketStatus', 1, (ticketStatus) => ticketStatus.merge({ responsibleId: admin.id }))
        .with('ticketCategory', 1, (ticketCategory) =>
          ticketCategory.merge({ responsibleId: admin.id })
        )
        .with('ticketPriority', 1, (ticketPriority) =>
          ticketPriority.merge({ responsibleId: admin.id })
        )
        .create()

      const response = await client.delete(route('ticket.destroy', [ticket.id])).loginAs(user)

      response.assertStatus(400)
    }
  )

  test('it should not be able to delete a ticket with not user ticket').run(
    async ({ assert, client, route }) => {
      const user = await UserFactory.create()
      const admin = await UserFactory.apply('admin').create()
      const notOwnerUser = await UserFactory.create()

      const ticket = await TicketFactory.merge({
        createdById: user.id,
      })
        .with('ticketStatus', 1, (ticketStatus) => ticketStatus.merge({ responsibleId: admin.id }))
        .with('ticketCategory', 1, (ticketCategory) =>
          ticketCategory.merge({ responsibleId: admin.id })
        )
        .with('ticketPriority', 1, (ticketPriority) =>
          ticketPriority.merge({ responsibleId: admin.id })
        )
        .create()

      const response = await client
        .delete(route('ticket.destroy', [ticket.id]))
        .loginAs(notOwnerUser)

      response.assertStatus(400)
    }
  )
})
