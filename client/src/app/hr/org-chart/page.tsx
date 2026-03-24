'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { pageTransition, fadeUp, staggerContainer } from '@/lib/animation'
import { ChevronRight, Users, Building2 } from 'lucide-react'
import { useEmployeeStore } from '@/stores/employee-store'
import { cn } from '@/lib/cn'

// ── 組織階層の型定義 ──

interface OrgNode {
  id: string
  name: string
  position: string
  department: string
  initial: string
  children: OrgNode[]
}

// ── 従業員データから組織ツリーを構築 ──

function buildOrgTree(employees: ReturnType<typeof useEmployeeStore.getState>['employees']): OrgNode | null {
  const active = employees.filter((e) => !e.deleted_at && e.status !== 'terminated')
  if (active.length === 0) return null

  // 経営者（代表取締役）をルートとして検出
  const ceo = active.find(
    (e) => e.position === '代表取締役' || e.position === '社長' || e.position === 'CEO'
  )

  if (!ceo) return null

  // 部署ごとにグループ化（経営者を除外）
  const deptMap = new Map<string, typeof active>()
  active.forEach((e) => {
    if (e.id === ceo.id) return
    const members = deptMap.get(e.department) || []
    members.push(e)
    deptMap.set(e.department, members)
  })

  // 部署ノードを構築
  const deptNodes: OrgNode[] = Array.from(deptMap.entries()).map(([dept, members]) => {
    // 部署内で管理者/責任者を先頭に
    const sorted = [...members].sort((a, b) => {
      const posOrder = (pos: string) => {
        if (pos.includes('部長') || pos.includes('管理者') || pos.includes('リーダー')) return 0
        if (pos.includes('担当')) return 1
        return 2
      }
      return posOrder(a.position) - posOrder(b.position)
    })

    const childNodes: OrgNode[] = sorted.map((m) => ({
      id: m.id,
      name: m.name,
      position: m.position,
      department: m.department,
      initial: m.name.charAt(0),
      children: [],
    }))

    // 部署ノード（最初のメンバーを部署代表として表示）
    const head = sorted[0]
    return {
      id: `dept-${dept}`,
      name: dept,
      position: `${members.length}名`,
      department: dept,
      initial: dept.charAt(0),
      children: childNodes,
    }
  })

  // ルートノード
  return {
    id: ceo.id,
    name: ceo.name,
    position: ceo.position,
    department: ceo.department,
    initial: ceo.name.charAt(0),
    children: deptNodes,
  }
}

// ── ノードカード ──

function NodeCard({
  node,
  isRoot,
  isDept,
}: {
  node: OrgNode
  isRoot?: boolean
  isDept?: boolean
}) {
  const gradientFrom = isRoot
    ? '#6366F1'
    : isDept
      ? '#3B82F6'
      : '#64748B'
  const gradientTo = isRoot
    ? '#8B5CF6'
    : isDept
      ? '#60A5FA'
      : '#94A3B8'

  return (
    <div
      className={cn(
        'bg-bg-surface border border-border rounded-[16px] shadow-card',
        'px-4 py-3 flex items-center gap-3 min-w-0',
        isRoot && 'ring-2 ring-[rgba(99,102,241,0.3)]',
        isDept && 'ring-1 ring-[rgba(59,130,246,0.2)]',
      )}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        }}
      >
        {isDept ? (
          <Building2 className="w-4 h-4" strokeWidth={2} />
        ) : (
          node.initial
        )}
      </div>
      <div className="min-w-0">
        <p className="text-[14px] font-semibold text-text-primary tracking-tight truncate">
          {node.name}
        </p>
        <p className="text-[12px] text-text-muted truncate">
          {node.position}
        </p>
      </div>
    </div>
  )
}

// ── デスクトップツリー ──

function DesktopTree({ root }: { root: OrgNode }) {
  return (
    <div className="hidden md:flex flex-col items-center gap-0 w-full overflow-x-auto pb-8">
      {/* CEO */}
      <NodeCard node={root} isRoot />

      {/* CEO → 部署 の縦線 */}
      {root.children.length > 0 && (
        <div className="w-px h-8 bg-border" />
      )}

      {/* 部署の横並び */}
      {root.children.length > 0 && (
        <div className="relative w-full">
          {/* 横線 */}
          {root.children.length > 1 && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px bg-border"
              style={{
                width: `${Math.min(100, (root.children.length - 1) * 25)}%`,
              }}
            />
          )}

          <div className="flex justify-center gap-8 lg:gap-12">
            {root.children.map((dept) => (
              <div key={dept.id} className="flex flex-col items-center gap-0 min-w-[180px]">
                {/* 部署への縦線 */}
                <div className="w-px h-8 bg-border" />

                {/* 部署カード */}
                <NodeCard node={dept} isDept />

                {/* 部署 → メンバー */}
                {dept.children.length > 0 && (
                  <div className="w-px h-6 bg-border" />
                )}

                {/* メンバー */}
                <div className="flex flex-col items-center gap-2">
                  {dept.children.map((member, i) => (
                    <div key={member.id} className="flex flex-col items-center">
                      {i > 0 && <div className="w-px h-2 bg-border" />}
                      <NodeCard node={member} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── モバイルリスト ──

function MobileTree({ root }: { root: OrgNode }) {
  return (
    <div className="md:hidden space-y-4">
      {/* CEO */}
      <div>
        <NodeCard node={root} isRoot />
      </div>

      {/* 部署ごと */}
      {root.children.map((dept) => (
        <div key={dept.id} className="ml-4 border-l-2 border-border pl-4 space-y-2">
          <NodeCard node={dept} isDept />

          {/* メンバー */}
          <div className="ml-4 border-l border-[rgba(148,163,184,0.3)] pl-3 space-y-2">
            {dept.children.map((member) => (
              <NodeCard key={member.id} node={member} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── ページ ──

export default function OrgChartPage() {
  const employees = useEmployeeStore((s) => s.employees)
  const hydrated = useEmployeeStore((s) => s._hydrated)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const orgTree = useMemo(() => buildOrgTree(employees), [employees])

  // 部署別統計
  const deptStats = useMemo(() => {
    const active = employees.filter((e) => !e.deleted_at && e.status !== 'terminated')
    const map = new Map<string, number>()
    active.forEach((e) => {
      map.set(e.department, (map.get(e.department) || 0) + 1)
    })
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  }, [employees])

  if (!mounted || !hydrated) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-6 bg-bg-elevated rounded-[10px] w-32" />
        <div className="h-8 bg-bg-elevated rounded-[10px] w-48" />
        <div className="h-64 bg-bg-elevated rounded-[16px]" />
      </div>
    )
  }

  return (
    <motion.div {...pageTransition}>
      {/* パンくず */}
      <nav className="flex items-center gap-2 text-[13px] mb-4">
        <Link href="/" className="text-text-muted hover:text-text-primary transition-colors">ホーム</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <Link href="/hr" className="text-text-muted hover:text-text-primary transition-colors">人事・労務</Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-text-secondary font-medium">組織図</span>
      </nav>

      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-text-primary tracking-tight">組織図</h1>
        <p className="text-[13px] text-text-secondary mt-1">
          部署・チーム構成の可視化
        </p>
      </div>

      {/* 部署別サマリー */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show" className="mb-8">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">
          部署別人数
        </h2>
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
          variants={fadeUp}
        >
          {deptStats.map(([dept, count]) => (
            <div
              key={dept}
              className="bg-bg-surface border border-border rounded-[16px] shadow-card p-5"
            >
              <p className="text-[12px] text-text-muted truncate">{dept}</p>
              <p
                className="text-[20px] font-bold text-text-primary mt-0.5 tabular-nums"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {count}<span className="text-[13px] font-normal text-text-muted ml-0.5">名</span>
              </p>
            </div>
          ))}
          <div className="bg-bg-surface border border-border rounded-[16px] shadow-card p-5">
            <p className="text-[12px] text-text-muted">全社合計</p>
            <p
              className="text-[20px] font-bold text-accent mt-0.5 tabular-nums"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {deptStats.reduce((sum, [, c]) => sum + c, 0)}
              <span className="text-[13px] font-normal text-text-muted ml-0.5">名</span>
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* 組織図ツリー */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show">
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">
          組織ツリー
        </h2>
        <motion.div
          className="bg-bg-surface border border-border rounded-[16px] shadow-card p-6 lg:p-8"
          variants={fadeUp}
        >
          {orgTree ? (
            <>
              <DesktopTree root={orgTree} />
              <MobileTree root={orgTree} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="w-10 h-10 text-text-muted mb-3" strokeWidth={1.5} />
              <p className="text-[14px] text-text-secondary font-medium">
                組織データはまだありません
              </p>
              <p className="text-[12px] text-text-muted mt-1">
                新しい従業員を作成しましょう
              </p>
            </div>
          )}
        </motion.div>
      </motion.section>
    </motion.div>
  )
}
