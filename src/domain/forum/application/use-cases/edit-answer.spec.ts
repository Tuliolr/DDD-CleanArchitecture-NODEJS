import {expect } from 'vitest'


import { makeAnswer } from 'test/factories/make-answer'
import { Slug } from '../../enterprise/entities/value-objects/slug'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditAnswersUseCase } from './edit-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'


let inMemoryAnswersRepository:  InMemoryAnswersRepository
let sut: EditAnswersUseCase

describe('Edit Answer', () => {
    beforeEach(() => {
        inMemoryAnswersRepository = new InMemoryAnswersRepository()
        sut = new EditAnswersUseCase(inMemoryAnswersRepository)
    })

    it('should be able to edit a answer', async () => {
        const newAnswer = makeAnswer({authorId: new UniqueEntityID('author-1')}, new UniqueEntityID('answer-1'))

        await inMemoryAnswersRepository.create(newAnswer)

        await sut.execute({
            answersId: newAnswer.id.toValue(),
            authorId: 'author-1',
            content: 'Conteúdo teste',
        })
    
        expect(inMemoryAnswersRepository.items[0]).toMatchObject({
            content: 'Conteúdo teste',
        })
        
    })

    
    it('should not be able to edit a answer from another user', async () => {
        const newAnswer = makeAnswer({authorId: new UniqueEntityID('author-1'),}, new UniqueEntityID('answer-1'))

        await inMemoryAnswersRepository.create(newAnswer)

        expect(() =>  {
            return sut.execute({
                answersId: newAnswer.id.toValue(),
                authorId: 'author-2',
                content: 'Conteúdo teste',
            })
        }).rejects.toBeInstanceOf(Error)
    
        
        
    })
})



