/**
 * 上线轨迹图表
 */
import { Empty } from 'antd'
import * as echarts from 'echarts/core'
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent
} from 'echarts/components'
import { BarChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import React, { useEffect, useMemo, useRef } from 'react'
import { barCharts, barChartsContainer } from './index.less'
import { EChartsType } from 'echarts/core'
import { PRIMARY_COLOR, REGULAR_DATE_FORMAT } from '@src/constant'
import { LineChartProps } from '@com/componentTypes'
import moment from 'moment'
import I18N from '@src/i18n'
import {getLineChartPosition} from '@src/utils/getLineChartPosition'

echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    BarChart,
    CanvasRenderer,
    UniversalTransition
])

const BarCharts: React.FC<LineChartProps> = ({
    width = 680,
    height = 120,
    xAxisData,
    yAxisData = {
        list: [],
        name: ''
    },
    multiYAxisData = [],
    multiData = false,
}) => {
    const ref = useRef<HTMLDivElement | null>(null)
    const chart = useRef<EChartsType>()

    const formatXAxisData = (xAxisData: StringOrNumber[], yAxisData: { list: StringOrNumber[],name?:string }) => {

        const tempData = {
            xAxisData: Array.from(xAxisData),
            yAxisData: {
                list:Array.from(yAxisData.list),
                name: yAxisData?.name
            }
        }
        // 由于后端记录数据限制，返回的只有上线状态变更时的数据，没有记录快照数据，所以，需要前端自己补充对应的上下线数据 from 徐明星
        let itemY
        if (xAxisData.length === 1) {
            itemY = yAxisData.list[0]
        }else {
            itemY = yAxisData.list[yAxisData.list.length-1]
        }
        tempData.xAxisData.push(moment(Date.now()).format(REGULAR_DATE_FORMAT))
        tempData.yAxisData.list.push(itemY)
        return tempData
    }
    const formatData = formatXAxisData(xAxisData, yAxisData)
    const updateChartOption = () => {

        const option = {
            tooltip: {
                trigger: 'axis',
                appendToBody: true,
                // 注释的配置需要调试时使用，误删
                // triggerOn: 'click',
                // hideDelay: 100000,
                position:getLineChartPosition,
                className: 'bar-chart-tooltip-container',
                formatter: (params: AnyType[]) => {
                    const current = params[0]
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return `<div>${current.axisValue}</div><div class="bar-tooltip-item-container">${current.marker}<div class="bar-tooltip-item">${ current.value === 1 ? I18N.constant.index.zaiXian : I18N.constant.index.liXian}</div></div>`
                }
            },
            grid: {
                x: 34,
                y: 16,
                x2: 16,
                y2: 20
            },
            xAxis: [
                {
                    silent: true,
                    type: 'category',
                    axisLabel: {
                        rotate: 0,
                        textStyle: {
                            color: '#682d19'
                        }
                    },
                    data: formatData.xAxisData
                }
            ],
            yAxis: [
                {
                    interval: 0.1,
                    nameTexStyle: {},
                    axisTick: false,
                    // show: false,
                    min: 0,
                    max: 1.2,
                    offset: 10,
                    // position: "right",
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    }
                },
                {
                    axisTick: false,
                    type: 'category',
                    position: 'left',
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        show: true
                    },
                    splitLine: {
                        show: false
                    },
                    data: [I18N.constant.index.liXian, I18N.constant.index.zaiXian]
                }
            ],
            series: [
                {
                    name: 'onlineStatus',
                    type: 'bar',
                    stack: 'onlineStatus',
                    label: {
                        normal: {
                            textStyle: {
                                color: 'blue'
                            },
                            position: 'left',
                            show: false,
                            formatter: '{b}'
                        }
                    },
                    barCategoryGap: 0,
                    itemStyle: {
                        normal: {
                            color: 'transparent'
                        }
                    },
                    data: formatData.yAxisData.list
                },
                {
                    type: 'bar',
                    stack: 'onlineStatus',
                    silent: true,
                    data: new Array(formatData.xAxisData.length).fill(0),
                    itemStyle: {
                        normal: {
                            color: PRIMARY_COLOR
                        }
                    },
                    barMinHeight: 2
                }
            ]
        }

        chart.current?.setOption(option)
    }

    useEffect(() => {
        updateChartOption()
    }, [yAxisData, multiYAxisData])

    useEffect(() => {
        chart.current = echarts.init(ref.current as HTMLElement, undefined, { renderer: 'canvas' })
        window.onresize = function() {
            chart.current?.resize()
        }
    }, [])

    useEffect(() => {
        chart.current?.resize()
    }, [width])

    const isEmpty = useMemo(() => {
        return multiData ? !multiYAxisData[0].list.length : !yAxisData.list.length
    }, [multiData, multiYAxisData, yAxisData])

    return <div className={barChartsContainer}>
        <div ref={ref}
             className={barCharts}
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
export default BarCharts

