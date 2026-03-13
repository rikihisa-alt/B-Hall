# B-Hall マルチテナント仕様

## テナント分離方式

### 論理分離（共有DB・tenant_id分離）

すべてのテーブルに `tenant_id` カラムを持ち、アプリケーションレベルでデータを分離する。

**理由**:
- 中小企業向けSaaSとして運用コストを抑える
- テナント数のスケーラビリティ
- 共通スキーマのメンテナンス性

### 分離の保証

1. **ORMレベル**: すべてのクエリにtenant_idフィルタを自動付加
2. **APIレベル**: リクエストからテナントIDを取得し、全操作で検証
3. **DBレベル**: Row Level Security（PostgreSQL RLS）を併用

```sql
-- RLS ポリシー例
CREATE POLICY tenant_isolation ON tasks
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

## テナント管理

### Tenantエンティティ
```
- id: UUID
- name: string（企業名）
- subdomain: string?（将来的にサブドメイン対応）
- plan: enum(free, standard, premium)
- max_users: integer
- storage_limit_gb: integer
- created_at: timestamp
- status: enum(active, suspended, cancelled)
```

### プラン設計（参考）

| 機能 | Free | Standard | Premium |
|------|------|----------|---------|
| ユーザー数 | 5 | 50 | 無制限 |
| ストレージ | 1GB | 10GB | 100GB |
| 監査ログ保持 | 30日 | 90日 | 365日 |
| カスタムフォーム | 3 | 無制限 | 無制限 |
| API連携 | × | ○ | ○ |

## Backlly担当者のアクセス

### 横断アクセス
- Backllyロールはテナント横断でデータを閲覧可能
- ただし、個人情報（従業員詳細等）は閲覧不可
- 閲覧可能: ヘルススコア、タスク滞留状況、利用率統計

### ヘルススコア算出
```
ヘルススコア = (
  利用率 × 0.3 +
  タスク完了率 × 0.2 +
  期限遵守率 × 0.2 +
  未処理件数の少なさ × 0.15 +
  改善提案活用率 × 0.15
) × 100
```

### 介入判断基準
- ヘルススコア 60未満
- 7日以上ログインなし
- 期限超過タスク 10件以上
- 未処理承認 5件以上かつ3日経過
