/**
 * 页面创建的tab
 */
export type TabItem = {
    title:string
    content: string
    key: string
    closable?: boolean
}
/**
 * 菜单
 */
export type MenuTree = {
  id: string
  name: string
  icon: string | null
  children: MenuTree[]
  parentId: number
  path: string | null
  redirect: string | null
  routerName: string | null
}
/**
 * 用户信息
 */
export type UserInfo = {
    id: string
    userName: string
    avatar?: string
    gender?: number
}
/**
 * 应用状态 type
 */
export type AppState = {
    tabs: TabItem[]
    menuTree: MenuTree[]
    hasLogin: boolean,
    userInfo: Partial<UserInfo>
}