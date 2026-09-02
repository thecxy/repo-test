/* eslint-disable */
// @ts-nocheck
import I18N from '@src/i18n'
import {retryButton} from '../index.less';

const RetryButton = ({fileKey, handleReUploadLocalFile}) => {
    return (
        <span
            onClick={() => handleReUploadLocalFile(fileKey)}
            className={retryButton}
        >{I18N.RetryButton.index.zhongShi}</span>
    );
};
export default RetryButton;
