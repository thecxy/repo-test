import urlJoin from 'url-join'
import { parseTemplate } from 'url-template'
import { getCompanyId } from '@src/utils/getRouteIds'

/**
 * sa 相关
 */
export const ADD_AGENT_GROUP = '/rest/v1/label/' // 新增主机组
export const FETCH_AGENT_GROUPS = '/rest/v1/label/list' // 获取主机组列表
export const SORT_AGENT_GROUP = '/rest/v1/label/sort-index' // 主机组排序
export const DELETE_AGENT_GROUP = '/rest/v1/label/' //
export const FETCH_AGENT_GROUP = parseTemplate(urlJoin('/rest/v1/label/', '{id}')) // 获取主机组详情
export const FETCH_AGENTS = '/rest/v1/agent/infos' // 分页获取主机信息
export const FETCH_SERVICE_UNITS = '/rest/v1/service-unit/all' // 获取所有服务单元
export const DELETE_AGENTS = '/rest/v1/agent/' // 移除主机
export const INSTALL_AGENT_REMOTE = '/rest/v1/agent/install/ssh' // 远程安装主机第一步
export const REMOTE_LINK_TEST = '/rest/v1/agent/install/connect-test' // 服务器联通性测试
export const FETCH_REMOTE_INSTALL_STATUS = parseTemplate(urlJoin('/rest/v1/agent/install/status/', '{uuid}'))// /rest/v1/agent/install/status/{uuid} // 远程安装ssh 主机状态查询
export const FETCH_AGENT = parseTemplate(urlJoin('/rest/v1/agent', '{uuid}')) // /rest/v1/agent/{uuid} 获取主机详情
export const EDIT_AGENT = '/rest/v1/agent/' // 编辑主机(手动安装主机、远程安装主机第二步)
export const FETCH_MANUAL_SCRIPT = '/rest/v1/agent/install/script' // 获取手动安装主机脚本
export const FETCH_MANUAL_INSTALL_STATUS = parseTemplate(urlJoin('/rest/v1/agent/install/manual/status', '{uuid}')) // /rest/v1/agent/install/manual/status/{uuid} // 手动安装主机， 安装状态查询
export const PUT_MORE_CONFIG_FOR_REMOTE_INSTALL = '/rest/v1/agent/install/config' // 远程安装更多配置
// export const FETCH_AGENT_VERSION = '/rest/v1/agent-version' // 获取agent版本
export const FETCH_ONLINE_HISTORY = '/rest/v1/monitor/online-history' // 查询 agent 上线轨迹
export const FETCH_CPU_MONITOR = '/rest/v1/monitor/cpu'// CPU 监控信息
export const FETCH_MEMORY_MONITOR = '/rest/v1/monitor/memory'// 内存 监控信息
export const FETCH_DISK_MONITOR = '/rest/v1/monitor/disk'// 磁盘 监控信息
export const FETCH_DISK_LIST = '/rest/v1/monitor/disk-names'// 磁盘 列表
export const FETCH_BANDWIDTH_MONITOR = '/rest/v1/monitor/bandwidth'// 内存 监控信息
export const FETCH_MONITOR_SORT_RULE = '/rest/v1/monitor/get-sort-rule' // 获取排序规则
export const MODIFY_MONITOR_SORT = '/rest/v1/monitor/save-sort-rule' // 更新排序规则
export const FETCH_TASK_LIST = parseTemplate(urlJoin('/rest/v1/job/', '{agentUuid}')) // 根据uuid和任务状态查询主机任务列表
export const CANCEL_AGENT = '/rest/v1/job/cancel' // 任务取消接口
export const FETCH_EXECUTE_LIST = '/rest/v1/execute/by-agent/infos' // 获取执行任务列表
export const FETCH_EXECUTE_DETAIL = parseTemplate(urlJoin('/rest/v1/execute/', '{id}')) // 查看执行详情
export const CHECK_WHETHER_HAS_RUNNING_AGENT = '/rest/v1/job/run-and-wait/count' //查询指定主机当前等待或进行中的任务数
export const MOVE_AGENT = '/rest/v1/agent/label' // 批量修改主机所属分组
export const SHUTDOWN_URL = '/rest/v1/agent/poweroff' // 关机
export const REBOOT_URL = '/rest/v1/agent/reboot' // 重启
export const FETCH_SHUTDOWN_DELAY = '/rest/v1/agent/min-operate-delay' // 获取最小宽恕时间
export const FETCH_AGENT_BY_AGENT_GROUP = parseTemplate(urlJoin('/rest/v1/agent', '{labelId}', '/ids')) // 根据主机组id查询主机列表id
export const UPDATE_AGENT = '/rest/v1/agent/upgrade' //升级Agent接口
export const FETCH_UPDATE_CONFIG = '/rest/v1/upgrade/setting' // 查询升级配置
export const MODIFY_UPDATE_CONFIG = '/rest/v1/upgrade/setting' // 保存升级设置

// noah 相关
export const ENTIRELY_RE_EXECUTE = parseTemplate(urlJoin('/rest/v1/execute/retry/stage-trigger/', '{id}')) // 全部重新执行  //
export const NEGLECT_ERRORS = parseTemplate(urlJoin('/rest/v1/execute/error/ignore/', '{id}')) // 忽略错误 // /rest/v1/execute/error/ignore/{id}// /rest/v1/execute/retry/stage-trigger/{id}
export const RAPID_EXECUTION = '/rest/v1/execute/fast' // 快速执行
export const UPLOAD_URL_PREFIX = '/rest/v1/file/local/multipart-upload'
export const UPLOAD_LOCAL_BY_SEPARATING_CHECK = urlJoin(UPLOAD_URL_PREFIX, 'check')// 分片上传 检查
export const UPLOAD_LOCAL_BY_SEPARATING = UPLOAD_URL_PREFIX // 分片上传
export const UPLOAD_LOCAL_BY_SEPARATING_FINISHED = urlJoin(UPLOAD_URL_PREFIX, 'finish')// 分片上传完成
export const LOG_RENDER = 'sa-agent-log' //请求日志
// export const LOG_DOWNLOAD = parseTemplate(urlJoin('log/download/', '{logUuid}')) // 日志下载 // sa-agent-log/2da4af65-7701-4456-a0ec-0fb40f0ef61c
export const SAVE_WEB_TERMINAL_INFO = '/rest/v1/terminal/save-info' // 保存连接信息
export const WEB_TERMINAL_SOCKET_PROD = parseTemplate(urlJoin('/terminal/rest/v1/terminal/', '{uuid}')) // /terminal/rest/v1/terminal/{uuid}，域名方式连接，后面跟的是 /terminal/rest/v1/terminal
export const WEB_TERMINAL_SOCKET_LOCAL = parseTemplate(urlJoin('/rest/v1/terminal/', '{uuid}')) // /rest/v1/terminal/{uuid}，ip+port 方式连接，后面直接跟的是 /rest/v1/terminal
export const UPLOAD_FILE = '/rest/v1/file/upload' // 普通文件上传 文件大小最大支持10M
export const DELETE_FILE = parseTemplate(urlJoin('/rest/v1/file/', '{fileName}')) // /rest/v1/file/{fileName} 删除文件

export const GLOBAL_URLS = {
    GET_USERS: `/user/${getCompanyId()}/rest/v1/companies/${getCompanyId()}/users`,
    GET_SCRIPTS: '/script/rest/v1/script-tasks',
    // 新版查询主机接口
    LABELS: '/rest/v1/label/query-label',
    AGENTS: '/rest/v1/agent/query-agent',
    CURRENT_USER: `/user/${getCompanyId()}/rest/v1/companies/${getCompanyId()}/users/current/center`,
    FRONTENV: '/rest/v1/front-env/',
}
