// 人工确认，通知方法
import I18N from '@src/i18n'
export const NOTICE_APPROACHES = {
    // 通知方式 1：邮件；2：短信；3：微信；4：站内通知
    EMAIL: {
        label: I18N.constant.index.youJian,
        value: 1,
        visible: true,
    },
    MESSAGE: {
        label: I18N.constant.index.duanXin,
        value: 2,
        visible: false,
        // visible: true,
    },
    WECHAT: {
        label: I18N.constant.index.weiXin,
        value: 3,
        visible: false,
    },
    STAND_INSIDE_LETTER: {
        label: I18N.constant.index.zhanNeiXin,
        value: 4,
        visible: false,
    },
}
// 运行环境              // runtimeEnv	运行环境 1：主机运行，2：容器运行		false   // integer
export const RUNNING_ENVIRONMENT = {
    AGENT: {
        label: I18N.constant.index.zhuJiYunXing,
        value: 1,
    },
    // 一期暂时不做
    CONTAINER: {
        disabled: true,
        label: I18N.constant.index.rongQiYunXing,
        value: 2,
    },
}

export const IS_PROD = process.env.NODE_ENV === 'production'

export const PROJECT_ROUTE = '_settings'

export const PUBLIC_ROUTE = 'sa_host'

export const PUBLIC_PATH = '/'

// common pagination
export const DEFAULT_PAGINATION = {
    // list: [],
    pageSize: 10,
    // current: 1,
    // total: 0,
    pageSizeOptions: [10, 20, 30, 50],
    showSizeChanger: true,
    showQuickJumper: true,
}

export const CONTAINER_DOM_ID = 'osc-sa-resource'

export enum REQUEST_METHODS {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete'
}

export enum REQUEST_TYPE {
    FORM_DATA = 'formData',
    BLOB = 'blob',
    JSON = 'json'
}

export const SYMBOL_FOR_ALL = '*'

export const DEFAULT_STRING_VALUE = '--'

export const COMMON_URL_PREFIX = IS_PROD ? '/sa_api' : '/api'

export const GLOBAL_URL_PREFIX = IS_PROD ? '/noah' : '/global'

export const SA_LOG_URL_PREFIX = IS_PROD ? '/opera_log_api' : '/logs'

export const SA_SERVER_PREFIX = IS_PROD ? '/sa_log' : '/sa_server'

export const NOAH_URL_PREFIX = IS_PROD ? '/api/noah' : '/noahs'

export const MANAGER_URL_PREFIX = IS_PROD ? '/sa_manage_api' : '/manager'

export const REQUEST_CODE = {
    SUCCESS: 200
}

export const SPLIT_SYMBOL = ','

export const MAX_DISPLAY_LENGTH = 3

// 服务端删除标识
export const DELETE_SYMBOL = -1

// 作业步骤类型
export const STEP_TYPES = {
    EXECUTE_SCRIPT: {
        label: I18N.constant.index.jiaoBenZhiXing,
        value: 1
    },
    FILE_DISTRIBUTION: {
        label: I18N.constant.index.wenJianFenFa,
        value: 2
    },
    MANUAL_CONFIRM: {
        label: I18N.constant.index.renGongQueRen,
        value: 3
    }
}

export const MILLI_SECOND_STEP = 1000
export const HOUR_STEP = 24
export const MINUTE_STEP = 60
export const MAGE_BYTE_SCALE = 1024

export const LOG_CONTENT_SEPARATOR = '\n'

export const PROMISE_STATUS = {
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected',
    PENDING: 'pending'
}

export enum TYPES_OF_FETCHING {
    'INIT' = 'INIT',
    'MORE' = 'MORE',
}

export const PAGE_SIZE_OF_NO_PAGINATION = 100000

export enum REQUEST_URL_TYPE {
    INTERNAL = 'INTERNAL',
    EXTERNAL = 'EXTERNAL'
}

export const MESSAGE_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning'
}

export const REQUEST_URL_TYPES = {
    INTERNAL: {
        label: 'INTERNAL',
        value: 'COMMON',
        prefix: COMMON_URL_PREFIX
    },
    EXTERNAL: {
        label: 'EXTERNAL',
        value: 'GLOBAL',
        prefix: GLOBAL_URL_PREFIX
    },
    LOG: {
        label: 'LOG',
        value: 'LOG',
        prefix: SA_LOG_URL_PREFIX
    },
    SA_SERVER: {
        label: 'SA_SERVER',
        value: 'SA_SERVER',
        prefix: SA_SERVER_PREFIX
    },
    NOAH: {
        label: 'NOAH',
        value: 'NOAH',
        prefix: NOAH_URL_PREFIX
    },
    MANAGER: {
        label: 'MANAGER',
        value: 'MANAGER',
        prefix: MANAGER_URL_PREFIX
    }
}

export const DEFAULT_SUCCESS_MESSAGE = I18N.constant.index.caoZuoChengGong

export const COMMON_EXEC_URL_PREFIX = '/rest/v1/cron-execute'

export const UPLOAD_URL_PREFIX = '/rest/v1/file/local/multipart-upload'

export const NOAH_SERVICE_UNIT_TYPE = 3

export const INTEGER_MAX = 600

export enum LAYOUTS {
    HORIZONTAL = 'horizontal',
    VERTICAL = 'vertical'
}

export enum AGENT_TYPE {
    WINDOWS = 1,
    LINUX
}

// 主机终端类型
export const AGENT_TERMINAL_TYPE = {
    LINUX: {
        label: 'Linux',
        value: AGENT_TYPE.LINUX,
        defaultPort: 22
    },
    WINDOWS: {
        label: 'Windows',
        value: AGENT_TYPE.WINDOWS,
        defaultPort: 23
    }
}

export const AUTHENTICATION_TYPES = {
    PASSWORD: {
        label: I18N.AgentInfoModal.index.miMa,
        value: 'password'
    }
}

export enum GROUP_TYPE {
    ENTERPRISE = 1,
    PROJECT
}

export enum AGENT_STATUS_ENUM {
    ONLINE,
    OFFLINE,
    DELETE,
    INSTALLING,
    ALL,
}

export const PRIMARY_COLOR = '#0C62FF'
export const SUCCESS_COLOR = '#3cb381'
export const ERROR_COLOR = '#ff5630'
export const WARNING_COLOR = '#fbac33'

// 当前主机状态 0：在线；1：离线；2：删除；3：安装中；
export const AGENT_STATUS = {
    [AGENT_STATUS_ENUM[AGENT_STATUS_ENUM.ALL]]: {
        label: I18N.Home.Main.quanBuZhuangTai,
        value: AGENT_STATUS_ENUM.ALL,
        color: '#bfbfbf'
    },
    [AGENT_STATUS_ENUM[AGENT_STATUS_ENUM.ONLINE]]: {
        label: I18N.constant.index.zaiXian,
        value: AGENT_STATUS_ENUM.ONLINE,
        color: SUCCESS_COLOR
    },
    [AGENT_STATUS_ENUM[AGENT_STATUS_ENUM.OFFLINE]]: {
        label: I18N.constant.index.liXian,
        value: AGENT_STATUS_ENUM.OFFLINE,
        color: '#bfbfbf'
    },
    [AGENT_STATUS_ENUM[AGENT_STATUS_ENUM.DELETE]]: {
        label: I18N.constant.index.shanChu,
        value: AGENT_STATUS_ENUM.DELETE,
        color: '#bfbfbf'
    },
    [AGENT_STATUS_ENUM[AGENT_STATUS_ENUM.INSTALLING]]: {
        label: I18N.constant.index.anZhuangZhong,
        value: AGENT_STATUS_ENUM.INSTALLING,
        color: WARNING_COLOR
    },
}

// 未分配主机组名
export const UNALLOCATED_GROUP_NAME = {
    value: 'allocation_label',
    name: I18N.constant.index.weiFenPeiZhuJi
}
// 最大主机组嵌套层级
export const AGENT_GROUP_DISABLED_LEVEL = 5

export const PUBLIC_KEY = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCfziOVDSSdt2da8u0UkLtWfIzk2d2MAHv2vBhA48dbxec9iSB+yGsFmqqTVXqVKSXCgiLLV14Aus+TM5ePAhLtIwvcNbq6RwgnlUNdjP1C7L2Agwbbc+Y7HJHRKlYGx0dr8wrlIpnunEhfET2Ziab4P1Zw+sNGJjE5tdLCnfPOXQIDAQAB'

export const DEFAULT_EXECUTOR_COUNT = -1

export enum AGENT_DETAIL_CATEGORY {
    CPU,
    MEMORY,
    DISK,
    BAND_WIDTH
}

export const SIDE_BAR_WIDTH = 270

export const UPDATE_TYPE_RADIOS = {
    AUTO: {
        value: 1,
        label: I18N.constant.index.ziDongShengJi,
    },
    MANUAL: {
        value: 2,
        label: I18N.constant.index.dingShiShengJi,
    }
}

// todo: 文案优化
export const UPDATE_STRATEGIES = {
    DEFAULT: {
        value: 1,
        label: I18N.constant.index.dengDaiShengJiWan,
        tooltip: I18N.constant.index.aGENT,
    }
}

export enum SCRIPT_TYPE_ENUM {
    IMPORT_SCRIPTS = 1,
    MANUAL_INPUT
}

// 脚本来源 脚本类型 1：脚本引用；2：手动录入
export const SCRIPTS_ORIGIN = {
    MANUAL_INPUT: {
        label: I18N.constant.index.shouDongLuRu,
        value: SCRIPT_TYPE_ENUM.MANUAL_INPUT,
        show: true,
    },
    IMPORT_SCRIPTS: {
        label: I18N.constant.index.jiaoBenYinRu,
        value: SCRIPT_TYPE_ENUM.IMPORT_SCRIPTS,
        show: true,
    },
}

// XXX 脚本语言类型，未来可以做成linux和windows的枚举的形式
export const LINUX_BASH_KEY = 'Linux Bash'
export const WINDOWS_BASH_KEY = 'Bat'
export const SCRIPT_TYPES = [
    {
        tab: 'Linux Bash',
        key: 'Linux Bash',
    },
    {
      tab: 'Bat',
      key: 'Bat',
    },
    {
        tab: 'Groovy',
        key: 'Groovy',
    },
    {
        tab: 'Python',
        key: 'Python',
    },
]

export enum SERVICE_UNIT {
    Pipe = 1,
    Deploy,
    Opera
}

export const LOADING_STATUS = {
    STARTING: 'STARTING',
    UPLOADING: 'UPLOADING',
    SUCCESS: 'SUCCESS',
    CHECKING: 'CHECKING',
    ERROR: 'ERROR',
}

// 上传文件状态
export const SUCCESS = {
    label: 'SUCCESS',
    value: 0,
}
export const ERROR = {
    label: 'error',
    value: 1,
}
export const LOADING = {
    label: 'LOADING',
    value: 2,
}
export const DELETED = {
    label: 'DELETED',
    value: -1,
}

// 文件来源类型
export const FILE_SOURCE_TYPE = {
    LOCAL: 1,
    SERVER: 2,
}

export const DEFAULT_FORMIK_VALUES = {
    type: STEP_TYPES.EXECUTE_SCRIPT.value,
    name: '',
    // about execute script
    runningEnvironment: RUNNING_ENVIRONMENT.AGENT.value,
    scriptOrigin: SCRIPTS_ORIGIN.MANUAL_INPUT.value,
    chooseScript: null, // number 类型
    scriptContents: '',
    targetResourceList: [],
    scriptLanguage: SCRIPT_TYPES[0].key,
    scriptParams: '',
    // 18. 脚本执行/文件分发，默认超时时间60秒
    timeoutValueForExecuteScript: 60,
    timeoutValueForFileDistribution: 60,
    timeoutValueForManualConfirm: 3,
    // about file distribution
    // 文件
    uploadLimitDisabled: true,
    // 后端单位kb, 接口提交需要前端转换
    uploadLimit: 0,
    downloadLimitDisabled: true,
    downloadLimit: 0,
    storageFileList: [],
    transmissionMode: 1,
    targetPath: '',

    // 人工确认 相关
    // 通知方式
    informWay: [NOTICE_APPROACHES.EMAIL.value],
    // 通知描述
    describes: '',
    // 通知人员
    informUserId: [],
}

// 传输模式
export const TRANSMISSION_MODE = {
    // 强制模式
    FORCE: {
        key: I18N.constant.index.qiangZhiMoShi,
        value: 1,
    },
    // 严谨模式
    STRICT: {
        key: I18N.constant.index.yanJinMoShi,
        value: 2,
    },
}

// @ts-ignore
export const UPDATE_FILE_STATUS = new Map([
    [SUCCESS.value, SUCCESS], [SUCCESS.label, SUCCESS],
    [ERROR.value, ERROR], [ERROR.label, ERROR],
    [LOADING.value, LOADING], [LOADING.label, LOADING],
    [DELETED.value, DELETED], [DELETED.label, DELETED],
])


// metaTitle 常量
export const APP_CODE = 'opera_01';
export const APP_DEFAULT_NAME = '资源管理 Opera';
export const ENTERPRISE_SETTING_NAME = '企业设置';


// Badge显示的最大个数 大于99显示99+
export const MAX_COUNT = 99

export const REGULAR_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export const DEFAULT_LOG_PAGE_SIZE = 1000

export const CLOSE_SIDE_WIDTH = 20

// one  对应左侧菜单宽度
export const COLLAPSED_STATUS_WIDTH = {
    OPEN: 240,
    CLOSE: 64
}
