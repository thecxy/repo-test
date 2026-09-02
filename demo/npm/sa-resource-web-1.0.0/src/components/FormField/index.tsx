/* eslint-disable */
// @ts-nocheck
import { Field, FieldProps } from 'formik'
import { pick } from 'ramda'
import Layout from './Layout'
import React from 'react'

// @see https://github.com/jaredpalmer/formik/issues/1667
export const fakeEvent = (name, value) => ({
    target: {
        name,
        value
    }
})

// eslint-disable-next-line max-len
const layoutProps = ['id', 'layout', 'label', 'tooltip', 'required', 'errors', 'hints', 'className', 'style', 'labelClassName', 'hideLabel', 'hideError']

const formikProps = ['as', 'children', 'component', 'innerRef', 'name', 'render', 'validate']

type FormFieldProps = {
    type: string,
    name: string,
    children: React.ReactNode | ((props: FieldProps) => React.ReactNode)
    // [key: string]: string | boolean | number
}
const FormField: React.FC<FormFieldProps> = ({
    type,
    name,
    children,
    // fast,
    ...rest
}) => (name ? (
    <Field {...pick(formikProps, rest)} type={type} name={name}>
        {({
            field,
            form,
            meta
        }) => {
            const { name } = field
            const {
                handleChange,
                validateOnMount
            } = form
            const {
                touched,
                error
            } = meta
            const errors = (validateOnMount || touched) ? error : []
            // TODO 这里不得不用了handleChange，等formik修复
            // @see https://github.com/jaredpalmer/formik/issues/2130
            const onChange = (mixed: Event) => {
                if (mixed?.target) {
                    handleChange(mixed)
                } else {
                    handleChange(fakeEvent(name, mixed))
                }
            }

            const fixedProps = {
                field: {
                    ...field,
                    onChange
                },
                form,
                meta,
            }

            // TODO errors需要改成数组，而不是反映values的结构。
            // 现在每个Field的errors是数组，FieldArray，也是数组。
            // 同时FieldArray的insert会给新添加的字段的error赋值一个null
            // 需要需要在Layout里边特殊适配
            // 以此保证错误信息的数组的数量与顺序是正确的 在这里进行一下兼容。
            return (
                <Layout {...pick(layoutProps, rest)} id={name} errors={errors}>
                    {typeof children === 'function' ? children(fixedProps) : children}
                </Layout>
            )
        }}
    </Field>
) : (
    <Layout {...pick(layoutProps, rest)} id={name}>
        {children}
    </Layout>
))

export default FormField
