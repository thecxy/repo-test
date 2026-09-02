import { Col } from 'antd';
import { Skeleton } from '@src/components/Skeleton';

type ColSkeletonProps = {
    width?: string;
    colSpan?: number
}

const ColSkeleton = ({ width = "80%", colSpan }: ColSkeletonProps) => {
    return (
        <Col span={colSpan}>
            <Skeleton width={width} />
        </Col>
    )
}

export default ColSkeleton