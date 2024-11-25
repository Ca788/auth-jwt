import { hash } from 'bcryptjs';
import { prismaClient } from "../lib/prismaClient";
import { AccountAlreadyExists } from "../erros/AccountAlreadyExists";

interface IInput {
  name: string;
  email: string;
  password: string;
}

type IOutput = void;

export class SignUpUseCase {
  constructor(private readonly salt: number) {}

 async call({ email, name, password }: IInput): Promise<IOutput> {
    const accountAlreadyExists = await prismaClient.account.findUnique({
      where: { email },
    });

    if (accountAlreadyExists) {
      throw new AccountAlreadyExists();
    }

    const hashedPassword = await hash(password, this.salt);

    await prismaClient.account.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    });
  }
}

