import { UserFactory } from '#database/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('color crud', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())
  test('it should be able to get/index colors in asc order').run(async ({ client, route }) => {
    const user = await UserFactory.apply('admin').create()

    const response = await client.get(route('color.index')).loginAs(user)

    response.assertStatus(200)

    response.assertJsonStructure({ '*': ['name', 'hex'] })
  })
})
