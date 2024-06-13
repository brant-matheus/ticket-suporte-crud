import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
test.group('Login', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())
  test('it should be able to login a user with valid email & password').run(
    async ({ assert, route, client }) => {
      const user = await UserFactory.create()
      const request = { email: user.email, password: 'Testing@123' }

      const response = await client.post(route('login')).json(request)

      response.assertStatus(200)
      response.assertJsonStructure({
        token: ['token'],
        user: ['id', 'isAdmin'],
      })

      const body = response.body()
      assert.equal(body.user.email, request.email)
    }
  )
  test('it should not be able to login with invalid email').run(
    async ({ assert, client, route }) => {
      await UserFactory.create()
      const request = { email: 'invalid', password: 'Testing@123' }
      const response = await client.post(route('login')).json(request)
      response.assertStatus(400)
      const body = response.body()
      assert.notProperty(body, 'token')
    }
  )
  test('it should not be able to login with invalid password').run(
    async ({ assert, client, route }) => {
      const user = await UserFactory.create()
      const request = { email: user.email, password: 'invalid' }
      const response = await client.post(route('login')).json(request)

      response.assertStatus(400)
      const body = response.body()
      assert.notProperty(body, 'token')
    }
  )
})
