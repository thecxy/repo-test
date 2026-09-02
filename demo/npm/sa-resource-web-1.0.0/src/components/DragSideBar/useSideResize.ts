import { useState, MutableRefObject, useEffect } from 'react'
import { MouseStatus } from './type'

type SideResizeProps = {
    resizeLineRef: MutableRefObject<HTMLDivElement | null>;
    defaultSideWidth: number;
    sideRef: MutableRefObject<HTMLDivElement | null>;
    maxSideWidth?: number;
    callback?: (open: boolean) => void;
    leftDistance?: number;
    dragCloseInstance?: number;
};

export const useSideResize = ({
    resizeLineRef,
    defaultSideWidth,
    maxSideWidth,
    sideRef,
    callback,
    leftDistance = 0,
    dragCloseInstance = 0.2
}: SideResizeProps): {
    sideWidth: number;
    mouseStatus: MouseStatus;
} => {
    const [sideWidth, setSideWidth] = useState(defaultSideWidth)
    const [mouseStatus, setMouseStatus] = useState(MouseStatus.UP)
    useEffect(() => {
        const mouseDown = () => {
            setMouseStatus(MouseStatus.DOWN)
            const defaultX = leftDistance + defaultSideWidth // 鼠标默认距离
            const resize = (e: MouseEvent) => {
                const maxWidth = maxSideWidth
                    ? maxSideWidth + leftDistance
                    : window.innerWidth * 0.5
                if (e.clientX > defaultX && e.clientX < maxWidth) {
                    if (sideRef?.current) {
                        window.requestAnimationFrame(() => {
                            (sideRef.current as HTMLDivElement).style.width = `${
                                e.clientX - leftDistance
                            }px`
                            callback && callback(true)
                            setSideWidth(e.clientX - leftDistance)
                            setMouseStatus(MouseStatus.MOVE)
                        })
                    }
                } else if (
                    e.clientX <=
                    leftDistance + defaultSideWidth * dragCloseInstance
                ) {
                    callback && callback(false)
                }
            }

            const resizeUp = () => {
                setMouseStatus(MouseStatus.UP)
                document.removeEventListener('mousemove', resize)
                document.removeEventListener('mouseup', resizeUp)
            }

            document.addEventListener('mousemove', resize)
            document.addEventListener('mouseup', resizeUp)
        }

        resizeLineRef.current?.addEventListener('mousedown', mouseDown)

        return () => {
            resizeLineRef.current?.removeEventListener('mousedown', mouseDown)
        }
    }, [
        defaultSideWidth,
        maxSideWidth,
        resizeLineRef,
        sideRef,
        sideWidth,
        callback,
        dragCloseInstance,
        leftDistance
    ])
    return {
        sideWidth,
        mouseStatus
    }
}
