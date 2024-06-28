import Comment from '#models/comment'
import type { HttpContext } from '@adonisjs/core/http'

export default class CommentsController {
  async index({ request }: HttpContext) {
    const { ticketId } = request.only(['ticketId'])
    return await Comment.query().where('ticketId', ticketId).preload('user').preload('ticket')
  }

  async store({ request, auth, response }: HttpContext) {
    const { comment, ticketId } = request.only(['comment', 'ticketId'])
    const data = await Comment.create({
      content: comment,
      responsibleId: auth.user?.id,
      ticketId: ticketId,
    })

    return response.created(data)
  }
}
