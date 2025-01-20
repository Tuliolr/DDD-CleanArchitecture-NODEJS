import { AnswerCommentsRepository } from "../repositories/answers-comments-repository"


interface DeleteAnswerCommentUseCaseRequest {
  authorId: string
  answerCommentId: string
}

interface DeleteAnswerCommentUseCaseResponse {}

export class DeleteAnswerCommentUseCase {
    constructor(
        private answerCommentsRepoistory: AnswerCommentsRepository
    ) {}

    async execute({authorId, answerCommentId}: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
        const answerComment = await this.answerCommentsRepoistory.findById(answerCommentId)

        if(!answerComment) {
            throw new Error('Answer comment not found.')
        }

        if (answerComment.authorId.toString() != authorId) {
            throw new Error('Not allowed')
        }

        await this.answerCommentsRepoistory.delete(answerComment)

        return {}
    }
}
