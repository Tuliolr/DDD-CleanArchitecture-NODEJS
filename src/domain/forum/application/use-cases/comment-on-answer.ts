import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswersRepository } from "../repositories/answers-repository";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { AnswerCommentsRepository } from "../repositories/answers-comments-repository";

interface CommentOnAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
}

interface CommentOnAnswerUseCaseResponse {
   answerComment: AnswerComment
}

export class CommentOnAnswerUseCase {
    constructor(
        private answerRepository: AnswersRepository,
        private answerCommentsRepoistory: AnswerCommentsRepository
    ) {}

    async execute({authorId, answerId, content}: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
        const answer = await this.answerRepository.findById(answerId)

        if(!answer) {
            throw new Error('Answer not found.')
        }

        const answerComment = AnswerComment.create({
            authorId: new UniqueEntityID(authorId),
            answerId: new UniqueEntityID(answerId),
            content,
        })

        await this.answerCommentsRepoistory.create(answerComment)

        return {
            answerComment
        }
    }
}
