import { PrismaClient } from '@prisma/client'

export type ModelPermission = {
  create: boolean
  read: boolean
  update: boolean
  delete: boolean
}

export type Permission = {
  model: string
  permissions: ModelPermission
}

// Get all model names from Prisma schema
export function getAllModels() {
  const prisma = new PrismaClient()
  const modelNames = Object.keys(prisma).filter(
    (key) => !key.startsWith('_') && !['$on', '$connect', '$disconnect', '$use', '$transaction', '$extends'].includes(key)
  )
  return modelNames
}

// Generate default permissions for all models
export function generateDefaultPermissions(role: 'admin' | 'user' = 'user'): Permission[] {
  const models = getAllModels()
  return models.map((model) => ({
    model,
    permissions: {
      create: role === 'admin',
      read: true,
      update: role === 'admin',
      delete: role === 'admin',
    }
  }))
}
