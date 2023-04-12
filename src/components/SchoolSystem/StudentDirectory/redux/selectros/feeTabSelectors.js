import {useSelector} from 'react-redux'

export const useStudentProfileFeeTabSelector = () => {
  return useSelector((state) => state.studentProfileFeeAndWalletTab.feeTab)
}

export const useStudentProfileFeeTabSummarySelector = () => {
  return useSelector(
    (state) => state.studentProfileFeeAndWalletTab.feeTab.summary
  )
}

export const useStudentProfileFeeTabPaymentHistorySelector = () => {
  return useSelector(
    (state) => state.studentProfileFeeAndWalletTab.feeTab.paymentHistory
  )
}

export const useStudentProfileFeeTabDiscountTillDateSelector = () => {
  return useSelector(
    (state) => state.studentProfileFeeAndWalletTab.feeTab.discountTilllDate
  )
}

export const useAddStudentAddOnFeesSelector = () => {
  return useSelector((state) => state.globalData.addStudentAddOnFees)
}
