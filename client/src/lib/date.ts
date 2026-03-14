import { format, formatDistanceToNow, isAfter, isBefore, addDays, parseISO } from 'date-fns'
import { ja } from 'date-fns/locale'

/** YYYY年M月D日 */
export const formatDate = (dateStr: string): string => {
  return format(parseISO(dateStr), 'yyyy年M月d日', { locale: ja })
}

/** YYYY/MM/DD */
export const formatDateShort = (dateStr: string): string => {
  return format(parseISO(dateStr), 'yyyy/MM/dd')
}

/** M月D日 */
export const formatDateCompact = (dateStr: string): string => {
  return format(parseISO(dateStr), 'M月d日', { locale: ja })
}

/** HH:mm */
export const formatTime = (dateStr: string): string => {
  return format(parseISO(dateStr), 'HH:mm')
}

/** 「3時間前」「2日前」など */
export const formatRelative = (dateStr: string): string => {
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true, locale: ja })
}

/** 期限切れかどうか */
export const isOverdue = (dueDateStr: string | null): boolean => {
  if (!dueDateStr) return false
  return isBefore(parseISO(dueDateStr), new Date())
}

/** 期限が近いか（N日以内） */
export const isDeadlineSoon = (dueDateStr: string | null, withinDays: number = 3): boolean => {
  if (!dueDateStr) return false
  const dueDate = parseISO(dueDateStr)
  const threshold = addDays(new Date(), withinDays)
  return isAfter(dueDate, new Date()) && isBefore(dueDate, threshold)
}

/** 今日のISO文字列 */
export const today = (): string => new Date().toISOString()

/** N日後のISO文字列 */
export const daysFromNow = (n: number): string => addDays(new Date(), n).toISOString()

/** ISO文字列を生成 */
export const toISO = (date: Date): string => date.toISOString()
