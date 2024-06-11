import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Users crud', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())
  test('it should be able to store a guest user').run(async ({ assert, client, route }) => {
    const data = {
      fullName: 'saga brasil',
      email: 'saga@brasil.com',
    }
    const request = {
      password: 'Testing@123',
      passwordConfirmation: 'Testing@123',
      ...data,
    }
    const response = await client.post(route('sign_up')).json(request)
    response.assertStatus(200)
    const user = await User.findByOrFail('email', request.email)
    assert.isTrue(await hash.verify(user.password, request.password))
    response.assertJsonStructure({ token: ['token'], user: ['id', 'isAdmin'] })
  })
})
