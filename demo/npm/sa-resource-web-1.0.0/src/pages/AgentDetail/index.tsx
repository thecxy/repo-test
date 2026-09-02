/**
 * 主机详情
 */
import I18N from '@src/i18n'
import { PageHeader, Tabs } from 'antd'
import React from 'react'
import { agentDetailContainer, inner, top } from './index.less'
import ExtraAgentOperation from '@src/pages/AgentDetail/ExtraAgentOperation'
import Outline from '@src/pages/AgentDetail/Outline'
import { useAgentDetail } from '@src/pages/AgentDetail/hook'
import { generateFullPath, getDetail } from '@src/utils'
import { useNavigate } from 'react-router'
import { routes } from '@src/routes'
import AddOrEditAgent from '@src/pages/Resource/Home/Main/AddOrEditAgent'
import Monitor from '@src/pages/AgentDetail/Monitor'
import Task from '@src/pages/AgentDetail/Task'
import ExecutiveList from '@src/pages/AgentDetail/ExecutiveList'
import ShutDownOrRebootAgentModal from '@src/pages/Resource/components/ShutDownOrRebootAgentModal'
import { updateDetailTabs } from '@src/pages/AgentDetail/agentDetailSlice'
import { useDispatch } from 'react-redux'
import { DetailTabs } from '@src/pages/AgentDetail/agentDetailTypes'
import FileDistribution from '@src/pages/Resource/components/FileDistribution'
import WebTerminal from '@com/WebTerminal'
import AgentInfoModal from '@com/WebTerminal/AgentInfoModal'
import IconFont from '@com/Iconfont'

const { TabPane } = Tabs
const AgentDetail: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const goBack = () => {
        navigate(generateFullPath(routes.HOME.path))
    }

    const handleChangeTab = (e: string) => {
        dispatch(updateDetailTabs(e))
    }
    const {
        currentAgentDetail,
        loading,
        detailTabs
    } = useAgentDetail()

    const title = getDetail(currentAgentDetail, 'name')

    const tabs = {
        outline: {
            label: I18N.AgentDetail.index.gaiYao,
            key: DetailTabs.outline,
            content: <Outline currentAgentDetail={currentAgentDetail} loading={loading}/>
        },
        monitor: {
            label: I18N.AgentDetail.index.jianKong,
            key: DetailTabs.monitor,
            // content: <Monitor currentAgentDetail={currentAgentDetail}/>
            content: <Monitor/>
        },
        task: {
            label: I18N.AgentDetail.index.renWu,
            key: DetailTabs.task,
            content: <Task/>
        },
        executiveCommand: {
            label: I18N.ExecutiveList.index.jiaoBen,
            key: DetailTabs.executiveCommand,
            content: <ExecutiveList currentAgentDetail={currentAgentDetail}/>
        }
    }

    const customStyle = { height: `~"calc(100vh - 90px)"` }

    return <div
        className={agentDetailContainer}
        style={customStyle}
    >
        <div className={top}>
            <PageHeader
                title={title}
                backIcon={<IconFont type={'iconarrow'}/>}
                onBack={goBack}
                extra={<ExtraAgentOperation currentAgentDetail={currentAgentDetail} loading={loading}/>}
            />
        </div>
        {/* <div className={bottom}> */}
        <Tabs
            activeKey={detailTabs}
            onChange={handleChangeTab}
            className={'agent-detail-outer-tabs'}
            destroyInactiveTabPane
        >
            {
                Object.values(tabs).map(({
                    key,
                    content,
                    label
                }) => {
                    return <TabPane key={key} tab={label}>
                        <div className={inner}>
                            {content}
                        </div>
                    </TabPane>
                })
            }
        </Tabs>
        {/* </div> */}
        {/*  添加、编辑 agent */}
        <AddOrEditAgent/>
        {/*  关机|重启 Modal */}
        <ShutDownOrRebootAgentModal multiple={false}/>
        {/*  文件分发 */}
        <FileDistribution currentAgentDetail={currentAgentDetail}/>
        {/* web terminal */}
        {/*  agent 信息配置 */}
        <AgentInfoModal/>
        <WebTerminal/>
    </div>
}

export default AgentDetail
