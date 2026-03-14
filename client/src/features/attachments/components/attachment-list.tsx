'use client'

import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Paperclip, FileText, Image, FileSpreadsheet, File, Download, Trash2 } from 'lucide-react'
import { useToast } from '@/components/ui/toast-provider'
import type { Attachment } from '@/types'
import { generateId } from '@/lib/id'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

interface AttachmentListProps {
  attachments: Attachment[]
  onAdd: (file: File) => void
  onRemove: (id: string) => void
}

/** ファイルサイズを読みやすい形式にフォーマット */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** ファイルタイプに応じたアイコンを返す */
function getFileIcon(type: string) {
  if (type.startsWith('image/')) return Image
  if (type.includes('spreadsheet') || type.includes('csv') || type.includes('excel')) return FileSpreadsheet
  if (type.includes('pdf') || type.includes('document') || type.includes('text')) return FileText
  return File
}

/** ファイルタイプに応じたカラーを返す */
function getFileColor(type: string): string {
  if (type.startsWith('image/')) return '#8B5CF6'
  if (type.includes('spreadsheet') || type.includes('csv') || type.includes('excel')) return '#22C55E'
  if (type.includes('pdf')) return '#EF4444'
  if (type.includes('document') || type.includes('text')) return '#3B82F6'
  return '#A8A29E'
}

export function AttachmentList({ attachments, onAdd, onRemove }: AttachmentListProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addToast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      addToast('error', 'ファイルサイズは2MB以下にしてください')
      // reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    onAdd(file)

    // reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDownload = (attachment: Attachment) => {
    const link = document.createElement('a')
    link.href = attachment.url
    link.download = attachment.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-3">
      {/* ファイル追加ボタン */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-3.5 h-9 rounded-[10px] border border-border bg-bg-surface text-[13px] font-medium text-text-secondary hover:bg-bg-elevated hover:border-[rgba(0,0,0,0.12)] active:scale-[0.97] transition-all"
        >
          <Paperclip className="w-4 h-4" strokeWidth={1.75} />
          ファイルを添付
        </button>
        <p className="text-[11px] text-text-muted mt-1.5">最大2MB</p>
      </div>

      {/* ファイル一覧 */}
      {attachments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-10 h-10 rounded-[10px] bg-bg-elevated flex items-center justify-center mb-3">
            <Paperclip className="w-5 h-5 text-text-muted" strokeWidth={1.75} />
          </div>
          <p className="text-[13px] text-text-muted">添付ファイルはありません</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {attachments.map((attachment) => {
            const Icon = getFileIcon(attachment.type)
            const color = getFileColor(attachment.type)

            return (
              <motion.div
                key={attachment.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] border border-border bg-bg-surface hover:bg-bg-elevated transition-colors group"
              >
                <div
                  className="w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0"
                  style={{ background: `${color}15` }}
                >
                  <Icon className="w-[18px] h-[18px]" style={{ color }} strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-text-primary truncate">
                    {attachment.name}
                  </p>
                  <p className="text-[11px] text-text-muted" style={{ fontFamily: 'var(--font-inter)' }}>
                    {formatFileSize(attachment.size)}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDownload(attachment)}
                    className="p-1.5 rounded-[6px] text-text-muted hover:text-accent hover:bg-[rgba(79,70,229,0.08)] transition-all"
                    title="ダウンロード"
                  >
                    <Download className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                  <button
                    onClick={() => onRemove(attachment.id)}
                    className="p-1.5 rounded-[6px] text-text-muted hover:text-danger hover:bg-[rgba(239,68,68,0.08)] transition-all"
                    title="削除"
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      )}
    </div>
  )
}
