import { UserRole } from '../../../generated/prisma/enums.js'
import { prisma } from '../../lib/prisma.js'
import { createTestUser } from '../../testing/factories.js'
import { authRepository } from './repository.js'

describe('AuthRepository', () => {
  const repo = authRepository

  // 各テスト実行前にDBをクリーンアップして独立性を保つ
  beforeEach(async () => {
    await prisma.userRelationships.deleteMany() // 子
    await prisma.artifacts.deleteMany() // 子
    await prisma.users.deleteMany() // 親
  })

  describe('createUser', () => {
    it('AUTH_REPO_001: 正しい入力値でユーザーが作成されること', async () => {
      const input = {
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: 'hashed_pw',
      }

      const user = await repo.createUser({
        ...input,
        password: 'pw',
      })

      expect(user).toEqual(
        expect.objectContaining({
          email: input.email,
          userName: input.name,
          passwordHash: input.passwordHash,
          role: UserRole.STUDENT,
          bio: null,
          avatarUrl: null,
        }),
      )

      expect(user.id).toBeDefined()
      expect(user.createdAt).toBeDefined()
    })

    it('AUTH_REPO_002: 名前が未指定の場合に No Name が設定されること', async () => {
      const input = {
        email: 'noname@example.com',
        name: undefined,
        passwordHash: 'hashed_pw',
      }
      const user = await repo.createUser({ ...input, password: 'pw' })
      expect(user.userName).toBe('No Name')
    })

    it('AUTH_REPO_003: 既に存在するEmailで登録した際にエラーが発生すること', async () => {
      const email = 'duplicate@example.com'
      // 1人目を作成
      await createTestUser({ email, role: 'STUDENT' })

      // 同じEmailで2人目を作成
      await expect(
        repo.createUser({
          email,
          name: 'New User',
          passwordHash: 'new_hash',
          password: '',
        }),
      ).rejects.toThrow()
    })

    it('AUTH_REPO_004: 必須項目(email)が欠落している場合にエラーが発生すること', async () => {
      await expect(
        repo.createUser({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
          email: null as any, // 意図的にnullを流し込む
          name: 'No Email User',
          passwordHash: 'hash',
          password: '',
        }),
      ).rejects.toThrow()
    })
  })

  describe('findByEmail', () => {
    it('AUTH_REPO_005: 存在するEmailを指定してユーザーが取得できること', async () => {
      const input = { email: 'find@example.com', role: UserRole.TEACHER }
      const createdUser = await createTestUser({ ...input })

      const foundUser = await repo.findByEmail('find@example.com')
      expect(foundUser).not.toBeNull()
      expect(foundUser?.id).toBe(createdUser.id)
    })

    it('AUTH_REPO_006: 存在しないEmailを指定した際に null が返ること', async () => {
      const foundUser = await repo.findByEmail('notfound@example.com')
      expect(foundUser).toBeNull()
    })
  })
})
