import { RootState } from '@src/store'
import { updateAgentInfoVisible, updateVisible, webTerminalNameSpace } from '@com/WebTerminal/slice'
import { useDispatch, useSelector } from 'react-redux'

export const useWebTerminal = () => {
    const dispatch = useDispatch()
    const webTerminalData = useSelector((state: RootState) => state[webTerminalNameSpace])
    const toggleVisible = (visible: boolean) => {
        dispatch(updateVisible(visible))
    }
    const toggleAgentInfoVisible = (visible: boolean) => {
        dispatch(updateAgentInfoVisible(visible))
    }
    return {
        ...webTerminalData,
        toggleVisible,
        toggleAgentInfoVisible
    }
}
