import React from 'react'
import { LAYOUTS } from '@src/constant'

export type FormFiled = {
    label: string | ReactNode
    name: string,
    required?: boolean
    MAX_LENGTH?: number
    validate: null | StringSchema | NumberSchema
    children: React.ReactNode | ((props: FieldProps) => React.ReactNode)
    layout: LAYOUTS,
    hide?: boolean
    collapseProps?: FormField

}
export type FormFields = {
    [key: string]: FormFiled
}
