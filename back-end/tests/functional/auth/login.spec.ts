import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Login', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('it should be able to login with valid password', async ({ assert, client, route }) => {
    const user = await UserFactory.create()
    const request = { email: user.email, password: 'password' }
    const response = await client.post(route('login')).json(request)
    response.assertStatus(200)
    const body = response.body()
    assert.properties(body, ['token', 'user'])
    assert.properties(body.token, ['token'])
    assert.properties(body.user, ['id', 'fullName', 'email'])
    assert.equal(body.user.email, request.email)
    const returnedUser = await User.find(body.user.id)
    assert.isNotNull(returnedUser)
  })
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
  test('it should not be able to login with invalid email').run(
    async ({ assert, client, route }) => {
      const request = { email: 'teste@teste.com', password: 'password' }
      const response = await client.post(route('login')).json(request)
      response.assertStatus(400)
      const body = response.body()
      assert.notProperty(body, 'token')
    }
  )
})
