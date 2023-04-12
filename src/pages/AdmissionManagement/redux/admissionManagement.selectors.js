import {useSelector} from 'react-redux'

const getSelector = (selector) => {
  return useSelector((state) => state.globalData[selector])
}

export const useInitiateCrmSettings = () => {
  return getSelector('initiateCrmSettings')
}

export const useAllSessionHierarchies = () => {
  return getSelector('allSessionHierarchies')
}

export const useAdmissionCrmSettings = () => {
  return getSelector('admissionCrmSettings')
}

export const useCrmInstituteHierarchy = (sessionId) => {
  const allSessionHierarchies = useAllSessionHierarchies()
  const admissionCrmSettings = useAdmissionCrmSettings()
  const currentSession =
    sessionId ?? admissionCrmSettings?.data?.enable_session?.session_id
  if (allSessionHierarchies?.data && currentSession) {
    return allSessionHierarchies?.data?.[currentSession] ?? null
  }
  return
}

export const useGetCurrentCoutryCode = () => {
  const {instituteInfo, countryList} = useSelector((state) => state)
  return (
    countryList?.find(
      (item) => item?.country === instituteInfo?.address?.country
    )?.isd_code || '91'
  )
}

export const useAdmissionCrmSettingsProgress = () => {
  return getSelector('admissionCrmSettingsProgress')
}

export const useUpdateAdmissionCrmSettings = () => {
  return getSelector('updateAdmissionCrmSettings')
}

export const useCrmPgKycStatus = () => {
  return getSelector('crmPgKycStatus')
}

export const admissionCrmAddLead = () => {
  return getSelector('addLead')
}

export const admissionCrmUpdateLead = () => {
  return getSelector('updateLead')
}

export const useAdmissionCrmUploadDocument = () => {
  return getSelector('admissionFormDocument')
}

export const useAdmissionTransactionList = () => {
  return getSelector('transactionList')
}

export const useLeadList = () => {
  return getSelector('leadList')
}

// export const useFollowupList = () => {
//   return getSelector('followupList')
// }

export const updateFollowups = () => {
  return getSelector('updateFollowups')
}

export const useAddUpdateFollowups = () => {
  return getSelector('addUpdateFollowups')
}

export const useApplicableFeeStructures = () => {
  return getSelector('leadApplicableFeeStructures')
}

export const useConfirmLeadAdmission = () => {
  return getSelector('confirmLeadAdmission')
}

export const getReceiptUrl = () => {
  return getSelector('getFeeReceiptUrl')
}

export const refreshtransactionStatus = () => {
  return getSelector('refreshTransactionStatus')
}

export const useLeadData = () => {
  return getSelector('leadData')
}

export const useFollowups = () => {
  return getSelector('getFollowups')
}

export const useLeadRecentActivity = () => {
  return getSelector('getLeadRecentActivity')
}

export const addFollowUps = () => {
  return getSelector('addFollowUps')
}

export const updateLeadStage = () => {
  return getSelector('updateLeadStage')
}

export const useFollowupList = () => {
  return getSelector('getFollowupList')
}

export const getReciept = () => {
  return getSelector('getReciept')
}

export const getTransactionListWithStatusSuccess = () => {
  return getSelector('getTransactionListWithStatusSuccess')
}

export const updateLeadStageFromLeadProfile = () => {
  return getSelector('updateLeadStageFromLeadProfile')
}

export const useCreatePaymentStatus = () => {
  return getSelector('admissionCrmOfflinePayment')
}

export const useSendSMS = () => {
  return getSelector('sendSMS')
}

export const useDeleteLead = () => {
  return getSelector('deleteLead')
}

export const useSyncAdmissionFee = () => {
  return getSelector('syncAdmissionFee')
}

export const printAdmissionForm = () => {
  return getSelector('printAdmissionForm')
}

export const printAdmissionFormForLead = () => {
  return getSelector('printAdmissionFormForLead')
}

export const useQrCodeUrl = () => {
  return getSelector('getQrCode')
}

export const useQrCodeImageUrl = () => {
  return getSelector('getQrCodeImage')
}
