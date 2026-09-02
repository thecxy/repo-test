/**
 * 主机详情- 任务
 */
import React from 'react'
import I18N from '@src/i18n'
import { taskContainer, inner } from './index.less'
import { Tabs } from 'antd'
import BasicTask from './BasicTask'
import { useTask } from '@src/pages/AgentDetail/Task/hook'
import { TABS } from './constant'
import { Helmet } from 'react-helmet'
import { useMetaTitleName } from '@src/hooks/useMetaTitleName'

const { TabPane } = Tabs

const Task: React.FC = () => {
    const {
        activeKey,
        handleChangeTab
    } = useTask()
    const metaTitle = useMetaTitleName()

    return <div className={taskContainer}>
        <div className={inner}>
            <Helmet title={`${I18N.AgentDetail.index.renWu}${metaTitle}`} />
            <Tabs activeKey={String(activeKey)} onChange={handleChangeTab}>
                {
                    Object.values(TABS).map(({
                        key,
                        label
                    }) => {
                        return <TabPane key={key} tab={label} />
                    })
                }
            </Tabs>
            <BasicTask type={activeKey} />
        </div>
    </div>
}

export default Task
