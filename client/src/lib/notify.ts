import { useNotificationStore } from '@/stores/notification-store'

/**
 * タスクが割り当てられた時の通知を作成
 */
export function notifyTaskAssigned(
  taskId: string,
  taskTitle: string,
  assigneeId: string
): void {
  useNotificationStore.getState().addNotification({
    user_id: assigneeId,
    type: 'task_assigned',
    title: 'タスクが割り当てられました',
    body: `タスク「${taskTitle}」が割り当てられました`,
    source_type: 'task',
    source_id: taskId,
    action_url: '/tasks',
  })
}

/**
 * タスクのステータスが変更された時の通知を作成
 */
export function notifyTaskStatusChanged(
  taskId: string,
  taskTitle: string,
  userId: string,
  newStatus: string
): void {
  useNotificationStore.getState().addNotification({
    user_id: userId,
    type: 'system',
    title: 'タスクステータスが変更されました',
    body: `タスク「${taskTitle}」のステータスが「${newStatus}」に変更されました`,
    source_type: 'task',
    source_id: taskId,
    action_url: '/tasks',
  })
}

/**
 * コメントが追加された時の通知を作成
 */
export function notifyCommentAdded(
  parentType: string,
  parentId: string,
  parentTitle: string,
  authorName: string,
  targetUserId: string
): void {
  const sourceType = parentType as 'task' | 'application' | 'ringi'

  const actionUrlMap: Record<string, string> = {
    task: '/tasks',
    application: '/applications',
    ringi: '/ringi',
  }

  useNotificationStore.getState().addNotification({
    user_id: targetUserId,
    type: 'comment',
    title: 'コメントが追加されました',
    body: `${authorName}さんが「${parentTitle}」にコメントしました`,
    source_type: sourceType,
    source_id: parentId,
    action_url: actionUrlMap[parentType] ?? '/',
  })
}
