import {useSelector} from 'react-redux'

export const useFeeFineSelector = () => {
  return useSelector((state) => state.feeFine)
}
