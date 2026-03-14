'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { cardStagger } from '@/lib/animation'
import { sections } from '@/lib/navigation'

// ── セクション説明マッピング ──

const sectionDescriptions: Record<string, string> = {
  accounting: '経費精算・請求・支払・月次管理',
  hr: '従業員管理・入退社・社保手続き',
  'general-affairs': '備品・設備・郵送・来客管理',
  documents: '契約書・NDA・規程管理',
  applications: '各種申請と承認ワークフロー',
  ringi: '稟議の起票・承認・決裁',
  reports: '日報・週報・月報・事故報告',
  knowledge: '手順書・マニュアル・ナレッジ',
  management: '経営ダッシュボード・投資判断',
  improvements: '改善提案・目安箱・フィードバック',
  assistant: 'AI業務アシスタント',
}

// ── 表示対象セクション（subItemsを持つもの + assistant） ──

const launcherSections = sections.filter(
  (s) => s.subItems || s.key === 'assistant'
)

export function SectionLauncher() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {launcherSections.map((section, i) => {
        const Icon = section.icon
        const description = sectionDescriptions[section.key] ?? ''

        return (
          <motion.div
            key={section.key}
            custom={i}
            variants={cardStagger}
            initial="hidden"
            animate="show"
          >
            <Link
              href={section.href}
              className="flex items-center gap-3.5 px-4 py-4 bg-bg-surface border border-border rounded-[16px] shadow-card hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-[10px] bg-[rgba(79,70,229,0.08)] flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-accent" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold text-text-primary leading-tight group-hover:text-accent transition-colors">
                  {section.label}
                </p>
                <p className="text-[13px] text-text-muted mt-0.5 truncate">
                  {description}
                </p>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
