import { Button, ButtonProps } from 'antd'
import React from 'react'

const LinkButton = (props: ButtonProps) => {
    return <Button type={'link'} {...props}/>
}

export default LinkButton
