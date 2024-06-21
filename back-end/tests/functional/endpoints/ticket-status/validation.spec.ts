import { TicketFactory } from '#database/factories/ticket_factory'
import { TicketStatusFactory } from '#database/factories/ticket_status_factory'
import { UserFactory } from '#database/factories/user_factory'
import Color from '#models/color'
import Ticket from '#models/ticket'
import TicketStatus from '#models/ticket_status'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import { stat } from 'fs'

test.group('ticket status validation', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('it should not be able to get/index ticket status by unauthorized').run(
    async ({ client, route }) => {
      const response = await client.get(route('ticket_status.index'))
      response.assertStatus(401)
    }
  )

  test('it should not be able to store a ticket status with non existing color').run(
    async ({ client, route }) => {
      const request = { name: 'new name', color: 'violeta' }
      const user = await UserFactory.apply('admin').create()
      const response = await client.post(route('ticket_status.store')).json(request).loginAs(user)

      response.assertStatus(404)
    }
  )

  test('it should not be able store a ticket status by a guest user').run(
    async ({ client, route }) => {
      const user = await UserFactory.create()
      const color = await Color.first()
      const request = { name: 'new name', color: color?.name }

      const response = await client.post(route('ticket_status.store')).json(request).loginAs(user)
      response.assertStatus(401)
    }
  )

  test('it should not be able to store a ticket status with a existing name').run(
    async ({ assert, client, route }) => {
      const user = await UserFactory.apply('admin').create()
      const status = await TicketStatus.first()
      const request = { name: status?.name, color: status?.color }

      const response = await client.post(route('ticket_status.store')).json(request).loginAs(user)

      response.assertStatus(409)

      const statuses = await TicketStatus.findManyBy('name', request.name)
      assert.isTrue(statuses.length == 1)
    }
  )

  test('it should not be able to update pendente status').run(async ({ assert, client, route }) => {
    const user = await UserFactory.apply('admin').create()
    const color = await Color.first()
    const request = { name: 'new name', color: color?.name }
    const status = await TicketStatus.findByOrFail('name', 'pendente')

    const response = await client
      .put(route('ticket_status.update', { id: status.id }))
      .json(request)
      .loginAs(user)
    response.assertStatus(403)

    const statusNotUpdated = await status.refresh()

    assert.include(status.serialize(), statusNotUpdated.serialize())
  })

  test('it should not be able to update concluido status').run(
    async ({ assert, client, route }) => {
      const user = await UserFactory.apply('admin').create()
      const request = { name: 'new name', color: 'azul' }
      const status = await TicketStatus.findByOrFail('name', 'concluido')

      const response = await client
        .put(route('ticket_status.update', { id: status.id }))
        .json(request)
        .loginAs(user)
      response.assertStatus(403)

      const statusNotUpdated = await TicketStatus.findByOrFail('name', 'concluido')

      assert.include(status.serialize(), statusNotUpdated.serialize())
    }
  )

  test('it should not be able to delete pendente status').run(async ({ assert, client, route }) => {
    const user = await UserFactory.apply('admin').create()
    const status = await TicketStatus.findByOrFail('name', 'pendente')

    const response = await client
      .delete(route('ticket_status.destroy', { id: status.id }))
      .loginAs(user)

    response.assertStatus(403)

    const statusNotDeleted = await TicketStatus.findByOrFail('name', 'pendente')
    assert.equal(status.name, statusNotDeleted.name)
  })
  test('it should not be able to delete concluido status').run(
    async ({ assert, client, route }) => {
      const user = await UserFactory.apply('admin').create()

      const status = await TicketStatus.findByOrFail('name', 'concluido')

      const response = await client
        .delete(route('ticket_status.destroy', { id: status.id }))
        .loginAs(user)

      response.assertStatus(403)

      const statusNotDeleted = await TicketStatus.findByOrFail('name', 'concluido')
      assert.equal(status.name, statusNotDeleted.name)
    }
  )

  test('it should not be able to delete a status if already used in ticket').run(
    async ({ assert, client, route }) => {
      const admin = await UserFactory.apply('admin').create()

      const status = await TicketStatusFactory.with('responsible', 1, (user) =>
        user.apply('admin')
      ).create()

      const t = await TicketFactory.with('user')
        .merge({ ticketStatusId: status.id })
        .with('ticketCategory', 1, (item) =>
          item.with('responsible', 1, (item) => item.apply('admin'))
        )
        .with('ticketPriority', 1, (item) =>
          item.with('responsible', 1, (item) => item.apply('admin'))
        )
        .create()

      console.log(t.serialize())
      const response = await client
        .delete(route('ticket_status.destroy', { id: status.id }))
        .loginAs(admin)

      response.assertStatus(403)

      const statusNotDeleted = await TicketStatus.findByOrFail('name', 'concluido')
      assert.include(status.serialize(), statusNotDeleted.serialize())
    }
  )
})
