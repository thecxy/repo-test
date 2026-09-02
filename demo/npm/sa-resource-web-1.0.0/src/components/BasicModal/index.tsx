import { Modal, ModalProps } from 'antd'
import React from 'react'
import Iconfont from '@com/Iconfont'

const BasicModal: React.FC<ModalProps> = (props) => {
    const customProps = {
        closeIcon: <Iconfont type={'iconcross'} />,
        ...props,
    }
    return <Modal {...customProps} />
}

export default BasicModal
