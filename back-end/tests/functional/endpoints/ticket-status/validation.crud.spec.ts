import { AdminFactory } from '#database/factories/admin_factory'
import { TicketStatusFactory } from '#database/factories/ticket_status_factory'
import { UserFactory } from '#database/factories/user_factory'
import TicketStatus from '#models/ticket_status'
import { ticketFactoryStatusId } from '#tests/utils/ticketFactoryStatusId'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('ticket status validation', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('it should not be able to get/index by unauthorized').run(
    async ({ assert, client, route }) => {
      const response = await client.get(route('ticket_status.index'))
      response.assertStatus(401)
    }
  )

  test('it should not be able to store a ticket status with non existing color').run(
    async ({ assert, client, route }) => {
      const request = { name: 'new name', color: 'violeta' }
      const admin = await AdminFactory.create()
      const response = await client.post(route('ticket_status.store')).json(request).loginAs(admin)

      response.assertStatus(404)
    }
  )

  test('it should not be able store a ticket status by a guest user').run(
    async ({ assert, client, route }) => {
      const guest = await UserFactory.create()
      const request = { name: 'new name', color: 'verde' }

      const response = await client.post(route('ticket_status.store')).json(request).loginAs(guest)
      response.assertStatus(401)
    }
  )

  test('it should not be able to store a ticket status with a existing name').run(
    async ({ assert, client, route }) => {
      const admin = await AdminFactory.create()
      const status = await TicketStatus.first()
      const request = { name: status?.name, color: status?.color }

      const response = await client.post(route('ticket_status.store')).json(request).loginAs(admin)

      response.assertStatus(409)
    }
  )

  test('it should not be able to update pendente status').run(async ({ assert, client, route }) => {
    const admin = await AdminFactory.create()
    const request = { name: 'new name', color: 'verde' }
    const status = await TicketStatus.findByOrFail('name', 'pendente')

    const response = await client
      .put(route('ticket_status.update', { id: status.id }))
      .json(request)
      .loginAs(admin)
    response.assertStatus(403)

    const statusNotUpdated = await TicketStatus.findByOrFail('name', 'pendente')

    assert.include(status.serialize(), statusNotUpdated.serialize())
  })

  test('it should not be able to update concluido status').run(
    async ({ assert, client, route }) => {
      const admin = await AdminFactory.create()
      const request = { name: 'new name', color: 'azul' }
      const status = await TicketStatus.findByOrFail('name', 'concluido')

      const response = await client
        .put(route('ticket_status.update', { id: status.id }))
        .json(request)
        .loginAs(admin)
      response.assertStatus(403)

      const statusNotUpdated = await TicketStatus.findByOrFail('name', 'concluido')

      assert.include(status.serialize(), statusNotUpdated.serialize())
    }
  )
  test('it should not be able to update a status if already used in ticket').run(
    async ({ assert, client, route }) => {
      const admin = await AdminFactory.create()
      const status = await TicketStatusFactory.create()

      await ticketFactoryStatusId(status.id)

      const response = await client
        .put(route('ticket_status.update', { id: status.id }))
        .loginAs(admin)

      response.assertStatus(403)
    }
  )

  test('it should not be able to delete pendente status').run(async ({ assert, client, route }) => {
    const admin = await AdminFactory.create()
    const pending = await TicketStatus.findByOrFail('name', 'pendente')

    const response = await client
      .delete(route('ticket_status.update', { id: pending.id }))
      .loginAs(admin)

    response.assertStatus(403)
    const statusNotDeleted = await TicketStatus.findByOrFail('name', 'pendente')
    assert.isNotEmpty(statusNotDeleted)
  })
  test('it should not be able to delete concluido status').run(
    async ({ assert, client, route }) => {
      const admin = await AdminFactory.create()

      const status = await TicketStatus.findByOrFail('name', 'concluido')

      const response = await client
        .delete(route('ticket_status.update', { id: status.id }))
        .loginAs(admin)

      response.assertStatus(403)
      const statusNotDeleted = await TicketStatus.findByOrFail('name', 'concluido')
      assert.isNotEmpty(statusNotDeleted)
    }
  )

  test('it should not be able to delete a status if already used in ticket').run(
    async ({ assert, client, route }) => {
      const admin = await AdminFactory.create()
      const status = await TicketStatus.findByOrFail('name', 'concluido')

      await ticketFactoryStatusId(status.id)

      const response = await client
        .delete(route('ticket_status.destroy', { id: status.id }))
        .loginAs(admin)

      response.assertStatus(403)
    }
  )
})
