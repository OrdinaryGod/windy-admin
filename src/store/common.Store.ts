import { makeAutoObservable } from 'mobx'
import { TabItem, MenuTree, UserInfo, AppState } from "./commonType";
import { setToken, removeToken } from '../utils/auth'
import { commonService } from "../service";

/**
 * 公共store 管理菜单状态
 *
 * @class CommonStore
 */
class CommonStore {
  appState: AppState = {
    tabs: [],
    menuTree: [],
    hasLogin: false,
    userInfo: {
      id: '',
      userName: '',
    }
  }
  constructor() {
    makeAutoObservable(this)
  }

  /**
   * 登录
   */
  async signIn(payload) {
    const [ err, data, code ] = await commonService.signIn(payload)
    if (code === 200 && data) {
      setToken(data.token)
      this.appState.hasLogin = true
      this.init()
    }
  }

  /**
   * 登出
   */
  async signOut() {
    await commonService.signOut()
  }

  /**
   * 设置用户信息
   */
  updateUserInfo(data: UserInfo) {
    this.appState.userInfo = data
  }
  
  /**
   * 添加头部tab
   */
  addTab(data: TabItem) {
    this.appState.tabs.push(data)
  }
  /**
   * 设置菜单
   */
  setMeun(data: MenuTree[]) {
    this.appState.menuTree = data
  }

  /**
   * 获取菜单权限
   */
  async getAuthorizedMenu() {
    const [ err, data, code ] = await commonService.getAuthorizedMenus()
    this.setMeun(data || [])
    // setRouter()
    setToken('')
  }

  /**
   * 清除权限
   */
  clearPermission() {
    removeToken()
    this.appState.hasLogin = false
    this.appState.userInfo = {}
    this.appState.menuTree = []
  }

  /**
   * 登录后初始化应用状态
   */
  async init() {
    // this.updateUserInfo({})
    // this.getAuthorizedMenu()
    // this.addTab()

  }

}

export default CommonStore