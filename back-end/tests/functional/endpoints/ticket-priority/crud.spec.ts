import { TicketPriorityFactory } from '#database/factories/ticket_priority_factory'
import { UserFactory } from '#database/factories/user_factory'
import Color from '#models/color'
import { default as TicketPriority, default as Ticketpriority } from '#models/ticket_priority'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('ticket priority crud', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('it should be able to get/index ticket priority paginated by admin').run(
    async ({ assert, client, route }) => {
      const limit = 1
      const allLength = (await TicketPriority.all()).length
      const user = await UserFactory.apply('admin').with('ticketPriority', limit).create()

      const request = {
        page: 1,
        pageSize: 10,
      }

      const response = await client.get(route('ticket_priority.index')).loginAs(user).qs(request)

      response.assertStatus(200)

      response.assertPaginatedStructure({ '*': ['id', 'name', 'color', 'responsibleId'] })

      const body = response.body()

      const total = allLength + limit
      assert.equal(body.meta.total, total)
      assert.equal(body.meta.perPage, request.pageSize)
      assert.equal(body.meta.currentPage, request.page)
    }
  )

  test('it should be able to get/index ticket priority by guest').run(async ({ client, route }) => {
    const user = await UserFactory.create()

    const response = await client.get(route('ticket_priority.index')).loginAs(user)
    response.assertStatus(200)

    response.assertJsonStructure({ '*': ['id', 'name', 'color', 'responsibleId'] })
  })

  test('it should be able to store a ticket priority by admin').run(
    async ({ client, route, assert }) => {
      const user = await UserFactory.apply('admin').create()

      const color = await Color.first()
      const request = { name: 'priority', color: color?.name }
      const response = await client.post(route('ticket_priority.store')).loginAs(user).json(request)
      response.assertStatus(201)

      const body = response.body()
      assert.properties(body, ['id', 'name', 'colorId', 'responsibleId'])
      assert.propertyVal(body, 'name', request.name)
      assert.propertyVal(body, 'colorId', color?.id)
      await TicketPriority.findByOrFail('name', request.name)
    }
  )

  test('it should be able to update a ticket priority by admin').run(
    async ({ client, route, assert }) => {
      const user = await UserFactory.apply('admin').create()

      const color = await Color.first()
      const request = { name: 'new priority name', color: color?.name }
      const ticketPriority = await TicketPriorityFactory.merge({ responsibleId: user.id }).create()

      const response = await client
        .put(route('ticket_priority.update', [ticketPriority.id]))
        .loginAs(user)
        .json(request)
      response.assertStatus(200)

      const body = response.body()

      const updatedPriority = await ticketPriority.refresh()

      assert.equal(updatedPriority.name, request.name)
      assert.equal(updatedPriority.colorId, color?.id)
      assert.propertyVal(body, 'name', request.name)
    }
  )

  test('it should be able to delete a ticket priority by admin').run(
    async ({ client, route, assert }) => {
      const user = await UserFactory.apply('admin').create()
      const ticketPriority = await TicketPriorityFactory.merge({ responsibleId: user.id }).create()

      const response = await client
        .delete(route('ticket_priority.destroy', [ticketPriority.id]))
        .loginAs(user)

      response.assertStatus(204)

      const deletedpriority = await Ticketpriority.find(ticketPriority.id)

      assert.isNull(deletedpriority)
    }
  )
})
