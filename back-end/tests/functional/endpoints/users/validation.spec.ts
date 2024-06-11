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

      // test with has not created a duplicated email
      const users = await User.findBy('email', user.email)
    }
  )
  test('it should not be able to store a guest user with invalid email').run(
    async ({ client, route, assert }) => {
      const request = {
        email: 'invalid',
        password: 'Testing@123',
        fullName: 'invalid',
        passwordConfirmation: 'Testing@123',
      }
      const response = await client.post(route('sign_up')).json(request)
      response.assertStatus(422)

      assert.isNull(await User.findBy('email', request.email))
    }
  )
  test('it should not be able to store a guest user with invalid full name').run(
    async ({ client, route, assert }) => {
      const request = {
        email: 'invalid@email.com',
        password: 'Testing@123',
        fullName: 'invalid5',
        passwordConfirmation: 'Testing@123',
      }
      const response = await client.post(route('sign_up')).json(request)
      response.assertStatus(422)

      assert.isNull(await User.findBy('email', request.email))
    }
  )
  test('it should not be able to store a guest user without required data').run(
    async ({ client, route, assert }) => {
      const response = await client.post(route('sign_up')).json({ email: 'any' })
      response.assertStatus(422)

      assert.isNull(await User.findBy('email', 'any'))
    }
  )
  test('it should not be able to store a guest user with less than 8 password characters').run(
    async ({ client, route, assert }) => {
      const request = {
        email: 'invalid@invalid.com',
        fullName: 'invalid',
        password: 'Aa@1345',
        passwordConfirmation: 'Aa@1345',
      }
      const response = await client.post(route('sign_up')).json(request)
      response.assertStatus(422)
      assert.isNull(await User.findBy('email', request.email))
    }
  )
  test('it should not be able to store a guest user without uppercase letter').run(
    async ({ client, route, assert }) => {
      const request = {
        email: 'invalid@invalid.com',
        fullName: 'invalid',
        password: 'aa@1345a',
        passwordConfirmation: 'aa@1345a',
      }
      const response = await client.post(route('sign_up')).json(request)
      response.assertStatus(422)
      assert.isNull(await User.findBy('email', request.email))
    }
  )
  test('it should not be able to store a guest user without a special character').run(
    async ({ client, route, assert }) => {
      const request = {
        email: 'invalid@invalid.com',
        fullName: 'invalid',
        password: 'aaA1345A',
        passwordConfirmation: 'aaA1345A',
      }
      const response = await client.post(route('sign_up')).json(request)
      response.assertStatus(422)
      assert.isNull(await User.findBy('email', request.email))
    }
  )
  test('it should not be able to store a guest user without a lowercase letter').run(
    async ({ client, route, assert }) => {
      const request = {
        email: 'invalid@invalid.com',
        fullName: 'invalid',
        password: 'AAA@1345A',
        passwordConfirmation: 'AAA@1345A',
      }
      const response = await client.post(route('sign_up')).json(request)
      response.assertStatus(422)
      assert.isNull(await User.findBy('email', request.email))
    }
  )
  test(
    'it should not be able to store a guest user with no macthing password and password confirmation'
  ).run(async ({ client, route, assert }) => {
    const request = {
      email: 'invalid@invalid.com',
      fullName: 'invalid',
      password: 'Testing@123',
      passwordConfirmation: 'Testing@1234',
    }
    const response = await client.post(route('sign_up')).json(request)
    response.assertStatus(422)
    assert.isNull(await User.findBy('email', request.email))
  })
})
