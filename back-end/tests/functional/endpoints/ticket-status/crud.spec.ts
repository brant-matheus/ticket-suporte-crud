import { AdminFactory } from '#database/factories/admin_factory'
import { TicketStatusFactory } from '#database/factories/ticket_status_factory'
import { UserFactory } from '#database/factories/user_factory'
import Color from '#models/color'
import TicketStatus from '#models/ticket_status'
import testUtils from '@adonisjs/core/services/test_utils'
import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'

test.group('ticket status crud', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('it should be able to get/index ticket status paginated by admin').run(
    async ({ assert, client, route }) => {
      const admin = await AdminFactory.create()

      const request = {
        page: 1,
        pageSize: 10,
      }

      const response = await client.get(route('ticket_status.index')).loginAs(admin).qs(request)
      response.assertStatus(200)

      response.assertPaginatedStructure({ '*': ['id', 'name', 'color', 'responsibleId'] })

      const body = response.body()
      assert.equal(body.meta.total, 2)
      assert.equal(body.meta.perPage, request.pageSize)
      assert.equal(body.meta.currentPage, request.page)
    }
  )

  test('it should be able to get/index ticket status by guest').run(async ({ client, route }) => {
    const guest = await UserFactory.create()

    const response = await client.get(route('ticket_status.index')).loginAs(guest)
    response.assertStatus(200)

    response.assertJsonStructure({ '*': ['id', 'name', 'color', 'responsibleId'] })
  })

  test('it should be able to store a ticket status').run(async ({ client, route, assert }) => {
    const admin = await AdminFactory.create()

    const request = { name: 'novo status', color: 'vermelho' }
    const response = await client.post(route('ticket_status.store')).loginAs(admin).json(request)
    response.assertStatus(201)

    const body = response.body()
    const red = await Color.findByOrFail('name', request.color)
    assert.properties(body, ['id', 'name', 'colorId', 'responsibleId'])
    assert.propertyVal(body, 'name', request.name)
    assert.propertyVal(body, 'colorId', red.id)
  })

  test('it should be able to update a ticket status').run(async ({ client, route, assert }) => {
    const admin = await AdminFactory.create()
    const request = { name: 'new status name', color: 'azul' }

    const status = await TicketStatusFactory.create()

    const blue = await Color.findByOrFail('name', 'azul')
    const response = await client
      .put(route('ticket_status.update', { id: status.id }))
      .loginAs(admin)
      .json(request)
    response.assertStatus(200)

    const body = response.body()

    const updatedStatus = await TicketStatus.findOrFail(status.id)
    assert.equal(updatedStatus.name, request.name)
    assert.equal(updatedStatus.colorId, blue.id)
    assert.propertyVal(body, 'name', request.name)
  })

  test('it should be able to delete a ticket status').run(async ({ client, route, assert }) => {
    const admin = await AdminFactory.create()
    const status = await TicketStatusFactory.create()

    const response = await client
      .delete(route('ticket_status.destroy', { id: status.id }))
      .loginAs(admin)

    response.assertStatus(204)

    const deletedStatus = await db.from('test.ticket_statuses').where('id', status.id)
    assert.isEmpty(deletedStatus)
  })
})
