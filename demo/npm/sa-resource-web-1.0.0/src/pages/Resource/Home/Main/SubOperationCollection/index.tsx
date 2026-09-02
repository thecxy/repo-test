/**
 * 副操作合集(移动到|文件分发|脚本执行|关机|重启|删除)
 */
import I18N from '@src/i18n'
import React, { Fragment, useEffect } from 'react'
import { Button, Space } from 'antd'

import { subOperationCollection, button, filterButton, title, active, division } from './index.less'
import { AGENT_OPERATION } from '@src/pages/Resource/constants/constant'
import { useSubOperation } from './hook'
import FilterIcon from '@src/statics/icons/IconFilterDefault.svg'
import FilterIconSelected from '@src/statics/icons/IconFilterSelected.svg'
import TableFilterCollection from '../TableFilterCollection'
import useSwitch from '@react-hook/switch'
import { useExecuteScript } from '@src/pages/Resource/components/ExecuteScript/hook'
import { useFileDistribution } from '@src/pages/Resource/components/FileDistribution/hook'
import { useRenderFinish } from '@src/hooks/useRenderFinish'
import { IconSkeleton, Skeleton } from '@src/components/Skeleton'
import { getItem, setItem } from '@src/utils/storage'

const SubOperationCollection: React.FC = () => {
    const storeName= 'operationFilter'
    const [showFilter, toggleFilter] = useSwitch(Boolean(getItem(storeName)))
    const {
        toggleVisible,
        toggleDrawerDisabled,
    } = useExecuteScript()
    const { toggleVisible: toggleFileDistributionVisible } = useFileDistribution()
    const { subOperations } = useSubOperation()
    const { renderLoading } = useRenderFinish()
    const {
        SHUTDOWN,
        REBOOT,
        DELETE,
        MOVETO
    } = AGENT_OPERATION

    const operations = {
        moveTo: {
            label: I18N.Home.Main.yiDongDao,
            callback: subOperations[MOVETO.value]
        },
        fileDistribute: {
            label: I18N.constant.index.wenJianFenFa,
            callback: () => {
                toggleFileDistributionVisible(true)
            }
        },
        scriptExecution: {
            label: I18N.constant.index.jiaoBenZhiXing,
            callback: () => {
                toggleVisible(true)
                toggleDrawerDisabled(false)
            }
        },
        shutdown: {
            label: I18N.ExtraAgentOperation.index.guanJi,
            callback: subOperations[SHUTDOWN.value]
        },
        reboot: {
            label: I18N.ExtraAgentOperation.index.zhongQi,
            callback: subOperations[REBOOT.value]
        },
        delete: {
            label: I18N.constant.index.shanChu,
            callback: subOperations[DELETE.value]
        },
    }
    useEffect(()=>{
        setItem(storeName,showFilter ? "true":"")
    },[showFilter])
    return <div className={subOperationCollection}>
        <div className={title}>
            <Space>
                {
                    Object.values(operations).map(({
                        label,
                        callback
                    }, index) =>
                    (<Fragment key={label}>
                        {/* 分隔符 */}
                        {index ? <div className={division} /> : null}
                        {
                            renderLoading ? <Skeleton.Button size="small" active /> : <Button
                                className={button}
                                type={'text'}
                                size={'small'}
                                onClick={callback}>{label}
                            </Button>
                        }

                    </Fragment>)
                    )
                }
            </Space>
            {/* 筛选 */}
            {
                renderLoading ? <IconSkeleton width="20px" height='20px' /> : <Button
                    type={'text'}
                    onClick={toggleFilter}
                    className={`${filterButton} ${showFilter ? active : null}`}
                    icon={showFilter ? <FilterIconSelected /> : <FilterIcon />}
                />
            }
        </div>
        {/* table 表单过滤 */}
        <TableFilterCollection showFilter={showFilter} closeFilter={toggleFilter.off} />
    </div>
}

export default SubOperationCollection
