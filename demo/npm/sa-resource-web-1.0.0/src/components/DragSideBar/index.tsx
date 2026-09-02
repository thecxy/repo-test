import { useRef, ReactNode, createContext, useMemo } from 'react'
import { resizeWrapper, sideContainer, activeLine } from './index.less'
import { useSideResize } from './useSideResize'
import { MouseStatus } from './type'
import { CLOSE_SIDE_WIDTH } from '@src/constant'

export { MouseStatus } from './type'

type DragSideBarProps = {
    children: ReactNode;
    className?: string; // className
    defaultSideWidth?: number; // 默认的宽度
    maxSideWidth?: number;
    // 危险属性 慎用 如使用请自行处理好z-index层级关系
    unsafe?: {
        zIndex: number;
    };
    callback?: (open: boolean) => void;
    open: boolean; // 是否开启
    leftDistance?: number; // 当前组件距离左侧屏幕的距离 暂时传入处理了 会限制此组件的复用性 应该是组件内部递归计算 后续有机会再处理
    dragCloseInstance?: number; // 仅支持百分比小数 比例依照defaultSideWidth
};

type DragSideBarContextType = {
    width: number;
    mouseStatus: MouseStatus;
};

// 用context实现子组件取width的值
export const DragSideBarContext = createContext<DragSideBarContextType>({
    width: 0,
    mouseStatus: MouseStatus.UP
})

/**
 * 组件只提供横向拉伸功能，内部逻辑需要放在children内自行实现
 * 没有提供onResize事件供外部获取状态 实测使用onResize往外暴露值时拖动会很卡，所以暂时选用context往children内传递状态
 * 后续项目性能优化好了之后可以尝试添加onResize事件
 * 向外暴露两个状态  width: 当前宽度  mouseStatus: 鼠标事件状态 down 按下、move 移动中、up 抬起
 * callback 可以用来控制拖动到左侧时关闭整棵树，或者鼠标直接拖动打开整棵树，逻辑需要自行处理
 * open字段用来判断树是否打开,用来处理关闭与开启状态下拖拽组件默认的宽度
 */
const DragSideBar = ({
    children,
    className,
    defaultSideWidth = 240,
    unsafe,
    maxSideWidth,
    callback,
    open,
    leftDistance = 0,
    dragCloseInstance = 0.2
}: DragSideBarProps) => {
    const resizeLineRef = useRef<HTMLDivElement>(null)
    const sideRef = useRef<HTMLDivElement>(null)
    const defaultWidth = useMemo(() => {
        return open ? defaultSideWidth : CLOSE_SIDE_WIDTH
    }, [open, defaultSideWidth])
    const {
        sideWidth,
        mouseStatus
    } = useSideResize({
        resizeLineRef,
        defaultSideWidth,
        sideRef,
        maxSideWidth,
        callback,
        leftDistance,
        dragCloseInstance
    })
    return (
        <DragSideBarContext.Provider value={{
            width: sideWidth,
            mouseStatus
        }}>
            <div
                className={`${className} ${sideContainer}`}
                ref={sideRef}
                style={{
                    width: `${defaultWidth}px`,
                    zIndex: unsafe?.zIndex
                }}
            >
                {children}
                <div
                    ref={resizeLineRef}
                    className={`${resizeWrapper} ${mouseStatus !== MouseStatus.UP ? activeLine : null}`}
                />
            </div>
        </DragSideBarContext.Provider>
    )
}

DragSideBar.displayName = 'DragSideBar'

export default DragSideBar
