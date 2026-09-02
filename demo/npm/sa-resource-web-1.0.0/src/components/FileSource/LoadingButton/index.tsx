/* eslint-disable */
// @ts-nocheck
import I18N from '@src/i18n'
import { LOADING_STATUS } from '@src/constant'
import { checking, uploading } from './index.less'

const Checking = () => {
    return <span className={checking}>{I18N.LoadingButton.index.jiJiangShangChuan}</span>
}
const Uploading = () => {
    return <span className={uploading}>{I18N.LoadingButton.index.shangChuanZhong}</span>
}

// 即将完成
const NearingCompletion = () => {
    return <span className={uploading}>{I18N.LoadingButton.index.jiJiangWanCheng}</span>
}

const LoadingButton = props => {
    const { uploadStatusByFrontEnd } = props
    const {
        STARTING,
        SUCCESS,
        UPLOADING,
        CHECKING
    } = LOADING_STATUS
    switch (uploadStatusByFrontEnd) {
    case STARTING:
    case CHECKING:
        return <Checking/>
    case UPLOADING:
        return <Uploading/>
    case SUCCESS:
        return <NearingCompletion/>
    }
}
export default LoadingButton
