import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Answer } from "../../enterprise/entities/answer"
import { AnswersRepository } from "../repositories/answers-repository"
import { Question } from "../../enterprise/entities/question"
import { QuestionsRepository } from "../repositories/questions-repository"

interface ChooseQuestionBestAnswerCaseRequest {
    authorId: string
    answerId: string
}

interface ChooseQuestionBestAnswerCaseResponse {
   question: Question
}

export class ChooseQuestionBestAnswerCase {
    constructor(
        private questionsRepository: QuestionsRepository,
        private answersRepository: AnswersRepository,
    ) {}

    async execute({answerId, authorId}: ChooseQuestionBestAnswerCaseRequest): Promise<ChooseQuestionBestAnswerCaseResponse> {
        const answer = await this.answersRepository.findById(answerId)

        if(!answer) {
            throw new Error('Answer not found.')
        }

        const question = await this.questionsRepository.findById(
            answer.questionId.toString(),
        )

        if(!question) {
            throw new Error('Question not found.')
        }

        if(authorId != question.authorId.toString()) {
            throw new Error('Not allowed.')
        }

        question.bestAnswerId = answer.id

        await this.questionsRepository.save(question)

        return {
            question
        }
    }
}
