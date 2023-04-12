import {DateTime} from 'luxon'
import {FEE_REPORTS_TEMPLATES, paymentStatusLabels} from '../../fees.constants'
import {
  getClassesList,
  getDepartmentsList,
  getSectionWithClassName,
} from '../../helpers/helpers'

const formatTransactionDate = (timestamp) => {
  return DateTime.fromSeconds(timestamp).toFormat('dd-MM-yyyy')
}

export const getAllTransactionDateRange = (payload) => {
  return {
    allTransactions: 'All Transactions from',
    dateRange:
      formatTransactionDate(payload.meta.date_range.start_date) +
      ' to ' +
      formatTransactionDate(payload.meta.date_range.end_date),
  }
}

export const getSelectedPaymentModes = (payload) => {
  return {
    selectedPaymentMode: 'Selected Payment Mode',
    paymentModes:
      Object.keys(paymentStatusLabels).length ===
      payload.meta.payment_modes.length
        ? 'All'
        : payload.meta.payment_modes
            .map((mode) => {
              return paymentStatusLabels[mode].actualLabel
            })
            .join(', '),
  }
}

const getTotalCollectedAmount = (data) => {
  return [
    {},
    {
      totalCollection: 'Total Amount',
      amount: data.reduce((sum, {collected}) => sum + collected, 0).toFixed(2),
    },
    {},
  ]
}

const getReportDetails = (response, payload) => {
  let reportDetails = [{}]
  if (
    payload.report_type === FEE_REPORTS_TEMPLATES.FEE_COLLECTION_MONTH.value
  ) {
    reportDetails.push(getSelectedPaymentModes(payload))
  } else if (
    payload.report_type ===
    FEE_REPORTS_TEMPLATES.FEE_COLLECTION_PAYMENTMODEWISE.value
  ) {
    reportDetails.push(getAllTransactionDateRange(payload))
  } else {
    reportDetails.push(getAllTransactionDateRange(payload))
    reportDetails.push(getSelectedPaymentModes(payload))
  }
  reportDetails.push(...getTotalCollectedAmount(response.data))
  return reportDetails
}

export const getCategoryBreakupData = (categoryBreakdownArr) => {
  let categoryBreakup = {}
  let columnNumber = 1
  categoryBreakdownArr.forEach((object) => {
    categoryBreakup[`column${columnNumber++}`] = `${object.collected.toFixed(
      2
    )}`
    categoryBreakup[`column${columnNumber++}`] = `${object.pending.toFixed(2)}`
    categoryBreakup[`column${columnNumber++}`] = `${object.total.toFixed(2)}`
  })

  return categoryBreakup
}

export const getCategoryStructureColumns = (selectedFeeTypes, feeTypeList) => {
  let columnNumber = 1
  let structureColumns = {}
  let structureSubColumns = {}

  selectedFeeTypes.forEach((element) => {
    let selectedFeeTypesObject = feeTypeList.find((ele) => ele._id === element)

    structureColumns[`column${columnNumber}`] = selectedFeeTypesObject.name
    structureSubColumns[`column${columnNumber}`] = 'Amount'
    columnNumber++

    structureColumns[`column${columnNumber}`] = selectedFeeTypesObject.name
    structureSubColumns[`column${columnNumber}`] = 'Pending Cheque & DD'
    columnNumber++

    structureColumns[`column${columnNumber}`] = selectedFeeTypesObject.name
    structureSubColumns[`column${columnNumber}`] =
      'Total Amount Paid (including pending cheque & DD) by Student'
    columnNumber++
  })
  return {structureColumns, structureSubColumns}
}

export const generateFeeCollectionMonthWiseReport = (
  response,
  metaData,
  {payload}
) => {
  const {feeTypeList, reportAction} = metaData
  let {structureColumns, structureSubColumns} = payload.meta.category_breakdown
    ? getCategoryStructureColumns(
        payload?.meta?.category_master_ids,
        feeTypeList
      )
    : ({}, {})
  if (!reportAction)
    return [
      ...response.data.map((monthData) => {
        return {
          month: monthData._id,
          amountCollected: monthData.collected.toFixed(2),
          amountAwaiting: monthData.pending.toFixed(2),
          totalAmount: monthData.total.toFixed(2),
        }
      }),
    ]
  return [
    ...getReportDetails(response, payload),
    payload.meta.category_breakdown
      ? {
          month: '',
          amountCollected: 'Total',
          amountAwaiting: 'Total',
          totalAmount: 'Total',
          ...structureColumns,
        }
      : {},
    {
      month: 'Month',
      amountCollected: 'Amount',
      amountAwaiting: 'Pending Cheque & DD',
      totalAmount:
        'Total Amount Paid (including pending cheque & DD) by Student',
      ...structureSubColumns,
    },
    ...response.data.map((monthData) => {
      let categoryBreakup = payload.meta.category_breakdown
        ? getCategoryBreakupData(monthData.category_breakdown)
        : {}

      return {
        month: monthData._id,
        amountCollected: monthData.collected.toFixed(2),
        amountAwaiting: monthData.pending.toFixed(2),
        totalAmount: monthData.total.toFixed(2),
        ...categoryBreakup,
      }
    }),
  ]
}
export const generateFeeCollectionDayWiseReport = (
  response,
  metaData,
  {payload}
) => {
  const {feeTypeList, reportAction} = metaData
  let {structureColumns, structureSubColumns} = payload.meta.category_breakdown
    ? getCategoryStructureColumns(
        payload?.meta?.category_master_ids,
        feeTypeList
      )
    : ({}, {})
  if (!reportAction)
    return [
      ...response.data.map((monthData) => {
        return {
          day: monthData._id,
          amountCollected: monthData.collected.toFixed(2),
          amountAwaiting: monthData.pending.toFixed(2),
          totalAmount: monthData.total.toFixed(2),
        }
      }),
    ]
  return [
    ...getReportDetails(response, payload),
    payload.meta.category_breakdown
      ? {
          day: '',
          amountCollected: 'Total',
          amountAwaiting: 'Total',
          totalAmount: 'Total',
          ...structureColumns,
        }
      : {},
    {
      day: 'Day',
      amountCollected: 'Amount',
      amountAwaiting: 'Pending Cheque & DD',
      totalAmount:
        'Total Amount Paid (including pending cheque & DD) by Student',
      ...structureSubColumns,
    },
    ...response.data.map((monthData) => {
      let categoryBreakup = payload.meta.category_breakdown
        ? getCategoryBreakupData(monthData.category_breakdown)
        : {}

      return {
        day: monthData._id,
        amountCollected: monthData.collected.toFixed(2),
        amountAwaiting: monthData.pending.toFixed(2),
        totalAmount: monthData.total.toFixed(2),
        ...categoryBreakup,
      }
    }),
  ]
}

export const generateFeeCollectionDepartmentWiseReport = (
  response,
  metaData,
  {payload}
) => {
  const departments = {}
  const {feeTypeList, reportAction} = metaData
  let {structureColumns, structureSubColumns} = payload.meta.category_breakdown
    ? getCategoryStructureColumns(
        payload?.meta?.category_master_ids,
        feeTypeList
      )
    : ({}, {})
  getDepartmentsList(metaData.instituteHierarchy).forEach((department) => {
    departments[department.value] = department.label
  })
  if (!reportAction)
    return [
      ...response.data.map((deptData) => {
        return {
          noOfStudents: deptData?.student_count,
          departmentName: departments[deptData._id] ?? '',
          amountCollected: deptData.collected.toFixed(2),
          amountAwaiting: deptData.pending.toFixed(2),
          totalAmount: deptData.total.toFixed(2),
        }
      }),
    ]
  return [
    ...getReportDetails(response, payload),
    payload.meta.category_breakdown
      ? {
          departmentName: '',
          amountCollected: 'Total',
          amountAwaiting: 'Total',
          totalAmount: 'Total',
          ...structureColumns,
        }
      : {},
    {
      departmentName: 'Department',
      noOfStudents: 'Number of Students',
      amountCollected: 'Amount',
      amountAwaiting: 'Pending Cheque & DD',
      totalAmount:
        'Total Amount Paid (including pending cheque & DD) by Student',
      ...structureSubColumns,
    },
    ...response.data.map((deptData) => {
      let categoryBreakup = payload.meta.category_breakdown
        ? getCategoryBreakupData(deptData.category_breakdown)
        : {}
      return {
        departmentName: departments[deptData._id] ?? '',
        noOfStudents: deptData?.student_count,
        amountCollected: deptData.collected.toFixed(2),
        amountAwaiting: deptData.pending.toFixed(2),
        totalAmount: deptData.total.toFixed(2),
        ...categoryBreakup,
      }
    }),
  ]
}

export const generateFeeCollectionClassWiseReport = (
  response,
  metaData,
  {payload}
) => {
  const classes = {}
  const {feeTypeList, reportAction} = metaData
  getClassesList(metaData.instituteHierarchy).forEach((classObj) => {
    classes[classObj.value] = classObj.label
  })
  let {structureColumns, structureSubColumns} = payload.meta.category_breakdown
    ? getCategoryStructureColumns(
        payload?.meta?.category_master_ids,
        feeTypeList
      )
    : ({}, {})
  if (!reportAction)
    return [
      ...response.data.map((classData) => {
        return {
          className: classes[classData._id] ?? '',
          noOfStudents: `${classData.student_count}`,
          amountCollected: classData.collected.toFixed(2),
          amountAwaiting: classData.pending.toFixed(2),
          totalAmount: classData.total.toFixed(2),
        }
      }),
    ]
  return [
    ...getReportDetails(response, payload),
    payload.meta.category_breakdown
      ? {
          className: '',
          noOfStudents: '',
          amountCollected: 'Total',
          amountAwaiting: 'Total',
          totalAmount: 'Total',
          ...structureColumns,
        }
      : {},
    {
      className: 'Class',
      noOfStudents: 'No of Students',
      amountCollected: 'Amount',
      amountAwaiting: 'Pending Cheque & DD',
      totalAmount:
        'Total Amount Paid (including pending cheque & DD) by Student',
      ...structureSubColumns,
    },
    ...response.data.map((classData) => {
      let categoryBreakup = payload.meta.category_breakdown
        ? getCategoryBreakupData(classData.category_breakdown)
        : {}
      return {
        className: classes[classData._id] ?? '',
        noOfStudents: `${classData.student_count}`,
        amountCollected: classData.collected.toFixed(2),
        amountAwaiting: classData.pending.toFixed(2),
        totalAmount: classData.total.toFixed(2),
        ...categoryBreakup,
      }
    }),
  ]
}

export const generateFeeCollectionSectionWiseReport = (
  response,
  metaData,
  {payload}
) => {
  const sections = {}
  const {feeTypeList, reportAction} = metaData
  getSectionWithClassName(metaData.instituteHierarchy).forEach((section) => {
    sections[section.value] = section.label
  })
  let {structureColumns, structureSubColumns} = payload.meta.category_breakdown
    ? getCategoryStructureColumns(
        payload?.meta?.category_master_ids,
        feeTypeList
      )
    : ({}, {})
  if (!reportAction)
    return [
      ...response.data.map((sectionData) => {
        return {
          className: sections[sectionData._id] ?? '',
          noOfStudents: `${sectionData.student_count}`,
          amountCollected: sectionData.collected.toFixed(2),
          amountAwaiting: sectionData.pending.toFixed(2),
          totalAmount: sectionData.total.toFixed(2),
        }
      }),
    ]
  return [
    ...getReportDetails(response, payload),
    payload.meta.category_breakdown
      ? {
          className: '',
          noOfStudents: '',
          amountCollected: 'Total',
          amountAwaiting: 'Total',
          totalAmount: 'Total',
          ...structureColumns,
        }
      : {},
    {
      className: 'Class',
      noOfStudents: 'No of Students',
      amountCollected: 'Amount',
      amountAwaiting: 'Pending Cheque & DD',
      totalAmount:
        'Total Amount Paid (including pending cheque & DD) by Student',
      ...structureSubColumns,
    },
    ...response.data.map((sectionData) => {
      let categoryBreakup = payload.meta.category_breakdown
        ? getCategoryBreakupData(sectionData.category_breakdown)
        : {}
      return {
        className: sections[sectionData._id] ?? '',
        noOfStudents: `${sectionData.student_count}`,
        amountCollected: sectionData.collected.toFixed(2),
        amountAwaiting: sectionData.pending.toFixed(2),
        totalAmount: sectionData.total.toFixed(2),
        ...categoryBreakup,
      }
    }),
  ]
}

export const generateFeeCollectionFeeTypeWiseReport = (
  response,
  metaData,
  {payload}
) => {
  const {reportAction} = metaData
  const feeTypes = {}
  metaData.feeTypeList.forEach((type) => {
    feeTypes[type._id] = type.name
  })
  if (!reportAction)
    return [
      ...response.data.map((feeTypeData) => {
        return {
          feeType: feeTypes[feeTypeData._id] ?? '',
          amountCollected: feeTypeData.collected.toFixed(2),
          amountAwaiting: feeTypeData.pending.toFixed(2),
          totalAmount: feeTypeData.total.toFixed(2),
        }
      }),
    ]
  return [
    ...getReportDetails(response, payload),
    {
      feeType: 'Fee Type',
      amountCollected: 'Amount',
      amountAwaiting: 'Pending Cheque & DD',
      totalAmount:
        'Total Amount Paid (including pending cheque & DD) by Student',
    },
    ...response.data.map((feeTypeData) => {
      return {
        feeType: feeTypes[feeTypeData._id] ?? '',
        amountCollected: feeTypeData.collected.toFixed(2),
        amountAwaiting: feeTypeData.pending.toFixed(2),
        totalAmount: feeTypeData.total.toFixed(2),
      }
    }),
  ]
}

export const getCategoryBreakupDataForPaymentModeWiseReport = (
  categoryBreakdownArr
) => {
  let categoryBreakup = {}
  let columnNumber = 1
  categoryBreakdownArr.forEach((object) => {
    categoryBreakup[`column${columnNumber++}`] = `${object.collected.toFixed(
      2
    )}`
  })

  return categoryBreakup
}

export const getCategoryStructureColumnsForPaymentModeWiseReport = (
  selectedFeeTypes,
  feeTypeList
) => {
  let columnNumber = 1
  let structureColumns = {}
  let structureSubColumns = {}

  selectedFeeTypes.forEach((element) => {
    let selectedFeeTypesObject = feeTypeList.find((ele) => ele._id === element)

    structureColumns[`column${columnNumber}`] = selectedFeeTypesObject.name
    structureSubColumns[`column${columnNumber}`] = 'Amount'
    columnNumber++
  })
  return {structureColumns, structureSubColumns}
}

export const generateFeeCollectionPaymentModeWiseReport = (
  response,
  metaData,
  {payload}
) => {
  const {feeTypeList, reportAction} = metaData
  let {structureColumns, structureSubColumns} = payload.meta.category_breakdown
    ? getCategoryStructureColumnsForPaymentModeWiseReport(
        payload?.meta?.category_master_ids,
        feeTypeList
      )
    : ({}, {})
  if (!reportAction)
    return [
      ...response.data.map((paymentModeData) => {
        return {
          paymentMode: paymentModeData._id,
          paymentStatus: paymentModeData.status,
          amountCollected: paymentModeData.collected.toFixed(2),
        }
      }),
    ]
  return [
    ...getReportDetails(response, payload),
    payload.meta.category_breakdown
      ? {
          paymentMode: '',
          paymentStatus: '',
          amountCollected: 'Total',
          ...structureColumns,
        }
      : {},
    {
      paymentMode: 'Payment Mode',
      paymentStatus: 'Payment Status',
      amountCollected: 'Amount',
      ...structureSubColumns,
    },
    ...response.data.map((paymentModeData) => {
      let categoryBreakup = payload.meta.category_breakdown
        ? getCategoryBreakupDataForPaymentModeWiseReport(
            paymentModeData.category_breakdown
          )
        : {}
      return {
        paymentMode: paymentModeData._id,
        paymentStatus: paymentModeData.status,
        amountCollected: paymentModeData.collected.toFixed(2),
        ...categoryBreakup,
      }
    }),
  ]
}
