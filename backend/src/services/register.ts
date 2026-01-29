import type { UsersRepository } from "@/repositories/user-repository";
import { hash } from "bcryptjs";
import type { User } from 'prisma/generated/prisma/client';
import { UserAlreadyExistsError } from "./errors/user/user-already-exists-error";


interface RegisterServiceRequest{
  name: string;
  email: string;
  password: string;
}

interface RegisterServiceResponse{
  user: User;
}

export class RegisterService {
  constructor(private usersRepository: UsersRepository){}

  async execute({ name, email, password }: RegisterServiceRequest): Promise<RegisterServiceResponse>{
    const password_hash = await hash(password, 6)
  
    const userAlreadyExists = await this.usersRepository.findByEmail(email)
  
    if(userAlreadyExists){
      throw new UserAlreadyExistsError()
    }
  
    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
    return {
      user,
    }
  }
}