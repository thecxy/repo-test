import { useMemo } from 'react';
import { Row, Col, Space } from 'antd';
import { Skeleton, IconSkeleton } from '@src/components/Skeleton';
import { title, contentContainer, operationCol, hostNameLoading, hostNameCon, tagLoading } from './index.less';
import { ColSkeleton } from '@src/components/Skeleton'

type TableSkeletonProps = {
  RowNum?: number
}
const TableSkeleton = ({ RowNum = 20 }: TableSkeletonProps) => {
  const rowEachArr = useMemo(() => {
    return Object.keys([...Array(RowNum)]);
  }, [RowNum]);

  return (
    <div style={{maxHeight: 900, overflow: 'hidden'}}>
      <Row className={title}>
        <Col span={4}>
          <div className={hostNameCon}>
            <IconSkeleton />
            <div className={hostNameLoading}>
              <Skeleton width="80%" />
            </div>
          </div>
        </Col>
        <ColSkeleton colSpan={4} />
        <ColSkeleton colSpan={3} />
        <ColSkeleton colSpan={7} />
        <ColSkeleton colSpan={1} />
        <ColSkeleton colSpan={1} />
        <ColSkeleton colSpan={1} />
        <ColSkeleton colSpan={3} />

      </Row>
      {rowEachArr.map((item, index) => (
        <Row
          key={`column-each-arr-${index}`}
          className={contentContainer}
        >
          <Col span={4}>
            <div className={hostNameCon}>
              <IconSkeleton />
              <div className={hostNameLoading}>
                <Skeleton width="90%" />
                <div className={tagLoading}>
                  <Skeleton width="90%"/>
                  <Skeleton width="90%"/>
                  <Skeleton width="90%"/>
                </div>
              </div>
            </div>

          </Col>
          <Col span={4}>
            <Skeleton width="90%"/>
          </Col>
          <Col span={3}>
            <Skeleton width="90%"/>
          </Col>
          <Col span={7}>
            <Skeleton width="90%"/>
          </Col>
          <Col span={1}>
            <IconSkeleton width="56px" height="56px" shape='circle' />
          </Col>
          <Col span={1}>
            <IconSkeleton width="56px" height="56px" shape='circle' />
          </Col>
          <Col span={1}>
            <IconSkeleton width="56px" height="56px" shape='circle' />
          </Col>
          <Col span={3} className={operationCol}>
            <Space style={{height: '100%'}}>
              <Skeleton.Button size="small" active />
              <Skeleton.Button size="small" active />
            </Space>
          </Col>
        </Row>
      ))}
    </div>
  );
};

export default TableSkeleton;
