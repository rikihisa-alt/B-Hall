# B-Hall ワークフローエンジン仕様

## 概要

ワークフローエンジンは基盤レイヤー（E層）に位置し、申請・承認・稟議・報告等すべてのフロー制御を担う。

## 承認ルート設計

### ルート構成要素

```typescript
interface ApprovalRoute {
  id: string
  name: string
  steps: ApprovalStep[]
  conditions: RouteCondition[]  // 条件分岐
}

interface ApprovalStep {
  order: number
  type: 'sequential' | 'parallel' | 'any_one'
  approvers: ApproverRule[]
  auto_approve_days?: number  // 自動承認（期限切れ）
}

interface ApproverRule {
  type: 'user' | 'role' | 'position' | 'department_head'
  value: string  // user_id, role名, 役職名
}

interface RouteCondition {
  field: string           // 判定フィールド
  operator: 'gte' | 'lte' | 'eq' | 'contains'
  value: any
  then_steps: ApprovalStep[]  // 条件一致時の追加ステップ
}
```

### 承認パターン

1. **直列承認**: A→B→C（順番に承認）
2. **並列承認**: A+B→C（AとB両方承認後にCへ）
3. **任意一名承認**: A|B→C（AまたはBの承認でCへ）
4. **条件分岐**: 金額100万以上→役員承認ステップ追加

### ステータス遷移

```
下書き → 申請中 → 承認ステップ1 → ... → 承認ステップN → 承認済み
                                              ↓
                                           差戻し → 再申請 → 申請中
                                              ↓
                                           取下げ
```

## 代理承認

- 承認者が不在時、事前に代理者を設定可能
- 代理承認はログに「代理」として記録
- 代理期間の設定（開始日〜終了日）

## 自動タスク生成

承認完了時に以下を自動実行可能:
- 関連タスクの自動作成（テンプレートID指定）
- 関連取引の自動作成（経費承認→支払データ）
- 通知の自動配信

## フォームビルダー

カスタム申請フォームを定義するための基盤。

```typescript
interface FormDefinition {
  id: string
  name: string
  fields: FormField[]
  approval_route_id: string
}

interface FormField {
  name: string
  label: string
  type: 'text' | 'number' | 'date' | 'select' | 'file' | 'user' | 'textarea'
  required: boolean
  options?: string[]    // selectの場合
  validation?: object   // バリデーションルール
}
```

## イベントトリガー

```typescript
interface EventTrigger {
  event_type: string       // 'employee.hired', 'contract.expiring' 等
  conditions?: object      // 追加条件
  task_template_id: string // 自動生成するタスクテンプレート
  notify_users?: string[]  // 通知先
}
```
