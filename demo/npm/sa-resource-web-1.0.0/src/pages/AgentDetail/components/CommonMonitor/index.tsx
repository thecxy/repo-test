/**
 * 监控公共子模块
 */
import React, { ReactNode } from 'react'
import {
    commonMonitorContainer,
    column2Css,
    labelCss,
    labelInnerCss,
    column1Css,
    column1LabelCss,
    column1ValueCss,
    column3Css,
    detailButton,
    maxCss,
    minCss,
    avgCss,
    itemLabel,
    itemValue,
    handleDragCss,
    left,
    right,
    bordered,
    selectCss,
} from './index.less'
import { Button, Tooltip } from 'antd'
import IconFont from '@com/Iconfont'
import MiniLineChart from './MiniLineChart'
import { Input } from '@src/pages/Resource/resourceTypes'
import { formatTimeStamp } from '@src/utils'
import { useMonitorDetailVisible } from '@src/pages/AgentDetail/hook'
import { useDispatch } from 'react-redux'
import {
    updateCurrentDetailItemCategory,
    updateCurrentDetailItemIndex
} from '../../agentDetailSlice'
import { AGENT_DETAIL_CATEGORY } from '@src/constant'
import AntdSelect from '@com/AntdSelect'

export type CommonMonitorProps = {
    label: string | ReactNode,
    index: number,
    uuid: string,
    category: AGENT_DETAIL_CATEGORY,
    selectList?: string[],
    selectChangeCallback?: (e: string) => void,
    column1: {
        label: string,
        unit: string,
        tips: string
    },
    column2: Input[],
    column3: {
        max: StringOrNumber,
        min: StringOrNumber,
        avg: StringOrNumber,
    },
    monitorUnit: string
}
const CommonMonitor: React.FC<CommonMonitorProps> = ({
    label,
    uuid,
    category,
    index,
    selectList = [],
    selectChangeCallback,
    column1,
    column2,
    column3,
    monitorUnit
}) => {
    const dispatch = useDispatch()
    const { toggleVisible } = useMonitorDetailVisible()
    const handleCheckDetail = () => {
        dispatch(updateCurrentDetailItemCategory(category))
        dispatch(updateCurrentDetailItemIndex(index))
        toggleVisible()
    }
    return <div className={commonMonitorContainer}>
        <div className={`${left} ${label ? bordered : null}`}>
            {
                label && <div className={handleDragCss}>
                    <IconFont type={'iconMove'} />
                </div>
            }
            <div className={labelCss}>
                <div className={labelInnerCss}>{label}</div>
                <div>
                    {selectList.length ? <AntdSelect
                        size={'small'}
                        className={selectCss}
                        onChange={selectChangeCallback}
                        defaultValue={selectList[0]}
                        options={selectList.map(item => ({
                            label: item,
                            value: item
                        }))}/> : null}
                </div>
            </div>
        </div>
        <div className={right}>
            <div className={column1Css}>
                <span className={column1LabelCss}>
                    <Tooltip title={column1.label}>{column1.label}</Tooltip>
                </span>

                <span className={column1ValueCss}>
                    <Tooltip title={column1.unit}>{column1.unit}</Tooltip>
                </span>
                <Tooltip title={column1.tips}>
                    <IconFont type={'iconinfo'} className={column1ValueCss}/>
                </Tooltip>
            </div>
            <div className={column2Css}>
                <MiniLineChart
                    uuid={uuid}
                    yAxisData={{
                        list: column2.map(item => item.value),
                        name: ''
                    }}
                    xAxisData={column2.map(item => formatTimeStamp(item.time))}
                    monitorUnit={monitorUnit}
                />
            </div>
            <div className={column3Css}>
            <span className={maxCss}>
                <span className={itemLabel}>Max:</span>
                <span className={itemValue}>{column3.max}
                    <Tooltip title={column1.unit}>{column1.unit}</Tooltip>
                </span>
            </span>
                <span className={minCss}>
                <span className={itemLabel}>Min:</span>
                <span className={itemValue}>
                    <Tooltip title={`${column3.min} ${column1.unit}`}>{column3.min} {column1.unit}</Tooltip>
                </span>
            </span>
                <span className={avgCss}>
                <span className={itemLabel}>Avg:</span>
                <span className={itemValue}>
                    <Tooltip title={`${column3.avg} ${column1.unit}`}>{column3.avg} {column1.unit}</Tooltip>
                </span>
            </span>
            </div>
            <Button
                className={detailButton}
                onClick={handleCheckDetail}
                icon={<IconFont type={'iconUnfold1'}/>}
                type={'text'}
            />
        </div>
    </div>
}

export default CommonMonitor
