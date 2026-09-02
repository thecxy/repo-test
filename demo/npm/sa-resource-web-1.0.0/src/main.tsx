/* eslint-disable */
// @ts-nocheck

import React from 'react'
import ReactDOM, { render } from 'react-dom'
import singleSpaReact from 'single-spa-react'
import { isEmpty } from 'ramda'
import App from './routes/App'
// 骨架屏样式没有打包，可能是webpack问题，后期排查
import 'antd/lib/skeleton/style/index.css'

// ⻚⾯挂载点, 写死是这个id
const rootElementId = 'spa-mount-point'

// 获取挂载元素的⽅法
function domElementGetter (): HTMLElement {
// 组件挂载饿根结点
    let el = document.getElementById(rootElementId)
    if (el == null) {
        el = document.createElement('div')
        el.id = rootElementId
        document.body.appendChild(el)
    }
    return el
}

function renderDOM (): void {
    render(<App/>, domElementGetter())
}

// 通过⼯具库辅助⽣成的spa⽣命周期
const reactLifecycles = singleSpaReact({
    React,
    ReactDOM,
    rootComponent: App,
    domElementGetter,
    errorBoundary () {
        // 错误出来函数
        return (
            <div>This renders when a catastrophic error occurs</div>
        )
    }
})
// 在没有spa环境的环境下渲染DOM
if (!isEmpty(window.singleSpaNavigate)) {
    renderDOM()
    // store.subscribe(renderDOM);
}

// 热重载
if (module?.hot) {
    module?.hot.accept()
}

// 暴露spa⽣命周期
export const {
    bootstrap,
    mount,
    unmount
} = reactLifecycles
export default reactLifecycles
