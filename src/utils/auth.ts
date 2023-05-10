import qs from 'qs'

/**
 * 获取 token
 */
export function getToken (): string | null {
  const { token } = qs.parse(location.search.substr(1)) // There is a risk
  if (token) {
    setToken(token as string)
    return token as string
  }
  
  return localStorage.getItem('token')
}
  
/**
   * 设置 token
   */
export function setToken (token: string): void {
  localStorage.setItem('token', token)
}

/**
 * 移除 token
 */
export function removeToken (): void {
  localStorage.removeItem('token')
}