import {useSelector} from 'react-redux'

export const useInstituteId = () => {
  const {instituteInfo} = useSelector((state) => state)
  return instituteInfo && instituteInfo._id
}

export const useFeeDiscount = () => {
  return useSelector((state) => state.feeDiscount)
}
