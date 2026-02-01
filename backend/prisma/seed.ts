import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import 'dotenv/config'

async function main() {
  console.log('🚀 Starting seed...')
  console.log('Cleaning database...')
  await prisma.student.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await hash('123456', 6)

  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@email.com',
      password_hash: passwordHash,
      role: 'ADMIN',
    },
  })

  await prisma.user.create({
    data: {
      name: 'João Member',
      email: 'member@email.com',
      password_hash: passwordHash,
      role: 'MEMBER',
    },
  })

  console.log('✅ Users created.')
  console.log('⌛ Seeding students...')
  const studentsToCreate = Array.from({ length: 22 }).map((_, i) => ({
    name: `Aluno Exemplo ${String(i + 1).padStart(2, '0')}`,
    email: `aluno${i + 1}@email.com`,
    ra: `RA${1000 + i}`,
    cpf: `123456789${String(i).padStart(2, '0')}`,
    user_id: admin.id,
  }))

  await prisma.student.createMany({
    data: studentsToCreate,
  })

  console.log('✅ Seed finished successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
