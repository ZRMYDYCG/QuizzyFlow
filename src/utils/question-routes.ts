/** 点击问卷标题：已发布打开填写页，未发布打开编辑页 */
export function getQuestionOpenPath(id: string, isPublished: boolean): string {
  return isPublished ? `/question/publish/${id}` : `/question/edit/${id}`
}

/** 查看答卷统计 */
export function getQuestionStatisticsPath(id: string): string {
  return `/question/statistics/${id}`
}
