import { TicketCategoryFactory } from '#database/factories/ticket_category_factory'
import { TicketFactory } from '#database/factories/ticket_factory'
import { UserFactory } from '#database/factories/user_factory'
import Color from '#models/color'
import TicketCategory from '#models/ticket_category'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('ticket category validation', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('it should not be able to store a ticket category with non existing color').run(
    async ({ client, route, assert }) => {
      const request = { name: 'new name', color: 'violeta' }
      const user = await UserFactory.apply('admin').create()
      const response = await client.post(route('ticket_category.store')).json(request).loginAs(user)

      response.assertStatus(404)

      const ticketCategory = await TicketCategory.findBy('name', request.name)
      assert.isNull(ticketCategory)
    }
  )

  test('it should not be able store a ticket category by a guest user').run(
    async ({ client, route, assert }) => {
      const user = await UserFactory.create()
      const color = await Color.first()
      const request = { name: 'new name', color: color?.name }

      const response = await client.post(route('ticket_category.store')).json(request).loginAs(user)
      response.assertStatus(401)

      const ticketCategory = await TicketCategory.findBy('name', request.name)
      assert.isNull(ticketCategory)
    }
  )

  test('it should not be able to store a ticket category with a existing name').run(
    async ({ assert, client, route }) => {
      const user = await UserFactory.apply('admin').with('ticketCategory').create()
      const category = await TicketCategory.first()
      const request = { name: category?.name, color: category?.color }

      const response = await client.post(route('ticket_category.store')).json(request).loginAs(user)

      response.assertStatus(409)

      const priorities = await TicketCategory.findManyBy('name', request.name)
      assert.isTrue(priorities.length == 1)
    }
  )

  test('it should not be able to delete a ticket category if already used in ticket').run(
    async ({ assert, client, route }) => {
      const user = await UserFactory.apply('admin').create()

      const ticketCategory = await TicketCategoryFactory.with('responsible', 1, (user) =>
        user.apply('admin')
      ).create()

      await TicketFactory.with('user')
        .merge({ ticketCategoryId: ticketCategory.id })
        .with('ticketPriority', 1, (ticketPriority) =>
          ticketPriority.merge({ responsibleId: user.id })
        )
        .with('ticketStatus', 1, (ticketStatus) => ticketStatus.merge({ responsibleId: user.id }))
        .create()

      const response = await client
        .delete(route('ticket_category.destroy', [ticketCategory.id]))
        .loginAs(user)

      response.assertStatus(400)

      const statusNotDeleted = await TicketCategory.find(ticketCategory.id)
      assert.isNotNull(statusNotDeleted)
    }
  )
})
