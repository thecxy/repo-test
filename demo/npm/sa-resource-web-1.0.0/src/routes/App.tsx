import React, { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, message } from 'antd'
import { Provider } from 'react-redux'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { CONTAINER_DOM_ID } from '../constant'
import { getContainerDOM } from '../utils'

import store from '../store'
import RouterByUseRoutes from './RouterByUseRoutes'
import { currentAntdLang } from '@src/i18n/antdLangs'

const App = () => {
    useEffect(() => {
        // 默认折叠one的左侧菜单
        window.globalState?.setItem('collapsedStatus', true)

        message.config({
            getContainer: getContainerDOM,
        })
        return () => {
            message.destroy()
        }
    }, [])
    return (
        <Provider store={store}>
            <ConfigProvider
                getPopupContainer={() => {
                    const node = getContainerDOM()
                    if (node) {
                        return node
                    }
                    return document.body
                }}
                locale={currentAntdLang}
            >
                <div
                    data-theme="osui"
                    id={CONTAINER_DOM_ID}
                    className="osc-sa-resource"
                >
                    <BrowserRouter>
                        <RouterByUseRoutes/>
                    </BrowserRouter>
                </div>
            </ConfigProvider>
        </Provider>
    )
}

export default App
