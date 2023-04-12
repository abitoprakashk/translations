import {
  getAmountFixDecimalWithCurrency,
  roundWithPrecision,
} from '../../../../utils/Helpers'
import {Icon} from '@teachmint/krayon'
import {
  getPaymentStatusClass,
  DateFormats,
} from '../../../../pages/fee/fees.constants'
import classNames from 'classnames'
import {DateTime} from 'luxon'
import {events} from '../../../../utils/EventsConstants'
import styles from '../FeeReports.module.css'

const SORT_TYPE = {
  ASC: 'asc',
  DSC: 'dsc',
}

const getValue = (obj, key) => {
  return key.split('.').reduce((o, k) => o?.[k], obj)
}

export const handleClassSort = ({type = SORT_TYPE.ASC, data = [], key}) => {
  const sortedData = data.sort((a, b) =>
    type === SORT_TYPE.ASC
      ? getValue(a, key)?.split(/[ -]/)?.[0] -
        getValue(b, key)?.split(/[ -]/)?.[0]
      : getValue(b, key)?.split(/[ -]/)?.[0] -
        getValue(a, key)?.split(/[ -]/)?.[0]
  )

  return sortedData
}

export const basicSort = ({type = SORT_TYPE.ASC, data = [], key}) => {
  const sortedData = data.sort((a, b) =>
    type === SORT_TYPE.ASC
      ? getValue(a, key) - getValue(b, key)
      : getValue(b, key) - getValue(a, key)
  )

  return sortedData
}

export const basicStringSort = ({type = SORT_TYPE.ASC, data = [], key}) => {
  const sortedData = data.sort((a, b) =>
    type === SORT_TYPE.ASC
      ? getValue(a, key)?.localeCompare(getValue(b, key))
      : getValue(b, key)?.localeCompare(getValue(a, key))
  )

  return sortedData
}

export const handleCountSort = ({type = SORT_TYPE.ASC, data = [], key}) => {
  const sortedData = basicSort({
    type,
    data,
    key,
  })

  return sortedData
}

const getCurrencySymbol = (instituteInfo) => {
  if (instituteInfo && instituteInfo.currency) {
    return instituteInfo.currency
  }
}

export const getFeeTypeBreakupObj = (feeTypeBreakUp = {}, feeTypeList = []) => {
  if (Object.keys(feeTypeBreakUp)?.length === 0 || feeTypeList?.length === 0) {
    return ''
  }
  let allBreakUps = {}
  Object.keys(feeTypeBreakUp).forEach((key) => {
    let findFeeType = feeTypeList?.find?.((feeType) => feeType?._id === key)
    if (findFeeType) {
      for (const bKey in feeTypeBreakUp[key]) {
        if (feeTypeBreakUp[key][bKey] === 0) continue
        allBreakUps[`${findFeeType?.name} ${bKey.split('_').join(' ')}`] =
          roundWithPrecision(feeTypeBreakUp[key][bKey])
      }
    }
  })
  return Object.keys(allBreakUps).length > 0 ? allBreakUps : ''
}

export const getFeeTypeBreakupJSX = (feeTypeBreakUp = {}, instituteInfo) => {
  if (!feeTypeBreakUp || Object.keys(feeTypeBreakUp)?.length === 0) {
    return []
  }
  return Object.keys(feeTypeBreakUp).map((key) => {
    return (
      <div key={key} className={styles.feeTypeBreakup}>
        <div>{key}:</div>{' '}
        <div>
          {getAmountFixDecimalWithCurrency(
            parseFloat(feeTypeBreakUp[key]) ?? 0,
            getCurrencySymbol(instituteInfo)
          )}
        </div>
      </div>
    )
  })
}

export const getCustomTableColumns = (
  tabledat,
  instituteInfo,
  extraData = {}
) => {
  let newTable = []
  if (tabledat) {
    tabledat.forEach((row) => {
      let obj = {}
      Object.keys(row).map((rowId) => {
        let breakupArr = []
        if (rowId === 'feeTypeBreakup') {
          breakupArr = getFeeTypeBreakupJSX(row[rowId], instituteInfo)
        }
        switch (rowId) {
          case 'paid':
            obj[rowId] = (
              <div className={styles.greenColor}>
                {getAmountFixDecimalWithCurrency(
                  parseFloat(row[rowId]) ?? 0,
                  getCurrencySymbol(instituteInfo)
                )}
              </div>
            )
            break
          case 'dues':
          case 'pendingDues':
            obj[rowId] = (
              <div className={styles.redColor}>
                {getAmountFixDecimalWithCurrency(
                  parseFloat(row[rowId]) ?? 0,
                  getCurrencySymbol(instituteInfo)
                )}
              </div>
            )
            break
          case 'discount':
          case 'applicable':
          case 'amountAwaiting':
          case 'amountCollected':
          case 'amount':
          case 'feeApplicableTillDate':
            obj[rowId] = (
              <div className={styles.amountDefaultTableColor}>
                {getAmountFixDecimalWithCurrency(
                  parseFloat(row[rowId]) ?? 0,
                  getCurrencySymbol(instituteInfo)
                )}
              </div>
            )
            break
          case 'status':
          case 'paymentStatus':
            obj[rowId] = (
              <div className={styles.paymentStatusTab}>
                <div className={getPaymentStatusClass(row[rowId], styles)}>
                  {[row[rowId]]}
                </div>
              </div>
            )
            break
          case 'a':
            obj[rowId] = <div>{row[rowId].replace(',', '')}</div>
            break
          case 'feeTypeBreakup':
            obj[rowId] = (
              <div>
                {breakupArr.length > 1 ? (
                  <div className={styles.tooltipBadgeWrapper}>
                    {breakupArr[0]}
                    <div
                      className={styles.feeTypeBreakupMoreText}
                      onClick={() =>
                        extraData?.handleOpenFeeTypeBreakupModal({
                          rowData: row,
                          breakupArr,
                        }) || null
                      }
                    >
                      + {breakupArr.length - 1} more
                    </div>
                  </div>
                ) : (
                  breakupArr[0]
                )}
              </div>
            )
            break
          default:
            obj[rowId] = row[rowId]
        }
      })
      newTable.push(obj)
    })
  }
  return newTable
}

export const handleFilterSelectionUtil = (
  val,
  instituteAcademicSessionInfo,
  instituteActiveAcademicSessionId,
  eventManager,
  getEventsParams,
  dispatch,
  setDateRangeAction,
  setSelectedTimePeriod,
  setshowDateRangePicker
) => {
  let activeAccademic = instituteAcademicSessionInfo.find(
    (session) => session._id === instituteActiveAcademicSessionId
  )
  let sessionStart = DateTime.now().toFormat(DateFormats['year'])
  if (activeAccademic) {
    sessionStart = DateTime.fromSeconds(
      parseInt(activeAccademic.start_time) / 1000
    ).toFormat(DateFormats['year'])
  }
  eventManager.send_event(events.FEE_REPORT_SESSION_TFI, {
    ...getEventsParams(),
  })
  setDateRangeHelper({
    key: val.value,
    dispatch,
    setDateRangeAction,
    sessionStart,
    setshowDateRangePicker,
  })
  eventManager.send_event(events.FEE_REPORT_SESSION_APPLIED_TFI, {
    ...getEventsParams(),
    session: val.value,
  })
  setSelectedTimePeriod(val.value)
}

export const setDateRangeHelper = ({
  key,
  dispatch,
  setDateRangeAction,
  sessionStart,
  setshowDateRangePicker,
}) => {
  switch (key) {
    case 'THIS_WEEK': {
      dispatch(
        setDateRangeAction({
          startDate: DateTime.local()
            .startOf('week')
            .toFormat(DateFormats['year']),
          endDate: DateTime.now().toFormat(DateFormats['year']),
        })
      )
      break
    }
    case 'LAST_WEEK': {
      dispatch(
        setDateRangeAction({
          startDate: DateTime.local()
            .minus({days: 7})
            .startOf('week')
            .toFormat(DateFormats['year']),
          endDate: DateTime.local()
            .minus({days: 7})
            .endOf('week')
            .toFormat(DateFormats['year']),
        })
      )
      break
    }
    case 'THIS_MONTH': {
      dispatch(
        setDateRangeAction({
          startDate: DateTime.local()
            .startOf('month')
            .toFormat(DateFormats['year']),
          endDate: DateTime.now().toFormat(DateFormats['year']),
        })
      )
      break
    }
    case 'LAST_MONTH': {
      dispatch(
        setDateRangeAction({
          startDate: DateTime.local()
            .minus({month: 1})
            .startOf('month')
            .toFormat(DateFormats['year']),
          endDate: DateTime.local()
            .minus({month: 1})
            .endOf('month')
            .toFormat(DateFormats['year']),
        })
      )
      break
    }
    case 'THIS_SESSION': {
      dispatch(
        setDateRangeAction({
          startDate: sessionStart,
          endDate: DateTime.now().toFormat(DateFormats['year']),
        })
      )
      break
    }
    case 'CUSTOM_RANGE': {
      setshowDateRangePicker(true)
      return
    }
  }
}

export const handleClassSortUtils = (
  type,
  keyVal,
  sortType,
  tableData,
  setTableData,
  setSortColData
) => {
  let newData = [...tableData]
  switch (sortType) {
    case 'class': {
      setTableData(handleClassSort({type: type, data: newData, key: keyVal}))
      break
    }
    case 'name': {
      setTableData(basicStringSort({type: type, data: newData, key: keyVal}))
      break
    }
    case 'count': {
      setTableData(handleCountSort({type: type, data: newData, key: keyVal}))
      break
    }
    case 'date': {
      setTableData(handleDateSort({type: type, data: newData, key: keyVal}))
      break
    }
  }
  setSortColData({
    key: keyVal,
    type,
  })
}

export const getColumnSortSymbols = (
  label,
  key,
  sortType,
  sortColData,
  handleClassSortFn
) => {
  return (
    <div
      className={styles.sortSymbolCont}
      onClick={() =>
        handleClassSortFn(
          sortColData?.type === SORT_TYPE.ASC ? SORT_TYPE.DSC : SORT_TYPE.ASC,
          key,
          sortType
        )
      }
    >
      {label}
      <div className={styles.sortSymbolButton}>
        <div className={classNames(styles.rot90, 'cursor-pointer')}>
          <Icon
            version={'outlined'}
            name="upArrow"
            size="xxx_s"
            type={
              sortColData?.type === SORT_TYPE.ASC && sortColData?.key === key
                ? 'primary'
                : 'basic'
            }
          ></Icon>
        </div>
        <div className={classNames(styles.rot270, 'cursor-pointer')}>
          <Icon
            version={'outlined'}
            name="downArrow"
            size="xxx_s"
            type={
              sortColData?.type === SORT_TYPE.DSC && sortColData?.key === key
                ? 'primary'
                : 'basic'
            }
          ></Icon>
        </div>
      </div>
    </div>
  )
}

export const onApplyFilter = (
  val,
  setranges,
  dispatch,
  setDateRangeAction,
  setSelectedTimePeriod,
  setshowDateRangePicker
) => {
  setranges({
    startDate: new Date(val.startDate),
    endDate: new Date(val.endDate),
    key: 'selection',
  })
  dispatch(
    setDateRangeAction({
      startDate: DateTime.fromSeconds(
        new Date(val.startDate).valueOf() / 1000
      ).toFormat(DateFormats['year']),
      endDate: DateTime.fromSeconds(
        new Date(val.endDate).valueOf() / 1000
      ).toFormat(DateFormats['year']),
    })
  )
  setSelectedTimePeriod('CUSTOM_RANGE')
  setshowDateRangePicker(false)
}

export const getHierarchyIdMap = (departmentList = [], hierarchyType) => {
  if (!departmentList?.length || !hierarchyType) {
    return null
  }

  return departmentList.reduce((acc, department) => {
    if (department.type === hierarchyType) {
      acc[department.id] = true
    }

    return {
      ...acc,
      ...getHierarchyIdMap(department.children, hierarchyType),
    }
  }, {})
}
export const handleDateSort = ({type = SORT_TYPE.ASC, data = [], key}) => {
  const sortedData = data.sort((a, b) =>
    type === SORT_TYPE.ASC
      ? new Date(getValue(a, key)) - new Date(getValue(b, key))
      : new Date(getValue(b, key)) - new Date(getValue(a, key))
  )

  return sortedData
}
