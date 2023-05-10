/**
 * 公共业务请求
 */
import { http } from '../service/http'
import { UserInfo, MenuTree } from "../store/commonType";
 
class CommonService {

  /**
   * 登录
   * @param payload 
   */  
  signIn(data: {userName: string, password: string}) {
    type Res = {
      code: number
      token: string
    }
    return http.post<Res>('/', data) // TODO
  }

  /**
   * 登出
   */
  signOut() {
    return http.post('/') // TODO
  }

  /**
   * 获取登录用户信息
   * @link // 未知
   */
  getLoginUserInfo () {
    return http.get<UserInfo>('/') // TODO
  }

  /**
   * 获取权限菜单资源
   */
  getAuthorizedMenus() {
    return http.post<MenuTree[]>('/',)
  }

}

export const commonService = new CommonService()