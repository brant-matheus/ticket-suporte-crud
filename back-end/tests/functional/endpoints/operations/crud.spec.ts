import { OperationFactory } from '#database/factories/operation_factory'
import { TicketFactory } from '#database/factories/ticket_factory'
import { UserFactory } from '#database/factories/user_factory'
import TicketCategory from '#models/ticket_category'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('crud operation', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('it should be able to get/index operation for ticket as admin').run(
    async ({ assert, client, route }) => {
      const user = await UserFactory.create()
      const admin = await UserFactory.apply('admin').create()

      const ticket = await TicketFactory.merge({ createdById: user.id })
        .with('ticketCategory', 1, (ticketCategory) =>
          ticketCategory.merge({ responsibleId: admin.id })
        )
        .with('ticketPriority', 1, (ticketPriority) =>
          ticketPriority.merge({ responsibleId: admin.id })
        )
        .with('ticketStatus', 1, (ticketStatus) => ticketStatus.merge({ responsibleId: admin.id }))

        .create()

      const operation = await OperationFactory.merge({
        responsibleId: admin.id,
        ticketId: ticket.id,
      }).createMany(2)

      // console.log(ticket.serialize(), operation.serialize())
      const response = await client
        .get(route('operation.index'))
        .loginAs(admin)
        .qs({ ticketId: ticket.id })

      response.assertStatus(200)

      const body = response.body()
      assert.equal(2, body.length)

      response.dumpBody()
      response.assertJsonStructure({
        '*': { id: 1, description: 'string', ticketId: 1, responsible: ['id'] },
      })

      assert.equal(body[0].ticketId, ticket.id)
    }
  )

  test('it should be able to store operation for ticket by admin').run(
    async ({ assert, client, route }) => {}
  )

  test('it should be able to update operation description for ticket').run(
    async ({ assert, client, route }) => {}
  )
})
