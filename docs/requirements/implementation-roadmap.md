# B-Hall 実装ロードマップ

## 実装優先順位

### P0 — 最小限のシステムとして成立するために必須

| 順序 | 対象 | 内容 | 目安期間 |
|------|------|------|---------|
| 1 | E層 基盤 | 認証、テナント、組織、ユーザー、権限 | 2週間 |
| 2 | M13 | 組織管理UI、ユーザー管理UI | 1週間 |
| 3 | M02 | タスク管理（CRUD、ステータス遷移、ビュー） | 2週間 |
| 4 | M12 | アプリ内通知基盤 | 1週間 |
| 5 | M01 | ダッシュボード（担当者ビュー） | 1週間 |
| 6 | デザインシステム | 共通コンポーネント群 | 並行 |

**P0完了時点の状態**: ログインし、タスクを管理し、通知を受け取り、ダッシュボードで状況把握ができる。

### P1 — 業務統制の核が動く

| 順序 | 対象 | 内容 | 目安期間 |
|------|------|------|---------|
| 7 | E層 WFエンジン | ワークフローエンジン基盤 | 2週間 |
| 8 | M03 | 申請・承認（経費、休暇、汎用） | 2週間 |
| 9 | M04 | 稟議（CRUD、承認フロー、連携チェーン） | 1週間 |
| 10 | M07 | 文書管理（アップロード、フォルダ、タグ） | 1週間 |
| 11 | M01 | ダッシュボード（管理者ビュー追加） | 1週間 |
| 12 | M12 | メール通知 | 1週間 |

**P1完了時点の状態**: 申請→承認→稟議→文書管理の業務フローが動く。

### P2 — 部門業務と経営管理

| 順序 | 対象 | 内容 | 目安期間 |
|------|------|------|---------|
| 13 | M05 | 人事・労務（従業員マスタ、イベント、自動タスク） | 2週間 |
| 14 | M08 | 経理・財務（取引、経費精算、CF） | 3週間 |
| 15 | M06 | 総務（備品、貸与物、アカウント管理） | 1週間 |
| 16 | M09 | 報告・改善（報告投稿、改善フロー） | 1週間 |
| 17 | M10 | 経営管理（経営者ビュー） | 2週間 |
| 18 | M11 | ナレッジ・テンプレート | 1週間 |
| 19 | M01 | ダッシュボード（経営者ビュー、Backllyビュー） | 1週間 |
| 20 | カスタマイズ | カスタム項目、フォームビルダー、承認ルート | 2週間 |

## 実装アーキテクチャ

### 推奨技術スタック

| レイヤー | 技術 | 理由 |
|---------|------|------|
| フロントエンド | React + TypeScript + Vite | 既存構成を継続 |
| UIフレームワーク | Tailwind CSS | 既存構成を継続 |
| 状態管理 | Zustand or TanStack Query | 軽量、サーバー状態管理に強い |
| ルーティング | React Router v7 | 標準的、ディープリンク対応 |
| バックエンド | Node.js + Express + TypeScript | 既存構成を継続 |
| ORM | Prisma | 型安全、マイグレーション管理 |
| DB | PostgreSQL | RLS対応、JSON型対応、全文検索 |
| 認証 | JWT + bcrypt | シンプル、将来SSO拡張可 |
| ファイルストレージ | S3互換（Cloudflare R2等） | コスト効率 |
| リアルタイム | WebSocket（Socket.io） | 通知、ダッシュボード更新 |
| デプロイ | Vercel（フロント）+ Railway/Render（API） | 運用負荷低 |

### 推奨ディレクトリ構成

```
B-hall/
├── client/                    # フロントエンド
│   ├── src/
│   │   ├── components/        # 共通UIコンポーネント
│   │   │   ├── ui/           # 基本UI（Button, Card, Input等）
│   │   │   ├── layout/       # レイアウト（Sidebar, Header等）
│   │   │   └── shared/       # 共有コンポーネント
│   │   ├── features/          # 機能モジュール別
│   │   │   ├── dashboard/    # M01
│   │   │   ├── tasks/        # M02
│   │   │   ├── workflows/    # M03
│   │   │   ├── ringi/        # M04
│   │   │   ├── hr/           # M05
│   │   │   ├── general-affairs/ # M06
│   │   │   ├── documents/    # M07
│   │   │   ├── accounting/   # M08
│   │   │   ├── reports/      # M09
│   │   │   ├── management/   # M10
│   │   │   ├── knowledge/    # M11
│   │   │   ├── notifications/ # M12
│   │   │   └── settings/     # M13
│   │   ├── hooks/            # カスタムフック
│   │   ├── lib/              # ユーティリティ
│   │   ├── stores/           # 状態管理
│   │   └── types/            # 型定義
│   └── ...
├── server/                    # バックエンド
│   ├── src/
│   │   ├── modules/          # 機能モジュール別
│   │   │   ├── auth/
│   │   │   ├── tasks/
│   │   │   ├── workflows/
│   │   │   ├── ringi/
│   │   │   ├── hr/
│   │   │   ├── documents/
│   │   │   ├── accounting/
│   │   │   ├── reports/
│   │   │   ├── notifications/
│   │   │   └── settings/
│   │   ├── common/           # 共通処理
│   │   │   ├── middleware/   # 認証、テナント分離、ログ
│   │   │   ├── guards/      # 権限チェック
│   │   │   └── utils/
│   │   ├── database/         # DB設定、マイグレーション
│   │   └── events/           # イベント駆動基盤
│   └── prisma/               # Prismaスキーマ
├── docs/                      # ドキュメント
│   └── requirements/
└── CLAUDE.md
```

### DB設計方針

1. **テナント分離**: 全テーブルに `tenant_id` + PostgreSQL RLS
2. **監査カラム**: 全テーブルに `created_at, updated_at, created_by, updated_by, deleted_at`
3. **カスタム項目**: 主要テーブルに `custom_fields JSONB`
4. **ソフトデリート**: `deleted_at` による論理削除
5. **UUID主キー**: 全テーブルUUID v4

### API設計方針

1. **RESTful**: リソースベースのURL設計
2. **テナントスコープ**: すべてのAPIはテナントIDでスコープ
3. **ページネーション**: cursor-basedページネーション
4. **フィルタ**: クエリパラメータでフィルタ・ソート
5. **エラーレスポンス**: 統一されたエラー形式

```
GET    /api/tasks              # 一覧
POST   /api/tasks              # 作成
GET    /api/tasks/:id          # 詳細
PATCH  /api/tasks/:id          # 更新
DELETE /api/tasks/:id          # 削除（ソフトデリート）
POST   /api/tasks/:id/approve  # 承認
POST   /api/tasks/:id/reject   # 差戻し
```

### イベント駆動設計

```typescript
// イベント定義
interface DomainEvent {
  type: string          // 'employee.hired', 'ringi.approved' 等
  tenant_id: string
  payload: object
  timestamp: Date
  actor_id: string
}

// イベントハンドラ
eventBus.on('employee.hired', async (event) => {
  await taskService.createFromTemplate(event.tenant_id, 'onboarding', event.payload)
  await notificationService.notify(event.tenant_id, 'hr_team', 'new_hire', event.payload)
})

eventBus.on('ringi.approved', async (event) => {
  await taskService.createExecutionTasks(event.tenant_id, event.payload.ringi_id)
  await paymentService.createPaymentRequest(event.tenant_id, event.payload)
})
```

## 実装着手順序

1. **デザインシステム**: 共通コンポーネントを先に作る
2. **認証・テナント基盤**: ログイン、組織管理
3. **タスク管理**: システムのハブを最初に
4. **通知基盤**: タスクと連動
5. **ダッシュボード**: タスクデータで担当者ビュー
6. **ワークフロー**: 申請・承認
7. **以降**: P1, P2の順で拡張
