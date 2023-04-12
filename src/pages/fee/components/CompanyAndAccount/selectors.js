import {useSelector} from 'react-redux'
import {GLOBAL_ACTIONS_COMPANY_ACCOUNT} from './companyAccConstants'

export const useCompanyAndAccountSelector = () => {
  return useSelector((state) => {
    let data = {}
    for (const key in GLOBAL_ACTIONS_COMPANY_ACCOUNT) {
      if (Object.hasOwnProperty.call(GLOBAL_ACTIONS_COMPANY_ACCOUNT, key)) {
        data[key] = state.globalData[key]
      }
    }
    return data
  })
}

export const useChangeReceiptAccountSelector = () => {
  return useSelector((state) => state.globalData.changeReceiptAccount)
}

export const useAccountChangeHistorySelector = () => {
  return useSelector((state) => state.globalData.accountChangeHistory)
}
