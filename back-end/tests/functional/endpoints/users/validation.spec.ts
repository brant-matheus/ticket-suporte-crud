import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('user crud validation', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('it should not be able to store a user with already taken email').run(
    async ({ assert, client, route }) => {
      const guest = await UserFactory.create()
      const request = { email: guest.email }
      const response = await client.post(route('sign_up')).json(request)

      response.assertStatus(409)

      const user = await User.findManyBy('email', guest.email)

      assert.isTrue(user.length === 1)
    }
  )

  test('it should not be able to store a user with invalid email').run(
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

  test('it should not be able to store a user with invalid full name').run(
    async ({ client, route, assert }) => {
      const request = {
        email: 'invalid@email.com',
        password: 'Testing@123',
        fullName: 12345678,
        passwordConfirmation: 'Testing@123',
      }
      const response = await client.post(route('sign_up')).json(request)
      response.assertStatus(422)

      assert.isNull(await User.findBy('email', request.email))
    }
  )

  test('it should not be able to store a user without required data').run(
    async ({ client, route, assert }) => {
      const response = await client.post(route('sign_up')).json({ email: 'any' })
      response.assertStatus(422)

      assert.isNull(await User.findBy('email', 'any'))
    }
  )

  test('it should not be able to store a user with less than 8 password characters').run(
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
  test('it should not be able to store a user without uppercase letter').run(
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
  test('it should not be able to store a user without a special character').run(
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
  test('it should not be able to store a user without a lowercase letter').run(
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
    'it should not be able to store a user with no macthing password and password confirmation'
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

  test('it should not be able to store a user with admin permission in sign up').run(
    async ({ assert, client, route }) => {
      const data = {
        email: 'validemail@valid.com',
        fullName: 'full name',
      }

      const request = {
        password: 'Testing@123',
        passwordConfirmation: 'Testing@123',
        ...data,
      }

      const response = await client.post(route('sign_up')).json(request)
      response.assertStatus(201)

      const user = await User.findByOrFail('email', data.email)
      assert.notEqual(user.serialize().isAdmin, true)
    }
  )

  test('it should not be able to update a user password by a guest user').run(
    async ({ assert, route, client }) => {
      const firstGuest = await UserFactory.create()
      const secondGuest = await UserFactory.create()

      const request = {
        password: 'NewPass@123',
        passwordConfirmation: 'NewPass@123',
      }
      const response = await client
        .put(route('user.update', { id: secondGuest.id }))
        .json(request)
        .loginAs(firstGuest)

      response.assertStatus(400)
      assert.isFalse(await hash.verify(secondGuest.password, request.password))
    }
  )
  test('it should not be able to update a user info by a guest user').run(
    async ({ assert, route, client }) => {
      const firstGuest = await UserFactory.create()
      const secondGuest = await UserFactory.create()

      const request = {
        email: 'newemail@email.com',
        fullName: 'new full name',
        isAdmin: !secondGuest.isAdmin,
      }
      const response = await client
        .put(route('user.update', { id: secondGuest.id }))
        .json(request)
        .loginAs(firstGuest)

      response.assertStatus(400)
      const user = await User.findOrFail(secondGuest.id)
      assert.notInclude(user.serialize(), request)
    }
  )

  test('it should not be able to delete a user by a guest user').run(async ({ route, client }) => {
    const firstGuest = await UserFactory.create()
    const secondGuest = await UserFactory.create()

    const response = await client
      .delete(route('user.destroy', { id: secondGuest.id }))
      .loginAs(firstGuest)

    response.assertStatus(400)
    await User.findOrFail(secondGuest.id)
  })

  test('it should not be able to get/index users by guest user').run(
    async ({ assert, client, route }) => {
      const guest = await UserFactory.create()

      const response = await client.get(route('user.index')).loginAs(guest)
      response.assertStatus(401)

      const body = response.body()
      assert.isEmpty(body)
    }
  )
})
