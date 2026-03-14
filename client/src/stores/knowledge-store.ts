import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { KnowledgeArticle, KnowledgeType } from '@/types'
import { generateId } from '@/lib/id'
import { today, daysFromNow } from '@/lib/date'

// ── シードナレッジ ──

const SEED_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'knowledge-1',
    title: '経費精算の手順',
    type: 'procedure',
    content: '## 経費精算の手順\n\n### 1. 経費の発生\n経費が発生したら、必ず領収書を受け取ってください。\n\n### 2. 申請書の作成\n- B-Hallの申請画面から「経費精算」を選択\n- 必要事項を入力し、領収書の画像を添付\n- 金額と勘定科目を正確に入力\n\n### 3. 承認フロー\n1. 直属の上長が一次承認\n2. 経理部が最終確認\n3. 精算処理（毎月25日締め、翌月10日支払い）\n\n### 注意事項\n- 3万円以上の経費は事前申請が必要\n- 領収書の提出期限は発生日から1ヶ月以内\n- 接待交際費は参加者名と目的を明記すること',
    department: '経理部',
    tags: ['経費', '精算', '手順'],
    author_id: 'user-3',
    version: 2,
    is_published: true,
    view_count: 45,
    created_at: daysFromNow(-90),
    updated_at: daysFromNow(-10),
    created_by: 'user-3',
    updated_by: 'user-3',
    deleted_at: null,
  },
  {
    id: 'knowledge-2',
    title: '入社手続きマニュアル',
    type: 'manual',
    content: '## 入社手続きマニュアル\n\n### 入社前の準備\n- [ ] 雇用契約書の作成・送付\n- [ ] 社会保険加入書類の準備\n- [ ] 社員証の発行依頼\n- [ ] PCアカウントの発行依頼\n\n### 入社当日\n1. オリエンテーション実施（9:00-10:00）\n2. 各種書類の回収\n3. 社員証・PC・備品の貸与\n4. 部署への引き渡し\n\n### 入社後1週間以内\n- 社会保険・雇用保険の届出\n- 給与振込口座の登録\n- 勤怠システムの初期設定\n- 各種社内ツールのアカウント発行',
    department: '人事部',
    tags: ['入社', '手続き', 'マニュアル'],
    author_id: 'user-2',
    version: 3,
    is_published: true,
    view_count: 32,
    created_at: daysFromNow(-180),
    updated_at: daysFromNow(-14),
    created_by: 'user-2',
    updated_by: 'user-2',
    deleted_at: null,
  },
  {
    id: 'knowledge-3',
    title: 'よくある質問：有給休暇',
    type: 'faq',
    content: '## 有給休暇に関するFAQ\n\n### Q: 有給休暇は何日付与されますか？\n入社6ヶ月経過時に10日付与されます。以降、勤続年数に応じて増加します。\n\n### Q: 半日単位で取得できますか？\nはい、半日単位での取得が可能です。午前半休（9:00-13:00）と午後半休（13:00-18:00）から選べます。\n\n### Q: 申請はいつまでにすればいいですか？\n原則として3営業日前までに申請してください。急な体調不良等の場合は当日申請も可能です。\n\n### Q: 有給の繰り越しはできますか？\n翌年度まで繰り越し可能です。2年を超えると消滅しますのでご注意ください。\n\n### Q: 計画年休とは何ですか？\n会社が指定する日に一斉に有給を取得する制度です。年間5日を上限に設定されます。',
    department: '人事部',
    tags: ['有給', '休暇', 'FAQ'],
    author_id: 'user-2',
    version: 1,
    is_published: true,
    view_count: 78,
    created_at: daysFromNow(-120),
    updated_at: daysFromNow(-30),
    created_by: 'user-2',
    updated_by: 'user-2',
    deleted_at: null,
  },
  {
    id: 'knowledge-4',
    title: '情報セキュリティガイドライン',
    type: 'guide',
    content: '## 情報セキュリティガイドライン\n\n### パスワード管理\n- 8文字以上、英数字・記号を含む\n- 3ヶ月ごとに変更\n- 使い回し禁止\n\n### メール利用\n- 不審なメールの添付ファイルを開かない\n- 社外へのファイル送信は暗号化必須\n- 個人メールアドレスでの業務利用禁止\n\n### リモートワーク時\n- VPN接続必須\n- 公共Wi-Fi での業務禁止\n- 画面ロックの徹底（離席時）\n- 社外での業務内容の会話に注意\n\n### インシデント発生時\n1. 直ちに情報システム担当に連絡\n2. 端末をネットワークから切断\n3. 状況を記録（スクリーンショット等）\n4. 指示に従い対応',
    department: '総務部',
    tags: ['セキュリティ', 'ガイドライン', 'IT'],
    author_id: 'user-6',
    version: 2,
    is_published: true,
    view_count: 25,
    created_at: daysFromNow(-200),
    updated_at: daysFromNow(-45),
    created_by: 'user-6',
    updated_by: 'user-6',
    deleted_at: null,
  },
  {
    id: 'knowledge-5',
    title: '議事録テンプレートの使い方',
    type: 'template',
    content: '## 議事録テンプレートの使い方\n\n### テンプレートの取得\n文書管理 > テンプレートから「議事録テンプレート」をダウンロードしてください。\n\n### 記載項目\n1. **会議名**: 正式な会議名を記載\n2. **日時**: 開始・終了時刻を明記\n3. **出席者**: 役職名・氏名を記載\n4. **議題**: 事前に共有された議題を列挙\n5. **議事内容**: 議題ごとに討議内容を記録\n6. **決定事項**: 合意された内容を明確に記載\n7. **アクションアイテム**: 担当者と期限を明記\n\n### 提出方法\n会議終了後3営業日以内に、文書管理システムにアップロードしてください。',
    department: '経営企画',
    tags: ['議事録', 'テンプレート', '使い方'],
    author_id: 'user-5',
    version: 1,
    is_published: true,
    view_count: 15,
    created_at: daysFromNow(-60),
    updated_at: daysFromNow(-20),
    created_by: 'user-5',
    updated_by: 'user-5',
    deleted_at: null,
  },
  {
    id: 'knowledge-6',
    title: 'リモートワーク規程解説',
    type: 'column',
    content: '## リモートワーク規程解説\n\n### はじめに\n当社のリモートワーク規程が改定されました。本コラムでは主な変更点と注意事項を解説します。\n\n### 主な変更点\n- 週3日までのリモートワークが可能に（従来は週2日）\n- リモートワーク手当の新設（月額5,000円）\n- フレックスタイム制との併用が可能に\n\n### 申請方法\n前日までにB-Hallの申請画面から「リモートワーク申請」を提出してください。\n\n### 注意事項\n- コアタイム（10:00-15:00）は連絡可能な状態を維持\n- 業務開始・終了時にチャットで報告\n- 週1回以上は出社日を設けること',
    department: '人事部',
    tags: ['リモートワーク', '規程', '解説'],
    author_id: 'user-2',
    version: 1,
    is_published: false,
    view_count: 0,
    created_at: daysFromNow(-2),
    updated_at: daysFromNow(-2),
    created_by: 'user-2',
    updated_by: 'user-2',
    deleted_at: null,
  },
]

// ── Store 型定義 ──

interface KnowledgeState {
  articles: KnowledgeArticle[]
  _hydrated: boolean
}

interface KnowledgeActions {
  addArticle: (data: Partial<KnowledgeArticle>) => KnowledgeArticle
  updateArticle: (id: string, data: Partial<KnowledgeArticle>) => void
  publishArticle: (id: string) => void
  incrementViewCount: (id: string) => void
  getArticles: () => KnowledgeArticle[]
  searchArticles: (query: string) => KnowledgeArticle[]
  getArticlesByType: (type: KnowledgeType) => KnowledgeArticle[]
  setHydrated: () => void
}

type KnowledgeStore = KnowledgeState & KnowledgeActions

// ── Store ──

export const useKnowledgeStore = create<KnowledgeStore>()(
  persist(
    (set, get) => ({
      articles: SEED_ARTICLES,
      _hydrated: false,

      addArticle: (data: Partial<KnowledgeArticle>) => {
        const now = today()
        const newArticle: KnowledgeArticle = {
          id: generateId(),
          title: data.title || '',
          type: data.type || 'manual',
          content: data.content || '',
          department: data.department || '',
          tags: data.tags || [],
          author_id: data.author_id || '',
          version: 1,
          is_published: data.is_published || false,
          view_count: 0,
          created_at: now,
          updated_at: now,
          created_by: data.created_by || '',
          updated_by: data.updated_by || '',
          deleted_at: null,
        }
        set((state) => ({ articles: [...state.articles, newArticle] }))
        return newArticle
      },

      updateArticle: (id: string, data: Partial<KnowledgeArticle>) => {
        set((state) => ({
          articles: state.articles.map((a) =>
            a.id === id ? { ...a, ...data, updated_at: today() } : a
          ),
        }))
      },

      publishArticle: (id: string) => {
        set((state) => ({
          articles: state.articles.map((a) =>
            a.id === id ? { ...a, is_published: true, updated_at: today() } : a
          ),
        }))
      },

      incrementViewCount: (id: string) => {
        set((state) => ({
          articles: state.articles.map((a) =>
            a.id === id ? { ...a, view_count: a.view_count + 1 } : a
          ),
        }))
      },

      getArticles: () => {
        return get().articles.filter((a) => !a.deleted_at)
      },

      searchArticles: (query: string) => {
        const q = query.toLowerCase()
        return get().articles.filter(
          (a) =>
            !a.deleted_at &&
            (a.title.toLowerCase().includes(q) ||
              a.content.toLowerCase().includes(q) ||
              a.tags.some((t) => t.toLowerCase().includes(q)))
        )
      },

      getArticlesByType: (type: KnowledgeType) => {
        return get().articles.filter((a) => !a.deleted_at && a.type === type)
      },

      setHydrated: () => {
        set({ _hydrated: true })
      },
    }),
    {
      name: 'b-hall-knowledge',
      partialize: (state) => ({
        articles: state.articles,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
