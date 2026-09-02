/* eslint-disable */
// @ts-nocheck
import I18N from '@src/i18n'
import { Input } from 'antd'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  agentGroupTreeSliceNameSpace,
  updateSearchValue,
  selectTreeData
} from '@src/pages/Resource/components/AgentGroupTree/agentGroupTreeSlice'
import searchIcon from '@src/assets/search.png'
import { debounceWith500ms } from '@src/utils'



const { Search } = Input;


const SubTitle: React.FC = () => {

    const dispatch = useDispatch()
    const { searchValue } = useSelector((state: RootState) => state[agentGroupTreeSliceNameSpace])

    const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(updateSearchValue(e.target.value))
      debounceWith500ms((e) => {
        dispatch(selectTreeData(e.target.value))
      })(e)
  
    }

    return <div title="">
      <Input 
        value={searchValue}
        placeholder={I18N.SelectAll.index.placeholderQSR} 
        onChange={onSearch} 
        style={{ width: '100%',marginBottom: 8 }} 
        suffix={<img src={searchIcon} width={14} height={14} alt="search" />}
      />
    </div>
}

export default SubTitle
