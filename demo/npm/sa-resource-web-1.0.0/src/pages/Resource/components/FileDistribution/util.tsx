/* eslint-disable */
// @ts-nocheck
import I18N from '@src/i18n'
import { timeOutInput, uploadLimitContainer, icon, container, groupContainer } from './index.less'
import UploadInputNumber from '@com/UploadInputNumber'
import OriginName from '@com/OriginName'
import FileSource from '@com/FileSource'
import { DEFAULT_FORMIK_VALUES, TRANSMISSION_MODE, INTEGER_MAX } from '@src/constant'
import TargetServer from '@com/OriginTargetServer'
import { Input, InputNumber, Radio, Switch, Tooltip } from 'antd'
import * as yup from 'yup'
import Iconfont from '@com/Iconfont'

const TransmissionModeTitle = () => {
    const List = () => (
        <div>
            <p>{I18N.components.FileDistribution.qiangZhiMoShiZhi}</p>
            <p>{I18N.components.FileDistribution.buLunMuBiaoLu}</p>

            <p>{I18N.components.FileDistribution.yanJinMoShiZhi}</p>
            <p>{I18N.components.FileDistribution.yanJinPanDuanMu}</p>
        </div>
    )
    return (
        <div className={container}>
            {I18N.components.FileDistribution.chuanShuMoShi}<Tooltip title={<List/>}>
                <span className={icon}><Iconfont type={'iconHelp'}/></span>
            </Tooltip>
        </div>

    )
}

export const getFileDistribution = ({
    isFileDistribution,
    isScriptExecute,
    setFormValues,
    formikValues,
    handleChangeTargetServer,
    visible,
    userInputError,
    setUserInputError,
    storageFileListError,
    setStorageFileListError,
    isFormDisabled,
    hideTargetServer,
}) => {
    const isManualConfirm = !isFileDistribution && !isScriptExecute

    return {
        timeoutValueForFileDistribution: {
            name: 'timeoutValueForFileDistribution',
            label: I18N.components.FileDistribution.chaoShiShiChangMiao,
            hide: !isFileDistribution || isManualConfirm,
            children: ({ field }) => (
                <InputNumber
                    max={INTEGER_MAX}
                    className={timeOutInput}
                    {...field}
                    disabled={isFormDisabled}
                    placeholder={I18N.components.ExecuteScript.qingShuRuChaoShi}
                />
            ),
            validate: null,
        },
        uploadLimit: {
            name: 'uploadLimit',
            label: I18N.components.FileDistribution.qiYongShangChuanXian,
            children: ({
                field,
                form: { values }
            }) => {
                const { uploadLimitDisabled } = formikValues
                return (
                    <div className={uploadLimitContainer}>
                        <Switch
                            className={'time-out-switch'}
                            checked={!uploadLimitDisabled}
                            onChange={e => {
                                setFormValues({
                                    ...values,
                                    uploadLimitDisabled: !e,
                                })
                            }}
                            disabled={isFormDisabled}
                        />
                        {!uploadLimitDisabled && (
                            <UploadInputNumber
                                {...field}
                                disabled={isFormDisabled}
                            />
                        )}
                    </div>
                )
            },
            validate: null,
        },
        downloadLimit: {
            name: 'downloadLimit',
            label: I18N.components.FileDistribution.qiYongXiaZaiXian,
            hide: !isFileDistribution,
            children: ({
                field,
                form: { values }
            }) => {
                const { downloadLimitDisabled } = formikValues
                return (
                    <div className={uploadLimitContainer}>
                        <Switch
                            className={'time-out-switch'}
                            checked={!downloadLimitDisabled}
                            disabled={isFormDisabled}
                            onChange={() => {
                                setFormValues({
                                    ...values,
                                    downloadLimitDisabled: !downloadLimitDisabled,
                                })
                            }}
                        />
                        {!downloadLimitDisabled && (
                            <UploadInputNumber
                                {...field}
                                disabled={isFormDisabled}
                            />
                        )}
                    </div>
                )
            },
            validate: null,
        },
        fileSource: {
            name: 'fileSource',
            collapseProps: {
                title: I18N.components.FileDistribution.wenJianLaiYuan,
                autoOpen: true,
                hideError: true,
                formFields: [
                    {
                        name: 'storageFileList',
                        label: <OriginName/>,
                        required: true,
                        children: ({
                            field,
                            form,
                            form: { values }
                        }) => {
                            return (
                                <FileSource
                                    form={form}
                                    field={field}
                                    values={values}
                                    setFormValues={setFormValues}
                                    disabled={isFormDisabled}
                                    storageFileList={formikValues.storageFileList}
                                    setStorageFileListError={setStorageFileListError}
                                    changeCallback={storageFileList => {
                                        setFormValues({
                                            ...values,
                                            storageFileList,
                                        })
                                    }}
                                    storageFileListError={storageFileListError}
                                    userInputError={userInputError}
                                    setUserInputError={setUserInputError}
                                />
                            )
                        },
                        validate: yup.array().min(1, I18N.components.FileDistribution.qingXuanZeWenJian).of(yup.object({
                            sourcePath: yup.string().ensure().required(I18N.components.FileDistribution.qingShuRuWenJian),
                            sourceUuid: yup.string().ensure().required(I18N.components.FileDistribution.qingXuanZeFuWu),
                        })),
                    },
                ],
            },
        },
        transportTarget: {
            name: 'transportTarget',
            hide: !isFileDistribution,
            collapseProps: {
                title: I18N.components.FileDistribution.chuanShuMuBiao,
                autoOpen: true,
                formFields: [
                    {
                        name: 'targetPath',
                        label: I18N.components.FileDistribution.muBiaoLuJing,
                        required: true,
                        hide: !isFileDistribution,
                        children: ({ field }) => {
                            return (
                                <Input {...field} placeholder={I18N.components.FileDistribution.qingTianXieFenFa} disabled={isFormDisabled}/>
                            )
                        },
                        validate: yup.string().ensure().required(I18N.components.FileDistribution.qingTianXieFenFa),
                    },
                    // 传输模式
                    {
                        name: 'transmissionMode',
                        label: <TransmissionModeTitle/>,
                        hide: !isFileDistribution,
                        required: true,
                        children: ({ field }) => {
                            return (
                                <Radio.Group
                                    {...field}
                                    defaultValue={DEFAULT_FORMIK_VALUES.transmissionMode}
                                    disabled={isFormDisabled}
                                    optionType="button"
                                    className={groupContainer}
                                    options={
                                        Object.values(TRANSMISSION_MODE)
                                            .map(item => ({
                                                ...item,
                                                disabled: isFormDisabled && field.value !== item.value,
                                                label: item.key,
                                            }))
                                    }
                                />
                            )
                        },
                        validate: null,
                    },
                    // 目标服务器
                    {
                        name: 'targetResourceList',
                        label: I18N.components.ExecuteScript.muBiaoFuWuQi,
                        required: true,
                        // 运行环境为 主机运行时 显示
                        hide: !isFileDistribution || hideTargetServer,
                        children: ({
                            field,
                            form: { values }
                        }) => (
                            <TargetServer
                                name={'targetResourceList'}
                                field={field}
                                disabled={isFormDisabled}
                                handleChange={(agents, agentMap) =>
                                    handleChangeTargetServer({
                                        agents,
                                        values,
                                        agentMap,
                                        editing: false
                                    })}
                                visible={visible}
                            />
                        ),
                        validate: yup
                            .array()
                            .min(1, I18N.OriginTargetServer.index.qingXuanZeMuBiao),
                    },
                ],
            },
        },
    }
}
