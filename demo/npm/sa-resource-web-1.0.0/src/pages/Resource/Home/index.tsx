// 资源管理 主页
import React, { createContext, useRef, useEffect } from 'react'
import SideBar from './SideBar'
import { saContainer, main, prodSaContainer } from './index.less'
import AddOrEditAgent from './Main/AddOrEditAgent'
import ShutDownOrRebootAgentModal from '../components/ShutDownOrRebootAgentModal'
import useSwitch from '@react-hook/switch'
import MainTitle from '@src/pages/Resource/Home/Main/MainTitle'
import SubOperationCollection from '@src/pages/Resource/Home/Main/SubOperationCollection'
import DataList from '@src/pages/Resource/Home/Main/DataList'
import AgentUpdateModal from '@com/AgentUpdateModal'
import ExecuteScript from '@src/pages/Resource/components/ExecuteScript'
import FileDistribution from '@src/pages/Resource/components/FileDistribution'
import { useMetaTitleName } from '@src/hooks/useMetaTitleName'
import { Helmet } from 'react-helmet'
import { IS_PROD } from '@src/constant'
import { useScripts } from '../components/ExecuteScript/hook'
import { useAuthorizeProject } from '@src/hooks/useAuthorizeProject'


export const Context = createContext({ showSideBar: true })
const ResourceContainer: React.FC = () => {
    const [showSideBar, toggleSideBar] = useSwitch(true)
    const mainRef = useRef<HTMLDivElement>(null)
    const metaTitle = useMetaTitleName()

    const { getEnv } = useScripts();
    const { updateAuthorProjects } = useAuthorizeProject();
    useEffect(() => {
      getEnv();
      updateAuthorProjects();
    }, [])
    

    return <div className={`${saContainer} ${IS_PROD ? prodSaContainer : null}`} >
        <Helmet title={`主机管理列表页${metaTitle}`} />
        <Context.Provider value={{ showSideBar }}>
            <SideBar toggleSideBar={toggleSideBar} />
            <div className={main} ref={mainRef}>
                <MainTitle />
                {/*  副操作集合 */}
                <SubOperationCollection />
                {/* 主数据表格 */}
                <DataList mainRef={mainRef} />
            </div>
        </Context.Provider>

        {/*  添加、编辑 agent */}
        <AddOrEditAgent />
        {/*  关机|重启 Modal */}
        <ShutDownOrRebootAgentModal />
        {/*  agent 更新 Modal    */}
        <AgentUpdateModal />
        {/*  执行脚本 */}
        <ExecuteScript executeCallback={() => {
            console.log('placeholder')
        }} />
        {/*  文件分发 */}
        <FileDistribution />
    </div>
}

export default ResourceContainer
