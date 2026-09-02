import { container, level1, level2, level3, nodeSkeleton, tagLoading, addLoading } from './index.less'
import { useMemo } from 'react'
import { IconAndTextSkeleton, IconSkeleton } from '@src/components/Skeleton'

type TreeSkeletonNode = {
    width?: string,
    level: number | string
}

const TreeSkeletonNode = ({ width = "100%", level }: TreeSkeletonNode) => {
    const levelName = useMemo(() => {
         // eslint-disable-next-line no-sparse-arrays
        const levels = [, level1, level2, level3];
        return levels[level as number]
    }, [level])

    return (
        <div className={`${nodeSkeleton} ${levelName}`}>
            <div style={{ width }}>
                <IconAndTextSkeleton paragraphWidth='100%' />
            </div>
            {
                level !== 'root' && <IconSkeleton shape='circle' className={tagLoading} />
            }
            <IconSkeleton shape='circle' className={tagLoading} />
            {
                level === 'root' && <IconSkeleton className={addLoading} />
            }
        </div>
    )
}

const TreeSkeleton = () => {
    return (
        <div className={container}>
            <TreeSkeletonNode width="80%" level="root" />
            {
                Object.keys([...Array(20)]).map((item, index) => {
                    return (
                        <TreeSkeletonNode key={`tree-${index}`} width="60%" level={1} />
                    )
                })
            }
        </div>
    )

}

export default TreeSkeleton