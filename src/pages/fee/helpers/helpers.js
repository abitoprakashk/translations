import {ICON_CONSTANTS} from '@teachmint/krayon'
import axios from 'axios'
import {t} from 'i18next'
import {BACKEND_HEADERS, REACT_APP_API_URL} from '../../../constants'
import {getAmountFixDecimalWithCurrency} from '../../../utils/Helpers'
import {
  STEP_STATUS,
  DEPENDANCY_CASES,
  STEPS_IDS,
} from '../../user-profile/components/Student/studentConstants'
import {DELETE_UPDATE_STRUCTURE_ERROR_CODE_AND_MSG} from '../../user-profile/constants'
import {
  BACKDATED_PAYMENT_CSV_ERROR_HEADERS,
  BACKDATED_PAYMENT_CSV_ERROR_STATUS,
  BACKDATED_PAYMENT_CSV_ERROR_STATUS_IDS,
  collectFeeOptionsIds,
  FILE_UPLOAD_ERROR_STATS,
  FILE_UPLOAD_ERROR_STATS_IDS,
  INSTITUTE_HIERARCHY_TYPES,
  RECORDED_BY_EVENTS_TYPE_VALUE,
  UPLOAD_BACKDATED_PAYMENT_OPTION_VALUES,
} from '../fees.constants'

const getDepartments = (instituteHierarchy) => {
  return instituteHierarchy?.children.filter(
    (dept) => dept.type === INSTITUTE_HIERARCHY_TYPES.DEPARTMENT
  )
}

export function intializationOfSetting({funcs, params}) {
  let settings = params.settings
  if (settings) {
    let objKeys = Object.keys(settings)
    if (objKeys.length > 0) {
      let titleId = objKeys[0]
      let optionId = Object.keys(settings[titleId]).filter(
        (key) => key !== 'title' && key !== 'desc'
      )[0]
      funcs.setSelectedSettingSubCategory(optionId)
      funcs.handleActions(titleId, optionId)
    }
  }
}

export const getDepartmentsList = (instituteHierarchy) => {
  let departments = []
  if (getDepartments(instituteHierarchy)) {
    departments = getDepartments(instituteHierarchy)
  }
  return departments.map((dept) => {
    return {
      value: dept.id,
      label: dept.name,
    }
  })
}

// const getClassrooms = (instituteHierarchy, departmentId = '') => {
//   let clssrooms = []
//   if (departmentId.trim() !== '') {
//     getDepartments(instituteHierarchy)
//       .filter((dept) => dept.id === departmentId)
//       .map((dept) => {
//         return dept.children.map((std) => clssrooms.push(std))
//       })
//   } else {
//     getDepartments(instituteHierarchy).map((dept) => {
//       return dept.children.map((std) => clssrooms.push(std))
//     })
//   }
//   return clssrooms
// }

const getClassrooms = (instituteHierarchy, departmentId = '') => {
  let clssrooms = []
  let departments = getDepartments(instituteHierarchy)
  if (departmentId.trim() !== '') {
    departments = departments.filter((dept) => dept.id === departmentId)
  }
  departments.map((dept) => {
    return dept.children.map((std) => clssrooms.push(std))
  })
  return clssrooms
}

export const getClassesList = (instituteHierarchy, departmentId = '') => {
  return getClassrooms(instituteHierarchy, departmentId).map((cls) => {
    return {
      label: cls.name,
      value: cls.id,
    }
  })
}

export const getClassroomWithSection = (
  instituteHierarchy,
  classroomId = ''
) => {
  if (!instituteHierarchy) return []
  let sections = []

  let classrooms = getClassrooms(instituteHierarchy)

  if (classroomId.trim() !== '') {
    classrooms = classrooms.filter((cls) => cls.id === classroomId)
  }

  classrooms.map((cls) => {
    let classroom = {}
    classroom.classId = cls.id
    classroom.className = cls.name
    classroom.children = cls?.children
      .filter((sec) => sec.type === INSTITUTE_HIERARCHY_TYPES.SECTION)
      .map((sec) => {
        return {
          label: sec.name,
          value: sec.id,
        }
      })
    sections.push(classroom)
  })
  return sections
}

export const getSectionWithClassName = (
  instituteHierarchy,
  classroomId = ''
) => {
  if (!instituteHierarchy) return []
  let sections = []

  let classrooms = getClassrooms(instituteHierarchy)

  if (classroomId.trim() !== '') {
    classrooms = classrooms.filter((cls) => cls.id === classroomId)
  }

  classrooms.map((cls) => {
    cls?.children
      .filter((sec) => sec.type === INSTITUTE_HIERARCHY_TYPES.SECTION)
      .map((sec) => {
        sections.push({
          label: `${cls.name} ${sec.name}`,
          value: sec.id,
        })
      })
  })

  return sections
}

export const getNumbersOfDays = (number) => {
  return [...Array(number)].map((i, date) => {
    return {value: `${date + 1}`, label: date + 1}
  })
}

export const getStudentDetails = (studentsList, studentId) => {
  return studentsList
    ? studentsList.find((student) => student._id === studentId)
    : null
}

export const plusMoreInfo = ({string, number}) => {
  let stringToArr = string.split(',')

  if (stringToArr.length > number)
    return string.split(',').slice(0, number).join(', ')
  else return string
}

export const filterList = (
  listToFilter = [],
  studentsList = [],
  searchTerms = ''
) => {
  listToFilter.filter((row) => {
    if (searchTerms) {
      const student = getStudentDetails(studentsList, row.student_id)
      return !student
        ? false
        : student.name
            .toLowerCase()
            .replace('  ', ' ')
            .includes(searchTerms.toLowerCase()) ||
            student.phone_number.includes(searchTerms)
    }
    return true
  })
}

export const getRecoredByValueForEvents = (selectedVal) => {
  return selectedVal === collectFeeOptionsIds.BY_LUMPSUM_AMOUNT
    ? RECORDED_BY_EVENTS_TYPE_VALUE.LUMP_SUMP
    : RECORDED_BY_EVENTS_TYPE_VALUE.FEE_STRUCTURE
}

export const getValuesOfDiscountForEvents = (
  lumpsumAmountDiscount,
  adHocDiscountReasons
) => {
  let reasonText = lumpsumAmountDiscount?.reasonId
    ? adHocDiscountReasons.find(
        (item) => item.value === lumpsumAmountDiscount?.reasonId
      )?.label
    : ''
  return {
    discount_amount: lumpsumAmountDiscount?.discountAmount ?? '',
    reason: reasonText ?? '',
    remark: lumpsumAmountDiscount?.remarks,
  }
}

export const createInvalidBackdatedStats = (data = []) => {
  let invalidDataStats = {}
  data
    .filter((item) =>
      Object.keys(FILE_UPLOAD_ERROR_STATS_IDS).includes(item?.status)
    )
    .map((item) => {
      if (item?.status) {
        invalidDataStats[FILE_UPLOAD_ERROR_STATS[item?.status]?.key] =
          FILE_UPLOAD_ERROR_STATS[item?.status]?.key in invalidDataStats
            ? invalidDataStats[FILE_UPLOAD_ERROR_STATS[item?.status]?.key] + 1
            : 1
      }
    })
  return invalidDataStats
}

export const getCsvProgressStatus = (taskId = null) => {
  let url = `${REACT_APP_API_URL}fee-module/fee/task${
    taskId ? `?_id=${taskId}` : ''
  }`
  return axios({
    method: 'GET',
    url,
    headers: BACKEND_HEADERS,
  })
}

export const checkPreviousSessionDuesTransferStatus = () => {
  let url = `${REACT_APP_API_URL}fee-module/import/due/task/running`
  return axios({
    method: 'GET',
    url,
    headers: BACKEND_HEADERS,
  })
}

export const findInstituteStudent = (filteredInstituteStudents, item) => {
  return filteredInstituteStudents.find(
    (student) => student._id === item.student_id
  )
}

export const backDatedCsvErrorData = ({
  invalidData = [],
  filteredInstituteStudents = [],
  dataMapping = {},
  headers = [],
  extraData = {},
}) => {
  let data = invalidData.map((item) => {
    let findStudent = findInstituteStudent(filteredInstituteStudents, item)

    let statusText = ''
    if (item?.status) {
      statusText =
        item?.status ===
        BACKDATED_PAYMENT_CSV_ERROR_STATUS_IDS.AMOUNT_GREATER_THAN_DUE
          ? `${
              BACKDATED_PAYMENT_CSV_ERROR_STATUS[item?.status]
            } (${item?.due_applicable?.toFixed(2)})`
          : BACKDATED_PAYMENT_CSV_ERROR_STATUS[item?.status]
    }

    let fields = {
      ...findStudent,
      _id: item?.student_id,

      payment_mode: item.payment_mode,
      collection_date: item.collection_date,
      reference_number_for_cheque_and_dd:
        item.reference_number_for_cheque_and_dd,
      disbursal_date: item.disbursal_date,
      additional_notes: item.additional_notes,
      status: statusText,
    }

    if (
      extraData?.collectionModeOnResponse ===
      UPLOAD_BACKDATED_PAYMENT_OPTION_VALUES.LUMPSUM_AMOUNT
    ) {
      fields.fee_amount = item.amount
    } else if (
      extraData?.collectionModeOnResponse ===
      UPLOAD_BACKDATED_PAYMENT_OPTION_VALUES.INSTALLMENT_WISE
    ) {
      Object.values(extraData.feeTypeMap).forEach((category_master_id) => {
        fields[category_master_id] = `${item?.amount[category_master_id] ?? 0}`
      })
    }
    return fields
  })

  let newDataMapping = {
    ...dataMapping,
    'Payment Mode*': 'payment_mode',
    'Collection Date*': 'collection_date',
    'Reference Number (if Cheque/DD)': 'reference_number_for_cheque_and_dd',
    'Disbursal Date (if Cheque/DD)': 'disbursal_date',
    'Transaction Id (Optional)': 'additional_notes',
    'Upload Status': 'status',
  }

  if (
    extraData?.collectionModeOnResponse ===
    UPLOAD_BACKDATED_PAYMENT_OPTION_VALUES.LUMPSUM_AMOUNT
  ) {
    newDataMapping = {...newDataMapping, 'Fee Amount*': 'fee_amount'}
  } else if (
    extraData?.collectionModeOnResponse ===
    UPLOAD_BACKDATED_PAYMENT_OPTION_VALUES.INSTALLMENT_WISE
  ) {
    Object.keys(extraData.feeTypeMap).forEach((category_name) => {
      newDataMapping = {
        ...newDataMapping,
        [category_name]: extraData.feeTypeMap[category_name],
      }
    })
  }

  let newHeaders = [...headers, ...BACKDATED_PAYMENT_CSV_ERROR_HEADERS]

  return {
    newData: data,
    newDataMapping,
    newHeaders,
  }
}

export const openLinkInNewTab = (receiptUrl) => {
  fetch(receiptUrl)
    .then((r) => r.blob())
    .then((blobData) => {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blobData)
      link.download = receiptUrl.substr(receiptUrl.lastIndexOf('/') + 1)
      link.click()
    })
}

export const updateDeleteFeeStructureErrorCodeAndMsg = (
  errorCode = '',
  method = 'DELETE'
) => {
  let response
  if (errorCode && errorCode in DELETE_UPDATE_STRUCTURE_ERROR_CODE_AND_MSG) {
    response = DELETE_UPDATE_STRUCTURE_ERROR_CODE_AND_MSG[errorCode][method]
  }
  return response
}

export const deleteAllReceiptsConfirmationTransText = ({
  transactionCount,
  structureName,
}) => {
  {
    return [
      t('transactionDeleteConfirmationText', {
        transactionCount,
        structureName,
      }),
      t('receiptsWillBeDeletedpermanentlyText'),
    ]
  }
}

export const deleteAddOnFeeAllAReceiptsConfirmationTransText = ({
  transactionCount,
  feeType,
  studentName,
}) => {
  {
    return [
      t('addOnFeeDeleteConfirmationText', {
        transactionCount,
        feeType,
        studentName,
      }),
      t('receiptsWillBeDeletedpermanentlyText'),
    ]
  }
}

export const createAndDownloadCsvAppendAttr = ({
  fileName,
  text,
  appendAttr = null,
}) => {
  let a = document.createElement('a')
  a.href = 'data:attachment/csv,' + encodeURIComponent(text)
  a.target = '_blank'
  a.download = `${fileName}.csv`
  if (appendAttr) {
    document.querySelector(appendAttr).appendChild(a)
  } else {
    document.body.appendChild(a)
  }
  a.click()
  a.remove()
}

const getDependancySummaryInfo = (
  transactions,
  includeTransactions = true,
  includeStudents = true,
  includePaid = true
) => {
  const totalTransactions = transactions?.length || 0
  const totalStudents = new Set(
    transactions?.map((item) => item?.student_id) || []
  )?.size
  const totalPaid = transactions?.reduce((acc, b) => acc + b?.amount, 0)
  const summary = []

  if (includeTransactions) {
    summary.push({
      heading: totalTransactions,
      subText: t('transactions'),
      type: '',
      borderClassName: 'summaryInfoDefaultBorder',
    })
  }
  if (includeStudents) {
    summary.push({
      heading: totalStudents,
      subText: t('students'),
      type: '',
      borderClassName: 'summaryInfoDefaultBorder',
    })
  }
  if (includePaid) {
    summary.push({
      heading: getAmountFixDecimalWithCurrency(totalPaid),
      subText: t('paid'),
      type: 'success',
      borderClassName: '',
    })
  }

  return summary
}

export const getDependancyStepsData = ({
  DependancyCase = DEPENDANCY_CASES.DELETE,
  transactions,
  steps,
  typography = {
    header: t('onDeleteDependancyHeader'),
    summaryInfoText: t('onDeleteDependancySummaryInfoText'),
    deleteHeading: t('onDeleteDependancyDeleteHeading'),
  },
  includeTransactions = true,
  includeStudents = true,
  includePaid = true,
}) => {
  const summaryInfo = getDependancySummaryInfo(
    transactions,
    includeTransactions,
    includeStudents,
    includePaid
  )

  if (DependancyCase === DEPENDANCY_CASES.UPDATE) {
    typography.deleteHeading = t('onFeeStructureEditDependancyDeleteHeading')
  }

  let newSteps = {}
  Object.keys(steps).forEach((key) => {
    if (key === STEPS_IDS.STEP_1) {
      newSteps[key] = {
        ...steps[key],
        ...typography,
        status: STEP_STATUS.IN_PROGRESS,
        summaryInfo,
      }
    } else {
      newSteps[key] = {
        ...steps[key],
        status: STEP_STATUS.NOT_STARTED,
      }
    }
  })

  return newSteps
}

export const getDependancyStepsDataForPreviousSessionDues = ({
  DependancyCase = DEPENDANCY_CASES.DELETE,
  transactions,
  steps,
}) => {
  const summaryInfo = getDependancySummaryInfo(transactions)
  let typography = {
    header: t('onDeleteDependancyHeader'),
    summaryInfoText: t('previousSessionDueReceiptDependencySummaryInfo'),
    deleteHeading: t('previousSessionDueReceiptDependencyDeleteHeading'),
  }

  if (DependancyCase === DEPENDANCY_CASES.UPDATE) {
    typography.deleteHeading = t('onFeeStructureEditDependancyDeleteHeading')
  }

  let newSteps = {}
  Object.keys(steps).forEach((key) => {
    if (key === STEPS_IDS.STEP_1) {
      newSteps[key] = {
        ...steps[key],
        ...typography,
        status: STEP_STATUS.IN_PROGRESS,
        summaryInfo,
      }
    } else {
      newSteps[key] = {
        ...steps[key],
        status: STEP_STATUS.NOT_STARTED,
      }
    }
  })

  return newSteps
}

export const getStepsDataAfterDeleteReceipts = ({
  DependancyCase = DEPENDANCY_CASES.DELETE,
  steps = {},
  toasts = [],
}) => {
  let changeToProgress = false
  let newCurrentStep = null
  let newSteps = {}
  Object.keys(steps).forEach((key, idx) => {
    let item = steps[key]
    if (item.status === STEP_STATUS.IN_PROGRESS && item.index === idx) {
      changeToProgress = true
      newSteps[key] = {
        ...item,
        status: STEP_STATUS.COMPLETED,
      }
    } else if (changeToProgress) {
      changeToProgress = false
      newCurrentStep = key
      newSteps[key] = {
        ...item,
        status: STEP_STATUS.IN_PROGRESS,
      }
    } else {
      newSteps[key] = item
    }
  })

  let icon = {name: 'delete1', type: ICON_CONSTANTS.TYPES.ERROR}
  let stepMsg = [
    `${t('feeStructureWillBeRemoved')}.`,
    t('structureWillNotBeAppliedToSelectedFeeTypesAndStudentsAnymore'),
  ]
  let deleteHeading = t('deleteFeeStructure')

  if (DependancyCase === DEPENDANCY_CASES.UPDATE) {
    icon = {
      name: 'publishedWithChanges',
      type: ICON_CONSTANTS.TYPES.BASIC,
    }
    stepMsg = [
      `${t('newFeeStructureWillBePublished')}.`,
      t('newStructureWillBeAppliedToSelectedFeeTypesAndStudents'),
    ]
    deleteHeading = t('publishFeeStructureText')
  }

  if (newCurrentStep === STEPS_IDS.STEP_2) {
    newSteps[STEPS_IDS.STEP_2] = {
      ...newSteps[STEPS_IDS.STEP_2],
      deleteHeading,
      info: {
        icon,
        messages: stepMsg,
      },
    }
  }

  let newData = {
    steps: newSteps,
    buttonLoader: false,
    toasts: [
      {
        id: toasts ? +toasts?.length + 1 : 1,
        content: t('recieptsDeletedSuccessfully'),
        type: 'success',
      },
    ],
  }

  return newData
}

export const toastOnCloseClick = (setToastFn = () => {}, toastId) => {
  return setToastFn((prev) => {
    return {
      ...prev,
      toasts: prev.toasts.filter((item) => item.id !== toastId),
    }
  })
}

export const eventReasonFromErrorCode = (errorCode) => {
  switch (errorCode) {
    case 7095:
      return 'online_payment'
    case 7096:
      return 'fine_discount'
    case 7151:
      return 'fine_discount'
    case 7150:
      return 'online_payment'
    default:
      return ''
  }
}

export const getAddOnFeesStepsDataAfterDeleteReceipts = ({
  steps = {},
  toasts = [],
  feeTypeName,
  studentName,
}) => {
  let changeToProgress = false
  let newCurrentStep = null
  let newSteps = {}
  Object.keys(steps).forEach((key, idx) => {
    let item = steps[key]
    if (item.status === STEP_STATUS.IN_PROGRESS && item.index === idx) {
      changeToProgress = true
      newSteps[key] = {
        ...item,
        status: STEP_STATUS.COMPLETED,
      }
    } else if (changeToProgress) {
      changeToProgress = false
      newCurrentStep = key
      newSteps[key] = {
        ...item,
        status: STEP_STATUS.IN_PROGRESS,
      }
    } else {
      newSteps[key] = item
    }
  })

  let icon = {name: 'delete1', type: ICON_CONSTANTS.TYPES.ERROR}
  let stepMsg = [
    t('deleteAddOnFeeTypeConfirmationMessage', {feeTypeName, studentName}),
  ]
  let deleteHeading = t('deleteAddOnFeeType')

  if (newCurrentStep === STEPS_IDS.STEP_2) {
    newSteps[STEPS_IDS.STEP_2] = {
      ...newSteps[STEPS_IDS.STEP_2],
      deleteHeading,
      info: {
        icon,
        messages: stepMsg,
      },
    }
  }

  let newData = {
    steps: newSteps,
    buttonLoader: false,
    toasts: [
      {
        id: toasts ? +toasts?.length + 1 : 1,
        content: t('recieptsDeletedSuccessfully'),
        type: 'success',
      },
    ],
  }

  return newData
}

export function isInstituteInternational(country) {
  let isInternational = false
  if (country && country?.toLowerCase?.() !== 'india') {
    isInternational = true
  }

  return isInternational
}
