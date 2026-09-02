import I18N from '@src/i18n'
import { PRIMARY_COLOR } from '@src/constant'

// 作业状态 0：待运行，1：运行中，2：成功，3：失败，4：取消，5：取消失败，6：超时,可用值:WAITING,RUNNING,SUCCESS,FAILED,CANCEL,CANCEL_FAILED,TIMEOUT
export enum AGENT_STATUS_VALUE {
    WAITING,
    RUNNING,
    SUCCESS,
    FAILED,
    CANCEL,
    CANCEL_FAILED,
    TIMEOUT
}

export const AGENT_STATUS = {
    [AGENT_STATUS_VALUE.WAITING]: {
        label: I18N.Task.constant.daiYunXing,
        color: PRIMARY_COLOR,
        bgColor: '#E2ECFF',

    },
    [AGENT_STATUS_VALUE.RUNNING]: {
        label: I18N.Task.constant.yunXingZhong,
        color: '#854800',
        bgColor: 'rgba(255, 139, 0, 0.3)',
    },
    [AGENT_STATUS_VALUE.SUCCESS]: {
        label: I18N.constant.constantWithReactFC.chengGong,
        color: '#00875A',
        bgColor: '#E2FFEE',
    },
    [AGENT_STATUS_VALUE.FAILED]: {
        label: I18N.constant.constantWithReactFC.shiBai,
        color: '#FF5630',
        bgColor: '#FFEBE5',
    },
    [AGENT_STATUS_VALUE.CANCEL]: {
        label: I18N.FormikComp.index.quXiao,
        color: '#909AAA',
        bgColor: '#E9EAEC',
    },
    [AGENT_STATUS_VALUE.CANCEL_FAILED]: {
        label: I18N.Task.constant.quXiaoShiBai,
        color: '#FF5630',
        bgColor: '#FFEBE5',
    },
    [AGENT_STATUS_VALUE.TIMEOUT]: {
        label: I18N.Task.constant.chaoShi,
        color: '#FF5630',
        bgColor: '#FFEBE5',
    }
}

export const TABS = {
    queue: {
        label: I18N.Task.constant.paiDuiZhongDeRen,
        key: AGENT_STATUS_VALUE.WAITING,
    },
    running: {
        label: I18N.Task.constant.yunXingZhongDeRen,
        key: AGENT_STATUS_VALUE.RUNNING,
    },
    completed: {
        label: I18N.Task.constant.yiWanChengDeRen,
        key: AGENT_STATUS_VALUE.SUCCESS,
    }
}

export enum EXECUTE_STATUS_VALUE {
//    1：待执行；2：执行中；3：执行失败；4：执行成功；5：执行暂停；
    WAITING = 1,
    RUNNING,
    FAILED,
    SUCCESS,
    PAUSE
}

export const EXECUTE_STATUS = {
    [EXECUTE_STATUS_VALUE.WAITING]: {
        label: I18N.Task.constant.daiYunXing,
        color: PRIMARY_COLOR,
        bgColor: '#E2ECFF',

    },
    [EXECUTE_STATUS_VALUE.RUNNING]: {
        label: I18N.Task.constant.yunXingZhong,
        color: '#854800',
        bgColor: 'rgba(255, 139, 0, 0.3)',
    },
    [EXECUTE_STATUS_VALUE.SUCCESS]: {
        label: I18N.ExecutiveList.constant.zhiXingChengGong,
        color: '#00875A',
        bgColor: '#E2FFEE',
    },
    [EXECUTE_STATUS_VALUE.FAILED]: {
        label: I18N.ExecutiveList.constant.zhiXingShiBai,
        color: '#FF5630',
        bgColor: '#FFEBE5',
    },
    [EXECUTE_STATUS_VALUE.PAUSE]: {
        label: I18N.ExecutiveList.constant.zhiXingZanTing,
        color: '#FF5630',
        bgColor: '#FFEBE5',
    }
}
