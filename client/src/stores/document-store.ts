import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Document, DocumentCategory } from '@/types'
import { generateId } from '@/lib/id'
import { today, daysFromNow } from '@/lib/date'

// ── シード文書 ──

const now = today()

const SEED_DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    title: '業務委託基本契約書（ABC商事）',
    category: 'contract',
    description: 'ABC商事との業務委託に関する基本契約書。有効期限は1年間、自動更新条項あり。',
    department: '法務部',
    tags: ['ABC商事', '業務委託', '基本契約'],
    file_name: '業務委託基本契約書_ABC商事.pdf',
    file_size: 2048000,
    file_type: 'application/pdf',
    file_url: '/files/doc-1.pdf',
    version: 1,
    expiry_date: daysFromNow(180),
    status: 'active',
    related_entity_type: '',
    related_entity_id: '',
    created_at: daysFromNow(-90),
    updated_at: daysFromNow(-90),
    created_by: 'user-4',
    updated_by: 'user-4',
    deleted_at: null,
  },
  {
    id: 'doc-2',
    title: '秘密保持契約書（XYZ社）',
    category: 'nda',
    description: 'XYZ社との秘密保持契約。共同開発プロジェクトに伴い締結。',
    department: '法務部',
    tags: ['XYZ社', 'NDA', '秘密保持'],
    file_name: 'NDA_XYZ社.pdf',
    file_size: 1024000,
    file_type: 'application/pdf',
    file_url: '/files/doc-2.pdf',
    version: 1,
    expiry_date: daysFromNow(90),
    status: 'active',
    related_entity_type: '',
    related_entity_id: '',
    created_at: daysFromNow(-60),
    updated_at: daysFromNow(-60),
    created_by: 'user-4',
    updated_by: 'user-4',
    deleted_at: null,
  },
  {
    id: 'doc-3',
    title: '就業規則（最新版）',
    category: 'regulation',
    description: '全従業員に適用される就業規則。最新の法改正を反映した第3版。',
    department: '人事部',
    tags: ['就業規則', '人事', '規程'],
    file_name: '就業規則_v3.pdf',
    file_size: 5120000,
    file_type: 'application/pdf',
    file_url: '/files/doc-3.pdf',
    version: 3,
    expiry_date: null,
    status: 'active',
    related_entity_type: '',
    related_entity_id: '',
    created_at: daysFromNow(-365),
    updated_at: daysFromNow(-14),
    created_by: 'user-2',
    updated_by: 'user-2',
    deleted_at: null,
  },
  {
    id: 'doc-4',
    title: '経費精算マニュアル',
    category: 'manual',
    description: '経費精算の手順と注意事項をまとめたマニュアル。領収書の取り扱い、承認フロー、精算期限について記載。',
    department: '経理部',
    tags: ['経費', '精算', 'マニュアル'],
    file_name: '経費精算マニュアル.pdf',
    file_size: 3072000,
    file_type: 'application/pdf',
    file_url: '/files/doc-4.pdf',
    version: 2,
    expiry_date: null,
    status: 'active',
    related_entity_type: '',
    related_entity_id: '',
    created_at: daysFromNow(-120),
    updated_at: daysFromNow(-30),
    created_by: 'user-3',
    updated_by: 'user-3',
    deleted_at: null,
  },
  {
    id: 'doc-5',
    title: '入社手続きチェックリスト',
    category: 'form',
    description: '新入社員の入社時に必要な手続き一覧。社保加入、雇用保険、給与口座登録等。',
    department: '人事部',
    tags: ['入社', 'チェックリスト', '手続き'],
    file_name: '入社手続きチェックリスト.xlsx',
    file_size: 512000,
    file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    file_url: '/files/doc-5.xlsx',
    version: 1,
    expiry_date: null,
    status: 'active',
    related_entity_type: '',
    related_entity_id: '',
    created_at: daysFromNow(-200),
    updated_at: daysFromNow(-45),
    created_by: 'user-2',
    updated_by: 'user-2',
    deleted_at: null,
  },
  {
    id: 'doc-6',
    title: '情報セキュリティポリシー',
    category: 'regulation',
    description: '社内の情報セキュリティに関する基本方針と遵守事項。全従業員が理解・遵守すべきポリシー。',
    department: '総務部',
    tags: ['セキュリティ', 'ポリシー', '規程'],
    file_name: '情報セキュリティポリシー.pdf',
    file_size: 2560000,
    file_type: 'application/pdf',
    file_url: '/files/doc-6.pdf',
    version: 2,
    expiry_date: null,
    status: 'active',
    related_entity_type: '',
    related_entity_id: '',
    created_at: daysFromNow(-180),
    updated_at: daysFromNow(-60),
    created_by: 'user-6',
    updated_by: 'user-6',
    deleted_at: null,
  },
  {
    id: 'doc-7',
    title: '月次報告テンプレート',
    category: 'form',
    description: '各部門の月次報告に使用するテンプレート。業績サマリー、課題、来月の計画を記載。',
    department: '経営企画',
    tags: ['月次報告', 'テンプレート', '報告'],
    file_name: '月次報告テンプレート.docx',
    file_size: 256000,
    file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    file_url: '/files/doc-7.docx',
    version: 1,
    expiry_date: null,
    status: 'active',
    related_entity_type: '',
    related_entity_id: '',
    created_at: daysFromNow(-150),
    updated_at: daysFromNow(-20),
    created_by: 'user-5',
    updated_by: 'user-5',
    deleted_at: null,
  },
  {
    id: 'doc-8',
    title: '取締役会議事録テンプレート',
    category: 'form',
    description: '取締役会の議事録作成に使用するテンプレート。法的要件を満たす書式。',
    department: '経営企画',
    tags: ['取締役会', '議事録', 'テンプレート'],
    file_name: '取締役会議事録テンプレート.docx',
    file_size: 384000,
    file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    file_url: '/files/doc-8.docx',
    version: 1,
    expiry_date: null,
    status: 'active',
    related_entity_type: '',
    related_entity_id: '',
    created_at: daysFromNow(-100),
    updated_at: daysFromNow(-100),
    created_by: 'user-5',
    updated_by: 'user-5',
    deleted_at: null,
  },
]

// ── Store 型定義 ──

interface DocumentState {
  documents: Document[]
  _hydrated: boolean
}

interface DocumentActions {
  addDocument: (data: Partial<Document>) => Document
  updateDocument: (id: string, data: Partial<Document>) => void
  deleteDocument: (id: string) => void
  getDocuments: () => Document[]
  getDocumentsByCategory: (category: DocumentCategory) => Document[]
  searchDocuments: (query: string) => Document[]
  setHydrated: () => void
}

type DocumentStore = DocumentState & DocumentActions

// ── Store ──

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      documents: SEED_DOCUMENTS,
      _hydrated: false,

      addDocument: (data: Partial<Document>) => {
        const now = today()
        const newDoc: Document = {
          id: generateId(),
          title: data.title || '',
          category: data.category || 'other',
          description: data.description || '',
          department: data.department || '',
          tags: data.tags || [],
          file_name: data.file_name || '',
          file_size: data.file_size || 0,
          file_type: data.file_type || '',
          file_url: data.file_url || '',
          version: data.version || 1,
          expiry_date: data.expiry_date || null,
          status: data.status || 'active',
          related_entity_type: data.related_entity_type || '',
          related_entity_id: data.related_entity_id || '',
          created_at: now,
          updated_at: now,
          created_by: data.created_by || '',
          updated_by: data.updated_by || '',
          deleted_at: null,
        }
        set((state) => ({ documents: [...state.documents, newDoc] }))
        return newDoc
      },

      updateDocument: (id: string, data: Partial<Document>) => {
        set((state) => ({
          documents: state.documents.map((d) =>
            d.id === id ? { ...d, ...data, updated_at: today() } : d
          ),
        }))
      },

      deleteDocument: (id: string) => {
        set((state) => ({
          documents: state.documents.map((d) =>
            d.id === id ? { ...d, deleted_at: today() } : d
          ),
        }))
      },

      getDocuments: () => {
        return get().documents.filter((d) => !d.deleted_at)
      },

      getDocumentsByCategory: (category: DocumentCategory) => {
        return get().documents.filter((d) => !d.deleted_at && d.category === category)
      },

      searchDocuments: (query: string) => {
        const q = query.toLowerCase()
        return get().documents.filter(
          (d) =>
            !d.deleted_at &&
            (d.title.toLowerCase().includes(q) ||
              d.description.toLowerCase().includes(q) ||
              d.tags.some((t) => t.toLowerCase().includes(q)))
        )
      },

      setHydrated: () => {
        set({ _hydrated: true })
      },
    }),
    {
      name: 'b-hall-documents',
      partialize: (state) => ({
        documents: state.documents,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
