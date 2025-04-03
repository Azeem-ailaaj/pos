import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'azeem@ailaaj.com'
  
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
    include: { userPermissions: true }
  })

  if (!user) {
    console.log('User not found')
    return
  }

  console.log('User found:', {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    hasPassword: !!user.password,
    permissions: user.userPermissions
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())