// 主机资源table  图表
import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import {
    DatasetComponent,
    TransformComponent,
    TitleComponent,
    TooltipComponent,
} from 'echarts/components'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

import { pieCharts } from './index.less'
import { EChartsType } from 'echarts/core'

echarts.use([
    PieChart,
    DatasetComponent,
    TitleComponent,
    TransformComponent,
    UniversalTransition,
    CanvasRenderer,
    TooltipComponent
])

type Data = {
    value: StringOrNumber,
    name: string
}
type PieChartProps = {
    title: string,
    data1: Data,
    data2: Data,
    width?: number
    fontSize?: number
}

type UpdateChartOption = ({
    data1,
    data2,
    title
}: PieChartProps) => void
const PieCharts: React.FC<PieChartProps> = ({
    title,
    data1,
    data2,
    width = 56,
    fontSize = 14
}) => {
    const ref = useRef<HTMLDivElement | null>(null)
    const chart = useRef<EChartsType>()

    const colorList = [
      '#58bf94',
      '#d4d6d9',
    ]

    const fullTooltip = function() {
      return `
        <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${colorList[0]};"></span>${data1.name} ${data1.value}%</br>
        <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${colorList[1]};"></span>${data2.name} ${data2.value}%</br>
      `
    }


    const updateChartOption: UpdateChartOption = ({
        data1,
        data2,
        title
    }) => {
        const option = {
            title: {
                text: title,
                left: 'center',
                top: 'center',
                textStyle: {
                    fontSize: fontSize,
                    color: '#2E405E'
                }
            },
            tooltip: {
                // trigger: 'item',
                // position: 'left',
                // // 注释的配置需要调试时使用，误删
                // // triggerOn: 'click',
                // // hideDelay: 100000,
                // // appendToBody:true,
                className:'line-chart-tooltip-container',
                // valueFormatter: (value: StringOrNumber) => `${value}%`
                formatter: fullTooltip,
                appendToBody:true,
            },
            series: [
                {
                    type: 'pie',
                    data: [
                        data1,
                        data2
                    ],
                    emphasis: {//使用emphasis
                        disable: false,
                        scale: false,//不缩放
                        scaleSize: 0,//为了防止失效直接设置未0
                    },
                    labelLine: {
                        show: false
                    },
                    itemStyle: {
                        normal: {
                            borderRadius: 2,
                            color: function (colors: { dataIndex: number }) {
                                return colorList[colors.dataIndex]
                            }
                        }
                    },
                    radius: ['85%', '100%'],
                },
            ],
        }
        chart.current?.setOption(option)
    }

    useEffect(() => {
        if (!data1.value) return
        updateChartOption({
            data1,
            data2,
            title
        })
    }, [title, data1, data2])

    useEffect(() => {
        chart.current = echarts.init(ref.current as HTMLElement, undefined, { renderer: 'canvas' })
        if (title) {
            updateChartOption({
                title,
                data1,
                data2
            })
        }
        window.onresize = function () {
            chart.current?.resize()
        }
    }, [])

    return (<div ref={ref} className={pieCharts} style={{
        width: `${width}px`,
        height: `${width}px`
    }}/>)
}

export default PieCharts




