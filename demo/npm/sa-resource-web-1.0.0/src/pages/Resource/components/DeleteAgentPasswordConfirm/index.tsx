/**
 * 删除agent 密码确认
 */
import I18N from '@src/i18n'
import React from 'react'
import FormErrorMessage from '@com/FormErrorMessage'
import { ProForm, ProFormInstance, ProFormText } from '@ant-design/pro-components'
import { DeleteAgentConfigFormType } from '../../resourceTypes'

type DeleteAgentPasswordConfirmProps = {
    formRef: React.MutableRefObject<ProFormInstance<DeleteAgentConfigFormType> | undefined>
}
const DeleteAgentPasswordConfirm: React.FC<DeleteAgentPasswordConfirmProps> = ({ formRef }) => {

    const initialValues: DeleteAgentConfigFormType = { password: '' }
    const formProps = {
        initialValues,
        formRef,
        validateTrigger: ['onChange', 'onBlur'],
        submitter: {
            render: () => [],
        }
    }
    return <ProForm<DeleteAgentConfigFormType> {...formProps}>
        <ProFormText.Password
            width={'xl'}
            name={'password'}
            required
            placeholder={I18N.AgentInfoModal.index.qingShuRuCurrentMiMa}
            label={I18N.AgentInfoModal.index.miMa}
            rules={[{
                validator: async (rule, value) => {
                    if (value === '') {
                        return Promise.reject(<FormErrorMessage message={I18N.AgentInfoModal.index.qingShuRuCurrentMiMa}/>)
                    }
                }
            },]}
        />
    </ProForm>
}

export default DeleteAgentPasswordConfirm
