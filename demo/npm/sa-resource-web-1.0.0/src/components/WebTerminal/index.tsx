/**
 * web terminal
 */
import I18N from '@src/i18n'
import React, { useEffect, useRef } from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { webTerminalContainer, terminalHeader, terminalBody } from './index.less'
import { useWebTerminal } from '@com/WebTerminal/hook'
import { WEB_TERMINAL_SOCKET_LOCAL, WEB_TERMINAL_SOCKET_PROD } from '@src/pages/Resource/constants/apis'
import urlJoin from 'url-join'
import { ERROR_MSG } from '@com/WebTerminal/constant'
import { ERROR_TYPE } from '@com/WebTerminal/types'
import { socketErrorNotice } from '@src/utils/utilsWithReactFC'
import { autoProtocol } from '@src/utils'
import { IS_PROD } from '@src/constant'
import IconFont from '@com/Iconfont'

const WebTerminal: React.FC = () => {
    const {
        toggleVisible,
        visible,
        webTerminalId,
        toggleAgentInfoVisible
    } = useWebTerminal()

    const termRef = useRef<Terminal>()
    const fitAddonRef = useRef<FitAddon>()
    const socketRef = useRef<WebSocket>()
    const terminalRef = useRef<AnyType>()

    const prompt = (term: Terminal) => {
        term.write('\r\n ')
        term.focus()
    }

    const isWindows = ['Windows', 'Win16', 'Win32', 'WinCE'].indexOf(navigator.platform) >= 0
    const initXterm = () => {
        const term = new Terminal({
            // rendererType: 'canvas', //渲染类型
            rendererType: 'dom', //渲染类型
            // rows, //行数
            // cols: 157, // 不指定行数，自动回车后光标从下一行开始
            convertEol: true, //启用时，光标将设置为下一行的开头
            // scrollback: 10, //终端中的回滚量
            disableStdin: false, //是否应禁用输入
            cursorStyle: 'underline', //光标样式
            cursorBlink: true, //光标闪烁
            theme: {
                foreground: '#FFF', //字体
                background: '#151723', //背景色
                cursor: 'help' //设置光标
            },
            allowProposedApi: true,
            windowsMode: isWindows,
            windowOptions: {
                // fullscreenWin: true,
                // refreshWin: true,
            },
            fontFamily: 'Fira Code, courier-new, courier, monospace',
        })
        const fitAddon = new FitAddon()
        term.loadAddon(fitAddon)
        fitAddonRef.current = fitAddon
        termRef.current = term
        term.onData(function (key: string) {
            socketRef.current?.send(key) //转换为字符串
        })

        terminalRef?.current && term.open(terminalRef.current)
        fitAddonRef.current.fit()
        term.onLineFeed(function () {
            // console.log('执行换行' + JSON.stringify(commandKey))
        })
        term.onKey(({
            domEvent,
            // key
        }: { key: string, domEvent: KeyboardEvent }) => {
            // @ts-ignore
            const printable = !domEvent.altKey && !domEvent.altGraphKey && !domEvent.ctrlKey && !domEvent.metaKey
            if (domEvent.keyCode === 13) {
                // prompt(term)
            } else if (domEvent.keyCode === 8) {
                // Do not delete the prompt
                // @ts-ignore
                if (term._core.buffer.x > 2) {
                    // term.write('\b \b')
                }
            } else if (printable) {
                // term.write(key)
            }
        })
    }
    const {
        ERROR_CONNECTION_INFORMATION,
        INFORMATION_DOES_NOT_EXIST
    } = ERROR_TYPE

    const host = IS_PROD ? window.location.host : '192.168.80.50:24006'
    const WEB_TERMINAL_SOCKET = IS_PROD ? WEB_TERMINAL_SOCKET_PROD : WEB_TERMINAL_SOCKET_LOCAL

    const initWebSocket = (uuid: string, term: Terminal) => {
        const socket = new WebSocket(urlJoin(autoProtocol(), host, WEB_TERMINAL_SOCKET.expand({ uuid })))
        socketRef.current = socket
        //连接打开事件
        socket.onopen = function () {
            // console.log('Socket 已打开')
        }
        //收到消息事件
        socket.onmessage = function (msg) {
            const { data } = msg
            if (data.indexOf(ERROR_CONNECTION_INFORMATION) !== -1) {
                socketErrorNotice(ERROR_MSG[ERROR_CONNECTION_INFORMATION].label, () => {
                    toggleVisible(false)
                    toggleAgentInfoVisible(true)
                })
            } else if (data.indexOf(INFORMATION_DOES_NOT_EXIST) !== -1) {
                socketErrorNotice(ERROR_MSG[INFORMATION_DOES_NOT_EXIST].label, () => {
                    toggleVisible(false)
                    toggleAgentInfoVisible(true)
                })
            } else {
                term.write(msg.data)//把接收的数据写到这个插件的屏幕上
            }
        }
        //连接关闭事件
        socket.onclose = function () {
            // console.log('Socket已关闭')
        }
        //发生了错误事件
        socket.onerror = function () {
            socketErrorNotice(I18N.WebTerminal.index.qingQueRenYongHu, () => {
                toggleVisible(false)
                toggleAgentInfoVisible(true)
            })
        }
    }

    // 暂时不删除，后期可能有用
    // const handleResize = () => {
    //     // document.cli
    //     // const height = screenFull.isFullscreen ? terminalRef.current?.clientHeight : 432
    //     // const width = screenFull.isFullscreen ? terminalRef.current?.clientWidth : 800
    //     const height = terminalRef.current?.clientHeight
    //     const width = terminalRef.current?.clientWidth
    //
    //     setClientWidth(width)
    //     // termRef.current?.resize(parseIntForDecimal(width / LETTER_WIDTH), parseIntForDecimal(height / LETTER_WIDTH))
    // }

    // const handleChange = () => {
    //     setIsFullScreen(screenFull.isFullscreen)
    // }
    // useEffect(() => {
    //     const width = fullScreenRef.current?.clientWidth
    //     const height = fullScreenRef.current?.clientHeight
    //     const rows = parseIntForDecimal(height / LETTER_HEIGHT)
    //     const finalRows = isFullScreen ? rows * 1.5 : 24
    //     termRef.current?.resize(parseIntForDecimal(width / LETTER_WIDTH), parseIntForDecimal(finalRows))
    // }, [isFullScreen])

    useEffect(() => {
        if (visible) {
            initXterm()
        } else {
            socketRef.current?.close()
            //销毁当前实例
            termRef.current?.dispose()
        }
    }, [visible])

    useEffect(() => {
        if (webTerminalId && visible) {
            initWebSocket(webTerminalId, termRef.current as Terminal)
        }
    }, [webTerminalId, termRef, visible])

    // useEffect(() => {
    //     screenFull.on('change', handleChange)
    // }, [])

    return <div className={webTerminalContainer} style={{display: visible ? 'flex' : 'none'}}>
        <div className={terminalHeader}>
            <span>{'Web Terminal'}</span>
            <IconFont type={'iconcross'} onClick={() => toggleVisible(false)}/>
        </div>
        <div className={terminalBody} ref={terminalRef}/>
    </div>
}

export default WebTerminal
