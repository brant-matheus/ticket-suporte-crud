import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Users validation', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('it should not be able to store a guest user with already taken email').run(
    async ({ assert, client, route }) => {
      const user = await UserFactory.create()
      const request = { email: user.email }
      const response = await client.post(route('sign_up')).json(request)
      response.assertStatus(400)
      const users = await User.query().where('email', request.email)
      assert.lengthOf(users, 1)
    }
  )
  test('it should not be able to store a guest user with invalid data').run(
    async ({ client, route }) => {
      const request = {
        email: 'invalid',
        password: 'Testing@123',
        fullName: '5invalid',
      }

      const response = await client.post(route('sign_up')).json(request)
      response.assertStatus(422)
      response.assertInvalid(['email', 'password', 'fullName'])
    }
  )
  test('it should not be able to store a guest user without required data').run(
    async ({ client, route }) => {
      const response = await client.post(route('sign_up')).json({ email: 'some' })
      response.assertStatus(422)
      response.assertInvalid(['email', 'password', 'fullName'])
    }
  )
  test('it should not be able to store a guest user with less than 8 password characters').run(
    async ({ client, route }) => {
      const response = await client.post(route('sign_up')).json({ email: 'some', password: '123' })
      response.assertStatus(422)
      response.assertInvalid(['password'])
    }
  )
  test('it should not be able to store a guest user without uppercase letter').run(
    async ({ client, route }) => {
      const response = await client
        .post(route('sign_up'))
        .json({ email: 'some', password: '123456aa' })
      response.assertStatus(422)

      response.assertInvalid(['password'])
    }
  )
  test('it should not be able to store a guest user without a special character').run(
    async ({ client, route }) => {
      const response = await client
        .post(route('sign_up'))
        .json({ email: 'some', password: '123456Aa' })
      response.assertStatus(422)
      response.assertInvalid(['password'])
    }
  )
  test('it should not be able to store a guest user without a lowercase letter').run(
    async ({ client, route }) => {
      const response = await client
        .post(route('sign_up'))
        .json({ email: 'some', password: '123456AA@' })
      response.assertStatus(422)
      response.assertInvalid(['password'])
    }
  )
})
