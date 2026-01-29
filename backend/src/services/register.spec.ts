import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { compare } from 'bcryptjs';
import { describe, expect, it } from 'vitest';
import { UserAlreadyExistsError } from './errors/user/user-already-exists-error';
import { RegisterService } from './register';

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository
    const registerService = new RegisterService(usersRepository)
    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '12345678',
    })
    expect(user.id).toEqual(expect.any(String))
  })
  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository
    const registerService = new RegisterService(usersRepository)
    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '12345678',
    })
    const isPasswordHashed = await compare('12345678', user.password_hash)
    expect(isPasswordHashed).toBe(true)
  })
  it('should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository
    const registerService = new RegisterService(usersRepository)

    const email = 'john.doe@example.com'
    await registerService.execute({
      name: 'John Doe',
      email: email,
      password: '12345678',
    })

    expect(() =>
      registerService.execute({
        name: 'John Doe',
        email: email,
        password: '12345678',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})