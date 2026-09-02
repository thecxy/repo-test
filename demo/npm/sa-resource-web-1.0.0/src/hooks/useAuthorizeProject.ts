import { useDispatch, useSelector } from 'react-redux'

import {
    getAuthorizeProjects,
    selectAllAuthorizeProjects
} from '@src/globalSlice/authorizeProjects'

export const useAuthorizeProject = () => {
    const dispatch = useDispatch()
    const authorizeProjects = useSelector(selectAllAuthorizeProjects)
    const updateAuthorProjects = () => dispatch(getAuthorizeProjects())

    return {
        authorizeProjects,
        updateAuthorProjects
    }
}