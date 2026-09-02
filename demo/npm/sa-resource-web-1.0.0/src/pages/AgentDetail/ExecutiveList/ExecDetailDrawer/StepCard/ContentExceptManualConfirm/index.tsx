// 人工确认
import { Button } from 'antd'
import React from 'react'

import TimeItem from '../TimeItem'
import { right } from '../index.less'
import { ContentExceptManualConfirmProps } from '@src/pages/AgentDetail/ExecutiveList/executiveTypes'

export const ContentExceptManualConfirm: React.FC<ContentExceptManualConfirmProps> = ({
    consumeObj,
    operations,
    stepId,
}) => {
    return (
        <>
            <TimeItem item={consumeObj}/>
            <div className={right}>
                {
                    operations.map(operation => {
                        return (
                            <Button
                                type={'link'}
                                style={{ padding: 4 }}
                                disabled={operation?.disabled}
                                key={operation.label}
                                onClick={() => operation.execution({ id: stepId })}
                            >{operation.label}
                            </Button>
                        )
                    })
                }
            </div>
        </>
    )
}

export default ContentExceptManualConfirm
