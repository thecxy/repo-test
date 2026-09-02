import { useEffect } from 'react';
import {
    executeScriptNameSpace,
    getScripts, getExistPipe, updateDrawerDisabled,
    updateVisible
} from '@src/pages/Resource/components/ExecuteScript/slice'
import { useDispatch, useSelector } from 'react-redux'
import { TYPES_OF_FETCHING } from '@src/constant'
import { RootState } from '@src/store'
import { RapidExecutionParamsType } from '@src/pages/Resource/resourceTypes'
import { rapidExecution } from '@src/pages/Resource/components/FileDistribution/slice'

export const useScripts = () => {
    const {
        scripts,
        scriptEntities,
        exisPipe,
    } = useSelector((state: RootState) => state[executeScriptNameSpace])
    const dispatch = useDispatch()
    const updateScripts = () => {
        const params = {
            type: TYPES_OF_FETCHING.INIT,
            currentPage: 0
        }
        dispatch(getScripts(params))
    }
    
    const getEnv = () => {
      dispatch(getExistPipe())
    }

    return {
        scriptEntities,
        scripts,
        exisPipe,
        getEnv,
        updateScripts
    }
}

export const useExecuteScript = () => {
    const executeData = useSelector((state: RootState) => state[executeScriptNameSpace])
    const dispatch = useDispatch()
    const toggleVisible = (visible: boolean) => {
        dispatch(updateVisible(visible))
    }
    const handleRapidExecution = async (params: RapidExecutionParamsType) => {
        return dispatch(rapidExecution(params))
    }

    const toggleDrawerDisabled = (disabled: boolean) => {
        dispatch(updateDrawerDisabled(disabled))
    }

    return {
        ...executeData,
        toggleVisible,
        toggleDrawerDisabled,
        handleRapidExecution
    }
}
