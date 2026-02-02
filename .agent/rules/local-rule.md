---
trigger: always_on
---

ユーザーへは日本語で回答してください。
この環境は、wsl上で起動したdevcontainerです。

下記に記述する二種類のコーディングに関する指示をよく読み作業を進めてください。

1. Project Context & Purpose
学校向けSNSアプリケーションの開発プロジェクトです。 学生・教師間のコミュニケーション、コンテンツ（Artifacts/Scraps）の共有、ワールド（コミュニティ）機能を備えています。教育機関向けのセキュアな環境とロールベース（ADMIN/STUDENT/TEACHER）のアクセス制御を特徴とします。

2. Technology Stack & Architecture
Monorepo: pnpm 10.25.0 (workspace)

Runtime: Node.js 20+

Backend: Hono, Prisma (SQLite), @praha/byethrow (Result pattern)

Frontend: React 19, Vite, Tailwind CSS v4

State/Routing: TanStack (Router, Query, Form)

Type Safety: TypeScript strict mode, End-to-End type safety via hono/client

3. Directory Structure
/
├── app/
│   ├── backend/             # Hono API Server
│   │   ├── src/routes/      # API endpoints (by domain)
│   │   ├── src/services/    # Business logic (service/repository/error)
│   │   └── prisma/          # Schema & Migrations
│   └── frontend/            # React SPA
│       ├── src/routes/      # File-based routing (TanStack Router)
│       ├── src/features/    # Domain logic & components
│       ├── src/components/  # ui/ (primitives), layout/
│       └── src/api/         # TanStack Query hooks & keys
└── .kiro/                   # Project memory
4. Coding Standards (Frontend)
Formatting & Naming
Prettier: semi: false, singleQuote: true, trailingComma: 'all'

Naming:

Components: PascalCase (folder/index.tsx pattern)

Hooks: useCamelCase

Constants: UPPER_SNAKE_CASE

Files: kebab-case (except Components)

Path Alias: Always use @/ for src/ imports in frontend.

Component Pattern
Base: index.tsx as entry point. Use Props interface.

Styling: Tailwind CSS v4 utilities. Use cn() from @/utils/cn for merging classes.

Layout: Prefer flex with gap over margins. Use h-dvh for full-height layouts.

Routing (TanStack Router)
Separation:

index.tsx: Loaders, beforeLoad, validateSearch (data fetching/logic).

index.lazy.tsx: UI components only.

Guards: Implement redirects in beforeLoad.

Data Fetching
Query Keys: Use factory functions (e.g., usersKeys.detail(id)).

Error Handling: Use ApiError class with status codes.

5. Coding Standards (Backend)
Error Handling: Use Result type pattern via @praha/byethrow. Avoid throwing raw errors.

Routes: Define schemas using Zod and use hono-openapi.

Imports: Use .js extension for relative imports (ESM compliance).

6. AI Implementation Instructions
Type Safety: any の使用を禁止し、Prismaの生成型や共通型を最大限活用せよ。

1. ディレクトリ構成とファイル責務
✅ DO (推奨事項)
Feature-First: 機能開発は原則 features/{domain}/ 内で完結させる。

Entry Point: コンポーネントはフォルダ化し、index.tsx から default export する。

Separation: ロジック（Hooks）とUI（Component）を分離する。

Backend/Frontend Separation: app/backend と app/frontend の境界を厳守する。

❌ DON'T (禁止事項)
❌ components/ui に特定のビジネスロジックを含める（これらは純粋なUI部品であるべき）。

❌ features ディレクトリを跨いだ相互依存（必要な場合は shared や core に切り出す）。

❌ 深い相対パスでのインポート（../../../）。必ずエイリアス src/ (@/) を使用する。

2. Frontend実装ルール (React/TanStack)
Routing (TanStack Router)
⚠️ 重要: ファイル分割のルール

index.tsx: データ取得・検証のみ (loader, beforeLoad, validateSearch)。コンポーネント本体は書かない。

index.lazy.tsx: UIコンポーネントのみ。Loaderやリダイレクト処理などの副作用を記述しない。

Guard: 認証チェックは beforeLoad で行い、失敗時は例外として redirect を throw する。

Component & Styling
Type Definitions: Props インターフェースを明示的に定義する。React.FC<Props> を使用。

Class Merging: 外部からスタイル拡張可能にするため、必ず cn() ユーティリティで className をマージする。

Tailwind CSS:

margin よりも gap を優先してスペーシングを行う。

色指定は slate (グレー系) と black/white (メイン) に限定する。

禁止: 動的なクラス名の生成（例: w-${width}）。Tailwindがパースできなくなるため、style 属性か、オブジェクトマップを使用する。

State Management (TanStack Query)
Query Keys: 文字列リテラルを直接書かず、必ず keys.ts の Factory 関数経由で生成する。

API Client: fetch を直接使わず、型安全なクライアント（hc 由来）を使用する。

Forms
Logic Separation: useForm の定義や zod スキーマは、コンポーネントファイル内に直接書かず、カスタムフック（useLoginForm等）に切り出す。

3. Backend実装ルール (Hono/Prisma)
API Architecture
Error Handling: try-catch ブロックを乱用せず、Result 型（@praha/byethrow）を使用してエラーを値として扱う。

Response Type: フロントエンドと型を共有するため、HonoのRPCモード（hc）に対応したレスポンス形式を維持する。

Database
Schema Changes: schema.prisma を変更した際は、必ずマイグレーションとクライアント生成コマンドを実行する。

4. General Coding Standards
Syntax & Formatting
TypeScript: Strict Mode 必須。any 型の使用は禁止。

Prettier: セミコロンなし (semi: false)、シングルクォート (singleQuote: true)。

Naming:

Component: PascalCase

Function/Variable: camelCase

Constant: UPPER_SNAKE_CASE

Import Order
外部ライブラリ (react, @tanstack/* 等)

内部絶対パス (@/features/*, @/components/*)

相対パス (./, ../)

型定義 (import type ...)

5. アンチパターン集 (AIへの禁止命令)
コード生成時は以下のパターンを 絶対に出力しないでください。

Tailwindの @apply の使用

理由: CSSバンドルサイズが増大し、クラスの追跡が困難になるため。cn() とコンポーネント化で対応する。

useEffect によるデータ取得

理由: useSuspenseQuery または useQuery を使用すべきであるため。

Default Export と Named Export の混在

理由: コンポーネントは Default Export、ユーティリティやHooksは Named Export に統一する。

マジックナンバー/ストリングの使用

理由: 定数ファイルまたは設定オブジェクトに切り出す。

不必要な div ラッパー

理由: React.Fragment (<>...</>) を使用するか、親要素のクラス (grid, flex) でレイアウトを制御する。