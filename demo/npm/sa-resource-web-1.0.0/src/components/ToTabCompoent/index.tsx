/**
 * 自定义组件名
 * @param props
 * @returns {JSX.Element|string}
 */

import React from 'react'

type ToTabComponentProps = {
    name: string,
    component: React.FC,
    [key: string]: AnyType
}
const ToTabComponent: React.FC<ToTabComponentProps> = (props) => {
    const {
        name,
        component,
        ...restProps
    } = props
    const Component = component
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return name ? <Component {...restProps} name={name}/> : null
}

export default ToTabComponent
