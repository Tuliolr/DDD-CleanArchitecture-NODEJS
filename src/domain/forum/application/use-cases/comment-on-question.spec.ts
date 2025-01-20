import {expect } from 'vitest'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'

let inMemoryQuestionsRepository:  InMemoryQuestionsRepository
let inMemoryQuestionCommentsRepository:  InMemoryQuestionsCommentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment on Question', () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        inMemoryQuestionCommentsRepository = new InMemoryQuestionsCommentsRepository()
        sut = new CommentOnQuestionUseCase(inMemoryQuestionsRepository, inMemoryQuestionCommentsRepository )
    })

    it('should be able to comment on question', async () => {
        const question = makeQuestion()

        await inMemoryQuestionsRepository.create(question)

        await sut.execute({
            questionId: question.id.toString(),
            authorId: question.authorId.toString(),
            content: 'Comentário teste',
        })
    
        expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual('Comentário teste')
        
    })

    
})



