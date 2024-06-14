import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
test.group('Sandbox', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())
  test('it should be able to validate input').run(async ({ assert, route, client }) => {
    const request = {
      email: 'teste@email.com',
      // password: { password: 'Testing@123', passwordConfirmation: 'Testing@123' },
      password: 'Testing@123',
      passwordConfirmation: 'Testing@123',
      fullName: 'teste teste',
      isAdmin: false,
    }

    const response = await client.post(route('sandbox.store')).json(request)
    const body = response.body()
    response.assertStatus(201)
    assert.include(body, { email: request.email })
  })
})
