import {DateTime} from 'luxon'
import {getFeeTypeBreakupObj} from '../../../../components/Home/FeeReports/utils/feeReport.utils'
import {
  CHEQUE_STATUS,
  FEE_REPORTS_TEMPLATES,
  GROUP_BY,
  INSTITUTE_HIERARCHY_TYPES,
  paymentStatusLabels,
} from '../../fees.constants'
import {
  getAllTransactionDateRange,
  getSelectedPaymentModes,
} from './feeCollectionReportUtils'

export const prepareDataForDownloadRequest = (data) => {
  // === Due paid reports fields
  if (
    [
      FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_STUDENTWISE.value,
      FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_CLASSWISE.value,
      FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_SECTIONWISE.value,
      FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_DEPARTMENTWIS.value,
      FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_INSTALLMENTWISE.value,
    ].includes(data.report_type)
  ) {
    delete data.meta.transaction_statuses
    delete data.meta.date_range
    delete data.meta.months
    delete data.meta.payment_modes

    if (
      FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_INSTALLMENTWISE.value !==
      data.report_type
    ) {
      delete data.meta.timestamps
    }

    if (
      FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_INSTALLMENTWISE.value ===
      data.report_type
    ) {
      delete data.meta.hierarchy_ids
    }
  }

  // === Collection reports fields
  if (
    [
      FEE_REPORTS_TEMPLATES.FEE_COLLECTION_MONTH.value,
      FEE_REPORTS_TEMPLATES.FEE_COLLECTION_DAILY.value,
      FEE_REPORTS_TEMPLATES.FEE_COLLECTION_DEPARTMENTWISE.value,
      FEE_REPORTS_TEMPLATES.FEE_COLLECTION_CLASSWISE.value,
      FEE_REPORTS_TEMPLATES.FEE_COLLECTION_FEETYPEWISE.value,
      FEE_REPORTS_TEMPLATES.FEE_COLLECTION_PAYMENTMODEWISE.value,
      FEE_REPORTS_TEMPLATES.FEE_COLLECTION_SECTIONWISE.value,
    ].includes(data.report_type)
  ) {
    delete data.meta.transaction_statuses
    delete data.meta.timestamps

    // Month wise
    if (FEE_REPORTS_TEMPLATES.FEE_COLLECTION_MONTH.value === data.report_type) {
      // delete data.meta.date_range
      delete data.meta.hierarchy_ids
    }
    if (FEE_REPORTS_TEMPLATES.FEE_COLLECTION_DAILY.value === data.report_type) {
      // delete data.meta.date_range
      delete data.meta.hierarchy_ids
    }

    // Department wise , Class wise
    if (
      [
        FEE_REPORTS_TEMPLATES.FEE_COLLECTION_DEPARTMENTWISE.value,
        FEE_REPORTS_TEMPLATES.FEE_COLLECTION_CLASSWISE.value,
        FEE_REPORTS_TEMPLATES.FEE_COLLECTION_SECTIONWISE.value,
      ].includes(data.report_type)
    ) {
      delete data.meta.months
    }

    // Fee type wise, Payment mode wise
    if (
      [
        FEE_REPORTS_TEMPLATES.FEE_COLLECTION_FEETYPEWISE.value,
        FEE_REPORTS_TEMPLATES.FEE_COLLECTION_PAYMENTMODEWISE.value,
      ].includes(data.report_type)
    ) {
      delete data.meta.months
      delete data.meta.hierarchy_ids
    }
  }

  //   === Miscellaneous Reports
  if (
    [
      FEE_REPORTS_TEMPLATES.FEE_MISC_CHEQUE_STATUS.value,
      FEE_REPORTS_TEMPLATES.FEE_MISC_ALL_TRANSACTIONS.value,
    ].includes(data.report_type)
  ) {
    delete data.meta.months
    delete data.meta.hierarchy_ids
    delete data.meta.category_master_ids
    delete data.meta.timestamps

    // Cheque DD Status wise
    if (
      FEE_REPORTS_TEMPLATES.FEE_MISC_CHEQUE_STATUS.value === data.report_type
    ) {
      delete data.meta.payment_modes
      delete data.meta.is_pending_cheque
    }

    // Transaction wise
    // if (
    //   [FEE_REPORTS_TEMPLATES.FEE_MISC_ALL_TRANSACTIONS.value].includes(
    //     data.report_type
    //   )
    // ) {
    // }
  }

  return data
}

export const groupBy = (arr, key) => {
  return arr.reduce((rv, x) => {
    ;(rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

export const selectedItemsJoinByNames = (
  itemsArr,
  selectedArr,
  others = {}
) => {
  if (itemsArr.length === selectedArr.length) return 'All'
  others = {filterByKey: '_id', joinBy: 'name', ...others}
  return itemsArr
    .filter((item) => selectedArr.includes(item[others.filterByKey]))
    .reduce(function (a, b) {
      return a + ['', ', '][+!!a.length] + b[others.joinBy]
    }, '')
}

export const selectedItemsInCells = (
  itemsArr = [], // original array of values
  selectedArr = [], // selected array of values
  others = {}
) => {
  others = {filterByKey: '_id', joinBy: 'name', ...others}
  let returnObj = {}
  if (selectedArr.length > 0) {
    itemsArr = itemsArr.filter((item) =>
      selectedArr.includes(item[others.filterByKey])
    )
  }
  itemsArr.forEach((ele, idx) => {
    returnObj[`z${idx}`] = typeof ele === 'object' ? ele[others.joinBy] : ele
  })

  return returnObj
}

export const getCategoryBreakupData = (categoryBreakdownArr) => {
  let categoryBreakup = {}
  categoryBreakdownArr.forEach((object, idx) => {
    categoryBreakup[`applicable${idx}`] = `${object.applicable.toFixed(2)}`
    categoryBreakup[`discount${idx}`] = `${object.discount.toFixed(2)}`
    categoryBreakup[`paid${idx}`] = `${object.paid.toFixed(2)}`
    categoryBreakup[`dues${idx}`] = `${object.dues.toFixed(2)}`
    categoryBreakup[`advance${idx}`] = `${object.advance.toFixed(2)}`
  })

  return categoryBreakup
}

export const getFeeTypesRowData = ({
  title = 'Selected fee type',
  itemArr = [],
  selectedArr = [],
}) => {
  return {
    feeTypeTitle: title,
    selectedFeeTypes: selectedItemsJoinByNames(itemArr, selectedArr),
  }
}

export const getSelectedTransactionStatus = (payload) => {
  return {
    transactionStatus: 'Transaction Status',
    selectedtransactionStatus:
      payload.meta.transaction_statuses.length === CHEQUE_STATUS.length
        ? 'All'
        : payload.meta.transaction_statuses.join(', '),
  }
}

export const getCategoryStructureColumns = (
  selectedFeeTypes,
  feeTypeList,
  numberOfEmptyColumns
) => {
  let columnNumber = 0
  let structureColumns = {}
  let structureSubColumns = {}
  for (let x = 0; x < numberOfEmptyColumns; x++) {
    structureColumns[columnNumber] = ''
    columnNumber++
  }
  for (let x = 0; x < 5; x++) {
    structureColumns[columnNumber] = 'Total'
    columnNumber++
  }

  for (let i = 0; i < selectedFeeTypes.length; i++) {
    let selectedFeeTypesObject = feeTypeList.find(
      (ele) => ele._id === selectedFeeTypes[i]
    )

    structureColumns[columnNumber] = selectedFeeTypesObject.name
    structureSubColumns[`_column${columnNumber}`] = 'Fee Applicable till date'
    columnNumber++

    structureColumns[columnNumber] = selectedFeeTypesObject.name
    structureSubColumns[`_column${columnNumber}`] = 'Discount'
    columnNumber++

    structureColumns[columnNumber] = selectedFeeTypesObject.name
    structureSubColumns[`_column${columnNumber}`] = 'Paid'
    columnNumber++

    structureColumns[columnNumber] = selectedFeeTypesObject.name
    structureSubColumns[`_column${columnNumber}`] = 'Pending Dues'
    columnNumber++

    structureColumns[columnNumber] = selectedFeeTypesObject.name
    structureSubColumns[`_column${columnNumber}`] = 'Advance Payment'
    columnNumber++
  }
  return {structureColumns, structureSubColumns}
}

export const generateFeeDuePaidStudentWiseReport = (
  response,
  metaData,
  othersData = {}
) => {
  const {payload} = othersData
  const {instituteStudentList, reportAction, feeTypeList} = metaData
  let totalNumberOfStudents = 0
  let totalFeeAplicableTillNow = 0
  let discountApplicableTillNow = 0
  let totalPaidAmount = 0
  let totalDueAmount = 0

  const {data} = response
  let studentClasses = new Set()
  let studentsRows = data.map((ele) => {
    let studentInfo = instituteStudentList?.find(
      (student) => student._id === ele._id
    )

    let categoryBreakup = payload.meta.category_breakdown
      ? getCategoryBreakupData(ele.category_breakdown)
      : {}
    totalNumberOfStudents++
    totalFeeAplicableTillNow = totalFeeAplicableTillNow + ele.applicable
    discountApplicableTillNow = discountApplicableTillNow + ele.discount
    totalPaidAmount = totalPaidAmount + ele.paid
    totalDueAmount = totalDueAmount + ele.dues

    let classroom = '-'
    if (studentInfo) {
      classroom = studentInfo?.sectionName ?? studentInfo.classroom
      studentClasses.add(classroom)
    }

    return {
      studentName: studentInfo
        ? studentInfo.full_name || studentInfo.name
        : '-',
      classroom,
      phoneNumber: studentInfo ? studentInfo.phone_number : '-',
      email: studentInfo ? studentInfo.email : '-',
      enrollmentNumber:
        studentInfo && studentInfo.enrollment_number
          ? `${studentInfo.enrollment_number}`
          : '-',
      feeApplicableTillDate: `${ele.applicable.toFixed(2)}`,
      discount: `${ele.discount.toFixed(2)}`,
      paid: `${ele.paid.toFixed(2)}`,
      pendingDues: `${ele.dues.toFixed(2)}`,
      advancedPayment: `${ele.advance.toFixed(2)}`,
      ...categoryBreakup,
    }
  })

  if (!reportAction) return studentsRows

  let {structureColumns, structureSubColumns} = payload.meta.category_breakdown
    ? getCategoryStructureColumns(
        payload?.meta?.category_master_ids,
        feeTypeList,
        5
      )
    : ({}, {})

  let rows = [
    // {
    //   classesOfStudent: 'Classes for which student are selected',
    //   ...selectedItemsInCells([...studentClasses]),
    // },
    {
      ...getFeeTypesRowData({
        itemArr: feeTypeList,
        selectedArr: payload.meta.category_master_ids,
      }),
    },
    {},
    {
      numberOfStudents: 'Number of students',
      totalNumberOfStudents: `${totalNumberOfStudents}`,
    },
    {
      applicableTillNow: 'Total fee applicable till now',
      totalFeeAplicableTillNow: `${totalFeeAplicableTillNow.toFixed(2)}`,
    },
    {
      applicableTillNow: 'Discount applicable till now',
      discountApplicableTillNow: `${discountApplicableTillNow.toFixed(2)}`,
    },
    {
      applicableTillNow: 'Total paid amount',
      totalPaidAmount: `${totalPaidAmount.toFixed(2)}`,
    },
    {
      applicableTillNow: 'Total due amount',
      totalDueAmount: `${totalDueAmount.toFixed(2)}`,
    },
    {},
    {
      ...structureColumns,
    },
    {
      studentName: 'Student Name',
      classroom: 'Class',
      phoneNumber: 'Mobile Number',
      email: 'Email',
      enrollmentNumber: 'Enrollment ID',
      feeApplicableTillDate: 'Fee Applicable till date',
      discount: 'Discount',
      paid: 'Paid',
      pendingDues: 'Pending Dues',
      advancedPayment: 'Advance Payment (if any)',
      ...structureSubColumns,
    },
    ...studentsRows,
  ]
  return rows
}

export const generateFeeDuePaidSectionWiseReport = (
  response,
  metaData,
  othersData = {}
) => {
  const {payload} = othersData
  const {instituteHierarchy, reportAction, feeTypeList} = metaData
  const {data} = response

  let totalNumberOfStudents = 0
  let totalFeeAplicableTillNow = 0
  let discountApplicableTillNow = 0
  let totalPaidAmount = 0
  let totalDueAmount = 0

  let sections = []
  instituteHierarchy?.children.forEach((dep) => {
    if (dep.type === INSTITUTE_HIERARCHY_TYPES.DEPARTMENT && dep.children) {
      dep.children.forEach((classroom) => {
        if (
          classroom.type === INSTITUTE_HIERARCHY_TYPES.STANDARD &&
          classroom.children
        ) {
          classroom.children.forEach((section) => {
            if (section.type === INSTITUTE_HIERARCHY_TYPES.SECTION) {
              let newSection = {
                ...section,
                className: `${classroom.name}-${section.name}`,
              }
              sections.push(newSection)
            }
          })
        }
      })
    }
  })

  let sectionRows = data.map((ele) => {
    totalNumberOfStudents++
    totalFeeAplicableTillNow = totalFeeAplicableTillNow + ele.applicable
    discountApplicableTillNow = discountApplicableTillNow + ele.discount
    totalPaidAmount = totalPaidAmount + ele.paid
    totalDueAmount = totalDueAmount + ele.dues

    let classroom = sections.find((clas) => clas.id === ele[GROUP_BY.sectionId])

    let categoryBreakup = payload.meta.category_breakdown
      ? getCategoryBreakupData(ele.category_breakdown)
      : {}

    return {
      className: classroom ? classroom.className : '-',
      //   classTeacher: ele?.class_teacher ? ele.class_teacher : '-',
      studentCount: `${ele.student_count}`,
      feeOverdueStudentCount: `${ele.fee_overdue_student_count}`,
      applicable: `${ele.applicable.toFixed(2)}`,
      discount: `${ele.discount.toFixed(2)}`,
      paid: `${ele.paid.toFixed(2)}`,
      dues: `${ele.dues.toFixed(2)}`,
      advance: `${ele.advance.toFixed(2)}`,
      clearancePending: ele?.cheque_pending ? `${ele.cheque_pending}` : '-',
      ...categoryBreakup,
    }
  })

  if (!reportAction) return sectionRows
  let {structureColumns, structureSubColumns} = payload.meta.category_breakdown
    ? getCategoryStructureColumns(
        payload?.meta?.category_master_ids,
        feeTypeList,
        3
      )
    : ({}, {})

  let rows = [
    // {
    //   departmentsTitle: 'Class Selected',
    //   ...selectedItemsInCells(sections, payload.meta.hierarchy_ids, {
    //     filterByKey: 'id',
    //     joinBy: 'className',
    //   }),
    // },
    {
      ...getFeeTypesRowData({
        itemArr: feeTypeList,
        selectedArr: payload.meta.category_master_ids,
      }),
    },
    {},
    {
      numberOfStudents: 'Number of students',
      totalNumberOfStudents: `${totalNumberOfStudents}`,
    },
    {
      applicableTillNow: 'Total Fee Applicable till now',
      totalFeeAplicableTillNow: `${totalFeeAplicableTillNow.toFixed(2)}`,
    },
    {
      applicableTillNow: 'Discount applicable till now',
      discountApplicableTillNow: `${discountApplicableTillNow.toFixed(2)}`,
    },
    {
      applicableTillNow: 'Total Paid amount',
      totalPaidAmount: `${totalPaidAmount.toFixed(2)}`,
    },
    {
      applicableTillNow: 'Total Due amount',
      totalDueAmount: `${totalDueAmount.toFixed(2)}`,
    },
    {},
    {
      ...structureColumns,
    },
    {
      class: 'Class',
      //   classTeacher: 'Class Teacher',
      totalStudents: 'Number of Students',
      feeDueStudents: 'Number of fee due student',
      feeApplicableTillDate: 'Fee Applicable till date',
      discount: 'Discount',
      paid: 'Paid',
      pendingDues: 'Due Amount',
      advancedPayment: 'Advance Payment',
      clearancePending: 'Cheque/DD Clearance Pending',
      ...structureSubColumns,
    },
    ...sectionRows,
  ]

  return rows
}

export const generateFeeDuePaidClassWiseReport = (
  response,
  metaData,
  othersData = {}
) => {
  const {payload} = othersData
  const {instituteHierarchy, feeTypeList, reportAction} = metaData
  const {data} = response

  let totalFeeAplicableTillNow = 0
  let discountApplicableTillNow = 0
  let totalPaidAmount = 0
  let totalDueAmount = 0

  let classrooms = []
  instituteHierarchy?.children.forEach((dep) => {
    if (dep.type === INSTITUTE_HIERARCHY_TYPES.DEPARTMENT && dep.children) {
      dep.children.forEach((classroom) => {
        if (classroom.type === INSTITUTE_HIERARCHY_TYPES.STANDARD) {
          classrooms.push(classroom)
        }
      })
    }
  })

  let classroomRows = data.map((ele) => {
    totalFeeAplicableTillNow = totalFeeAplicableTillNow + ele.applicable
    discountApplicableTillNow = discountApplicableTillNow + ele.discount
    totalPaidAmount = totalPaidAmount + ele.paid
    totalDueAmount = totalDueAmount + ele.dues

    let categoryBreakup = payload.meta.category_breakdown
      ? getCategoryBreakupData(ele.category_breakdown)
      : {}

    let classroom = classrooms.find((clas) => clas.id === ele[GROUP_BY.classId])

    return {
      className: classroom ? classroom.name : '-',
      studentCount: `${ele.student_count}`,
      feeOverdueStudentCount: `${ele.fee_overdue_student_count}`,
      applicable: `${ele.applicable.toFixed(2)}`,
      discount: `${ele.discount.toFixed(2)}`,
      paid: `${ele.paid.toFixed(2)}`,
      dues: `${ele.dues.toFixed(2)}`,
      advance: `${ele.advance.toFixed(2)}`,
      clearancePending: ele?.cheque_pending
        ? `${ele.cheque_pending.toFixed(2)}`
        : '-',
      ...categoryBreakup,
    }
  })

  if (!reportAction) {
    return classroomRows
  }

  let {structureColumns, structureSubColumns} = payload.meta.category_breakdown
    ? getCategoryStructureColumns(
        payload?.meta?.category_master_ids,
        feeTypeList,
        3
      )
    : ({}, {})

  let rows = [
    // {
    //   departmentsTitle: 'Class Selected',
    //   ...selectedItemsInCells(classrooms, payload.meta.hierarchy_ids, {
    //     filterByKey: 'id',
    //   }),
    // },
    {
      ...getFeeTypesRowData({
        itemArr: feeTypeList,
        selectedArr: payload.meta.category_master_ids,
      }),
    },
    {},
    {
      applicableTillNow: 'Total Fee Applicable till now',
      totalFeeAplicableTillNow: `${totalFeeAplicableTillNow.toFixed(2)}`,
    },
    {
      applicableTillNow: 'Discount applicable till now',
      discountApplicableTillNow: `${discountApplicableTillNow.toFixed(2)}`,
    },
    {
      applicableTillNow: 'Total Paid amount',
      totalPaidAmount: `${totalPaidAmount.toFixed(2)}`,
    },
    {
      applicableTillNow: 'Total Due amount',
      totalDueAmount: `${totalDueAmount.toFixed(2)}`,
    },
    {},
    {
      ...structureColumns,
    },
    {
      class: 'Class',
      totalStudents: 'Number of Students',
      feeDueStudents: 'Number of fee due student',
      feeApplicableTillDate: 'Fee Applicable till date',
      discount: 'Discount',
      paid: 'Paid',
      pendingDues: 'Due Amount',
      advancedPayment: 'Advance Payment',
      clearancePending: 'Cheque/DD Clearance Pending',
      ...structureSubColumns,
    },
    ...classroomRows,
  ]

  return rows
}

export const generateFeeDuePaidDepartmentWiseReport = (
  response,
  metaData,
  othersData = {}
) => {
  const {payload} = othersData
  const {instituteHierarchy, feeTypeList, reportAction} = metaData
  const departments = instituteHierarchy?.children.filter(
    (dep) => dep.type === INSTITUTE_HIERARCHY_TYPES.DEPARTMENT
  )

  let totalFeeAplicableTillNow = 0
  let discountApplicableTillNow = 0
  let totalPaidAmount = 0
  let totalDueAmount = 0

  const {data} = response

  let departmentRows = data.map((depData) => {
    totalFeeAplicableTillNow = totalFeeAplicableTillNow + depData.applicable
    discountApplicableTillNow = discountApplicableTillNow + depData.discount
    totalPaidAmount = totalPaidAmount + depData.paid
    totalDueAmount = totalDueAmount + depData.dues

    let categoryBreakup = payload.meta.category_breakdown
      ? getCategoryBreakupData(depData.category_breakdown)
      : {}

    let department = departments.find(
      (dep) => dep.id === depData[GROUP_BY.departmentId]
    )

    return {
      departmentName: department ? department.name : '-',
      studentCount: `${depData.student_count}`,
      feeOverdueStudentCount: `${depData.fee_overdue_student_count}`,
      applicable: `${depData.applicable.toFixed(2)}`,
      discount: `${depData.discount.toFixed(2)}`,
      paid: `${depData.paid.toFixed(2)}`,
      dues: `${depData.dues.toFixed(2)}`,
      advance: `${depData.advance.toFixed(2)}`,
      clearancePending: depData?.cheque_pending
        ? `${depData.cheque_pending.toFixed(2)}`
        : '-',
      ...categoryBreakup,
    }
  })

  if (!reportAction) return departmentRows

  let {structureColumns, structureSubColumns} = payload.meta.category_breakdown
    ? getCategoryStructureColumns(
        payload?.meta?.category_master_ids,
        feeTypeList,
        3
      )
    : ({}, {})

  let rows = [
    // {
    //   departmentsTitle: 'Department Selected',
    //   ...selectedItemsInCells(departments, payload.meta.hierarchy_ids, {
    //     filterByKey: 'id',
    //   }),
    // },
    {
      ...getFeeTypesRowData({
        itemArr: feeTypeList,
        selectedArr: payload.meta.category_master_ids,
      }),
    },
    {},
    {
      applicableTillNow: 'Total Fee Applicable till now',
      totalFeeAplicableTillNow: `${totalFeeAplicableTillNow.toFixed(2)}`,
    },
    {
      applicableTillNow: 'Discount applicable till now',
      discountApplicableTillNow: `${discountApplicableTillNow.toFixed(2)}`,
    },
    {
      applicableTillNow: 'Total Paid amount',
      totalPaidAmount: `${totalPaidAmount.toFixed(2)}`,
    },
    {
      applicableTillNow: 'Total Due amount',
      totalDueAmount: `${totalDueAmount.toFixed(2)}`,
    },
    {},
    {
      ...structureColumns,
    },
    {
      department: 'Department',
      totalStudents: 'Number of Students',
      feeDueStudents: 'Number of fee due student',
      feeApplicableTillDate: 'Fee Applicable till date',
      discount: 'Discount',
      paid: 'Paid',
      pendingDues: 'Due Amount',
      advancedPayment: 'Advance Payment',
      clearancePending: 'Cheque/DD Clearance Pending',
      ...structureSubColumns,
    },
    ...departmentRows,
  ]

  return rows
}

export const generateFeeDuePaidInstalmentWiseReport = (
  response,
  metaData,
  othersData = {}
) => {
  const {payload} = othersData
  const {feeTypeList, reportAction} = metaData

  let totalFeeAplicableTillNow = 0
  let discountApplicableTillNow = 0
  let totalPaidAmount = 0
  let totalDueAmount = 0

  const {data} = response

  let timestampsRow = data.map((ele) => {
    totalFeeAplicableTillNow = totalFeeAplicableTillNow + ele.applicable
    discountApplicableTillNow = discountApplicableTillNow + ele.discount
    totalPaidAmount = totalPaidAmount + ele.paid
    totalDueAmount = totalDueAmount + ele.dues

    let categoryBreakup = payload.meta.category_breakdown
      ? getCategoryBreakupData(ele.category_breakdown)
      : {}

    return {
      a: DateTime.fromSeconds(parseInt(ele._id)).toFormat('dd MMM, yyyy'),
      applicable: `${ele.applicable.toFixed(2)}`,
      discount: `${ele.discount.toFixed(2)}`,
      paid: `${ele.paid.toFixed(2)}`,
      dues: `${ele.dues.toFixed(2)}`,
      advance: `${ele.advance.toFixed(2)}`,
      clearancePending: ele?.cheque_pending
        ? `${ele.cheque_pending.toFixed(2)}`
        : '-',
      ...categoryBreakup,
    }
  })

  if (!reportAction) return timestampsRow

  let {structureColumns, structureSubColumns} = payload.meta.category_breakdown
    ? getCategoryStructureColumns(
        payload?.meta?.category_master_ids,
        feeTypeList,
        1
      )
    : ({}, {})

  //   let installmentDatesSelected = {}

  //   if (payload.meta.timestamps.length > 0) {
  //     payload.meta.timestamps.forEach(
  //       (timestamp, idx) =>
  //         (installmentDatesSelected[`z${idx}`] =
  //           DateTime.fromSeconds(timestamp).toFormat('dd MMM, yyyy'))
  //     )
  //   } else {
  //     installmentDatesSelected.noneSelcted = '-'
  //   }

  let rows = [
    // {
    //   departmentsTitle: 'Installment date Selected',
    //   ...installmentDatesSelected,
    // },
    {
      ...getFeeTypesRowData({
        itemArr: feeTypeList,
        selectedArr: payload.meta.category_master_ids,
      }),
    },
    {},
    {
      applicableTillNow: 'Total Fee Applicable till now',
      totalFeeAplicableTillNow: `${totalFeeAplicableTillNow.toFixed(2)}`,
    },
    {
      applicableTillNow: 'Discount applicable till now',
      discountApplicableTillNow: `${discountApplicableTillNow.toFixed(2)}`,
    },
    {
      applicableTillNow: 'Total Paid amount',
      totalPaidAmount: `${totalPaidAmount.toFixed(2)}`,
    },
    {
      applicableTillNow: 'Total Due amount',
      totalDueAmount: `${totalDueAmount.toFixed(2)}`,
    },
    {},
    {
      ...structureColumns,
    },
    {
      instalmentDate: 'Installment Date',
      feeApplicableTillDate: 'Applicable Fee',
      discount: 'Discount',
      paid: 'Paid',
      pendingDues: 'Due Amount',
      advancedPayment: 'Advance Payment',
      clearancePending: 'Cheque/DD Clearance Pending',
      ...structureSubColumns,
    },
    ...timestampsRow,
  ]

  return rows
}

// Miscellaneous Reports
export const generateMiscellaneousChequeStatusReports = (
  response,
  metaData,
  othersData = {}
) => {
  const {instituteStudentList, reportAction} = metaData
  if (!instituteStudentList) {
    return []
  }
  const {payload} = othersData
  let amountPendingForClearance = 0

  const {data} = response

  let dataRows = data.map((ele) => {
    let studentInfo = instituteStudentList?.find(
      (student) => student._id === ele.student_id
    )

    // if (ele.transaction_status === 'PENDING') {
    if (['RECEIVED', 'DEPOSITED'].includes(ele.transaction_status)) {
      amountPendingForClearance = amountPendingForClearance + ele.amount
    }

    return {
      studentName: studentInfo
        ? studentInfo.full_name || studentInfo.name
        : '-',
      studentMobileNumber: studentInfo ? studentInfo.phone_number : '-',
      class: studentInfo
        ? studentInfo?.sectionName ?? studentInfo.classroom
        : '-',
      transactionId: ele.transaction_id,
      amount: `${ele.amount.toFixed(2)}`,
      // status: ele.transaction_status,
      status: ele.cheque_status,
      paymentMode: ele?.payment_mode
        ? paymentStatusLabels[ele.payment_mode].actualLabel
        : '-',
      referenceNumber: ele.payment_ref_id,
      disbursalDate:
        ele?.disbursal_timestamp && ele.disbursal_timestamp !== ''
          ? DateTime.fromSeconds(ele.disbursal_timestamp).toFormat(
              'dd MMM, yyyy'
            )
          : '-',
      paymentDate:
        ele?.timestamp && ele.timestamp !== ''
          ? DateTime.fromSeconds(ele.timestamp).toFormat('dd MMM, yyyy')
          : '-',
      receiptNumber: ele.receipt_no,
      receiptGenerationDate:
        ele?.creation_date && ele.creation_date !== ''
          ? DateTime.fromSeconds(ele.creation_date).toFormat('dd MMM, yyyy')
          : '-',
    }
  })

  if (!reportAction) return dataRows

  let rows = [
    // {
    //   departmentsTitle: 'Transaction Status',
    //   ...selectedItemsInCells(payload.meta.transaction_statuses),
    // },
    {...getAllTransactionDateRange(payload)},
    {...getSelectedTransactionStatus(payload)},
    {},
    {
      feeTypeTitle: 'Amount Pending for clearance',
      selectedFeeTypes: `${amountPendingForClearance.toFixed(2)}`,
    },
    {},
    {
      studentName: 'Student Name',
      studentMobileNumber: 'Student Mobile Number',
      class: 'Class',
      transactionId: 'Transaction ID',
      amount: 'Amount',
      status: 'Status',
      paymentMode: 'Payment Mode',
      referenceNumber: 'Cheque/DD Reference Number',
      disbursalDate: 'Cheque/DD disbursal date',
      paymentDate: 'Payment Date',
      receiptNumber: 'Receipt Number',
      receiptGenerationDate: 'Receipt Generation Date',
    },
    ...dataRows,
  ]

  return rows
}

export const generateMiscellaneousAllTransactionStatusReports = (
  response,
  metaData,
  othersData = {}
) => {
  const {instituteStudentList, reportAction, feeTypeList} = metaData
  if (!instituteStudentList) return []
  const {payload} = othersData

  const {data} = response

  let totalCollection = 0

  let dataRows = data.map((ele) => {
    let studentInfo = instituteStudentList.find(
      (student) => student._id === ele.student_id
    )

    if (['SETTLED', 'SUCCESS'].includes(ele.transaction_status)) {
      totalCollection = totalCollection + ele.amount
    }

    let feebreakup =
      getFeeTypeBreakupObj(ele?.fee_type_breakup, feeTypeList) || []

    if (metaData.reportAction === 'download') {
      feebreakup = Object.keys(feebreakup)
        .map((key) => {
          return `${key}: ${feebreakup[key]}`
        })
        .join(' | ')
    }

    return {
      studentName: studentInfo
        ? studentInfo.full_name || studentInfo.name
        : '-',
      enrollmentNumber: studentInfo?.enrollment_number || '-',
      studentMobileNumber: studentInfo ? studentInfo.phone_number : '-',
      class: studentInfo
        ? studentInfo?.sectionName ?? studentInfo.classroom
        : '-',
      transactionId: ele.transaction_id,
      amount: `${ele.amount.toFixed(2)}`,
      feeTypeBreakup: feebreakup,
      status: ele.transaction_status,
      paymentMode: ele?.payment_mode
        ? paymentStatusLabels[ele.payment_mode].actualLabel
        : '-',
      referenceNumber: ele.payment_ref_id,
      paymentDate:
        ele?.timestamp && ele.timestamp !== ''
          ? DateTime.fromSeconds(ele.timestamp).toFormat('dd MMM, yyyy')
          : '-',
      receiptNumber: ele.receipt_no,
      receiptGenerationDate:
        ele?.creation_date && ele.creation_date !== ''
          ? DateTime.fromSeconds(ele.creation_date).toFormat('dd MMM, yyyy')
          : '-',
    }
  })

  if (!reportAction) return dataRows

  let rows = [
    {...getAllTransactionDateRange(payload)},
    {...getSelectedTransactionStatus(payload)},
    {...getSelectedPaymentModes(payload)},
    {},
    {
      totalCollectionTitle:
        'Total Collection (Only settled or success transaction counted)',
      totalCollection: `${totalCollection.toFixed(2)}`,
    },
    {},
    {
      studentName: 'Student Name',
      enrollmentNumber: 'Enrollment no.',
      studentMobileNumber: 'Student Mobile Number',
      class: 'Class',
      transactionId: 'Transaction ID',
      amount: 'Amount',
      feeTypeBreakup: 'Fee Category Breakup',
      status: 'Status',
      paymentMode: 'Payment Mode',
      referenceNumber: 'Cheque/DD Reference Number',
      paymentDate: 'Payment Date',
      receiptNumber: 'Receipt Number',
      receiptGenerationDate: 'Receipt Generation Date',
    },
    ...dataRows,
  ]
  return rows
}

export const generateChequeDetailedReport = (response, metaData) => {
  const {instituteStudentList} = metaData

  let student = ''
  let classSection = ''
  let transactionId = ''
  let amount = 0
  let chequeDisbursalDate = ''
  let paymentDate = ''
  let receiptNumber = ''

  const {transactions} = response

  let chequeRows = transactions.map((cheqData) => {
    if (cheqData.payment_method === 3) {
      if (instituteStudentList) {
        let studData = instituteStudentList.find(
          (stud) => stud._id === cheqData.student_id
        )
        if (studData) {
          student = studData.full_name || studData.name
          classSection = studData?.sectionName ?? studData.classroom
        }
      }
      transactionId = cheqData.transaction_id
      amount = cheqData.amount
      chequeDisbursalDate = new Date(
        cheqData.disbursal_timestamp * 1000
      ).toLocaleDateString('en-In', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
      paymentDate = new Date(cheqData.timestamp * 1000).toLocaleDateString(
        'en-In',
        {year: 'numeric', month: 'short', day: 'numeric'}
      )
      receiptNumber = cheqData.payment_id
      return {
        student,
        classSection,
        transactionId,
        amount,
        chequeDisbursalDate,
        paymentDate,
        receiptNumber,
      }
    }
  })
  chequeRows.unshift({
    student: 'Student Name',
    classSection: 'Class-Section',
    transactionId: 'Transaction ID',
    amount: 'Amount',
    chequeDisbursalDate: 'Cheque Disbursal Date',
    paymentDate: 'Payment Date',
    receiptNumber: 'Reference Number',
  })
  return chequeRows
}
