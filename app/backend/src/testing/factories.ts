import argon2 from 'argon2'
import type { UserRole } from '../../generated/prisma/enums.js'
import { prisma } from '../lib/prisma.js'

/**
 * テスト用の共通ユーザー作成関数
 */
export const createTestUser = async (options: {
  email?: string
  name?: string
  password?: string
  role: UserRole
}) => {
  // 指定がなければランダムなメールアドレスを生成
  const email =
    options.email ?? `test-${Math.random().toString(36).slice(2)}@example.com`

  const plainPassword = options.password ?? 'password123'
  const passwordHash = await argon2.hash(plainPassword)

  // authRepo.createUser を使わずに、直接 Prisma で作成
  const user = await prisma.users.create({
    data: {
      email: email,
      userName: options.name ?? 'Test User',
      passwordHash: passwordHash,
      role: options.role,
    },
  })

  return {
    ...user,
    plainPassword,
  }
}
