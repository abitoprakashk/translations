import {useSelector} from 'react-redux'

export const useInstituteId = () => {
  const {instituteInfo} = useSelector((state) => state)
  return instituteInfo && instituteInfo._id
}

export const useFeeTransactionCollection = () => {
  return useSelector((state) => state.feeTransactionCollection)
}

export const useBackdatedPaymentCollection = () => {
  return useSelector((state) => state.feeCollection.collectBackdatedPayment)
}
