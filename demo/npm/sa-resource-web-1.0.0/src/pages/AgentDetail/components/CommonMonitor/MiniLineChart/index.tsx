/**
 * mini 折线图
 */
import React, { useEffect, useMemo, useRef } from 'react'
import { miniLineChartContainer, emptyContainer } from './index.less'
import { lineCharts, lineChartsContainer } from '@com/LineChart/index.less'
import * as echarts from 'echarts/core'
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
} from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    LineChart,
    CanvasRenderer,
])
import { EChartsType } from 'echarts/core'
import { MultiData } from '@com/componentTypes'
import { PRIMARY_COLOR } from '@src/constant'
import { generateSeries, getLineChartPosition } from '@src/utils'

type MiniLineChartProps = {
    width?: number,
    height?: number,
    xAxisData: StringOrNumber[]
    yAxisData: MultiData,
    uuid: string,
    monitorUnit: string
}
const MiniLineChart: React.FC<MiniLineChartProps> = ({
    width = 480,
    height = 80,
    xAxisData,
    uuid,
    yAxisData = {
        list: [],
        name: ''
    },
    monitorUnit
}) => {
    const chart = useRef<EChartsType>()

    const updateChartOption = () => {
        if(!chart?.current){
            init()
        }
        let series = {}
        if (!yAxisData.list.length) return
        series = generateSeries({
            isStep: false,
            data: yAxisData.list,
            name: yAxisData.name,
            color: PRIMARY_COLOR,
        })
        const option = {
            title: {},
            tooltip: {
                trigger: 'axis',
                appendToBody: true,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                position: getLineChartPosition,
                className: 'line-chart-tooltip-container',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter: function (item: any) {
                    return `<div>${item[0].axisValue}</div>
                            <div class="line-tooltip-item-container">
                                ${item[0].marker}
                                <div class="line-tooltip-item">
                                    ${item[0].data}${monitorUnit}
                                    </div>
                            </div>`
                }
            },
            grid: {
                // left: '2%',
                // right: '4%',
                // bottom: '3%',
                // containLabel: true
            },
            xAxis: {
                // type: 'category',
                data: xAxisData,
                axisLabel: {
                    show: false,
                },
                axisLine: {
                    show: false, //隐藏y轴
                },
                axisTick: {
                    show: false,  //刻度线
                }
            },
            yAxis: {
                splitNumber: 1,
                type: 'value'
            },
            series
        }
        chart.current?.setOption(option)
    }
    useEffect(() => {
        updateChartOption()
    }, [yAxisData])
    const resize = () => {
        chart.current?.resize()
    }
    const init = () => {
        chart.current = echarts.init(document.querySelector(`#${uuid}`) as HTMLDivElement, undefined, { renderer: 'canvas' })
        window.addEventListener('resize', resize)
    }
    useEffect(() => {
        init()
        return () => {
            window.removeEventListener('resize', resize)
        }
    }, [])
    const isEmpty = useMemo(() => {
        return !yAxisData.list.length
    }, [yAxisData])

    return <div className={miniLineChartContainer}>
        <div className={lineChartsContainer}>
            <div
                id={uuid}
                className={lineCharts}
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    display: !isEmpty ? 'block' : 'none'
                }}
            />
            {
                isEmpty && <span className={emptyContainer}>暂无数据</span>
            }
        </div>

    </div>
}

export default MiniLineChart
