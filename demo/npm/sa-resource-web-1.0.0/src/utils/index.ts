/* eslint-disable */
// @ts-nocheck
import I18N from '@src/i18n'
import { message } from 'antd'
import urlJoin from 'url-join'
import { debounce } from 'lodash/fp'
import _ from 'lodash';
import { generatePath, Params } from 'react-router'
import { parseTemplate, Template } from 'url-template'
import { useSelector, TypedUseSelectorHook } from 'react-redux'
import { path, propOr, omit, isNil, isEmpty } from 'ramda'
import md5 from 'md5'
import { DataNode } from 'antd/lib/tree'
import JSEncrypt from 'jsencrypt'
import { Rule } from 'antd/lib/form'
import { RootState } from '../store'
import { CustomFile, FormDataValue } from './utils'
import { getCompanyId, getSpaceId } from './getRouteIds'
import {
    CONTAINER_DOM_ID, DEFAULT_STRING_VALUE,
    TYPES_OF_FETCHING, HOUR_STEP,
    MAGE_BYTE_SCALE, MILLI_SECOND_STEP,
    MINUTE_STEP, PROJECT_ROUTE,
    PUBLIC_PATH, REQUEST_CODE,
    MESSAGE_TYPES, REQUEST_URL_TYPES,
    DEFAULT_SUCCESS_MESSAGE,
    COMMON_EXEC_URL_PREFIX,
    DEFAULT_PAGINATION,
    REQUEST_URL_TYPE,
    UNALLOCATED_GROUP_NAME,
    AGENT_GROUP_DISABLED_LEVEL,
    GROUP_TYPE,
    PUBLIC_KEY, PRIMARY_COLOR
} from '../constant'
import { RequestData } from '@src/request/request'
import { ROOT_TREE_NODE } from '@src/pages/Resource/constants/constant'
import { AnyAction } from '@reduxjs/toolkit'
import { AgentDetail, FulfilledAction, PendingAction, RejectedAction } from '@src/pages/Resource/resourceTypes'

export { getLineChartPosition } from './getLineChartPosition'

export const Toast = {
    common (type, ...args) {
        let params = {
            showCountDown: false
        }

        if (args.length === 1 && typeof args[0] === 'object') {
            const [moreParams] = args
            params = {
                ...params,
                ...moreParams
            }
        } else {
            const [content, duration, onClose] = args

            params = {
                ...params,
                content,
                duration,
                onClose
            }
        }

        message[type](params)
    },
    success (...args) {
        Toast.common(MESSAGE_TYPES.SUCCESS, ...args)
    },
    error (...args) {
        Toast.common(MESSAGE_TYPES.ERROR, ...args)
    },
    warning (...args) {
        Toast.common(MESSAGE_TYPES.WARNING, ...args)
    }
}

const formatWidthEero = (origin: number | string, maxLength: number, fillString: string): string => {
    return String(origin).padStart(maxLength, fillString)
}

const formatTime = (origin: number | string): string => {
    return formatWidthEero(origin, 2, '0')
}
export const formatTimeStamp = (timestamp: StringOrNumber | null, dateSymbol = '-', timeSymbol = ':'): string => {
    if (!timestamp) {
        return DEFAULT_STRING_VALUE
    }
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = formatTime(date.getMonth() + 1)
    const day = formatTime(date.getDate())
    const hour = formatTime(date.getHours())
    const minute = formatTime(date.getMinutes())
    const second = formatTime(date.getSeconds())
    return `${year}${dateSymbol}${month}${dateSymbol}${day} ${hour}${timeSymbol}${minute}${timeSymbol}${second}`
}

export const parseIntForDecimal = (target: number): number => parseInt(String(target), 10)

/**
 * @param dateTimeStamp
 * @returns {{hourTime: number, secondTime: number, minuteTime: number, dayTime: number}}
 */
export const getDateTime = dateTimeStamp => {
    const formatTime = str => String(str)?.padStart(2, '0')
    // 获取总秒数
    let secondTime = parseIntForDecimal(dateTimeStamp / MILLI_SECOND_STEP)
    let dayTime = 0 // 天
    let minuteTime = 0 // 分
    let hourTime = 0 // 小时

    // 如果秒数大于60，将秒数转换成整数
    if (secondTime >= MINUTE_STEP) {
        // 获取分钟，除以60取整数，得到整数分钟
        minuteTime = formatTime(parseIntForDecimal(secondTime / MINUTE_STEP))
        // 获取秒数，秒数取佘，得到整数秒数
        secondTime = formatTime(parseIntForDecimal(secondTime % MINUTE_STEP))
        // 如果分钟大于60，将分钟转换成小时
        if (minuteTime >= MINUTE_STEP) {
            // 获取小时，获取分钟除以60，得到整数小时
            hourTime = formatTime(parseIntForDecimal(minuteTime / MINUTE_STEP))
            // 获取小时后取佘的分，获取分钟除以60取佘的分
            minuteTime = formatTime(parseIntForDecimal(minuteTime % MINUTE_STEP))
        }
        if (hourTime >= HOUR_STEP) {
            dayTime = parseIntForDecimal(hourTime / HOUR_STEP)
            hourTime = formatTime(parseIntForDecimal(hourTime % HOUR_STEP))
        }
    }
    return {
        dayTime,
        hourTime,
        minuteTime,
        secondTime
    }
}

export function getContainerDOM (): HTMLDivElement {
    return document.getElementById(CONTAINER_DOM_ID) as HTMLDivElement
}

export function getUrlPrefixReal () {
    const companyId = getCompanyId()
    const projectId = getSpaceId()
    const PREFIX = projectId ? urlJoin(PUBLIC_PATH, companyId, projectId) : urlJoin(PUBLIC_PATH, companyId)
    return projectId ? PREFIX : urlJoin(PREFIX, PROJECT_ROUTE)
}

export const byteToGage = (size: number): string => {
    return (size / Math.pow(MAGE_BYTE_SCALE, 3)).toFixed(2)
}

/**
 * 转换为 MB
 * @param fileSize 单位 byte
 */
export function convertFileSize (fileSize) {
    let size
    let symbol
    const doubleUnit = Math.pow(MAGE_BYTE_SCALE, 2)
    const treblingUnit = Math.pow(MAGE_BYTE_SCALE, 3)
    if (fileSize < doubleUnit) {
        size = fileSize / MAGE_BYTE_SCALE
        symbol = 'Kb'
    } else if (fileSize <= treblingUnit) {
        size = fileSize / doubleUnit
        symbol = 'Mb'
    } else {
        size = size = fileSize / treblingUnit
        symbol = 'Gb'
    }
    return `${size.toFixed(2)}${symbol}`
}

// 换算总耗时
export function convertConsumeTime (executionDetail, needDefaultDate = true) {
    if (!executionDetail) {
        return
    }
    let {
        consumeTime = null,
        beginTime
    } = executionDetail

    if (!consumeTime) {
        if (!needDefaultDate || !beginTime) {
            return DEFAULT_STRING_VALUE
        }

        if (beginTime) {
            consumeTime = (Date.now() - beginTime) / MILLI_SECOND_STEP
        }
    }

    const {
        dayTime,
        hourTime,
        minuteTime,
        secondTime
    } = getDateTime(consumeTime * MILLI_SECOND_STEP)
    const dateStr = dayTime ? `${dayTime}d` : ''
    const hourStr = hourTime ? `${hourTime}h` : ''
    const minuteStr = minuteTime ? `${minuteTime}m` : ''
    const secondStr = secondTime ? `${secondTime}s` : ''
    return `${dateStr}${hourStr}${minuteStr}${secondStr}`
}

type RequestCallbackProps = {
    res: any,
    hideMessage?: boolean,
    successMessage?: string,
    callback?: (data: RequestData.data) => void
    errorCallback?: (data: RequestData.data) => void
}

export function requestCallback ({
    res,
    hideMessage = false,
    successMessage = DEFAULT_SUCCESS_MESSAGE,
    callback,
    errorCallback
}: RequestCallbackProps) {
    const {
        code,
        msg,
        data
    } = res
    if (code === REQUEST_CODE.SUCCESS) {
        if (!hideMessage) {
            message.success(successMessage || msg)
        }
        callback && callback(data)
    } else {
        errorCallback && errorCallback(data)
    }
}

export const TYPE_MESSAGES = {
    APP: 'app',
    DISK_SPACE: 'diskSpace'
}
export const diskWarning = (diskSpaceInfo, type = 'app') => {
    if (!diskSpaceInfo) {
        return
    }
    const {
        diskFreeSize,
        diskUsedWarnRatio,
        diskTotalSize,
        overstep
    } = diskSpaceInfo

    const freeRatio = diskFreeSize / diskTotalSize
    const {
        APP,
        DISK_SPACE
    } = TYPE_MESSAGES
    const typeMessages = {
        [APP]: I18N.template(I18N.utils.index.cunChuKongJianYi, { val1: (freeRatio * 100).toFixed(2) }),
        [DISK_SPACE]: I18N.template(I18N.utils.index.ciPanShengYuKong, { val1: (freeRatio * 100).toFixed(2),
val2: diskUsedWarnRatio * 100 })
    }

    if (overstep) {
        Toast.warning(typeMessages[type])
    }
}

export const updateCategoryMap = list => {
    const length = list.length
    const map = {}
    for (let i = 0; i < length; i++) {
        const {
            name = '',
            id
        } = list[i]
        map[name] = list[i]
        map[id] = list[i]
    }
    return map
}

export const loadMoreCallBackByScrolling = (e, {
    dispatch,
    currentPage,
    params,
    pageSize = DEFAULT_PAGINATION.pageSize
}) => {
    e.persist()
    // 判断滑动到底部
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = e.target
    if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
        dispatch({
            pageSize,
            currentPage: currentPage + 1,
            type: TYPES_OF_FETCHING.MORE,
            ...params
        })
    }
}

export const debounceWith500ms = fn => debounce(500)(fn)

export const debounceWith250ms = fn => debounce(250)(fn)

export const generateFullPath = (url: string, params?: Params): string => {
    return urlJoin(getUrlPrefixReal(), generatePath(url, params))
}

export const assembleRequestUrl = (url: string, type = REQUEST_URL_TYPES.INTERNAL.label): string =>
    urlJoin(REQUEST_URL_TYPES[type as REQUEST_URL_TYPE].prefix, url)

export const assembleExternalUrl = (url: string): string => assembleRequestUrl(url, REQUEST_URL_TYPES.EXTERNAL.label)

export const assembleSaServerUrl = (url: string): string => assembleRequestUrl(url, REQUEST_URL_TYPES.SA_SERVER.label)

export const generateDispatchCallback = (dispatch, callback) => payload => dispatch(callback(payload))

export const generateUrlWithParamsString = (prefix: string, paramsString: string, suffix = ''): Template =>
    parseTemplate(urlJoin(prefix, paramsString, suffix))

export const generateExecUrlWithParamsString = (paramsString: string, suffix = ''): Template =>
    generateUrlWithParamsString(COMMON_EXEC_URL_PREFIX, paramsString, suffix)

export const useSelectState = (paths: string | string[]): TypedUseSelectorHook<RootState> => {
    const generateExecution = Array.isArray(paths) ? (state: RootState) => path(paths, state) : (state: RootState) => propOr('', paths, state)
    return useSelector(generateExecution) as TypedUseSelectorHook<RootState>
}

export const generateMd5ForFile = (file: File): string => {
    const {
        name,
        size
    } = file
    return md5(urlJoin(name, String(size)))
}

export const generateFormData = (params: FormDataValue): FormData => {
    const formData = new FormData()

    for (const paramsKey in params) {
        formData.append(paramsKey, params[paramsKey])
    }

    return formData
}

export const generateFileKey = ({
    fileName,
    fileSize
}: CustomFile): string => {
    return urlJoin(btoa(encodeURI(fileName)), btoa(encodeURI(String(fileSize))))
}
export const decodeFileKey = (target: string): CustomFile => {
    const [btoa1, btoa2] = target.split('/')
    return {
        fileName: decodeURI(atob(btoa1)),
        fileSize: decodeURI(atob(btoa2))
    }
}

export const getDefaultPopupContainer = (triggerNode: HTMLElement): HTMLElement => triggerNode.parentNode as HTMLElement

export const generateBooleanToNumber = (val: boolean): number => {
    return val ? 1 : 0
}

export const generateResponseMessage = (data: { msg?: string }, defaultMessage: string): string => {
    return propOr(defaultMessage, 'msg', data)
}

type GenerateTreeDataParams = {
    originData: DataNode[],
    isEnterprise: boolean,
    isAddingAgentGroup: boolean,
    isAddingAgent: boolean
}
export const generateTreeData = ({
    originData,
    isEnterprise,
    isAddingAgentGroup,
    isAddingAgent
}: GenerateTreeDataParams) => {
    const map = new Map()
    const relationshipMap = new Map()
    const length = originData.length
    for (let i = length - 1; i >= 0; i--) {
        const curr = originData[i]
        const {
            id,
            displayName,
            parentId,
            level,
            groupType
        } = curr
        if (!map.has(id)) {
            relationshipMap.set(id, {
                parentId,
                childrenIds: []
            })
            const isProjectToResolveEnterprise = (!isEnterprise && groupType === GROUP_TYPE.ENTERPRISE)
            const agentGroupDisabled = isAddingAgentGroup
                && (
                    level === AGENT_GROUP_DISABLED_LEVEL
                    || isProjectToResolveEnterprise
                    || checkIfUnallocatedGroup(displayName).flag
                )
            const agentDisabled = isAddingAgent && (
                id === ROOT_TREE_NODE.id
                || isProjectToResolveEnterprise
            )
            const disabled = agentGroupDisabled || agentDisabled

            map.set(id, {
                ...omit(['disabled'], curr),
                title: displayName,
                key: id,
                // 禁止选择的条件：
                //  (新增主机组前提下)
                //      1. 树的层级等于5
                //      2. 项目设置中新增主机组选择父级主机组的时候禁止选择企业级主机组
                //      3. 未授权项目组不禁用
                //  (新增主机前提下)
                //      1. 根节点不允许添加，禁用
                //      2. 项目设置中新增主机选择父级主机组的时候禁止选择企业级主机组
                //
                disabled,
                children: [],
                isLeaf: true
            })
        }
    }

    for (let i = length - 1; i >= 0; i--) {
        const curr = originData[i]
        const {
            parentId,
            id
        } = curr
        if (map.has(parentId)) {
            relationshipMap.get(parentId).childrenIds.unshift(id)
            map.get(parentId).children.unshift(map.get(id))
            map.get(parentId).isLeaf = false
        }
    }
    return {
        treeData: map.get(-1) ? [map.get(-1)] : [],
        relationshipMap
    }
}

export const generateRelationShipMap = (treeData) => {
    let relationMap = new Map()
    generateRelationShipMapSub(treeData, relationMap)
    return relationMap
}


function getParentIds(id, treeData) {
  // 查找父节点的
  const parentIds = [];
  let parentId = id;
  while (parentId !== null && parentId !== undefined) {
    parentIds.push(parentId);
    console.log(parentId, treeData.find((item) => item.id === parentId), 'parentId');
    const parentObject = treeData.find((item) => item.id === parentId)
    parentId = parentObject ? parentObject.parentId : null;
  }
  return parentIds;
}

export const fillterTreeData = (treeData, filterValue) => {
  const cloneTreeData = _.cloneDeep(treeData);

  // 如果筛选条件为空，返回原始数据
  if (!filterValue) {
    return {
      filterTreeData: cloneTreeData,
      defaultExpandedKeys: [-1]
    }
  }
  
  const newExpandedKeys = cloneTreeData
    .filter(item => {
      return item.displayName.indexOf(filterValue) > -1
    })
    .map(item => getParentIds(item.id, cloneTreeData)).flat();
  
  // 筛选后的数据
  const filterTreeData =  cloneTreeData.filter(item => {
    return newExpandedKeys.includes(item.id);
  })
  const defaultExpandedKeys = filterTreeData.map(item => item.id)
  return {
    filterTreeData,
    defaultExpandedKeys
  }
}

export const generateRelationShipMapSub = (treeData, relationMap) => {
    if (!treeData) {
        return
    }
    let length = treeData.length
    let index = 0
    while (index < length) {
        const {
            id,
            parentId,
            children = []
        } = treeData[index]
        if (relationMap.has(id)) {
            relationMap.get(id).childrenIds.unshift(children.map(child => child.id))
        } else {
            relationMap.set(id, {
                parentId,
                childrenIds: children.map(child => child.id)
            })
        }
        children.length && generateRelationShipMapSub(children, relationMap)

        index++
    }
}
export const checkIfUnallocatedGroup = (displayName) => {
    const flag = displayName === UNALLOCATED_GROUP_NAME.value
    return {
        flag,
        name: flag ? UNALLOCATED_GROUP_NAME.name : displayName
    }
}
export const omitChineseWords = targetString => {
    return targetString.replace(/[\u4e00-\u9fa5]+/g, '')
}
export const omitEnglishWords = targetString => {
    return targetString.replace(/[a-zA-Z]+/g, '')
}

export const generateGroupType = () => {
    const companyId = getCompanyId()
    const projectId = getSpaceId()
    const isEnterprise = isEmpty(projectId)
    const groupType = isEnterprise ? GROUP_TYPE.ENTERPRISE : GROUP_TYPE.PROJECT
    const groupName = isEnterprise ? companyId : projectId
    return {
        groupName,
        groupType,
        companyId,
        projectId,
        isEnterprise
    }
}

export const generateEncrypt = (str): string => {
    let encrypt = new JSEncrypt()
    encrypt.setPublicKey(PUBLIC_KEY)
    return encrypt.encrypt(str)
}

export const generateValidateRules = (rules: Rule[], disabled = false): Rule[] => {
    return disabled ? [] : rules
}

export function isPendingAction (action: AnyAction): action is PendingAction {
    return action.type.endsWith('/pending')
}

export function isRejectedAction (action: AnyAction): action is RejectedAction {
    return action.type.endsWith('/rejected')
}

export function isFulfilledAction (action: AnyAction): action is FulfilledAction {
    return action.type.endsWith('/fulfilled')
}

export const getDetail = (detail: AgentDetail, key: string): string => {
    return propOr(DEFAULT_STRING_VALUE, key, detail)
}

export const formatHourAndMinute = (timeStamp: number): string => {
    const date = new Date(timeStamp)
    const hours = `${date.getHours()}`.padStart(2, '0')
    const minutes = `${date.getMinutes()}`.padStart(2, '0')
    return `${hours}:${minutes}`
}

export const generateSeries = ({
    data,
    name = '',
    color = PRIMARY_COLOR,
    isStep
}: {
    data: StringOrNumber[],
    name?: string,
    color?: string
    isStep: boolean
}) => {
    const config = {
        name,
        type: 'line',
        stack: 'Total',
        data: data,
        smooth: true,
        // smoothMonotone: 'x',
        symbol: data.length === 1 ? 'circle' : 'none',
        lineStyle: { // 设置线条的style等
            normal: {
                color, // 折线线条颜色
            },
        },
        itemStyle: {
            // 设置线条上点的颜色（和图例的颜色）
            normal: {
                color
            },
        },
    }
    return isStep ? {
        ...config,
        step: 'start'
    } : config
}

export const autoProtocol = () => {
    let wsProtocol = 'ws://'
    if (window.location.protocol === 'https:') {
        wsProtocol = 'wss://'
    }
    return wsProtocol
}

export const hasValue = value => !(isNil(value) || isEmpty(value));

export const findMinAndMaxFromList = (list) => {
    let max = Number.MIN_SAFE_INTEGER
    let min = Number.MAX_SAFE_INTEGER
    const length = list.length
    for (let i = 0; i < length; i++) {
        const item = list[i]
        let transfer = item
        if (typeof item === 'string') {
            transfer = transfer - 0
        }
        max = max < transfer ? transfer : max
        min = min > transfer ? transfer : min
    }
    return [(min + max)/2, min,max]
}
