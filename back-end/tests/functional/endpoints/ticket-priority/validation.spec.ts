import { TicketFactory } from '#database/factories/ticket_factory'
import { TicketPriorityFactory } from '#database/factories/ticket_priority_factory'
import { UserFactory } from '#database/factories/user_factory'
import Color from '#models/color'
import ticketPriority from '#models/ticket_priority'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('ticket priority validation', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('it should not be able to get/index ticket priority by unauthorized').run(
    async ({ client, route }) => {
      const response = await client.get(route('ticket_priority.index'))
      response.assertStatus(401)
    }
  )

  test('it should not be able to store a ticket priority with non existing color').run(
    async ({ client, route }) => {
      const request = { name: 'new name', color: 'violeta' }
      const user = await UserFactory.apply('admin').create()
      const response = await client.post(route('ticket_priority.store')).json(request).loginAs(user)

      response.assertStatus(404)
    }
  )

  test('it should not be able store a ticket priority by a guest user').run(
    async ({ client, route }) => {
      const user = await UserFactory.create()
      const color = await Color.first()
      const request = { name: 'new name', color: color?.name }

      const response = await client.post(route('ticket_priority.store')).json(request).loginAs(user)
      response.assertStatus(401)
    }
  )

  test('it should not be able to store a ticket priority with a already existing name').run(
    async ({ assert, client, route }) => {
      const user = await UserFactory.apply('admin').with('ticketPriority').create()
      const ticket = await ticketPriority.first()
      const request = { name: ticket?.name, color: ticket?.color }

      const response = await client.post(route('ticket_priority.store')).json(request).loginAs(user)

      response.assertStatus(409)

      const priorities = await ticketPriority.findManyBy('name', request.name)
      assert.isTrue(priorities.length == 1)
    }
  )

  test('it should not be able to delete a ticket priority if already used in ticket').run(
    async ({ assert, client, route }) => {
      const user = await UserFactory.apply('admin').create()

      const ticketPriority = await TicketPriorityFactory.with('responsible').create()

      await TicketFactory.with('user')
        .with('ticketStatus', 1, (ticketStatus) => ticketStatus.with('responsible'))
        .with('ticketCategory', 1, (ticketCategory) => ticketCategory.with('responsible'))
        .merge({ ticketPriorityId: ticketPriority.id })
        .create()

      const response = await client
        .delete(route('ticket_priority.destroy', [ticketPriority.id]))
        .loginAs(user)

      response.assertStatus(400)

      const statusNotDeleted = await ticketPriority.refresh()
      assert.isNotNull(statusNotDeleted)
    }
  )
})
