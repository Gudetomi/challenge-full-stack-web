import type { UsersRepository } from "@/repositories/user-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user/user-already-exists-error";

interface RegisterServiceRequest{
  name: string;
  email: string;
  password: string;
}
export class RegisterService {
  constructor(private usersRepository: UsersRepository){}

  async execute({ name, email, password }: RegisterServiceRequest){
    const password_hash = await hash(password, 6)
  
    const userAlreadyExists = await this.usersRepository.findByEmail(email)
  
    if(userAlreadyExists){
      throw new UserAlreadyExistsError()
    }
  
    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}