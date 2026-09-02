/**
 * 新增、编辑、重连 agent
 */
import I18N from '@src/i18n'
import { Steps } from 'antd'
import React from 'react'
import { sideBar, main, agentTypeSelect, stepCss, mainContent } from './index.less'
import { updateAddAgentMode } from '@src/pages/Resource/resourceSlice'
import { useDispatch } from 'react-redux'
import SSHFirstStep from './BySSH/FirstStep'
import SSHSecondStep from './BySSH/SecondStep'
import ThirdStep from './BySSH/ThirdStep'
import EllipsisContainer from '@com/EllipsisContainer'
import { useAddAgentModal } from '@src/pages/Resource/hook'
import { useAgentOperationType, useAgentStep } from './hook'
import FirstProgress from './ByManual/FirstStep/FirstProgress'
import BasicModal from '@com/BasicModal'
import AntdSelect from '@com/AntdSelect'
import { getContainerDOM } from '@src/utils'

const { Step } = Steps
const AddOrEditAgent: React.FC = () => {
    const dispatch = useDispatch()

    const handleChangeAgentMode = (value: string) => {
        dispatch(updateAddAgentMode(value))
    }

    const {
        currentStep,
        isSSHInstall,
        addAgentMode,
        isThirdStep,
        isFirstProcess,
        currentTitle,
        currentStepProcessRent
    } = useAgentStep()
    const {
        agentOperationType,
    } = useAgentOperationType()

    const {
        visible,
        toggleVisible
    } = useAddAgentModal()

    const modalProps = {
        maskClosable: false,
        visible,
        onCancel: () => {
            toggleVisible()
        },
        footer: null,
        width: 800,
        // height: 560,
        centered: true,
        getContainer: getContainerDOM,
        className: 'add-edit-agent-modal'
    }

    const sshSteps = [
        {
            title: I18N.Home.Main.tianXieZhuJiXin,
            content: <SSHFirstStep/>,
            // content: <div/>    ,
        },
        {
            title: I18N.Home.Main.tianJiaZhuJiDao,
            content: <SSHSecondStep/>,
        },
        {
            title: I18N.Home.Main.wanCheng,
            content: <ThirdStep/>,
        },
    ]
    const manualSteps = [
        {
            title: I18N.Home.Main.huoQuZhiXingA,
            content: <FirstProgress/>,
        },
        {
            title: I18N.Home.Main.tianJiaZhuJiDao,
            content: <SSHSecondStep/>,
        },
        {
            title: I18N.Home.Main.wanCheng,
            content: <ThirdStep/>,
        },
    ]

    const finalStep = isSSHInstall ? sshSteps : manualSteps
    const customStyle = { maxWidth: 134 }
    return <BasicModal {...modalProps}>
        <div className={sideBar}>
            {/*  选择添加agent 方式(SSH|MANUAL) */}
            <AntdSelect
                value={addAgentMode}
                onChange={handleChangeAgentMode}
                disabled={!isFirstProcess}
                options={Object.values(agentOperationType)}
                style={{ width: 200 - 24 * 2, }}
            />
            {/*  ssh step */}
            {
                isSSHInstall && <Steps
                    className={stepCss}
                    size={'small'}
                    percent={currentStepProcessRent}
                    current={currentStep - 1}
                    direction="vertical"
                >
                    {sshSteps.map(item => (
                        <Step
                            key={item.title}
                            title={<EllipsisContainer val={item.title} style={customStyle}/>}
                        />
                    ))}
                </Steps>
            }
            {/*  manual step */}
            {
                !isSSHInstall && <Steps
                    className={stepCss}
                    size={'small'}
                    percent={currentStepProcessRent}
                    current={currentStep - 1}
                    direction="vertical"
                >
                    {manualSteps.map(item => (
                        <Step
                            key={item.title}
                            title={<EllipsisContainer val={item.title} style={customStyle}/>}
                        />
                    ))}
                </Steps>
            }
        </div>
        <div className={main}>
            {/*  agent 类型(linux|windows) */}
            {!isThirdStep && <div className={agentTypeSelect}>
                <EllipsisContainer val={currentTitle}/>
                {/*  暂无需求，等待PM 更新 */}
                {/* <Button type={'link'}>{I18N.Home.Main.anZhuangShiYuDao}</Button> */}
            </div>
            }
            {/*   主要步骤   */}
            <div className={mainContent}>{finalStep[currentStep - 1].content}</div>
        </div>
    </BasicModal>
}

export default AddOrEditAgent
