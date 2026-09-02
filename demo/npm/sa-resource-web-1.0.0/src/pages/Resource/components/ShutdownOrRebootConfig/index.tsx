/**
 * 重启、关机宽恕时间配置
 */
import I18N from '@src/i18n'
import React from 'react'
import { ProForm, ProFormDigit, ProFormInstance } from '@ant-design/pro-components'
import { ShutdownOrRebootConfigFormType } from '@src/pages/Resource/resourceTypes'

type ShutdownOrRebootConfigProps = {
    formRef: React.MutableRefObject<ProFormInstance<ShutdownOrRebootConfigFormType> | undefined>,
    visible: boolean
}
const ShutdownOrRebootConfig: React.FC<ShutdownOrRebootConfigProps> = ({
    formRef,
}) => {

    const initialValues: ShutdownOrRebootConfigFormType = { time: 0 }
    const formProps = {
        initialValues,
        formRef,
        validateTrigger: ['onChange', 'onBlur'],
        submitter: {
            render: () => [],
        }
    }
    return <ProForm<ShutdownOrRebootConfigFormType> {...formProps}>
        <ProFormDigit
            name={'time'}
            addonAfter={I18N.utils.utilsWithReactFC.miao}
            min={0}
            max={600}
            placeholder={I18N.components.ShutdownOrRebootConfig.qingSheZhiKuanShu}
            label={I18N.components.ShutdownOrRebootConfig.kuanShuShiJian}
            tooltip={I18N.components.ShutdownOrRebootConfig.kuanShuShiJianTip}
        />
    </ProForm>
}

export default ShutdownOrRebootConfig
