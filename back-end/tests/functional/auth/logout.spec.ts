import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'
import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'
test.group('Logout', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())
  test('it should be able to logout the user, deleting all token for the user id').run(
    async ({ assert, route, client }) => {
      const user = await UserFactory.create()

      const response = await client.get(route('sign_out')).loginAs(user)
      response.assertStatus(200)
      const tokens = await db.from('auth_access_tokens').where('tokenable_id', user.id)
      assert.isEmpty(tokens)
    }
  )

  test('it should not be able to logout with no token').run(async ({ assert, route, client }) => {
    const response = await client.get(route('sign_out'))
    response.assertStatus(401)
  })
})
