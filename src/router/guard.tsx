/**
 * 路由守卫 路由统一处理
 */
import React from 'react'
import { Navigate, RouteObject, useLocation, useNavigate } from 'react-router-dom'
import { Meta, RouterType, OnRouteBeforeResType, OnRouteBeforeType } from './types'

// 获取数据类型
function getDataType (data: any): string {
  return (Object.prototype.toString.call(data).match(/\s(\w+)\]/) as string[])[1]
}

/**
 * 统一拦截处理路由组件
 * @param param0 
 */
function RouterGuard (
  {
    element, meta, onRouteBefore
  }: 
  {
    element: JSX.Element, meta: Meta, onRouteBefore: OnRouteBeforeType 
  }
) {
  const location = useLocation()
  const path = location.pathname
  const navigate = useNavigate()
  if (onRouteBefore) {
    const resPath = onRouteBefore(path, meta)
    // 处理异步返回的路由路径，返回后直接跳转
    if (getDataType(resPath) === 'Promise') {
      (resPath as Promise<OnRouteBeforeResType>).then((res: OnRouteBeforeResType) => {
        if (res && res !== path) {
          navigate(res, { replace: true })
        }
      })
    } else {
      // 处理返回的路径
      if (resPath && !Object.is(path, resPath)) {
        element = <Navigate to={resPath as string} replace={true} />
      }
    }
  } 
  return element
}

class Guard {
  routers: RouterType[] = []
  onRouteBefore: OnRouteBeforeType

  constructor(routers: RouterType[], onRouteBefore: OnRouteBeforeType) {
    this.routers = routers
    this.onRouteBefore = onRouteBefore
  }
  
  /**
   * 将路由配置组转换成 react-router 能识别的路由配置
   * @param routers 
   * @returns 
   */
  transformRouter(routers: RouterType[] = this.routers) {
    const newRouters: RouteObject[] = []
    routers.forEach(item => {
      const router = { ...item } 
      if(!router.path) return
  
      if (router.redirect) {
        router.element = <Navigate to={router.redirect} replace={true}/>
      } else if(router.component) {
        router.element = this.layLoad(router.component, router.meta || {})
      }
  
      delete router.redirect
      delete router.component
      delete router.meta
      if (router.children?.length) {
        router.children = this.transformRouter(router.children)
      }
      newRouters.push(router)
    })
    return newRouters
  }
  
  /**
   * 路由懒加载
   * @param importFn 
   * @param meta 
   * @returns 
   */
  private layLoad(importFn: () => any, meta: Meta) {
    const Element = React.lazy(importFn)
    const LazyElement = (
      <Element/>
    )
    return <RouterGuard 
      element={LazyElement}
      meta={meta}
      onRouteBefore={this.onRouteBefore} />
  }
  
}

export default Guard
