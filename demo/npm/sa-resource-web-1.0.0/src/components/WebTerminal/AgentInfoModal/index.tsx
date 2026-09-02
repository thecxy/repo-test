import I18N from '@src/i18n'
import { ModalForm, ProFormDependency, ProFormInstance, ProFormRadio, ProFormText } from '@ant-design/pro-components'
import {
    assembleRequestUrl,
    generateFormData,
    generateValidateRules,
    getContainerDOM,
    requestCallback
} from '@src/utils'
import React, { useEffect, useRef } from 'react'
import { useWebTerminal } from '@com/WebTerminal/hook'
import { AgentFormInfo, CONNECT_TYPE } from '@com/WebTerminal/types'
import { CONNECT_TYPES } from '@com/WebTerminal/constant'
import { generateFormRequiredRule, IPValidator, portValidator } from '@src/utils/utilsWithReactFC'
import { useAgentDetailData } from '@src/pages/AgentDetail/hook'
import { saveLinkInfo } from '@com/WebTerminal/slice'
import { useDispatch } from 'react-redux'
import { IS_PROD, REQUEST_METHODS, REQUEST_TYPE } from '@src/constant'
import { Button, Form, Input } from 'antd'
import { secretKeyContainer, uploadButton, fileInput, groupContainer } from './index.less'
import { request } from '@src/request/fetch'
import { DELETE_FILE, UPLOAD_FILE } from '@src/pages/Resource/constants/apis'
import { testDefaultValue } from '@src/temp/testAgent'
import { omit } from 'ramda'
import useSwitch from '@react-hook/switch'
import FormErrorMessage from '@com/FormErrorMessage'
import Iconfont from '@com/Iconfont'

const AgentInfoModal: React.FC = () => {
    const uploadRef = useRef<AnyType>()

    const {
        agentInfoVisible: visible,
        loading,
        toggleAgentInfoVisible
    } = useWebTerminal()
    const dispatch = useDispatch()
    const { currentAgentDetail } = useAgentDetailData()
    const formRef = useRef<ProFormInstance<AgentFormInfo>>()
    const [finished, toggleFinished] = useSwitch(false)
    const initialValues = IS_PROD ? {
        connectType: CONNECT_TYPE.PASSWORD,
        ip: '',
        name: '',
        port: 22,
        user: '',
        privateKeyPath: {
            fileName: '',
            fileNameFromServer: ''
        },
        password: '',
    } : {
        // ...agentByfFanBingYang,
        ...testDefaultValue,
        connectType: CONNECT_TYPE.SECRET_KEY,
        name: '',
        privateKeyPath: {
            fileName: '',
            fileNameFromServer: ''
        },
    }
    const modalFormProps = {
        formRef,
        width: 500,
        title: I18N.AgentInfoModal.index.wEBTE,
        visible,
        initialValues,
        submitter: {
            submitButtonProps: {
                loading
            }
        },
        modalProps: {
            closeIcon: <Iconfont type={'iconcross'} />,
            getContainer: getContainerDOM,
            onCancel: () => {
                toggleAgentInfoVisible(false)
            },
        },
        onFinish: async (values: AgentFormInfo) => {
            toggleFinished.on()
            const params = {
                ...omit(['privateKeyPath'], values),
                // ...agentByfFanBingYang,
                privateKeyPath: values.privateKeyPath?.fileNameFromServer,
                uuid: currentAgentDetail.uuid
            }
            dispatch(saveLinkInfo(params))
        }
    }

    const handleRemoveFile = async (fileName: string) => {
        const res = await request({
            url: assembleRequestUrl(DELETE_FILE.expand({ fileName })),
            method: REQUEST_METHODS.DELETE,
        })
        requestCallback({
            res,
            hideMessage: true,
        })
    }

    const removePreviousFile = () => {
        const {
            privateKeyPath = {
                fileNameFromServer: ''
            }
        } = formRef.current?.getFieldsValue() || {}

        const {
            fileNameFromServer,
        } = privateKeyPath
        // 移除之前已上传的文件
        if (fileNameFromServer) {
            handleRemoveFile(fileNameFromServer)
        }
    }
    const handleAddLocalFile = async (e: React.FormEvent<HTMLInputElement>) => {
        removePreviousFile()

        const file = (e.target as HTMLInputElement)?.files?.[0] as File

        const {
            name: fileName,
        } = file

        const params = {
            file
        }
        const formData = generateFormData(params)

        const res = await request({
            url: assembleRequestUrl(UPLOAD_FILE),
            params: formData,
            type: REQUEST_TYPE.FORM_DATA,
            method: REQUEST_METHODS.POST,
        })
        requestCallback({
            res,
            hideMessage: true,
            callback: data => {
                formRef.current?.setFieldsValue({
                    privateKeyPath: {
                        fileName,
                        fileNameFromServer: data
                    }
                })
            },
        })
    }

    useEffect(() => {
        if (!visible) {
            return
        }
        const {
            ip,
            name
        } = currentAgentDetail
        formRef.current?.setFieldsValue({
            ip,
            name
        })
    }, [currentAgentDetail, visible])

    useEffect(() => {
        if (!visible) {
            // 上传文件后没有提交，则删除已上传的文件
            if (!finished) {
                removePreviousFile()
            }
            formRef.current?.resetFields()
        }
    }, [visible])
    return <ModalForm<AgentFormInfo>{...modalFormProps}>
        {/* agent 连接方式 */}
        <ProFormRadio.Group
            width={'xl'}
            required
            radioType="button"
            fieldProps={{
                className: groupContainer
            }}
            name={'connectType'}
            label={I18N.AgentInfoModal.index.lianJieFangShi}
            placeholder={I18N.AgentInfoModal.index.qingXuanZeLianJie}
            options={Object.values(CONNECT_TYPES)}
            rules={generateValidateRules([generateFormRequiredRule(I18N.AgentInfoModal.index.qingXuanZeLianJie)])}
        />
        <ProFormText
            required
            disabled
            label={I18N.AgentInfoModal.index.zhuJiIP}
            placeholder={I18N.AgentInfoModal.index.qingShuRuZhuJi2}
            name={'ip'}
            rules={[{ validator: IPValidator }]}
        />
        <ProFormText
            required
            disabled
            label={I18N.AgentInfoModal.index.zhuJiMingCheng}
            name={'name'}
            placeholder={I18N.AgentInfoModal.index.qingShuRuZhuJi}
            rules={generateValidateRules([generateFormRequiredRule(I18N.AgentInfoModal.index.qingShuRuZhuJi)])}
        />
        <ProFormText
            required
            label={I18N.AgentInfoModal.index.duanKou}
            placeholder={I18N.AgentInfoModal.index.qingShuRuDuanKou}
            name={'port'}
            rules={[{ validator: portValidator }]}
        />
        <ProFormText
            required
            label={I18N.AgentInfoModal.index.yongHuMing}
            name={'user'}
            placeholder={I18N.AgentInfoModal.index.qingShuRuYongHu}
            rules={generateValidateRules([generateFormRequiredRule(I18N.AgentInfoModal.index.qingShuRuYongHu)])}
        />
        <ProFormDependency name={['connectType']}>
            {({ connectType }) => {
                const isPasswordType = connectType === CONNECT_TYPE.PASSWORD
                return <>
                    {
                        isPasswordType ? <ProFormText.Password
                                required={isPasswordType}
                                label={I18N.AgentInfoModal.index.miMa}
                                name={'password'}
                                placeholder={I18N.AgentInfoModal.index.qingShuRuMiMa}
                                rules={generateValidateRules([generateFormRequiredRule(I18N.AgentInfoModal.index.qingShuRuMiMa)], !isPasswordType)}
                            /> :
                            <Form.Item
                                required={!isPasswordType}
                                label={I18N.AgentInfoModal.index.miYao}
                                name={'privateKeyPath'}
                                rules={[
                                    {
                                        validator: async (_rule: AnyType, value) => {
                                            if (!isPasswordType) {
                                                const { fileNameFromServer } = value
                                                if (fileNameFromServer === '') {
                                                    return Promise.reject(<FormErrorMessage
                                                        message={I18N.AgentInfoModal.index.qingXuanZeMiYao}/>)
                                                }
                                            }
                                        }
                                    }
                                ]}
                            >
                                <div className={secretKeyContainer}>
                                    <Input
                                        className={fileInput}
                                        disabled
                                        value={formRef.current?.getFieldsValue()?.privateKeyPath?.fileName}
                                        placeholder={I18N.AgentInfoModal.index.qingXuanZeMiYao}
                                    />
                                    <Button onClick={() => {
                                        uploadRef.current?.click()
                                    }
                                    }>{I18N.AgentInfoModal.index.xuanZeMiYao}</Button>
                                    <input
                                        type="file"
                                        className={uploadButton}
                                        ref={uploadRef}
                                        onInput={e => handleAddLocalFile(e)}
                                    />
                                </div>
                            </Form.Item>
                    }
                </>
            }}
        </ProFormDependency>
    </ModalForm>
}

export default AgentInfoModal
