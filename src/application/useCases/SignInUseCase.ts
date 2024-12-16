import { prismaClient } from '../lib/prismaClient';
import { InvalidCredentials } from '../erros/InvalidCredentials';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { env } from '../config/env';


interface IInput {
  email: string;
  password: string;
}

interface IOutput {
  accessToken: string;
}

export class SignInUseCase {

  async call({ email, password }: IInput): Promise<IOutput> {
    const account = await prismaClient.account.findUnique({
      where: { email },
    });

    if (!account) {
      throw new InvalidCredentials();
    }

    const isPasswordValid = await compare(password, account.password);

    if(!isPasswordValid) {
      throw new InvalidCredentials();
    }

    const accessToken = sign(
      { subj: account.id },
      env.jwtSecret,
      { expiresIn: '1d' },
    );

    return {
      accessToken,
    };
  }
}

