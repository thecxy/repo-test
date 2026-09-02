import { Empty } from 'antd'
import * as echarts from 'echarts/core'
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
} from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import React, { useEffect, useMemo, useRef } from 'react'
import { lineCharts, lineChartsContainer } from './index.less'
import { EChartsType } from 'echarts/core'
import { PRIMARY_COLOR, SUCCESS_COLOR } from '@src/constant'
import { LineChartProps } from '@com/componentTypes'
import { findMinAndMaxFromList, generateSeries } from '@src/utils'
import { getLineChartPosition } from '@src/utils'

echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    LineChart,
    CanvasRenderer,
    UniversalTransition
])

const LineCharts: React.FC<LineChartProps> = ({
    isStep = false,
    width = 680,
    height = 120,
    xAxisData,
    yAxisData = {
        list: [],
        name: ''
    },
    multiYAxisData = [],
    multiData = false,
    type = 'value',
    axisLabelFormatter,
    xAxisLabelFormatter,
    tooltipValueFormatter,
    gridTop = '16px'
}) => {
    const ref = useRef<HTMLDivElement | null>(null)
    const chart = useRef<EChartsType>()
    const minInterval = useMemo(() => {
        let temp
        if (multiData) {
            const multiList = multiYAxisData.map((item) => item.list).flat(10)
            temp = findMinAndMaxFromList(multiList)[0]
        } else {
            temp = findMinAndMaxFromList(yAxisData.list)[0]
        }
        return temp.toFixed(3)
    }, [yAxisData.list[0], multiYAxisData, multiData])

    const updateChartOption = () => {
        let series = {}
        if (multiData) {
            if (!multiYAxisData?.[0]?.list?.length) return
            series = multiYAxisData.map((item, index) => generateSeries({
                data: item.list,
                name: item.name,
                color: index % 2 === 0 ? PRIMARY_COLOR : SUCCESS_COLOR,
                isStep
            }))
        } else {
            if (!yAxisData.list.length) return
            series = generateSeries({
                data: yAxisData.list,
                name: yAxisData.name,
                color: PRIMARY_COLOR,
                isStep
            })
        }
        const option = {
            title: {},
            tooltip: {
                trigger: 'axis',
                // 注释的配置需要调试时使用，误删
                // triggerOn: 'click',
                appendToBody: true,
                // hideDelay: 100000,
                className: 'line-chart-tooltip-container',
                valueFormatter: tooltipValueFormatter,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter: function (items: any) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return `<div>${items[0].axisValue}</div>` + items.map((child: any) => `<div class="line-tooltip-item-container">${child.marker}<div class="line-tooltip-item">${child.seriesName} ${child.data}</div></div>`).join('')
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                position: getLineChartPosition
            },
            grid: {
                left: '2%',
                right: '4%',
                top: gridTop,
                bottom: '4%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                axisLabel: {
                    formatter: xAxisLabelFormatter
                },
                data: xAxisData,
            },
            yAxis: {
                scale: true,
                minInterval,
                type,
                axisLabel: {
                    formatter: axisLabelFormatter,
                },
            },
            series
        }
        chart.current?.setOption(option)
    }

    // useEffect(() => {
    //     console.log(yAxisData,'yAxisData')
    //     updateChartOption()
    // }, [yAxisData, multiYAxisData])

    useEffect(() => {
        chart.current = echarts.init(ref.current as HTMLElement, undefined, { renderer: 'canvas' })
        updateChartOption();
        window.onresize = function () {
            chart.current?.resize()
        }
    }, [yAxisData,multiYAxisData])

    useEffect(() => {
        chart.current?.resize()
    }, [width])

    const isEmpty = useMemo(() => {
        return multiData ? !multiYAxisData[0].list.length : !yAxisData.list.length
    }, [multiData, multiYAxisData, yAxisData])

    return <div className={lineChartsContainer}>
        <div ref={ref}
            className={lineCharts}
            style={{
                width: `${width}px`,
                height: `${height}px`,
                display: !isEmpty ? 'block' : 'none'
            }}
        />
        {
            isEmpty && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }
    </div>

}
export default LineCharts

