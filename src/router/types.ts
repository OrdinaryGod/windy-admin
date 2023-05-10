
export type Meta = {
    title?: string
    needLogin?: boolean
    icon?: React.ReactNode
}

export type RouterType = {
    path?: string
    element?: JSX.Element | React.ReactNode | null
    children?: RouterType[]
    meta?: Meta
    redirect?: string
    component?: () => any
}

export type OnRouteBeforeResType = string | void

export interface OnRouteBeforeType {
    (path: string, meta: Meta): OnRouteBeforeResType | Promise<OnRouteBeforeResType>
}
