import {expect } from 'vitest'

import { DeleteAnswerUseCase } from './delete-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-question-repository'
import { ChooseQuestionBestAnswerCase } from './choose-question-best-answer'
import { makeQuestion } from 'test/factories/make-question'

let inMemoryQuestionsRepository:  InMemoryQuestionsRepository
let inMemoryAnswersRepository:  InMemoryAnswersRepository
let sut: ChooseQuestionBestAnswerCase

describe('Choose Question Best Answer', () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository()
        sut = new ChooseQuestionBestAnswerCase(inMemoryQuestionsRepository, inMemoryAnswersRepository )
    })

    it('should be able to choose the question best answer', async () => {
        const question = makeQuestion()
        const answer = makeAnswer({
            questionId: question.id
        })

        await inMemoryQuestionsRepository.create(question)
        await inMemoryAnswersRepository.create(answer)


        await sut.execute({
            answerId: answer.id.toString(),
            authorId: question.authorId.toString(),
        })
    
        expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(answer.id)
        
    })

    
    it('should not be able to choose user question best answer', async () => {
        const question = makeQuestion({
            authorId: new UniqueEntityID('author-1')
        })
        const answer = makeAnswer({
            questionId: question.id
        })

        await inMemoryQuestionsRepository.create(question)
        await inMemoryAnswersRepository.create(answer)

        expect(() =>  {
            return sut.execute({
                answerId: answer.id.toString(),
                authorId: 'author-2',
            })
        }).rejects.toBeInstanceOf(Error)
      
        
    })
})



