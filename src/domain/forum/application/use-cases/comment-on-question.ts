import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { QuestionsRepository } from "../repositories/questions-repository";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { QuestionsCommentsRepository } from "../repositories/question-comments-repository";

interface CommentOnQuestionUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

interface CommentOnQuestionUseCaseResponse {
   questionComment: QuestionComment
}

export class CommentOnQuestionUseCase {
    constructor(
        private questionRepository: QuestionsRepository,
        private questionCommentsRepoistory: QuestionsCommentsRepository
    ) {}

    async execute({authorId, questionId, content}: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
        const question = await this.questionRepository.findById(questionId)

        if(!question) {
            throw new Error('Question not found.')
        }

        const questionComment = QuestionComment.create({
            authorId: new UniqueEntityID(authorId),
            questionId: new UniqueEntityID(questionId),
            content,
        })

        await this.questionCommentsRepoistory.create(questionComment)

        return {
            questionComment
        }
    }
}
