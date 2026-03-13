# B-Hall ドメインモデル

## 5層思想モデル

### Layer 1 — イベント
業務の発生起点。B-Hallではすべてのフローがイベントから始まる。

### Layer 2 — フロー
イベントに紐づく処理経路。誰が起票し、誰が確認・承認し、何の書類が必要か。

### Layer 3 — 業務オブジェクト
フローの中を流れる実体。タスク、申請、稟議、報告、書類、取引等。

### Layer 4 — 経営情報
フロー実行結果として蓄積される情報。進捗、コスト、リスク等。

### Layer 5 — 経営判断
蓄積情報を元に経営者が判断・改善を行うレイヤー。

---

## コアエンティティ

### Tenant（テナント）
```
- id: UUID
- name: string
- plan: enum(free, standard, premium)
- created_at: timestamp
```

### Organization（組織）
```
- id: UUID
- tenant_id: UUID → Tenant
- name: string
- parent_id: UUID? → Organization（部署階層）
- type: enum(company, department, team)
```

### User（ユーザー）
```
- id: UUID
- tenant_id: UUID → Tenant
- email: string
- name: string
- role: enum(ceo, exec, admin, mgr, acc, hr, labor, ga, legal, staff, viewer, audit, backlly)
- organization_id: UUID → Organization
- position: string
- status: enum(active, inactive, suspended)
```

### Task（タスク — システムのハブ）
```
- id: UUID
- tenant_id: UUID → Tenant
- title: string
- description: text
- category: string
- sub_category: string
- organization_id: UUID → Organization
- creator_id: UUID → User
- assignee_id: UUID → User
- reviewer_id: UUID? → User
- approver_id: UUID? → User
- due_date: date?
- priority: enum(urgent, high, medium, low)
- status: enum(todo, in_progress, reviewing, approving, rejected, on_hold, done, cancelled)
- source_event: string?（発生起点）
- template_id: UUID? → TaskTemplate
- parent_task_id: UUID?（サブタスク）
- recurrence: json?（繰り返し設定）
```

### Application（申請）
```
- id: UUID
- tenant_id: UUID → Tenant
- type: string（経費、休暇、出張等）
- applicant_id: UUID → User
- form_data: json
- status: enum(draft, submitted, approving, approved, rejected, resubmitted, withdrawn)
- approval_route_id: UUID → ApprovalRoute
- related_task_id: UUID? → Task
```

### ApprovalRoute（承認ルート）
```
- id: UUID
- tenant_id: UUID → Tenant
- name: string
- steps: json（承認ステップ配列）
- conditions: json?（条件分岐ルール）
```

### Ringi（稟議）
```
- id: UUID
- tenant_id: UUID → Tenant
- title: string
- background: text
- purpose: text
- content: text
- amount: decimal?
- roi_estimate: text?
- risk: text?
- effect: text?
- approval_route_id: UUID → ApprovalRoute
- status: enum(draft, submitted, approving, approved, rejected)
- decision_date: date?
- related_contract_id: UUID? → Document
- related_payment_id: UUID? → Payment
- execution_task_id: UUID? → Task
```

### Employee（従業員マスタ）
```
- id: UUID
- tenant_id: UUID → Tenant
- user_id: UUID? → User
- name: string
- department_id: UUID → Organization
- position: string
- employment_type: enum(full_time, part_time, contract, temporary)
- hire_date: date
- termination_date: date?
- social_insurance_status: json
- employment_insurance_status: json
- emergency_contact: json
- health_check_date: date?
```

### Document（文書）
```
- id: UUID
- tenant_id: UUID → Tenant
- title: string
- type: enum(contract, nda, regulation, procedure, certificate, receipt, other)
- file_url: string
- folder_id: UUID?
- tags: string[]
- version: integer
- expiry_date: date?
- status: enum(active, expired, archived)
- uploaded_by: UUID → User
```

### Transaction（取引）
```
- id: UUID
- tenant_id: UUID → Tenant
- type: enum(income, expense, transfer)
- amount: decimal
- account_code: string
- sub_account: string?
- counterparty: string?
- date: date
- description: string
- document_id: UUID? → Document（証憑）
- application_id: UUID? → Application
```

### Report（報告）
```
- id: UUID
- tenant_id: UUID → Tenant
- type: enum(daily, weekly, monthly, incident, accident, complaint, near_miss, improvement, suggestion_box)
- author_id: UUID → User
- is_anonymous: boolean
- title: string
- content: text
- status: enum(submitted, assigned, in_progress, resolved, closed)
- assignee_id: UUID? → User
- improvement_task_id: UUID? → Task
```

### Notification（通知）
```
- id: UUID
- tenant_id: UUID → Tenant
- user_id: UUID → User
- type: string
- title: string
- body: text
- source_type: string（タスク、申請、稟議等）
- source_id: UUID
- is_read: boolean
- created_at: timestamp
```

---

## リレーション図（簡略）

```
Tenant ─┬── Organization ── User
        ├── Task ←──────── Application
        │    ↑                  ↑
        │    ├── Ringi ─── ApprovalRoute
        │    ├── Report
        │    └── Document
        ├── Employee
        ├── Transaction ── Document（証憑）
        └── Notification
```

## オブジェクト間の接続ルール

1. **タスクはハブ**: すべてのオブジェクトはTaskとの関連を持てる
2. **テナント分離**: すべてのエンティティにtenant_idを持つ
3. **監査可能**: 全エンティティにcreated_at, updated_at, created_by, updated_byを持つ
4. **ソフトデリート**: deleted_atフラグで論理削除
5. **カスタム項目**: custom_fields (json) を主要エンティティに持つ
