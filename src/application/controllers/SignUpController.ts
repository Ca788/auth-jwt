import { z } from 'zod';

import { IController, IRequest, IResponse } from '../interfaces/IController';
import { SignUpUseCase } from '../useCases/SignUpUseCase';
import { AccountAlreadyExists } from '../erros/AccountAlreadyExists';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email().min(1),
  password: z.string().min(8),
});

export class SignUpController implements IController {
  constructor(private readonly SignUpUseCase: SignUpUseCase) {}

  async handle({ body }: IRequest): Promise<IResponse> {
    const { name, email, password } = schema.parse(body);

    try {
      await this.SignUpUseCase.call({ name, email, password });

      return {
        statusCode: 204,
        body: null,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          statusCode: 400,
          body: error.issues,
        };
      }

      if(error instanceof AccountAlreadyExists) {
        return {
          statusCode: 409,
          body: {
            message: 'Account already exists',
          },
        };
      }
      throw error;
    }
  }
}

