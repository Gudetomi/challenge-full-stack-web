import type { UsersRepository } from "@/repositories/user-repository";
import { compare } from "bcryptjs";
import type { User } from 'prisma/generated/prisma/client';
import { UserInvalidCredentialsError } from "./errors/user/user-invalid-credentials-error";
interface AuthenticateServiceRequest{
  email: string;
  password: string;
}

interface AuthenticateServiceResponse {
  user:User
}
export class AuthenticateService {
  constructor(private usersRepository:UsersRepository){}

  async execute({ email, password }: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse> {
    const user = await this.usersRepository.findByEmail(email)
    if(!user){
      throw new UserInvalidCredentialsError()
    }
    const doesPasswordMatches = await compare(password, user.password_hash)
    if(!doesPasswordMatches){
      throw new UserInvalidCredentialsError()
    }
    return{
      user
    }
  }
}