/**
 * FirstProgress|Windows SSH 添加agent step one
 */
import I18N from '@src/i18n'
import { Button, FormInstance, Space } from 'antd'
import React, { useEffect, useMemo, useRef } from 'react'
import {
    AUTHENTICATION_TYPES,
    DEFAULT_EXECUTOR_COUNT,
    IS_PROD,
} from '@src/constant'
import EssentialFirstStep from '../EssentialFirstStep'
import { InitialValues } from '../firstStep'
import { customFooter, linuxContainer } from './index.less'
import SecondProgress from '@src/pages/Resource/Home/Main/AddOrEditAgent/BySSH/FirstStep/SecondProgress'
import ThirdProgress from '@src/pages/Resource/Home/Main/AddOrEditAgent/BySSH/FirstStep/ThirdProgress'
import { useDispatch } from 'react-redux'
import { omit } from 'ramda'
import { generateEncrypt } from '@src/utils'
import { ProFormInstance } from '@ant-design/pro-components'
import { remoteLinkTest, submitFirstStep } from '../../slice'
import { useAgentOperationType, useAgentStep } from '../../../hook'
import { useBySSHData } from '../../hook'
import { useAddAgentModal, useExtraConfig } from '@src/pages/Resource/hook'
import { useAgentDetail } from '@src/pages/AgentDetail/hook'
import { testDefaultValue } from '@src/temp/testAgent'

export const defaultFirstProgressValues = {
    ip: '',
    authenticationType: AUTHENTICATION_TYPES.PASSWORD.value,
    user: '',
    password: '',
    port: '',
    // 不选就传null，后端会赋值为-1，代表不限制，这块到时候前端回显的时候，也需要处理一下了。 from zhangchao
    executorCount: null
}

// 误删 windows ssh
// const testDefaultValue = {
//     ip: '192.168.137.106',
//     authenticationType: AUTHENTICATION_TYPES.PASSWORD.value,
//     user: 'Administrator', // 需加密
//     password: 'sD@oschina',
//     executorCount: '1',
//     port: 23
// }

const SSHFirstProgress: React.FC = () => {
    const {
        goBackFromNextProcessOrStep,
        firstProgressFormValues,
        firstResponseData,
        loading,
        testLoading,
    } = useBySSHData()
    const { isReconnect } = useAgentOperationType()
    const { currentAgentDetail } = useAgentDetail()
    const initialValues: InitialValues = IS_PROD ? defaultFirstProgressValues : {
        ...testDefaultValue,
        authenticationType: AUTHENTICATION_TYPES.PASSWORD.value,
    }
    const { visible } = useAddAgentModal()

    const dispatch = useDispatch()
    const {
        isFirstProcess,
        isSecondProcess,
        isThirdProcess,
        addAgentType,
    } = useAgentStep()
    const {
        needExtraConfig,
        toggleExtraConfig
    } = useExtraConfig()
    const formRef = useRef<ProFormInstance<InitialValues>>()

    const agentUuid = useMemo(() => {
        if (isReconnect) {
            return currentAgentDetail.uuid
        } else {
            return goBackFromNextProcessOrStep ? firstResponseData.uuid : ''
        }
    }, [isReconnect, goBackFromNextProcessOrStep, firstResponseData])
    const generateRequestParams = (values: InitialValues) => {
        return {
            ...omit(['authenticationType', 'password', 'user'], values),
            password: generateEncrypt(values.password),
            user: generateEncrypt(values.user),
            agentUuid,
            type: addAgentType,
            executorCount: values?.executorCount || null,
        }
    }

    // 提交并下一步
    const onFinish = async (values: InitialValues) => {
        // 添加主机重复校验，添加机器识别是否可行
        const params = generateRequestParams(values)

        dispatch(submitFirstStep({
            params,
            values,
            needExtraConfig
        }))
    }
    const handleTestLink = async (form: FormInstance<AnyType>) => {
        form?.validateFields?.().then(res => {
            const params = generateRequestParams(res)
            dispatch(remoteLinkTest(params))
        })
    }
    const formProps = {
        initialValues,
        onFinish,
        formRef,
        validateTrigger: ['onChange', 'onBlur'],
        // labelWidth: 'auto',
        submitter: {
            render: (props: { form: FormInstance<AnyType> }) => {
                return <div className={customFooter}>
                    <Space>
                        <Button
                            loading={testLoading}
                            key="rest" onClick={() => handleTestLink(props.form)}>
                            {I18N.Home.Main.ceShiLianJie}</Button>
                        <Button
                            loading={!testLoading && loading}
                            disabled={testLoading}
                            type="primary"
                            key="submit" onClick={
                            () => {
                                props?.form?.submit?.()
                            }
                        }>
                            {I18N.Home.Main.xiaYiBu}</Button>
                    </Space>
                </div>
            },
        }
    }

    useEffect(() => {
        if (!visible) {
            formRef.current?.resetFields()
        }
    }, [visible])

    useEffect(() => {
        if (goBackFromNextProcessOrStep) {
            formRef.current?.setFieldsValue(firstProgressFormValues)
        }
    }, [goBackFromNextProcessOrStep])

    useEffect(() => {
        if (isReconnect) {
            const {
                ip,
                executorCount
            } = currentAgentDetail
            formRef.current?.setFieldsValue({
                ip,
                executorCount: executorCount === DEFAULT_EXECUTOR_COUNT ? '' : executorCount
            })
        }
    }, [isReconnect])

    return (
        <div className={linuxContainer}>
            {isFirstProcess && <EssentialFirstStep
                formProps={formProps}
                needExtraConfig={needExtraConfig}
                toggleExtraConfig={toggleExtraConfig}
            />
            }
            {/*  步骤一 阶段二 */}
            {isSecondProcess && <SecondProgress/>}
            {isThirdProcess && <ThirdProgress/>}
        </div>
    )
}

export default SSHFirstProgress
