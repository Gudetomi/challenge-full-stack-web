import type { UsersRepository } from "@/repositories/user-repository";
import { UserInvalidCredentialsError } from "./errors/user/user-invalid-credentials-error";
interface AuthenticateServiceRequest{
  email: string;
  password: string;
}

type AuthenticateServiceResponse = void;

export class AuthenticateService {
  constructor(private usersRepository:UsersRepository){}

  async execute({ email, password }: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse> {
    const user = await this.usersRepository.findByEmail(email)
    if(!user){
      throw new UserInvalidCredentialsError()
    }
  }
}