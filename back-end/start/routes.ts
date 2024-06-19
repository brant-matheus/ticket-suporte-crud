import AuthController from '#controllers/auth_controller'
import CommentsController from '#controllers/comments_controller'
import OperationsController from '#controllers/operations_controller'
import TicketCategoriesController from '#controllers/ticket_categories_controller'
import TicketPrioritiesController from '#controllers/ticket_priorities_controller'
import TicketStatusesController from '#controllers/ticket_statuses_controller'
import TicketsController from '#controllers/tickets_controller'
import UsersController from '#controllers/users_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router
  .group(() => {
    // user
    router
      .resource('user', UsersController)
      .except(['create', 'edit', 'show'])
      .use(['index'], middleware.admin())

    // logout
    router.delete('auth', [AuthController, 'logout']).as('sign_out')

    // ticket
    router
      .resource('ticket', TicketsController)
      .except(['create', 'edit', 'show'])
      .use(['store', 'destroy'], middleware.guest())
    // operation
    router
      .resource('operation', OperationsController)
      .except(['create', 'edit', 'show'])
      .use('*', middleware.admin())
    //comments
    router
      .resource('comments', CommentsController)
      .except(['create', 'edit', 'show'])
      .use('*', middleware.admin())

    router
      .resource('ticket-status', TicketStatusesController)
      .except(['create', 'edit', 'show'])
      .use(['destroy', 'store', 'update'], middleware.admin())

    router
      .resource('ticket-category', TicketCategoriesController)
      .except(['create', 'edit', 'show'])
      .use(['destroy', 'store', 'update'], middleware.admin())

    router
      .resource('ticket-priority', TicketPrioritiesController)
      .except(['create', 'edit', 'show'])
      .use(['destroy', 'store', 'update'], middleware.admin())
  })
  .middleware(middleware.auth())

router.post('auth', [AuthController, 'login']).as('login')

//guest register by guest

router.post('external-register', [UsersController, 'store']).as('sign_up')
