/**
 * 主机详情/概要信息
 */
import React from 'react'
import I18N from '@src/i18n'
import { outlineContainer, cpuAndMemory, left, right, inner } from './index.less'
import EssentialInfo from '@src/pages/AgentDetail/Outline/EssentialInfo'
import { AgentDetail } from '@src/pages/Resource/resourceTypes'
import AgentConfig from './AgentConfig'
import ResourceStores from './ResourceStores'
import NetworkConfig from '@src/pages/AgentDetail/Outline/NetworkConfig'
import CPURate from '@src/pages/AgentDetail/Outline/CPURate'
import MemoryRate from '@src/pages/AgentDetail/Outline/MemoryRate'
import PublicNetworkBandwidth from '@src/pages/AgentDetail/Outline/PublicNetworkBandwidth'
import SystemIO from '@src/pages/AgentDetail/Outline/SystemIO'
import RecentOnlineTrajectory from '@src/pages/AgentDetail/Outline/RecentOnlineTrajectory'
import { Helmet } from 'react-helmet'
import { useMetaTitleName } from '@src/hooks/useMetaTitleName'

type OutlineProps = {
    currentAgentDetail: AgentDetail,
    loading: boolean
}
const Outline: React.FC<OutlineProps> = ({
    currentAgentDetail,
    loading
}) => {
    const metaTitle = useMetaTitleName()
    return <div className={outlineContainer}>
        <Helmet title={`${I18N.AgentDetail.index.gaiYao}${metaTitle}`}/>
        <div className={inner}>
            <div className={left}>
                {/* 主机信息 */}
                <EssentialInfo detail={currentAgentDetail} loading={loading}/>
                {/* Agent 配置 */}
                <AgentConfig detail={currentAgentDetail} loading={loading}/>
                {/* 存储资源 */}
                <ResourceStores detail={currentAgentDetail} loading={loading}/>
                {/* 近期上线轨迹 */}
                <RecentOnlineTrajectory detail={currentAgentDetail} loading={loading}/>
            </div>
            <div className={right}>
                <div className={cpuAndMemory}>
                    {/* CPU 利用率 */}
                    <CPURate detail={currentAgentDetail} loading={loading}/>
                    {/* 内存 利用率 */}
                    <MemoryRate detail={currentAgentDetail} loading={loading}/>
                </div>
                <div className={cpuAndMemory}>
                    {/* 公网带宽 */}
                    <PublicNetworkBandwidth detail={currentAgentDetail} loading={loading}/>
                    {/* 系统盘IO */}
                    <SystemIO detail={currentAgentDetail} loading={loading}/>
                </div>
                {/* 网卡配置 */}
                <NetworkConfig detail={currentAgentDetail} loading={loading}/>
            </div>
        </div>
    </div>
}

export default Outline
