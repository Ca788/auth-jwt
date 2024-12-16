import { z } from 'zod';

import { IController, IRequest, IResponse } from '../interfaces/IController';
import { SignInUseCase } from '../useCases/SignInUseCase';
import { InvalidCredentials } from '../erros/InvalidCredentials';

const schema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(8),
});

export class SignInController implements IController {
  constructor(private SignInUseCase: SignInUseCase) {}

  async handle({ body }: IRequest): Promise<IResponse> {
    const { email, password } = schema.parse(body);

    try {
      const { accessToken } = await this.SignInUseCase.call({ email, password });

      return {
        statusCode: 200,
        body: {
          accessToken,
        },
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          statusCode: 401,
          body: error.issues,
        };
      }

      if(error instanceof InvalidCredentials) {
        return {
          statusCode: 401,
          body: {
            message: 'Invalid credentials',
          },
        };
      }

      throw error;
    }
  }
}

