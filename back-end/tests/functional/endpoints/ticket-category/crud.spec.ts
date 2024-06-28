import { TicketCategoryFactory } from '#database/factories/ticket_category_factory'
import { UserFactory } from '#database/factories/user_factory'
import Color from '#models/color'
import TicketCategory from '#models/ticket_category'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('ticket category crud', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('it should be able to get/index ticket category paginated by admin').run(
    async ({ assert, client, route }) => {
      const limit = 1
      const allLength = await TicketCategory.all()

      const user = await UserFactory.apply('admin').with('ticketCategory', limit).create()

      const request = {
        page: 1,
        pageSize: 10,
      }

      const response = await client.get(route('ticket_category.index')).loginAs(user).qs(request)

      response.assertStatus(200)

      response.assertPaginatedStructure({ '*': ['id', 'name', 'color', 'responsibleId'] })

      const body = response.body()

      const total = allLength.length + limit

      assert.equal(body.meta.total, total)
      assert.equal(body.meta.perPage, request.pageSize)
      assert.equal(body.meta.currentPage, request.page)
    }
  )

  test('it should be able to get/index ticket category by guest').run(async ({ client, route }) => {
    const user = await UserFactory.create()

    const response = await client.get(route('ticket_category.index')).loginAs(user)
    response.assertStatus(200)

    response.assertJsonStructure({ '*': ['id', 'name', 'color', 'responsibleId'] })
  })

  test('it should be able to store a ticket category by admin').run(
    async ({ client, route, assert }) => {
      const user = await UserFactory.apply('admin').create()

      const color = await Color.first()
      const request = { name: 'category', color: color?.name }
      const response = await client.post(route('ticket_category.store')).loginAs(user).json(request)
      response.assertStatus(201)

      const body = response.body()
      assert.properties(body, ['id', 'name', 'colorId', 'responsibleId'])
      assert.propertyVal(body, 'name', request.name)
      assert.propertyVal(body, 'colorId', color?.id)
      await TicketCategory.findByOrFail('name', request.name)
    }
  )

  test('it should be able to update a ticket category by admin').run(
    async ({ client, route, assert }) => {
      const user = await UserFactory.apply('admin').create()

      const color = await Color.first()
      const request = { name: 'new category name', color: color?.name }
      const ticketCategory = await TicketCategoryFactory.merge({ responsibleId: user.id }).create()

      const response = await client
        .put(route('ticket_category.update', [ticketCategory.id]))
        .loginAs(user)
        .json(request)
      response.assertStatus(200)

      const body = response.body()

      const updatedCategory = await ticketCategory.refresh()

      assert.equal(updatedCategory.name, request.name)
      assert.equal(updatedCategory.colorId, color?.id)
      assert.propertyVal(body, 'name', request.name)
    }
  )

  test('it should be able to delete a ticket category by admin').run(
    async ({ client, route, assert }) => {
      const user = await UserFactory.apply('admin').create()
      const ticketCategory = await TicketCategoryFactory.merge({ responsibleId: user.id }).create()

      const response = await client
        .delete(route('ticket_category.destroy', [ticketCategory.id]))
        .loginAs(user)

      response.assertStatus(204)

      const deletedCategory = await TicketCategory.find(ticketCategory.id)

      assert.isNull(deletedCategory)
    }
  )
})
