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
    }
  )
  test('it should not be able to store a guest user with invalid data').run(
    async ({ client, route }) => {
      const request = {
        email: 'invalid',
        password: 'invalid',
        fullName: 'invalid',
        passwordConfirmation: 'invalid1',
      }
      const response = await client.post(route('sign_up')).json(request)
      response.assertStatus(422)
    }
  )
  test('it should not be able to store a guest user without required data').run(
    async ({ client, route }) => {
      const response = await client.post(route('sign_up')).json({ email: 'any' })
      response.assertStatus(422)
    }
  )
  test('it should not be able to store a guest user with less than 8 password characters').run(
    async ({ client, route }) => {
      const request = {
        email: 'invalid@invalid.com',
        fullName: 'invalid',
        password: 'Aa@1345',
        passwordConfirmation: 'Aa@1345',
      }
      const response = await client.post(route('sign_up')).json(request)
      response.assertStatus(422)
    }
  )
  test('it should not be able to store a guest user without uppercase letter').run(
    async ({ client, route }) => {}
  )
  test('it should not be able to store a guest user without a special character').run(
    async ({ client, route }) => {}
  )
  test('it should not be able to store a guest user without a lowercase letter').run(
    async ({ client, route }) => {}
  )
})
