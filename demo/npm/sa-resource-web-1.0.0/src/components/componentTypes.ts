type OptionAxisType = 'value' | 'category' | 'time' | 'log'
export type MultiData = {
    name?: string,
    list: StringOrNumber[]
}
export type LineChartProps = {
    width?: number
    height?: number
    fontSize?: number
    title?: string,
    xAxisData: string[]
    yAxisData?: MultiData,
    multiData?: boolean
    multiYAxisData?: MultiData[]
    type?: OptionAxisType
    isStep?: boolean
    gridTop?: string
    axisLabelFormatter?: (value: AnyType) => string
    xAxisLabelFormatter?: (value: AnyType) => string
    tooltipValueFormatter?: (value: AnyType) => string
}
