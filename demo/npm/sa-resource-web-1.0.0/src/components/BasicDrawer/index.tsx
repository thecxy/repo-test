import { Drawer, DrawerProps } from 'antd'
import React from 'react'
import Iconfont from '@com/Iconfont'

const BasicDrawer: React.FC<DrawerProps> = (props) => {
    const customProps = {
        closeIcon: <Iconfont type={'iconcross'} />,
        ...props,
    }
    return <Drawer {...customProps} />
}

export default BasicDrawer
