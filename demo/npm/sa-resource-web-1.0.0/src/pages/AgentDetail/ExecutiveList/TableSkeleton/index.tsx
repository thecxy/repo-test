import { useMemo } from 'react';
import { Row, Col } from 'antd';
import { Skeleton } from '@src/components/Skeleton';
import { title, contentContainer } from './index.less';
import { ColSkeleton } from '@src/components/Skeleton'

type TableSkeletonProps = {
  RowNum?: number
}
const TableSkeleton = ({ RowNum = 10 }: TableSkeletonProps) => {
  const rowEachArr = useMemo(() => {
    return Object.keys([...Array(RowNum)]);
  }, [RowNum]);

  return (
    <div>
      <Row className={title}>
        <ColSkeleton colSpan={3} />
        <ColSkeleton colSpan={3} />
        <ColSkeleton colSpan={8} />
        <ColSkeleton colSpan={3} />
        <ColSkeleton colSpan={3} />
        <ColSkeleton colSpan={2} />
      </Row>
      {rowEachArr.map((item, index) => (
        <Row
          key={`column-each-arr-${index}`}
          className={contentContainer}
        >
          <Col span={3}>
            <Skeleton width="90%"/>
          </Col>
          <Col span={3}>
            <Skeleton width="90%"/>
          </Col>
          <Col span={8}>
            <Skeleton width="90%"/>
          </Col>
          <Col span={3}>
            <Skeleton width="90%"/>
          </Col>
          <Col span={3}>
            <Skeleton width="90%"/>
          </Col>
          <Col span={2}>
              <Skeleton width="90%"/>
          </Col>
        </Row>
      ))}
    </div>
  );
};

export default TableSkeleton;
