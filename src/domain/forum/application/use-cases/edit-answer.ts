import { Answer } from "../../enterprise/entities/answer";
import { AnswersRepository } from "../repositories/answers-repository";

interface EditAnswersUseCaseRequest {
    authorId: string
    answersId: string
    content: string
}

interface EditAnswersUseCaseResponse {
  answers: Answer
}

export class EditAnswersUseCase {
    constructor(
        private answersRepository: AnswersRepository,
    ) {}

    async execute({authorId,answersId, content}: EditAnswersUseCaseRequest): Promise<EditAnswersUseCaseResponse> {
        const answers = await this.answersRepository.findById(answersId)

        if(!answers) {
            throw new Error('Answers not found.')
        }

        if (authorId != answers.authorId.toString()) {
            throw new Error('Not allowed')
        }

        answers.content = content

        await this.answersRepository.save(answers)

        return {
            answers,
        }
    }
}
