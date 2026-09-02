import { Skeleton, SkeletonProps } from 'antd';
import SkeletonNode from '../SkeletonNode';
import { container } from './index.less';

interface CustomSkeletonProps extends SkeletonProps {
  rows?: number,
  width?: string
}

const CustomSkeleton = ({
  className,
  style,
  title = false,
  rows = 1,
  width = '100%',
  ...rest
}: CustomSkeletonProps) => {
  return (
    <div className={`${container} ${className}`} style={style}>
      <Skeleton title={title} paragraph={{ rows: rows, width: width }} active {...rest} />
    </div>
  );
};

CustomSkeleton.Button = Skeleton.Button;
CustomSkeleton.Input = Skeleton.Input;
CustomSkeleton.Node = SkeletonNode;
CustomSkeleton.Image = Skeleton.Image;

export default CustomSkeleton;
