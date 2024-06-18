import { AdminFactory } from '#database/factories/admin_factory'
import { TicketStatusesFactory } from '#database/factories/ticket_configs_factory'
import { UserFactory } from '#database/factories/user_factory'
import TicketStatus from '#models/ticket_status'
import testUtils from '@adonisjs/core/services/test_utils'
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
      assert.equal(body.meta.total, 1)
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

    const request = { statusName: 'novo status' }
    const response = await client.post(route('ticket_status.store')).loginAs(admin).json(request)
    response.assertStatus(201)

    const body = response.body()
    assert.properties(body, ['id', 'name', 'color', 'responsibleId'])
    assert.propertyVal(body, 'name', request.statusName)
  })

  test('it should be able to update a ticket status').run(async ({ client, route, assert }) => {
    const admin = await AdminFactory.create()
    const request = { statusUpdateRequest: 'new status name' }

    const response = await client
      .put(route('ticket_status.update', { id: statuses[0].id }))
      .loginAs(admin)
      .json(request)
    response.assertStatus(200)

    const body = response.body()
    const status = await TicketStatus.findOrFail(statuses[0].id)

    assert.equal(status.name, request.statusUpdateRequest)
    assert.propertyVal(body, 'name', request.statusUpdateRequest)
  })
})
