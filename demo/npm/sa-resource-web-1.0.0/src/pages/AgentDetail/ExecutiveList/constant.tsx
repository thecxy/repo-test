import I18N from '@src/i18n'
import ReadyRun from '../../../statics/icons/readyrun.svg'// 未开始
import CloseCircle from '../../../statics/icons/closecircle.svg'// 执行失败
import CheckCircle from '../../../statics/icons/checkcircle.svg'// 初始化、执行成功
import Suspend from '../../../statics/icons/suspend.svg'// 执行暂停
import Warning from '../../../statics/icons/warning-Circle-Fill.svg'
import Iconfont from '../../../components/Iconfont'
import './index.less'

// 执行状态 1：待执行；2：执行中；3：执行失败；4：执行成功；5：执行暂停；
export const READY_RUN = {
    label: I18N.ExecutiveList.constant.daiZhiXing,
    icon: <ReadyRun/>,
    value: 1,
}
export const RUNNING = {
    label: I18N.ExecutiveList.constant.zhiXingZhong,
    icon: <Iconfont type={'iconrunning'} className={'running-icon'}/>,
    value: 2,
}
export const FAILED = {
    label: I18N.ExecutiveList.constant.zhiXingShiBai,
    icon: <CloseCircle/>,
    value: 3,
}
export const SUCCESS = {
    label: I18N.ExecutiveList.constant.zhiXingChengGong,
    icon: <CheckCircle/>,
    value: 4,
}
export const PAUSE = {
    label: I18N.ExecutiveList.constant.zhiXingZanTing,
    icon: <Suspend/>,
    value: 5,
}
export const IGNORE_ERROR = {
    label: I18N.ExecutiveList.constant.huLueCuoWu,
    icon: <Warning/>,
    value: 3,
    styleLabel: 6,
}
export const PASS = {
    label: I18N.ExecutiveList.constant.queRenTongGuo,
    icon: <CheckCircle/>,
    value: 4,
}
export const NOT_PASS = {
    label: I18N.ExecutiveList.constant.buTongGuo,
    icon: <CloseCircle/>,
    value: 3,
}

export const RUN_STATUSES = new Map([
    [READY_RUN.value, READY_RUN],
    [SUCCESS.value, SUCCESS],
    [RUNNING.value, RUNNING],
    [FAILED.value, FAILED],
    [PAUSE.value, PAUSE],
])

export const CONFIRM_RESULTS = {
    PASS: 1,
    NO_PASS: 2,
}
