/* eslint-disable */
// @ts-nocheck
/**
 * 文件分发
 */

import I18N from '@src/i18n'
import React, { useRef, useState, useEffect } from 'react'
import { STEP_TYPES, DEFAULT_STRING_VALUE, DEFAULT_FORMIK_VALUES, LOADING } from '@src/constant'
import { useScripts } from '@src/pages/Resource/components/ExecuteScript/hook'
import { Button, message, Space } from 'antd'
import { AgentDetail, ExecuteScriptForm, RapidExecutionParamsType } from '../../resourceTypes'
import { debounceWith250ms } from '@src/utils'
import {
    useFileDistribution,
} from '@src/pages/Resource/components/FileDistribution/hook'
import { getFileDistribution } from './util'
import { useCallback } from 'react'
import FormikComp from '@com/FormikComp'
import { omit } from 'ramda'
import { footerContainer, footer } from './index.less'
import BasicDrawer from '@com/BasicDrawer'
import { useUploadDetailData } from '@com/FileSource/hook'

type FileDistributionProps = {
    currentAgentDetail?: AgentDetail
}
const FileDistribution: React.FC<FileDistributionProps> = ({currentAgentDetail}) => {
    const [userInputError, setUserInputError] = useState(false)
    const [formikValues, setFormikValues] = useState(DEFAULT_FORMIK_VALUES)
    const [disabled, setDisabled] = useState(false)
    const [storageFileListError, setStorageFileListError] = useState([])
    const [hideTargetServer, setHideTargetServer] = useState(false)
    const formRef = useRef()

    const transferParams = (originParams: ExecuteScriptForm): RapidExecutionParamsType => {
        const {
            storageFileList,
            targetResourceList,
            downloadLimit,
            targetPath,
            timeoutValueForFileDistribution,
            transmissionMode,
            uploadLimit
        } = originParams
        return {
            name:`文件分发-${Date.now()}`,
            type: STEP_TYPES.FILE_DISTRIBUTION.value,
            stageFileBean: {
                downloadLimit,
                targetPath,
                timeoutValue: timeoutValueForFileDistribution,
                transmissionMode,
                uploadLimit
            },
            storageFileList: storageFileList.map((item) => (omit(['key'], item))),
            targetResourceList: targetResourceList.map(({
                name: targetResourceName,
                uuid: targetUuid
            }) => ({
                targetResourceName,
                targetUuid
            }))
        }
    }
    const onFinish = (data) => {
        handleRapidExecution(data)
    }
    const handleChangeStorageFileListError = (message) => {
        setStorageFileListError(message ? [{
            sourceFile: [{
                level: 'error',
                text: message
            }]
        }] : [])
    }
    // 本地文件如果还处于上传中，则禁止保存
    const checkStorageListAvailable = useCallback(e => {
        const { storageFileList = [] } = e
        const length = storageFileList?.length
        if (!length) {
            handleChangeStorageFileListError(I18N.components.FileDistribution.qingZhiShaoXuanZe)
            return false
        }
        let tempMap = {}
        for (let i = 0; i < length; i++) {
            const {
                sourcePath,
                sourceResourceName,
                status
            } = storageFileList[i]
            // 本地上传文件
            if (sourcePath === DEFAULT_STRING_VALUE) {
                if (status === LOADING.value) {
                    message.error(I18N.components.FileDistribution.dangQianYouBenDi)
                    handleChangeStorageFileListError(I18N.components.FileDistribution.dangQianYouBenDi)
                    return false
                }
                continue
            }

            // 服务器文件
            if (tempMap[`${sourcePath}${DEFAULT_STRING_VALUE}${sourceResourceName}`]) {
                message.error(I18N.components.FileDistribution.qingWuTianXieYi)
                handleChangeStorageFileListError(I18N.components.FileDistribution.qingWuTianXieYi)
                return false
            }
            tempMap[`${sourcePath}${DEFAULT_STRING_VALUE}${sourceResourceName}`] = 1
        }
        setStorageFileListError([])
        return true
    }, [])
    const handleSubmit = debounceWith250ms((e) => {
        const available = checkStorageListAvailable(e)
        if (!available) {
            setUserInputError(true)
            return
        }
        formRef.current?.submitForm().then(() => {
            formRef.current?.validateForm().then((res) => {
                const errLength = Object.keys(res).length
                if (!errLength) {
                    onFinish(transferParams(e))
                }
            })
        })
    })

    const setFormValues = useCallback(e => {
        return setFormikValues(e)
    }, [setFormikValues])

    const {
        scripts,
    } = useScripts()
    const {
        visible,
        toggleVisible,
        handleRapidExecution,
        loading,
        handleChangeLoading
    } = useFileDistribution()

    const drawerFormProps = {
        title: I18N.constant.index.wenJianFenFa,
        width: 650,
        onClose: () => toggleVisible(false),
        className: 'file-distribution-container',
        visible,
        destroyOnClose:true
    }

    const defaultFormField = {
    }

    const handleAddTargetServer = useCallback(({
        agents,
        values
    }) => {
        setFormikValues({
            ...values,
            targetResourceList: agents,
        })
    }, [])

    const updateFormFields = useCallback(() => {
        const isScriptExecute = false

        const isFileDistribution = true
        const fileDistributionFields = getFileDistribution({
            isFileDistribution,
            isScriptExecute,
            setFormValues,
            formikValues,
            handleChangeTargetServer: handleAddTargetServer,
            visible,
            userInputError,
            setUserInputError,
            storageFileListError,
            setStorageFileListError: handleChangeStorageFileListError,
            isFormDisabled: false,
            hideTargetServer
        })
        return {
            ...defaultFormField,
            ...fileDistributionFields,
        }
    }, [
        defaultFormField,
        formikValues,
        scripts,
        setFormValues,
        setUserInputError,
        userInputError,
        visible,
    ])
    const {
        updateLocalFileMap,
        updateServerFileMap,
    } = useUploadDetailData()
    const handleCancel = () => {
        // 重置表单
        setFormikValues(DEFAULT_FORMIK_VALUES)
        updateLocalFileMap({})
        updateServerFileMap({})
        toggleVisible(false)
        handleChangeLoading(false)
    }

    const formikProps = {
        handleSubmit: () => {
        },
        initialValues: formikValues,
        disabled,
        setDisabled,
        formFields: updateFormFields(),
        handleCancel,
        Footer: ({ values }) => {
            return <div className={footerContainer}>
                <div className={footer}>
                    <Space>
                        <Button onClick={handleCancel}>{I18N.FormikComp.index.quXiao}</Button>
                        <Button type={'primary'} onClick={() => handleSubmit(values)} loading={loading}>{I18N.components.FileDistribution.fenFa}</Button>
                    </Space>
                </div>
            </div>
        },
        showLog:true,
        transformRef: form => {
            formRef.current = form
        },
    }

    // 当前页面在agent详情页时，主动选择当前的agent作为目标服务器 from 张超、徐明星
    useEffect(() => {
        if(currentAgentDetail && visible){
            const {name,uuid} = currentAgentDetail
            setHideTargetServer(true)
            setFormValues({
                ...formikValues,
                targetResourceList:[{
                    name,
                    uuid,
                    title:name,
                    value:uuid,
                }]
            })
        }
    }, [currentAgentDetail, visible])

    useEffect(()=>{
        if(!visible){
            handleCancel()
        }
    },[visible])

    return visible ? <BasicDrawer {...drawerFormProps}>
        <FormikComp {...formikProps} />
    </BasicDrawer> : null
}

export default FileDistribution
