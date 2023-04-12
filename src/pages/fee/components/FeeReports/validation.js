import {FEE_REPORTS_TEMPLATES} from '../../fees.constants'

export const validateReportDownloadButton = (
  reportType = '',
  {
    months,
    paymentModes = [],
    hierarchyIds,
    selectedInstalmentTimestamp,
    chequeStatus = [],
    masterCategoryIds,
    instituteStudentList,
  }
) => {
  let isValidationFail = false
  if (
    [FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_STUDENTWISE.value].includes(
      reportType
    ) &&
    (!instituteStudentList ||
      instituteStudentList.length === 0 ||
      !hierarchyIds ||
      Object.keys(hierarchyIds).length === 0 ||
      masterCategoryIds?.length === 0)
  ) {
    isValidationFail = true
  } else if (
    [
      FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_CLASSWISE.value,
      FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_SECTIONWISE.value,
      FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_DEPARTMENTWIS.value,
    ].includes(reportType) &&
    (!hierarchyIds ||
      Object.keys(hierarchyIds).length === 0 ||
      masterCategoryIds?.length === 0)
  ) {
    isValidationFail = true
  } else if (
    [FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_INSTALLMENTWISE.value].includes(
      reportType
    ) &&
    (selectedInstalmentTimestamp.length === 0 || masterCategoryIds.length === 0)
  ) {
    isValidationFail = true
  } else if (
    [FEE_REPORTS_TEMPLATES.FEE_COLLECTION_MONTH.value].includes(reportType) &&
    ((months && months.length === 0) ||
      paymentModes.length === 0 ||
      masterCategoryIds.length === 0)
  ) {
    isValidationFail = true
  } else if (
    [FEE_REPORTS_TEMPLATES.FEE_COLLECTION_DAILY.value].includes(reportType) &&
    ((months && months.length === 0) ||
      paymentModes.length === 0 ||
      masterCategoryIds.length === 0)
  ) {
    isValidationFail = true
  } else if (
    [
      FEE_REPORTS_TEMPLATES.FEE_COLLECTION_DEPARTMENTWISE.value,
      FEE_REPORTS_TEMPLATES.FEE_COLLECTION_CLASSWISE.value,
      FEE_REPORTS_TEMPLATES.FEE_COLLECTION_SECTIONWISE.value,
    ].includes(reportType) &&
    ((hierarchyIds && hierarchyIds.length === 0) ||
      paymentModes.length === 0 ||
      masterCategoryIds.length === 0)
  ) {
    isValidationFail = true
  } else if (
    [
      FEE_REPORTS_TEMPLATES.FEE_COLLECTION_FEETYPEWISE.value,
      FEE_REPORTS_TEMPLATES.FEE_COLLECTION_PAYMENTMODEWISE.value,
    ].includes(reportType) &&
    (paymentModes.length === 0 || masterCategoryIds.length === 0)
  ) {
    isValidationFail = true
  } else if (
    [FEE_REPORTS_TEMPLATES.FEE_MISC_CHEQUE_STATUS.value].includes(reportType) &&
    chequeStatus.length === 0
  ) {
    isValidationFail = true
  } else if (
    [FEE_REPORTS_TEMPLATES.FEE_MISC_ALL_TRANSACTIONS.value].includes(
      reportType
    ) &&
    (chequeStatus.length === 0 || paymentModes.length === 0)
  ) {
    isValidationFail = true
  }
  return isValidationFail
}
