import { TicketStatusFactory } from '#database/factories/ticket_status_factory'
import { UserFactory } from '#database/factories/user_factory'
import Color from '#models/color'
import TicketStatus from '#models/ticket_status'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('ticket status crud', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('it should be able to get/index ticket status paginated by admin').run(
    async ({ assert, client, route }) => {
      const limit = 1
      const allLength = (await TicketStatus.all()).length
      const user = await UserFactory.apply('admin').with('ticketStatus', limit).create()

      const request = {
        page: 1,
        pageSize: 10,
      }

      const response = await client.get(route('ticket_status.index')).loginAs(user).qs(request)

      response.assertStatus(200)

      response.assertPaginatedStructure({ '*': ['id', 'name', 'color', 'responsibleId'] })

      const body = response.body()

      const total = allLength + limit
      assert.equal(body.meta.total, total)
      assert.equal(body.meta.perPage, request.pageSize)
      assert.equal(body.meta.currentPage, request.page)
    }
  )

  test('it should be able to store a ticket status by admin').run(
    async ({ client, route, assert }) => {
      const user = await UserFactory.apply('admin').create()

      const color = await Color.first()
      const request = { name: 'novo status', color: color?.name }
      const response = await client.post(route('ticket_status.store')).loginAs(user).json(request)
      response.assertStatus(201)

      const body = response.body()
      assert.properties(body, ['id', 'name', 'colorId', 'responsibleId'])
      assert.propertyVal(body, 'name', request.name)
      assert.propertyVal(body, 'colorId', color?.id)
      await TicketStatus.findByOrFail('name', request.name)
    }
  )

  test('it should be able to update a ticket status by admin').run(
    async ({ client, route, assert }) => {
      const user = await UserFactory.apply('admin').create()

      const color = await Color.first()
      const request = { name: 'new status name', color: color?.name }
      const status = await TicketStatusFactory.merge({ responsibleId: user.id }).create()

      const response = await client
        .put(route('ticket_status.update', { id: status.id }))
        .loginAs(user)
        .json(request)
      response.assertStatus(200)

      const body = response.body()

      const updatedStatus = await status.refresh()

      assert.equal(updatedStatus.name, request.name)
      assert.equal(updatedStatus.colorId, color?.id)
      assert.propertyVal(body, 'name', request.name)
    }
  )

  test('it should be able to delete a ticket status by admin').run(
    async ({ client, route, assert }) => {
      const admin = await UserFactory.apply('admin').create()
      const status = await TicketStatusFactory.merge({ responsibleId: admin.id }).create()

      const response = await client
        .delete(route('ticket_status.destroy', { id: status.id }))
        .loginAs(admin)

      response.assertStatus(204)

      const deletedStatus = await TicketStatus.find(status.id)

      assert.isNull(deletedStatus)
    }
  )
})
