import { googleAuth } from '@hono/oauth-providers/google'
import type { GoogleUser } from '@hono/oauth-providers/google'
import { Hono } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { describeRoute, resolver, validator } from 'hono-openapi'
import { authCookie } from '../../lib/authCookie.js'
import { env } from '../../lib/env.js'
import { createSession, getSession } from '../../lib/redis.js'
import { authService } from '../../services/auth/service.js'
import type { app } from '../index.js'
import { loginSchema, signupSchema, authResponseSchema } from './schema.js'

interface SessionUser {
  userId: string
  role: string
}

interface Variables {
  'user-google'?: GoogleUser
  user?: SessionUser
}

const authCheck = createMiddleware<{ Variables: Variables }>(
  async (c, next) => {
    const sessionId = getCookie(c, authCookie.cookieName)
    if (!sessionId) {
      return c.json({ message: 'Unauthorized: No session ID' }, 401)
    }

    const session = await getSession<SessionUser>(sessionId)

    if (!session) {
      // Redisにデータがない = 有効期限切れ or 不正なID
      return c.json(
        { message: 'Unauthorized: Invalid or expired session' },
        401,
      )
    }

    c.set('user', session.data)

    await next()
  },
)

export const auth = new Hono<{ Variables: Variables }>()
  .post(
    '/signup',
    describeRoute({
      tags: ['Auth'],
      description: 'Signup endpoint',
      responses: {
        200: {
          description: 'Successful Signup',
          content: {
            'application/json': {
              schema: resolver(authResponseSchema),
            },
          },
        },
        409: {
          description: 'Email already exists',
        },
      },
    }),
    validator('json', signupSchema),
    async (c) => {
      const input = c.req.valid('json')
      const result = await authService.signup(input)
      if (result.type === 'Failure') {
        return c.json({ message: result.error.message }, 409)
      }
      const sessionId = crypto.randomUUID()
      await createSession({
        id: sessionId,
        data: { userId: result.value.user.id, role: result.value.user.role },
      })

      authCookie.set(c, sessionId)
      return c.json(result.value, 201)
    },
  )
  .post(
    '/login',
    describeRoute({
      tags: ['Auth'],
      description: 'Login endpoint',
      responses: {
        200: {
          description: 'Successful Login',
          content: {
            'application/json': {
              schema: resolver(authResponseSchema),
            },
          },
        },
        401: {
          description: 'Invalid email or password',
        },
      },
    }),
    validator('json', loginSchema),
    async (c) => {
      const input = c.req.valid('json')
      const result = await authService.login(input)
      if (result.type === 'Failure') {
        return c.json({ message: result.error.message }, 401)
      }
      const sessionId = crypto.randomUUID()
      await createSession({
        id: sessionId,
        data: { userId: result.value.user.id, role: result.value.user.role },
      })

      authCookie.set(c, sessionId)
      return c.json(result.value)
    },
  )
  .post(
    '/logout',
    authCheck,
    describeRoute({
      tags: ['Auth'],
      description: 'Logout endpoint',
      responses: {
        200: {
          description: 'Successful Logout',
        },
      },
    }),
    (c) => {
      authCookie.remove(c)
      authService.logout()
      return c.json({ message: 'Logged out' }, 200)
    },
  )
  .get(
    '/google',
    describeRoute({
      tags: ['Auth'],
      summary: 'Google OAuth2 Login',
      description:
        'Googleアカウントを使用してログインを開始、またはコールバックを処理します。成功するとセッションCookieがセットされます。',
      responses: {
        200: {
          description:
            'Google認証成功。ユーザー情報を返却し、CookieにセッションIDをセットします。',
          content: {
            'application/json': {
              schema: resolver(authResponseSchema),
            },
          },
        },
        401: {
          description: 'Google認証、またはユーザー作成に失敗しました。',
        },
      },
    }),
    googleAuth({
      client_id: env.GOOGLE_ID,
      client_secret: env.GOOGLE_SECRET,
      scope: ['openid', 'email', 'profile'],
      // redirect_uri: env.GOOGLE_REDIRECT_URI,
    }),
    async (c) => {
      // 1. Googleからユーザー情報を取得
      const googleUser = c.get('user-google')

      if (!googleUser) {
        return c.json({ message: 'Google authentication failed' }, 401)
      }

      // 2. Service層: DBからユーザーを検索、または新規作成
      const result = await authService.loginWithGoogle({
        googleId: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
      })

      if (result.type === 'Failure') {
        return c.json({ message: result.error.message }, 401)
      }

      const user = result.value.user

      // 3. Redisセッション作成
      // サーバー側(Redis)にユーザー情報を保存
      const sessionId = crypto.randomUUID()
      await createSession({
        id: sessionId,
        data: {
          userId: user.id,
          role: user.role,
        },
      })

      // 4. クライアント側(Cookie)にセッションIDを保存
      setCookie(c, authCookie.cookieName, sessionId, {
        httpOnly: true,
        sameSite: 'Lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 1日
      })

      // 5. ログイン成功レスポンス
      return c.json({
        message: 'Google Login Successful',
        user: user,
      })
    },
  )

export type AppType = typeof app
