const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = 'azeem@ailaaj.com'
  const newPassword = '123456' // Replace with desired password
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  try {
    // First, check if user exists
    let user = await prisma.user.findUnique({
      where: { email }
    })

    if (user) {
      // Delete existing permissions if user exists
      await prisma.userPermission.deleteMany({
        where: { userId: user.id }
      })

      // Update existing user
      user = await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          userPermissions: {
            create: [
              { resource: 'admin', action: 'access_admin_panel' },
              { resource: 'locations', action: 'view' },
              { resource: 'locations', action: 'edit' },
              { resource: 'users', action: 'view' },
              { resource: 'users', action: 'edit' },
              { resource: 'settings', action: 'view' },
              { resource: 'settings', action: 'edit' }
            ]
          }
        },
        include: { userPermissions: true }
      })

      console.log('User updated:', {
        id: user.id,
        email: user.email,
        permissions: user.userPermissions.length
      })
    } else {
      // Create new user if doesn't exist
      user = await prisma.user.create({
        data: {
          email,
          name: 'Azeem',
          password: hashedPassword,
          role: 'admin',
          userPermissions: {
            create: [
              { resource: 'admin', action: 'access_admin_panel' },
              { resource: 'locations', action: 'view' },
              { resource: 'locations', action: 'edit' },
              { resource: 'users', action: 'view' },
              { resource: 'users', action: 'edit' },
              { resource: 'settings', action: 'view' },
              { resource: 'settings', action: 'edit' }
            ]
          }
        },
        include: { userPermissions: true }
      })

      console.log('New user created:', {
        id: user.id,
        email: user.email,
        permissions: user.userPermissions.length
      })
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()