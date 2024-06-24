import { TicketFactory } from '#database/factories/ticket_factory'
import { UserFactory } from '#database/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('crud ticket', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('it should be able to get/index tickets by admin paginated').run(
    async ({ client, route }) => {
      const user = await UserFactory.apply('admin').create()

      const request = { page: 1, pageSize: 10 }

      await TicketFactory.with('user')
        .with('ticketCategory', 1, (ticketCategory) =>
          ticketCategory.merge({ responsibleId: user.id })
        )
        .with('ticketPriority', 1, (ticketPriority) =>
          ticketPriority.merge({ responsibleId: user.id })
        )
        .with('ticketStatus', 1, (ticketStatus) => ticketStatus.merge({ responsibleId: user.id }))
        .create()

      const response = await client.get(route('ticket.index')).qs(request).loginAs(user)
      response.dumpBody()

      response.assertStatus(200)
      response.assertPaginatedStructure({
        '*': [
          'id',
          'ticketCategory',
          'ticketStatus',
          'ticketPriority',
          'user',
          'subject',
          'description',
        ],
      })
    }
  )
  test('it should be able to get/index tickets by guest').run(async ({ client, route }) => {
    const user = await UserFactory.create()
    const admin = await UserFactory.apply('admin').create()

    await TicketFactory.merge({ createdById: user.id })
      .with('ticketCategory', 1, (ticketCategory) =>
        ticketCategory.merge({ responsibleId: admin.id })
      )
      .with('ticketPriority', 1, (ticketPriority) =>
        ticketPriority.merge({ responsibleId: admin.id })
      )
      .with('ticketStatus', 1, (ticketStatus) => ticketStatus.merge({ responsibleId: admin.id }))
      .create()

    const response = await client.get(route('ticket.index')).loginAs(user)
    response.dumpBody()

    response.assertStatus(200)
  })

  test('it should be able to store a ticket by a guest user').run(
    async ({ client, route, assert }) => {
      const user = await UserFactory.create()
    }
  )
})
