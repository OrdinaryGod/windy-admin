import { useStore } from '../store'
import IndexLayout from '../layout';
import Login from '../modules/login'
import { RouterType, OnRouteBeforeType } from './types'
import Guard from './guard';

/**
 * 全局路由配置
 */
const routers: RouterType[]  = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/',
    element: <IndexLayout/>,
    children: [
      {
        path: '/index',
        component: () => import('../modules/index'),
        meta: {
          title: '首页',
          needLogin: true
        },
      },
      {
        path: '/order',
        component: () => import('../modules/order')
      }
    ]
  },
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '*',
    component: () => import('../layout/error'),
    meta: {
      title: '404'
    }
  }
]

/**
 * 全局路由拦截
 */
const useRouteBefore: OnRouteBeforeType = (path, meta) => {
  const { commonStore } = useStore()
  if (meta.title) {
    document.title = meta.title
  } else {
    document.title = 'windy-admin'
  }
  
  if (meta.needLogin) {
    if (!commonStore.appState.hasLogin) {
      document.title = 'windy-admin'
      return '/login'
    }
  }
}

// 配置路由处理
const guard = new Guard(routers, useRouteBefore)
const newRouters = guard.transformRouter()

export { routers, newRouters }