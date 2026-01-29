import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { compare } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { UserAlreadyExistsError } from './errors/user/user-already-exists-error';
import { RegisterService } from './register';

let usersRepository: InMemoryUsersRepository
let sut: RegisterService

describe('Register Service', () => {
  beforeEach(()=>{
    usersRepository = new InMemoryUsersRepository
    sut = new RegisterService(usersRepository)
  })
  it('should be able to register', async () => {

    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '12345678',
    })
    expect(user.id).toEqual(expect.any(String))
  })
  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '12345678',
    })
    const isPasswordHashed = await compare('12345678', user.password_hash)
    expect(isPasswordHashed).toBe(true)
  })
  it('should not be able to register with same email twice', async () => {
    const email = 'john.doe@example.com'
    await sut.execute({
      name: 'John Doe',
      email: email,
      password: '12345678',
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email: email,
        password: '12345678',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})