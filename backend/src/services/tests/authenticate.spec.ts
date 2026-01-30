import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthenticateService } from '../authenticate';
import { UserInvalidCredentialsError } from '../errors/user/user-invalid-credentials-error';

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateService

describe('Authenticate Service', () => {
  beforeEach(()=>{
    usersRepository = new InMemoryUsersRepository
    sut = new AuthenticateService(usersRepository)
  })
  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('12345678', 6),
    })
    const { user } = await sut.execute({
      email: 'john.doe@example.com',
      password: '12345678',
    })
    expect(user.id).toEqual(expect.any(String))
  })
  it('should not be able to authenticate with wrong email', async () => {

    await expect(() => sut.execute({
      email: 'john.doe@example.com',
      password: '12345678',
    })).rejects.toBeInstanceOf(UserInvalidCredentialsError)
  })
  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('12345678', 6),
    })
    await expect(() => sut.execute({
      email: 'john.doe@example.com',
      password: '123456789',
    })).rejects.toBeInstanceOf(UserInvalidCredentialsError)
  })
})