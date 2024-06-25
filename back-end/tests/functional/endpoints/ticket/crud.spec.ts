import { TicketFactory } from '#database/factories/ticket_factory'
import { UserFactory } from '#database/factories/user_factory'
import Ticket from '#models/ticket'
import TicketCategory from '#models/ticket_category'
import TicketPriority from '#models/ticket_priority'
import TicketStatus from '#models/ticket_status'
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
  test('it should be able to get/index guest tickets paginated').run(async ({ client, route }) => {
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

    response.assertStatus(200)
    response.assertPaginatedStructure({
      '*': ['id', 'ticketCategory', 'ticketStatus', 'ticketPriority', 'subject', 'description'],
    })
  })

  test('it should be able to store a ticket by a guest user').run(
    async ({ client, route, assert }) => {
      const user = await UserFactory.with('ticketCategory').with('ticketPriority').create()

      const category = await TicketCategory.first()
      const priority = await TicketPriority.first()
      const request = {
        subject: 'random subject',
        description: 'random description',
        category: category?.name,
        priority: priority?.name,
      }

      const response = await client.post(route('ticket.store')).loginAs(user).json(request)
      response.assertStatus(201)
      const body = response.body()
      const statusId = (await TicketStatus.findByOrFail('name', 'pendente')).id

      const bodyContains = {
        subject: 'random subject',
        description: 'random description',
        createdById: user.id,
        ticketCategoryId: category?.id,
        ticketPriorityId: priority?.id,
        ticketStatusId: statusId,
      }

      assert.include(body, bodyContains)

      const ticket = await Ticket.findByOrFail('createdById', user.id)

      assert.include(ticket.serialize(), bodyContains)
    }
  )

  test('it should be able to update a ticket by a guest user').run(
    async ({ client, route, assert }) => {
      const user = await UserFactory.create()
      const admin = await UserFactory.apply('admin').create()
      const pendingId = (await TicketStatus.findByOrFail('name', 'pendente')).id

      const ticket = await TicketFactory.merge({ createdById: user.id, ticketStatusId: pendingId })
        .with('ticketCategory', 1, (ticketCategory) =>
          ticketCategory.merge({ responsibleId: admin.id })
        )
        .with('ticketPriority', 1, (ticketPriority) =>
          ticketPriority.merge({ responsibleId: admin.id })
        )
        .create()

      const priority = await TicketPriority.first()
      const category = await TicketCategory.first()
      const request = {
        priority: priority?.name,
        category: category?.name,
        subject: 'it should be able to update subject',
        description: 'it should be able to update description',
      }

      const response = await client
        .put(route('ticket.update', [ticket.id]))
        .loginAs(user)
        .json(request)
      response.assertStatus(200)

      const body = response.body()

      const ticketRefreshed = await ticket.refresh()
      assert.include(body, { ticketPriorityId: priority?.id })
      assert.include(ticketRefreshed.serialize(), { ticketPriorityId: priority?.id })
    }
  )

  test('it should be able to update a ticket status by admin user').run(
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

      const ticketStatus = await TicketStatus.first()
      const request = {
        ticketConfigItem: ticketStatus?.name,
        fromTable: 'status',
      }

      const response = await client
        .put(route('ticket.update', [ticket.id]))
        .loginAs(admin)
        .json(request)
      response.assertStatus(200)

      const body = response.body()

      const ticketRefreshed = await ticket.refresh()
      assert.include(body, { ticketStatusId: ticketStatus?.id })
      assert.include(ticketRefreshed.serialize(), { ticketStatusId: ticketStatus?.id })
    }
  )

  test('it should be able to update a ticket status to conclued by admin user').run(
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

      const concluedTicketStatus = await TicketStatus.findByOrFail('name', 'concluido')
      const request = {
        ticketConfigItem: concluedTicketStatus?.name,
        fromTable: 'status',
      }

      const response = await client
        .put(route('ticket.update', [ticket.id]))
        .loginAs(admin)
        .json(request)
      response.assertStatus(200)

      const body = response.body()

      const ticketRefreshed = await ticket.refresh()

      const bodyContains = { ticketStatusId: concluedTicketStatus?.id, isConclued: true }
      assert.include(body, bodyContains)
      assert.include(ticketRefreshed.serialize(), bodyContains)
    }
  )

  test('it should be able to update a ticket priority by admin').run(
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

      const ticketPriority = await TicketPriority.first()
      const request = {
        ticketConfigItem: ticketPriority?.name,
        fromTable: 'priority',
      }

      const response = await client
        .put(route('ticket.update', [ticket.id]))
        .loginAs(admin)
        .json(request)
      response.assertStatus(200)

      const body = response.body()

      const ticketRefreshed = await ticket.refresh()
      assert.include(body, { ticketPriorityId: ticketPriority?.id })
      assert.include(ticketRefreshed.serialize(), { ticketPriorityId: ticketPriority?.id })
    }
  )

  test('it should be able to delete a ticket not in progress by guest user').run(
    async ({ assert, client, route }) => {
      const user = await UserFactory.create()
      const admin = await UserFactory.apply('admin').create()

      const pendingId = (await TicketStatus.findByOrFail('name', 'pendente')).id

      const ticket = await TicketFactory.merge({ createdById: user.id, ticketStatusId: pendingId })
        .with('ticketCategory', 1, (ticketCategory) =>
          ticketCategory.merge({ responsibleId: admin.id })
        )
        .with('ticketPriority', 1, (ticketPriority) =>
          ticketPriority.merge({ responsibleId: admin.id })
        )
        .create()

      const response = await client.delete(route('ticket.destroy', [ticket.id])).loginAs(user)

      response.assertStatus(204)

      assert.isNull(await Ticket.find(ticket.id))
    }
  )
})
