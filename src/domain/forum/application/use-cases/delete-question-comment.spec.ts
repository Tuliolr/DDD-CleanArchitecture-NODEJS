import {expect } from 'vitest'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryQuestionCommentsRepository:  InMemoryQuestionsCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
    beforeEach(() => {
        inMemoryQuestionCommentsRepository = new InMemoryQuestionsCommentsRepository()
        sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository )
    })

    it('should be able to delete a question comment', async () => {
        const questionComment = makeQuestionComment()

        await inMemoryQuestionCommentsRepository.create(questionComment)

        await sut.execute({
            questionCommentId: questionComment.id.toString(),
            authorId: questionComment.authorId.toString(),
            
        })
    
        expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
        
    })

    it('shouldnot be able to delete another question comment', async () => {
        const questionComment = makeQuestionComment({
            authorId: new UniqueEntityID('author-1')
        })

        await inMemoryQuestionCommentsRepository.create(questionComment)

        expect(() => {
            return sut.execute({
                questionCommentId: questionComment.id.toString(),
                authorId: 'author-2'
            })
        }).rejects.toBeInstanceOf(Error)
        
    })

    
})



