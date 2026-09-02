import { RootState } from '@src/store'
import { useUuid } from '@src/pages/AgentDetail/hook'
import { executiveNameSpace, updateCurrentMonitorTimeIndex, updateExecuteDetailVisible } from '@src/pages/AgentDetail/ExecutiveList/executiveSlice'
import { useDispatch, useSelector } from 'react-redux'
import { updatePagination } from '@src/pages/Resource/resourceTableSlice'
import { MONITOR_TIME_INDEX } from './executiveTypes'

export const useRequestData = () => {
    const {
        pageSize,
        currentPage,
        manualRefresh,
    } = useSelector((state: RootState) => state[executiveNameSpace])
    const agentUuid = useUuid()

    return {
        pageSize,
        currentPage,
        current: currentPage,
        agentUuid,
        manualRefresh,
    }
}

export const useExecuteDetail = () => {
    const {
        currentExecute,
        executeDetailVisible,
    } = useSelector((state: RootState) => state[executiveNameSpace])
    const dispatch = useDispatch()
    const toggleExecuteDetailVisible = () => {
        dispatch(updateExecuteDetailVisible(!executeDetailVisible))
    }
    return {
        currentExecute,
        executeDetailVisible,
        toggleExecuteDetailVisible,
    }
}

export const usePagination = () => {
    const tableData = useSelector(
        (state: RootState) => state[executiveNameSpace]
    );
    const dispatch = useDispatch();
    const { total, pageSize, currentPage } = tableData;
    const onChange = (current: number, pageSize: number) => {
        dispatch(
            updatePagination({
                current,
                pageSize,
            })
        );
    };
    return {
        total,
        pageSize,
        current: currentPage,
        onChange,
    };
};

export const useTimeSelector = ()=>{
    const dispatch = useDispatch()
    const {
        currentMonitorTimeIndex,
        timeInterval
    } = useSelector((state: RootState) => state[executiveNameSpace])
    const toggleIndex=  (index: MONITOR_TIME_INDEX)=>{
        dispatch(updateCurrentMonitorTimeIndex(index))
    }
    return {
        currentMonitorTimeIndex,
        toggleIndex,
        timeInterval
    }
}
