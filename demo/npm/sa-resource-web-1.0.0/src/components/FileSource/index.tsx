/* eslint-disable */
// @ts-nocheck
// 文件分发/文件来源/源文件
import I18N from '@src/i18n'
import React, { useCallback, useMemo, useRef } from 'react'
import { Button, Input, Table, Progress, Space } from 'antd'
import { omit, propOr } from 'ramda'

import LoadingButton from './LoadingButton'

import {
    fileSourceContainer,
    fileFromServer,
    fileChooseTips,
    addButton,
    inner,
    fileFromLocal,
    layoutItem,
    disabled as disabledCss,
    uploadButton
} from './index.less'
import { useFileSource, useUploadDetailData } from './hook'
import { pick } from 'lodash/fp'
import RetryButton from './RetryButton'
import { convertFileSize } from '@src/utils'
import Layout from '@com/FormField/Layout'
import TargetServer from '@com/OriginTargetServer'
import EllipsisContainer from '@com/EllipsisContainer'
import { ERROR, LOADING, SUCCESS } from '@src/constant'
import IconFont from '@com/Iconfont'

const FileSource = ({
    field,
    changeCallback,
    storageFileList,
    values,
    setFormValues,
    userInputError,
    setUserInputError,
    storageFileListError,
    setStorageFileListError,
    disabled,
    form,
}) => {
    const uploadRef = useRef()
    const {
        uploadingMap,
        localFilesMap,
        serverFilesMap
    } = useUploadDetailData()

    const {
        // about server file
        handleChangeSourcePath,
        handleAddServerFile,
        handleChangeServerFileSourceResource,
        handleRemoveServerFile,

        // about local file
        handleAddLocalFile,
        handleRemoveLocalFile,

        needUpdateFileMap,

        handleReUploadLocalFile,
    } = useFileSource({
        changeCallback,
        storageFileList,
        values,
        setFormValues
    })

    const resetUserInputError = useCallback(() => {
        setStorageFileListError('')
        if (userInputError) {
            setUserInputError(false)
        }
    }, [setUserInputError, userInputError])

    const RemoveButton = ({ record }) => {
        return (
            <span
                className={`delete-button ${disabled ? disabledCss : ''}`}
                onClick={() => (disabled ? null : handleRemoveLocalFile(record))}
            >{I18N.FileSource.index.yiChu}</span>
        )
    }

    const serverFiles = Object.values(serverFilesMap)

    const chooseServerTips = useMemo(() => {
        const length = serverFiles.length
        return length ? I18N.template(I18N.FileSource.index.yiXuanZeLE2, { length }) : I18N.FileSource.index.zanWeiXuanZeWen
    }, [serverFiles.length])

    const serverFileTableProps = {
        dataSource: serverFiles,
        columns: [
            {
                title: I18N.FileSource.index.wenJianLuJing,
                dataIndex: 'sourcePath',
                width: '30%',
                render: (val, record) => {
                    const errors = form.errors?.storageFileList?.map(item => {
                        return pick('sourcePath', item)
                    })
                    return (
                        <Layout id={'sourcePath'} errors={!val && errors} className={layoutItem}>
                            <Input
                                name={'sourcePath'}
                                value={val}
                                {...omit(['value'], field)}
                                disabled={disabled}
                                onChange={e => {
                                    handleChangeSourcePath({
                                        value: e.target.value,
                                        key: record.key,
                                    })
                                }}
                                onFocus={resetUserInputError}
                                placeholder={I18N.FileSource.index.qingShuRuLuJing}
                            />
                        </Layout>
                    )
                },
            },
            {
                title: I18N.FileSource.index.fuWuQi,
                dataIndex: 'sourceUuid',
                render: (val, record) => {
                    const errors = form.errors?.storageFileList?.map(item => {
                        return pick('sourceUuid', item)
                    })
                    return (
                        <Layout id={'sourceUuid'} errors={!val && errors} className={layoutItem}>
                            <TargetServer
                                name={'sourceUuid'}
                                multiple={false}
                                allowClear={false}
                                disabled={disabled}
                                field={{
                                    ...omit(['onChange'], field),
                                    value: val
                                }}
                                resetUserInputError={resetUserInputError}
                                handleChange={(agents, agentMapByUuid) =>
                                    handleChangeServerFileSourceResource(agents, agentMapByUuid, record.key)}
                            />
                        </Layout>
                    )
                },
            },
            {
                title: I18N.FileSource.index.caoZuo,
                align: 'center',
                width: '10%',
                render: (_, record) => {
                    return (
                        <span
                            className={`delete-button server-button ${disabled ? disabledCss : ''}`}
                            onClick={() => (disabled ? null : handleRemoveServerFile(record))}
                        >{I18N.FileSource.index.yiChu}</span>
                    )
                },
            },
        ],
        pagination: false,
    }

    const localFiles = useMemo(() => {
        return Object.values(localFilesMap)
    }, [localFilesMap])

    const chooseLocalTips = useMemo(() => {
        const length = localFiles.length
        return length ? I18N.template(I18N.FileSource.index.yiXuanZeLE, { val1: length }) : I18N.FileSource.index.zanWeiXuanZeWen
    }, [localFiles.length])

    const localFileTableProps = {
        dataSource: localFiles,
        // 后期如果服务端分片大小小于 100M/每片，前端显示可以不正常，需要添加横向滚动
        // scroll: {x: 750},
        columns: [
            {
                title: I18N.FileSource.index.wenJianMing,
                dataIndex: 'fileName',
                render: val => <EllipsisContainer val={val}/>,
            },
            {
                title: I18N.FileSource.index.wenJianDaXiao,
                dataIndex: 'fileSize',
                // 单位 byte
                render: val => <EllipsisContainer val={convertFileSize(val)}/>,
            },
            {
                title: I18N.FileSource.index.caoZuo,
                align: 'center',
                render: (_, record) => {
                    const {
                        status,
                        fileName,
                        uploadStatusByFrontEnd,
                        key
                    } = record
                    // 上传进度
                    const process = propOr(0, 'process', uploadingMap?.[fileName])
                    const total = propOr(1, 'total', uploadingMap?.[fileName])
                    const loadingProps = {
                        process,
                        total,
                        uploadStatusByFrontEnd,
                    }
                    switch (status) {
                    case SUCCESS.value:
                        return (<RemoveButton record={record}/>)
                    case ERROR.value:
                        return (
                            <Space>
                                <RetryButton fileKey={key} handleReUploadLocalFile={handleReUploadLocalFile}/>
                                <RemoveButton record={record}/>
                            </Space>
                        )
                    case LOADING.value:
                        return (
                            <>
                                <LoadingButton {...loadingProps} />
                                <Progress
                                    style={{marginLeft: 4}}
                                    percent={process}
                                    steps={total}
                                    size="small"
                                    strokeColor="#52c41a"
                                />
                            </>
                        )
                    }

                },
            },
        ],
        pagination: false,
    }
    return (
        <Layout id={'sourceFile'} errors={storageFileListError} className={`${layoutItem} ${fileSourceContainer}`}>
            <div className={fileSourceContainer}>
                <div className={fileFromServer}>
                    <p className={fileChooseTips}>{chooseServerTips}</p>
                    <div className={inner}>
                        <Table {...serverFileTableProps} />
                        <Button
                            size={'small'}
                            icon={<IconFont type={'iconAdded'}/>}
                            className={addButton}
                            onClick={handleAddServerFile}
                            disabled={disabled}
                        >{I18N.FileSource.index.tianJiaFuWuQi}</Button>
                    </div>
                </div>
                <div className={fileFromLocal}>
                    <p className={fileChooseTips}>{chooseLocalTips}</p>
                    <Table {...localFileTableProps} />
                    <Button
                        disabled={disabled}
                        size={'small'}
                        icon={<IconFont type={'iconAdded'}/>}
                        className={addButton}
                        onClick={() => {
                            uploadRef.current.click()
                        }}
                    >{I18N.FileSource.index.tianJiaBenDiWen}{
                            !needUpdateFileMap && (
                                <input
                                    type="file"
                                    className={uploadButton}
                                    ref={uploadRef}
                                    onInput={e => handleAddLocalFile(e, uploadRef)}
                                />
                            )
                        }
                    </Button>
                </div>
            </div>
        </Layout>
    )
}

export default FileSource
