import factory from '@adonisjs/lucid/factories'
import Comment from '#models/comment'

export const CommentFactory = factory
  .define(Comment, async ({ faker }) => {
    return {
      content: faker.lorem.sentence(),
      ticketId: 1,
      responsibleId: faker.number.int({ min: 1, max: 2 }),
    }
  })
  .relation('user', () => CommentFactory)

  .build()
