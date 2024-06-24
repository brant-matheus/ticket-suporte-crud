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
import ColorsController from '#controllers/colors_controller'

router
  .group(() => {
    // user
    router.resource('user', UsersController).apiOnly().use(['index'], middleware.admin())

    // logout
    router.delete('auth', [AuthController, 'logout']).as('sign_out')

    // ticket
    router
      .resource('ticket', TicketsController)
      .apiOnly()
      .use(['store', 'destroy'], middleware.guest())
    // operation
    router.resource('operation', OperationsController).apiOnly().use('*', middleware.admin())
    //comments
    router.resource('comments', CommentsController).apiOnly()

    // ticket status
    router
      .resource('ticket-status', TicketStatusesController)
      .apiOnly()
      .use('*', middleware.admin())

    //ticket category
    router
      .resource('ticket-category', TicketCategoriesController)
      .apiOnly()
      .use(['destroy', 'store', 'update'], middleware.admin())

    //ticket priority
    router
      .resource('ticket-priority', TicketPrioritiesController)
      .apiOnly()
      .use(['destroy', 'store', 'update'], middleware.admin())

    // color
    router
      .resource('color', ColorsController)
      .apiOnly()
      .except(['destroy', 'show', 'store', 'update'])
      .use('*', middleware.admin())
  })
  .middleware(middleware.auth())

router.post('auth', [AuthController, 'login']).as('login')

//guest register by guest

router.post('external-register', [UsersController, 'store']).as('sign_up')
