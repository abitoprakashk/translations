import {useSelector} from 'react-redux'

export const useStudentProfileWalletTabSelector = () => {
  return useSelector((state) => state.studentProfileFeeAndWalletTab.walletTab)
}

export const useStudentProfileWalletTabSummarySelector = () => {
  return useSelector(
    (state) => state.studentProfileFeeAndWalletTab.walletTab.walletSummary
  )
}

export const useStudentProfileWalletTabWalletRefundSelector = () => {
  return useSelector(
    (state) => state.studentProfileFeeAndWalletTab.walletTab.walletRefund
  )
}
