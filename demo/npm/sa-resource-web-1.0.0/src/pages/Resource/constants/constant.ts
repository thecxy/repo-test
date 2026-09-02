import I18N from "@src/i18n";
import {
    AgentGroupOperationType,
    AgentOperationType,
    ListItem,
} from "../resourceTypes";
import {
    belongsGroup,
    operatingSystem,
} from "@src/pages/Resource/Home/Main/DataList/index.less";

export enum URLS {
    SERVICE_UNITS = "/sa/rest/v3/labels/types",
}

export type LIST_COLUMN_KEY =
    | "AGENT_NAME"
    | "HOST_NAME"
    | "AGENT_ID"
    | "BELONGS_GROUP"
    | "OPERATING_SYSTEM"
    | "CPU"
    | "MEMORY"
    | "STORAGE"
    | "IP"
    | "AGENT_DESCRIPTION"
    | "MAC_ADDRESS"
    | "AGENT_VERSION"
    | "CREATE_TIME"
    | "OPERATING";

export const LIST_COLUMNS: Record<LIST_COLUMN_KEY, ListItem> = {
    AGENT_NAME: {
        label: I18N.AgentInfoModal.index.zhuJiMingCheng,
        search: true,
        disabled: false,
        key: "AGENT_NAME",
        fixed: "left",
    },
    HOST_NAME: {
        disabled: false,
        label: "Hostname",
        search: false,
    },
    AGENT_ID: {
        disabled: true,
        label: I18N.constants.constant.zhuJiID,
        search: false,
    },
    BELONGS_GROUP: {
        disabled: false,
        label: I18N.constants.constant.suoShuZiYuanZu,
        search: false,
        className: belongsGroup,
    },
    OPERATING_SYSTEM: {
        disabled: false,
        label: I18N.Outline.EssentialInfo.caoZuoXiTong,
        search: true,
        className: operatingSystem,
    },
    CPU: {
        disabled: false,
        label: I18N.constants.constant.cPUHe,
        search: false,
        key: "CPU",
    },
    MEMORY: {
        disabled: false,
        label: I18N.constants.constant.neiCunG,
        search: false,
        key: "MEMORY",
    },
    STORAGE: {
        disabled: false,
        label: I18N.constants.constant.cunChuG,
        search: false,
        key: "STORAGE",
    },
    IP: {
        disabled: true,
        label: "IP",
        search: true,
    },
    AGENT_DESCRIPTION: {
        disabled: true,
        label: I18N.Home.Main.zhuJiMiaoShu,
        search: false,
    },
    MAC_ADDRESS: {
        disabled: true,
        label: I18N.constants.constant.mACDiZhi,
        search: false,
    },
    AGENT_VERSION: {
        disabled: true,
        label: I18N.constants.constant.aGENT,
        search: false,
    },
    CREATE_TIME: {
        disabled: true,
        label: I18N.constants.constant.chuangJianShiJian,
        search: false,
    },
    OPERATING: {
        disabled: false,
        label: I18N.FileSource.index.caoZuo,
        key: "OPERATING",
        fixed: "right",
        search: false,
        width: 100,
    },
};

// export type LIST_COLUMN_KEY = keyof typeof LIST_COLUMNS;

export const getDefaultColumnList = () => {
    const LIST_COLUMNS_LIST: ListItem[] = [];

    let key: LIST_COLUMN_KEY;
    for (key in LIST_COLUMNS) {
        const value = LIST_COLUMNS[key];
        LIST_COLUMNS_LIST.push({
            id: LIST_COLUMNS_LIST.length,
            key,
            label: value.label,
            value: value.label,
            search: value.search,
            fixed: value.fixed,
            disabled: value.disabled || false,
            width: value.width,
            className: value.className,
        });
    }
    return LIST_COLUMNS_LIST;
};

// agent 添加方式
export const ADD_AGENT_MODE = {
    SSH: {
        label: I18N.constants.constant.tongGuoSSH2,
        value: "SSH",
    },
    MANUAL: {
        label: I18N.constants.constant.shouDongAnZhuangTian,
        value: "MANUAL",
    },
};

export const RE_CONNECT_AGENT_MODE = {
    SSH: {
        label: I18N.constants.constant.tongGuoSSH,
        value: "SSH",
    },
    MANUAL: {
        label: I18N.constants.constant.shouDongAnZhuangZhong,
        value: "MANUAL",
    },
};

// 添加主机步骤
export enum ADD_AGENT_STEP {
    FIRST_STEP = 1,
    SECOND_STEP,
    THIRD_STEP,
}

// 添加主机第一步 三个阶段
export enum FIRST_STEP_PROGRESS {
    FIRST_PROGRESS = 1,
    SECOND_PROGRESS,
    THIRD_PROGRESS,
}

// 主机组操作(新建|查看|编辑|删除|拖拽)
export const AGENT_GROUP_OPERATION: AgentGroupOperationType = {
    ADD: {
        label: I18N.constants.constant.xinJian,
        value: "ADD",
    },
    VIEW: {
        label: I18N.constants.constant.chaKan,
        value: "VIEW",
    },
    EDIT: {
        label: I18N.constants.constant.bianJi,
        value: "EDIT",
    },
    DELETE: {
        label: I18N.constant.index.shanChu,
        value: "DELETE",
    },
    MOVETO: {
        label: I18N.constants.constant.yiDong,
        value: "MOVETO",
    },
    // 默认值，不做任何展示
    DEFAULT: {
        label: "DEFAULT",
        value: "DEFAULT",
    },
};

// 主机操作(新建|查看|编辑|删除|移动到)
export const AGENT_OPERATION: AgentOperationType = {
    ...AGENT_GROUP_OPERATION,
    RE_CONNECT: {
        label: I18N.ExtraAgentOperation.index.zhongLian,
        value: "RE_CONNECT",
    },
    REBOOT: {
        label: I18N.ExtraAgentOperation.index.zhongQi,
        value: "REBOOT",
    },
    SHUTDOWN: {
        label: I18N.constants.constant.guanBi,
        value: "SHUTDOWN",
    },
};

// 主机组树顶级节点
export const ROOT_TREE_NODE = {
    id: -1,
    name: "",
    createTime: -1,
    updateTime: -1,
    deleteStatus: -1,
    displayName: I18N.components.AddGroupModal.suoYouZhuJi,
    description: "",
    parentId: -1,
    sortIndex: 1,
    level: 0,
    childCount: 5,
    allocation: -1,
    groupType: -1,
    projectList: [],
    serviceUnitList: [],
    groupId: -1,
};

export enum AgentGroupLevel {
    ROOT,
    SECOND,
    THIRD,
    FOURTH,
    FIFTH,
}

export enum AGENT_GROUP_DELETE_TYPE {
    // 主机组相关主机处理：1彻底删除,2归还未分配
    COMPLETELY_DELETE = 1,
    RETURN_TO_UNALLOCATED,
}

export const ADD_AGENT_STEP_OR_PROGRESS_TITLE = {
    [ADD_AGENT_MODE.SSH.value]: {
        [ADD_AGENT_STEP.FIRST_STEP]: {
            title: I18N.Home.Main.tianXieZhuJiXin,
            [FIRST_STEP_PROGRESS.FIRST_PROGRESS]: {
                title: I18N.Home.Main.tianXieZhuJiXin,
            },
            [FIRST_STEP_PROGRESS.SECOND_PROGRESS]: {
                title: I18N.constants.constant.yuZhuJiJianLi,
            },
            [FIRST_STEP_PROGRESS.THIRD_PROGRESS]: {
                title: I18N.constants.constant.queRenZhuJiGui,
            },
        },
        [ADD_AGENT_STEP.SECOND_STEP]: {
            title: I18N.Home.Main.tianJiaZhuJiDao,
        },
        [ADD_AGENT_STEP.THIRD_STEP]: {
            title: I18N.Home.Main.wanCheng,
        },
    },
    [ADD_AGENT_MODE.MANUAL.value]: {
        [ADD_AGENT_STEP.FIRST_STEP]: {
            title: I18N.constants.constant.anZhuangAGE,
            [FIRST_STEP_PROGRESS.FIRST_PROGRESS]: {
                title: I18N.constants.constant.anZhuangAGE,
            },
            [FIRST_STEP_PROGRESS.SECOND_PROGRESS]: {
                title: I18N.constants.constant.yuZhuJiJianLi,
            },
            [FIRST_STEP_PROGRESS.THIRD_PROGRESS]: {
                title: I18N.constants.constant.queRenZhuJiGui,
            },
        },
        [ADD_AGENT_STEP.SECOND_STEP]: {
            title: I18N.Home.Main.tianJiaZhuJiDao,
        },
        [ADD_AGENT_STEP.THIRD_STEP]: {
            title: I18N.Home.Main.wanCheng,
        },
    },
};
