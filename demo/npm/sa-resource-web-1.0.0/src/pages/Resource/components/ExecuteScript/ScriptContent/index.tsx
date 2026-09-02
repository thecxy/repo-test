/**
 * 脚本内容
 */
import React, { ChangeEventHandler, useCallback, useMemo, useRef, useEffect } from 'react'
import { Input, Tabs } from 'antd'
import screenFull from 'screenfull'

import {
    scriptContentContainer,
    fullScreenButton,
    noahTextarea
} from './index.less'
import { SCRIPT_TYPES, LINUX_BASH_KEY, WINDOWS_BASH_KEY } from '@src/constant'
import { ScriptContentType } from '@src/pages/Resource/resourceTypes'
import { useAgentDetailData } from '@src/pages/AgentDetail/hook'
import { useUuid } from '@src/pages/AgentDetail/hook'

const { TextArea } = Input
const { TabPane } = Tabs

type ScriptContentProps = {
    onChange?: (scriptContent: ScriptContentType) => void,
    value?: ScriptContentType,
    disabled: boolean
}
const ScriptContent: React.FC<ScriptContentProps> = ({
    onChange,
    // scriptLanguage,
    value = {
        scriptLanguage: SCRIPT_TYPES[0].key,
        scriptContents: ''
    },
    disabled,
}) => {
    const containerRef = useRef<AnyType>()


    /**
     * 获取agentDetail的主机类型操作系统类型。
     * 当时windows时，隐藏tabs的bash选项，并change默认值。
     * 在主机列表页没有选择某个主机时，hostType为undefined;
     */
    const agentDetail = useAgentDetailData();
    const hostType = agentDetail?.currentAgentDetail.type as 1 | 2 | undefined; // 操作系统类型：1.Windows 2.Linux
    const uuid = useUuid();
    const SCRIPT_TYPES_MAP = useMemo(() => {
      if(!uuid) {
        return SCRIPT_TYPES
      } else {
        const map = SCRIPT_TYPES.filter(item => {
          if(hostType === 1) {
            return item.key !== LINUX_BASH_KEY;
          } else if (hostType === 2) {
            return item.key !== WINDOWS_BASH_KEY;
          } else {
            return true;
          }
        })
        return map
      }
    }, [hostType,uuid])

    useEffect(() => {
      onChange?.({
        ...value,
        scriptLanguage: SCRIPT_TYPES_MAP[0].key
      })
    }, [SCRIPT_TYPES_MAP])
    

    const toggleFullScreen = useCallback(() => {
        if (screenFull.isEnabled) {
            screenFull.toggle(containerRef.current)
        }
    }, [])

    const handleChange = (scriptLanguage: string) => {
        // 脚本命令，切换脚本语言，不保留之前数据
        onChange?.({
            scriptLanguage,
            scriptContents: '',
        })
    }

    const triggerChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        onChange?.({
            scriptLanguage: value.scriptLanguage,
            scriptContents: e.target.value
        })
    }
    return (
        <div className={scriptContentContainer} ref={containerRef}>
            <Tabs
                activeKey={value.scriptLanguage}
                defaultActiveKey={value.scriptLanguage}
                tabBarStyle={{
                    padding: '0 10px',
                }}
                onChange={handleChange}
                tabBarExtraContent={(
                    <i
                        className={fullScreenButton}
                        onClick={toggleFullScreen}
                    />
                )}
            >
                {
                    SCRIPT_TYPES_MAP.map(({
                        tab,
                        key
                    }) => <TabPane
                        disabled={disabled}
                        tab={tab}
                        key={key}
                    />)
                }
            </Tabs>
            <TextArea
                className={noahTextarea}
                autoSize={{ minRows: 10 }}
                value={value?.scriptContents}
                onChange={triggerChange}
                bordered={false}
                disabled={disabled}
            />
        </div>
    )
}
export default ScriptContent
