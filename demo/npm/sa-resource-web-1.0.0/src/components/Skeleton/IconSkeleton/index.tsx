import { Skeleton } from 'antd';
import { loadingIcon } from './index.less';
import { CSSProperties } from 'react'

interface SkeletonType {
  width?: string,
  height?: string
  shape?: 'square' | 'circle',
  className?: string,
  style?: CSSProperties,
}

const IconSkeleton = ({
  shape = 'square',
  className,
  width = '16px',
  height = '16px',
  style,
}: SkeletonType) => {
  return (
    <Skeleton.Button
      active
      shape={shape}
      className={`${loadingIcon} ${className}`}
      style={{ width: width, minWidth: width, height: height, ...style }}
    />
  );
};

export default IconSkeleton;
