import { AGENT_TYPE } from '@src/constant'
import {
    agentNameSpace,
    getAgentList,
    getLabelList,
    updateType
} from '@src/pages/Resource/components/TargetServer/agentSlice'
import {
    useDispatch,
    useSelector
} from 'react-redux'
import { RootState } from '../store'

const useLabelAndAgents = () => {
    const dispatch = useDispatch()
    const {
        labelName,
        agentList,
        labelList,
        type,
        loading
    } = useSelector((state: RootState) => state[agentNameSpace])
    const fetchData = (type: AGENT_TYPE): void => {
        dispatch(getAgentList({
            type,
            agentName: labelName
        }))
        dispatch(getLabelList({
            labelName,
            type
        }))
    }
    const toggleType = (type: AGENT_TYPE) => {
        dispatch(updateType(type))
    }
    return {
        type,
        labelName,
        agentList,
        labelList,
        loading,
        fetchData,
        toggleType
    }
}

export default useLabelAndAgents
