import { Result } from '@praha/byethrow'
import * as argon2 from 'argon2'
import { jwt } from '../../lib/jwt.js'
import type {
  SignupInput,
  LoginInput,
  GoogleLoginInput,
} from '../../routes/auth/schema.js'
import { EmailAlreadyExistsError, InvalidCredentialsError } from './error.js'
import { authRepository } from './repository.js'

export const authService = {
  /**
   * 新規登録
   */
  signup: async (input: SignupInput) => {
    // 1. 重複チェック
    const existingUser = await authRepository.findByEmail(input.email)
    if (existingUser) {
      return Result.fail(new EmailAlreadyExistsError())
    }

    // 2. ハッシュ化
    const passwordHash = await argon2.hash(input.password)

    // 3. ユーザー作成
    const user = await authRepository.createUser({ ...input, passwordHash })

    // 4. JWT生成 (共通関数を使用)
    const token = await jwt.generate({
      id: user.id,
      role: user.role,
    })

    // 5. UserResponse型に変換して返却
    return Result.succeed({
      token,
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  },
  /**
   * ログイン
   */
  login: async (input: LoginInput) => {
    // 1. ユーザー取得
    const user = await authRepository.findByEmail(input.email)

    if (!user) {
      return Result.fail(new InvalidCredentialsError())
    }

    // 2. パスワード検証
    if (!user.passwordHash) {
      return Result.fail(new InvalidCredentialsError())
    }

    const isValidPassword = await argon2.verify(
      user.passwordHash,
      input.password,
    )

    if (!isValidPassword) {
      return Result.fail(new InvalidCredentialsError())
    }

    // 3. ★JWT生成 (共通関数を使用)
    const token = await jwt.generate({
      id: user.id,
      role: user.role,
    })

    // 4. UserResponse型に変換して返却
    return Result.succeed({
      token,
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  },

  /**
   * Google認証（ログイン・新規登録兼用）
   */
  loginWithGoogle: async (input: GoogleLoginInput) => {
    // 1. Google ID でユーザー検索
    let user = await authRepository.findByGoogleId(input.googleId)

    // 2. Google IDで見つからない場合
    if (!user) {
      // 2-a. メールアドレスで既存ユーザーがいるか確認 (アカウント紐付け)
      const existingEmailUser = await authRepository.findByEmail(input.email)

      if (existingEmailUser) {
        // 既存ユーザーがいる場合、Google ID を更新して紐付ける
        user = await authRepository.updateGoogleId(
          existingEmailUser.id,
          input.googleId,
        )
      } else {
        // 2-b. 完全新規ユーザーとして作成
        // パスワード認証ではないのでハッシュは不要ですが、DB制約がある場合はダミーを入れるかschemaをnullableにする
        user = await authRepository.createWithGoogle({
          googleId: input.googleId,
          email: input.email,
          name: input.name,
          picture: input.picture,
        })
      }
    }

    // 3. JWT生成 (RedisSessionにする場合はここを差し替え)
    const token = await jwt.generate({
      id: user.id,
      role: user.role,
    })

    // 4. 返却
    return Result.succeed({
      token,
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  },

  logout: () => {
    return
  },
}
