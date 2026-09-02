import React, { ReactNode } from 'react'
import ErrorIcon from './error.svg'
import {formErrorMsg} from './index.less'

type FormErrorMessageProps = {
    message: string | ReactNode
}
const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ message }) => {
    return <div className={formErrorMsg}>
        <ErrorIcon/>
        {message}
    </div>
}
export default FormErrorMessage
