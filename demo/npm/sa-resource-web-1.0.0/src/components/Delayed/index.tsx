/**
 * 延迟加载组件
 */
import { useState, useEffect } from 'react'

type Props = {
    children: JSX.Element
    waitBeforeShow?: number
}

const Delayed = ({
    children,
    waitBeforeShow = 500
}: Props): JSX.Element | null => {
    const [isShown, setIsShown] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setIsShown(true)
        }, waitBeforeShow)
    }, [waitBeforeShow])

    return isShown ? children : null
}

export default Delayed
