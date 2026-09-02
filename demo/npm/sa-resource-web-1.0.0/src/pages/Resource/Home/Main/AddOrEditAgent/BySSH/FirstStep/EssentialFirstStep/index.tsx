import I18N from '@src/i18n'
import { CONCURRENCE_REGEXP } from '@src/constant/regExp'
import FormErrorMessage from '@com/FormErrorMessage'
import { AGENT_TERMINAL_TYPE, AUTHENTICATION_TYPES } from '@src/constant'
import {
    DownOutlined,
} from '@ant-design/icons'
import {
    ProForm,
    ProFormRadio,
    ProFormText,
} from '@ant-design/pro-components'
import React from 'react'
import { InitialValues } from '../firstStep'
import { rotate, icon, expand, groupContainer } from './index.less'
import SelectAddAgentMode from '@src/pages/Resource/Home/Main/AddOrEditAgent/SelectAddAgentMode'
import { Form } from 'antd'
import { useAgentOperationType, useAgentStep } from '@src/pages/Resource/Home/Main/AddOrEditAgent/hook'
import { IPValidator, portValidator } from '@src/utils/utilsWithReactFC'

type EssentialFirstStepProps = {
    formProps: {
        initialValues: InitialValues,
        onFinish: (formData: InitialValues) => Promise<boolean | void>,
        validateTrigger: string[],
    },
    needExtraConfig?: boolean,
    toggleExtraConfig?: () => void
}
const EssentialFirstStep: React.FC<EssentialFirstStepProps> = ({
    formProps,
    needExtraConfig,
    toggleExtraConfig
}) => {
    const { isReconnect } = useAgentOperationType()
    const { addAgentType } = useAgentStep()
    const {
        LINUX,
        WINDOWS
    } = AGENT_TERMINAL_TYPE
    const defaultPort = addAgentType === LINUX.value ? LINUX.defaultPort : WINDOWS.defaultPort
    return <ProForm
        {...formProps}
    >
        <Form.Item
            required
            name="agentType"
            label={I18N.Home.Main.zhuJiLeiXing}
        >
            <SelectAddAgentMode disabled={isReconnect}
            />
        </Form.Item>
        <ProFormText
            width={'xl'}
            required
            placeholder={I18N.Home.Main.qingShuRuIP}
            name={'ip'}
            disabled={isReconnect}
            label={'IP'}
            rules={[
                {
                    validator: IPValidator,
                }
            ]}
        />
        <ProFormRadio.Group
            radioType="button"
            width={'xl'}
            required
            fieldProps={{
                className: groupContainer
            }}
            name={'authenticationType'}
            label={I18N.Home.Main.renZhengFangShi}
            options={Object.values(AUTHENTICATION_TYPES)}
            rules={[
                {
                    required: true,
                    message: <FormErrorMessage message={I18N.AgentUpdateModal.index.qingXuanZeRenZheng}/>
                },
            ]}
        />
        <ProForm.Group>
            <ProFormText
                width={'xl'}
                name={'user'}
                required
                placeholder={I18N.Home.Main.qingShuRuZhuJi2}
                label={I18N.AgentInfoModal.index.yongHuMing}
                rules={[{
                    validator: async (rule, value) => {
                        const length = value.length
                        if (value === '') {
                            return Promise.reject(<FormErrorMessage message={I18N.Home.Main.qingShuRuZhuJi2}/>)
                        }
                        if (length <= 32 && length >= 3) {
                            return Promise.resolve()
                        }
                        return Promise.reject(<FormErrorMessage message={I18N.Home.Main.zhuJiYongHuMing}/>)
                    }
                }]}
            />
            <ProFormText.Password
                width={'xl'}
                name={'password'}
                required
                placeholder={I18N.AgentInfoModal.index.qingShuRuMiMa}
                label={I18N.AgentInfoModal.index.miMa}
                rules={[{
                    validator: async (rule, value) => {
                        const length = value.length
                        if (value === '') {
                            return Promise.reject(<FormErrorMessage message={I18N.AgentInfoModal.index.qingShuRuMiMa}/>)
                        }
                        if (length <= 100 && length >= 3) {
                            return Promise.resolve()
                        }
                        return Promise.reject(<FormErrorMessage message={I18N.Home.Main.zhuJiMiMaChang}/>)
                    }
                },]}
            />
        </ProForm.Group>
        {/* 1、请输入端口号，默认为22
            2、请输入端口号，默认为21
            注：用户选择Windows和Linux时提示不一样
        */}
        <ProFormText
            width={'xl'}
            name={'port'}
            required
            placeholder={I18N.get(I18N.Home.Main.qingShuRuDuanKou, { val1: defaultPort })}
            label={I18N.Home.Main.sSHDuanKou}
            rules={[{ validator: portValidator }]}
        />
        <div className={expand}>
            <span onClick={toggleExtraConfig}>
                <DownOutlined className={`${icon} ${needExtraConfig ? null : rotate}`}/>
                {I18N.Home.Main.gengDuoPeiZhi}</span>
        </div>
        <ProFormText
            width={'xl'}
            name={'executorCount'}
            hidden={!needExtraConfig}
            placeholder={I18N.Home.Main.qingShuRuZhuJi}
            fieldProps={{
                maxLength: 4,
                showCount: true
            }}
            label={I18N.Home.Main.bingFaXianZhi}
            rules={[{
                validator: async (rule, value) => {
                    if (needExtraConfig) {
                        if (value?.length && !CONCURRENCE_REGEXP.test(value)) {
                            return Promise.reject(<FormErrorMessage
                                message={I18N.Outline.AgentConfig.qingShuRuDeZheng}/>)
                        }
                    }
                }
            }]}
        />
    </ProForm>
}

export default EssentialFirstStep
