import IconSkeleton from '../IconSkeleton';
import Skeleton from '../CustomSkeleton';
import { PLACEMENT } from './constants';
import { container, leftIcon, rightIcon } from './index.less';

type IconAndTextSkeletonType = {
  showIcon?: boolean,
  placement?: 'left' | 'right',
  shape?: 'square' | 'circle',
  paragraphWidth?: string
}

const IconAndTextSkeleton = ({
  showIcon = true,
  placement = 'left',
  shape,
  paragraphWidth = '80%',
}: IconAndTextSkeletonType) => {
  return (
    <div className={container}>
      {showIcon && placement === PLACEMENT.LEFT && (
        <IconSkeleton shape={shape} className={leftIcon} />
      )}
      <Skeleton title={false} width={paragraphWidth} />
      {showIcon && placement === PLACEMENT.RIGHT && (
        <IconSkeleton shape={shape} className={rightIcon} />
      )}
    </div>
  );
};
export default IconAndTextSkeleton;
