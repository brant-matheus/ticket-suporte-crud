import { AdminFactory } from '#database/factories/admin_factory'
import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import testUtils from '@adonisjs/core/services/test_utils'
import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'

test.group('Users crud', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())
  test('it should be able to store a guest user in external register').run(
    async ({ assert, client, route }) => {
      const data = {
        fullName: 'saga brasil',
        email: 'saga@brasil.com',
        isAdmin: false,
      }
      const request = {
        password: 'Testing@123',
        passwordConfirmation: 'Testing@123',
        ...data,
      }
      const response = await client.post(route('sign_up')).json(request)
      response.assertStatus(200)

      const user = await User.findByOrFail('email', data.email)

      assert.isTrue(await hash.verify(user.password, request.password))
      response.assertJsonStructure({ token: ['token'], user: ['id', 'isAdmin'] })
      assert.propertyVal(user.serialize(), 'isAdmin', false)
      assert.include(user.serialize(), data)
    }
  )
  test('it should be able to the admin store a user').run(async ({ assert, client, route }) => {
    const user = await AdminFactory.create()
    const data = {
      email: 'validemail@valid.com',
      fullName: 'full name',
      isAdmin: false,
    }

    const request = {
      passwordConfirmation: 'Testing@123',
      password: 'Testing@123',

      ...data,
    }
    const response = await client.post(route('user.store')).loginAs(user).json(request)
    response.assertStatus(200)
    await User.findByOrFail('email', request.email)
    const body = response.body()
    assert.include(body, data)
  })

  test('it should be able to the guest user update its password').run(
    async ({ assert, client, route }) => {
      const user = await UserFactory.create()
      const passwords = {
        password: 'Anypass@123',
        passwordConfirmation: 'Anypass@123',
        isProfile: true,
      }

      const response = await client
        .put(route('user.update', { id: user.id }))
        .loginAs(user)
        .json(passwords)

      response.assertStatus(200)
      const userPassowrdRedifined = await db.query().from('test.users').where('email', user.email)
      assert.isTrue(await hash.verify(userPassowrdRedifined[0].password, passwords.password))
    }
  )

  test('it should be able to the admin user update its password').run(
    async ({ assert, client, route }) => {
      const user = await AdminFactory.create()
      const passwords = {
        password: 'Anypass@123',
        passwordConfirmation: 'Anypass@123',
        isProfile: true,
      }

      const response = await client
        .put(route('user.update', { id: user.id }))
        .loginAs(user)
        .json(passwords)

      response.assertStatus(200)

      const userPassowrdRedifined = await db.query().from('test.users').where('email', user.email)
      assert.isTrue(await hash.verify(userPassowrdRedifined[0].password, passwords.password))
    }
  )

  test('it should be able to update general information with emaill and full name').run(
    async ({ assert, client, route }) => {
      const user = await UserFactory.create()
      const request = { email: 'novo@email.com', fullName: 'new full name', isProfile: true }
      const response = await client
        .put(route('user.update', { id: user.id }))
        .loginAs(user)
        .json(request)

      response.assertStatus(200)
      const body = response.body()
      assert.include(body, { email: request.email, fullName: request.fullName })
      await User.findByOrFail('email', request.email)
    }
  )
  test('it should be able to update general information with full name only in profile config').run(
    async ({ assert, client, route }) => {
      const user = await UserFactory.create()
      const request = { email: null, fullName: 'new full name', isProfile: true }
      const response = await client
        .put(route('user.update', { id: user.id }))
        .loginAs(user)
        .json(request)

      response.assertStatus(200)
      const body = response.body()
      assert.include(body, { fullName: request.fullName, email: user.email })
      await User.findByOrFail('fullName', request.fullName)
    }
  )
  test('it should be able to update general information with email only in profile config')
    // .with(new Array(30))
    .run(async ({ assert, client, route }) => {
      const user = await UserFactory.create()
      const data = { email: 'novo@email.com', fullName: null }
      const request = { isProfile: true, ...data }
      const response = await client
        .put(route('user.update', { id: user.id }))
        .loginAs(user)
        .json(request)

      response.assertStatus(200)
      const newuser = await User.findOrFail(user.id)
      assert.equal(newuser.email, data.email)
      assert.notEqual(newuser.fullName, data.fullName)
    })

  test('it should be able to admin update general information of user').run(
    async ({ assert, client, route }) => {
      const admin = await AdminFactory.create()
      const guest = await UserFactory.create()
      const data = {
        email: 'brandnewemail@hotmail.com',
        fullName: 'brand new name',
        isAdmin: true,
      }
      const request = {
        isProfile: false,
        ...data,
      }
      const response = await client
        .put(route('user.update', { id: guest.id }))
        .loginAs(admin)
        .json(request)

      response.assertStatus(200)

      const user = await User.findByOrFail('email', request.email)
      assert.include(user.serialize(), data)
    }
  )

  test('it should be able to admin update user password').run(async ({ assert, client, route }) => {
    const admin = await AdminFactory.create()
    const guest = await UserFactory.create()
    const data = {
      password: 'NewPass@123',
      passwordConfirmation: 'NewPass@123',
    }
    const request = {
      isProfile: false,

      ...data,
    }
    const response = await client
      .put(route('user.update', { id: guest.id }))
      .loginAs(admin)
      .json(request)

    response.assertStatus(200)
    const userPassowrdRedifined = await db.query().from('test.users').where('email', guest.email)
    assert.isTrue(userPassowrdRedifined.length == 1)
    assert.isTrue(await hash.verify(userPassowrdRedifined[0].password, data.password))
  })

  test('it should be able to admin index/get all users paginate').run(
    async ({ assert, client, route }) => {
      const admin = await AdminFactory.create()
      await UserFactory.create()
      const request = { page: 1, pageSize: 1 }

      const response = await client.get(route('user.index')).loginAs(admin).qs(request)
      response.assertStatus(200)
      const body = response.body()
      assert.properties(body, ['meta', 'data'])
      assert.properties(body.meta, ['total', 'perPage', 'currentPage', 'lastPage', 'firstPage'])
      assert.properties(body.data[0], ['id', 'fullName', 'email', 'isAdmin'])
    }
  )

})
