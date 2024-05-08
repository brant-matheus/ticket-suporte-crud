import UsersController from '#controllers/users_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import AuthController from '#controllers/auth_controller'
// internal, auth.
router
  .group(() => {
    // user
    router
      .resource('user', UsersController)
      .except(['create', 'edit', 'show'])
      .use(['index'], middleware.admin())

    router.get('auth', [AuthController, 'logout'])
  })
  .middleware(middleware.auth())

// external, no auth.
router.post('auth', [AuthController, 'login'])

router.post('externalUser', [UsersController, 'store'])
