/**
 * 通过 SSH 安装 linux、 windows agent step one(essential information)
 */
import React from 'react'
import SSHFirstProgress from './FirstProgress'
import { firstStep } from './index.less'

const SSHFirstStep: React.FC = () => {
    return <div className={firstStep}>
        <SSHFirstProgress/>
    </div>
}

export default SSHFirstStep

