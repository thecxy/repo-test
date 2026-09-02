import { container, circleNode } from './index.less';
import { CSSProperties, ReactNode } from 'react'

type SkeletonNodeType = {
  children?: ReactNode,
  style?: CSSProperties,
  className?: string,
  shape?: 'circle' | 'square'
}

const SkeletonNode = ({ children, style, className, shape }: SkeletonNodeType) => {
  return (
    <div style={style} className={`${container} ${shape === 'circle' ? circleNode : null} ${className}`}>
      {children}
    </div>
  );
};

export default SkeletonNode;
