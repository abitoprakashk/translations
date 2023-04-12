import {toCamelCasedKeys} from '../../../utils/Helpers'
import {v4 as uuid} from 'uuid'
import {events} from '../../../utils/EventsConstants'
import {
  OPTION_TYPES,
  TITLE_OPTIONS,
} from '../../global-settings/components/common/containers/options-box/OptionsBox'

export const createFeeStructureTree = (feesData) => {
  feesData = toCamelCasedKeys(feesData)
  const {fees} = feesData
  const rows = {
    current: [],
    entire: [],
    previous_session_current: [],
    previous_session_entire: [],
  }
  const totalDue = {
    currentTotalDue: 0,
    entireTotalDue: 0,
  }

  ;['current', 'entire'].forEach((duration) => {
    let topLevel = {}
    let previousSessionDueTopLevel = {}
    fees[duration].map((feeStructure) => {
      Object.keys(feeStructure['timestamp']).map((timestamp) => {
        let timestampDate = new Date(parseInt(timestamp) * 1000)
        let firstDateOfMonth = new Date(
          timestampDate.getFullYear(),
          timestampDate.getMonth(),
          1
        )
        let month = firstDateOfMonth.getTime() / 1000
        if (feeStructure['is_previous_due']) {
          if (month in previousSessionDueTopLevel) {
            let mergedData = previousSessionDueTopLevel[month].concat(
              feeStructure['timestamp'][timestamp]
            )
            previousSessionDueTopLevel[month] = mergedData
          } else {
            previousSessionDueTopLevel[month] = []
            let mergedData = previousSessionDueTopLevel[month].concat(
              feeStructure['timestamp'][timestamp]
            )
            previousSessionDueTopLevel[month] = mergedData
          }
        } else {
          if (month in topLevel) {
            let mergedData = topLevel[month].concat(
              feeStructure['timestamp'][timestamp]
            )
            topLevel[month] = mergedData
          } else {
            topLevel[month] = []
            let mergedData = topLevel[month].concat(
              feeStructure['timestamp'][timestamp]
            )
            topLevel[month] = mergedData
          }
        }
      })
    })
    prepareInstallmentWiseData({
      is_previous_due: true,
      previousSessionDueTopLevel,
      duration,
      rows,
      totalDue,
    })
    prepareInstallmentWiseData({
      is_previous_due: false,
      topLevel,
      duration,
      rows,
      totalDue,
    })
  })

  delete feesData.fees
  return {...feesData, ...rows, ...totalDue}
}

const prepareInstallmentWiseData = ({
  is_previous_due,
  previousSessionDueTopLevel = {},
  topLevel = {},
  duration,
  rows,
  totalDue,
}) => {
  Object.keys(is_previous_due ? previousSessionDueTopLevel : topLevel)
    .sort()
    .reduce(function (result, key) {
      result[key] = is_previous_due
        ? previousSessionDueTopLevel[key]
        : topLevel[key]
      return result
    }, {})
  Object.keys(is_previous_due ? previousSessionDueTopLevel : topLevel).forEach(
    (installment, i) => {
      const d = new Date(parseInt(installment) * 1000)
      const monthId = uuid()
      const monthInString =
        d.toString().split(' ')[1] + ' ' + d.toString().split(' ')[3]
      const monthRow = {
        id: monthId,
        actualId: installment,
        type: 'month',
        name: monthInString,
        fee: 0,
        discount: 0,
        due: 0,
        amount: 0,
        paid: 0,
        hidden: false,
        icon: 'downArrow',
        selected: i == 0 ? true : false,
        childrenShowing: true,
      }
      rows[is_previous_due ? `previous_session_${duration}` : duration].push(
        monthRow
      )
      let processData = is_previous_due ? previousSessionDueTopLevel : topLevel
      processData[installment].forEach((feeType) => {
        const childRowId = uuid()
        const childRow = {
          type: 'childLevel',
          actualId: feeType['_id'],
          id: childRowId,
          name: feeType['category_name'],
          fee: feeType['fee'],
          discount: parseFloat(feeType['discount']),
          due: parseFloat(feeType['due']),
          paid: parseFloat(feeType['due']),
          amount: parseFloat(feeType['due']),
          hidden: false,
          icon: null,
          selected: i == 0 ? true : false,
          parentId: monthRow.id,
          structureId: feeType.structure_id,
          structureName: feeType.structure_name,
        }
        rows[is_previous_due ? `previous_session_${duration}` : duration].push(
          childRow
        )
        monthRow.fee += childRow.fee
        monthRow.paid += childRow.paid
        monthRow.amount += childRow.amount
        monthRow.due += childRow.due
        monthRow.discount += childRow.discount
        totalDue[`${duration}TotalDue`] += childRow.due
      })
    }
  )
}

export const prepareFeesPayload = (feesData, metaData = {}) => {
  const feeRecords = feesData[feesData.collectFeesDuration]
  const topLevelRecords = feeRecords.filter(
    (r) => r.type === 'childLevel' && r.selected === true
  )
  const structureWiseRecords = {}
  topLevelRecords.map((record) => {
    const structure_id = record.structureId
    if (structure_id in structureWiseRecords) {
      let mergedData = structureWiseRecords[structure_id].concat(record)
      structureWiseRecords[structure_id] = mergedData
    } else {
      structureWiseRecords[structure_id] = []
      let mergedData = structureWiseRecords[structure_id].concat(record)
      structureWiseRecords[structure_id] = mergedData
    }
  })
  return Object.keys(structureWiseRecords).map((tr) => ({
    structure_id: tr == 'null' ? null : tr,
    transactions: structureWiseRecords[tr].map((gc) => {
      let obj = {
        id: gc.actualId,
        amount: parseFloat(gc.paid || 0),
      }

      if (metaData?.adHocDiscountValuesArr) {
        let adHocDiscount = metaData.adHocDiscountValuesArr.find(
          (adHoc) => adHoc.childLevelId === gc.id
        )
        if (adHocDiscount && adHocDiscount.isChecked) {
          obj.adhoc_discount_id = adHocDiscount.adHocReasonId
          obj.adhoc_discount_amount = parseFloat(adHocDiscount.discountAmount)
          obj.adhoc_discount_remarks = adHocDiscount.remarks
        }
      }

      return obj
    }),
  }))
}

export const handleEasebuzzRegistration = (eventManager, link) => {
  eventManager.send_event(events.REGISTER_FOR_GATEWAY_CLICKED_TFI, {
    gateway: link,
  })
  window.open(link)
}

export const listData = (listDetailData) => {
  let listObj = {}
  let curData = {...listDetailData}
  Object.keys(curData)
    .filter((key) => key !== 'title' && key !== 'desc')
    .forEach(function (key) {
      listObj[key] = {
        ...listDetailData,
        id: key,
        title: listDetailData[key].title,
        desc: '',
        settings: [],
      }
    })
  return listObj
}

export const fSettings = (data) => {
  let newObj = {}
  let settingData = {...data}
  Object.keys(settingData).map(function (key) {
    if (key !== 'miscellaneous_settings') {
      newObj[key] = {
        ...settingData[key],
        id: key,
        title: settingData[key].title,
        // title: title,
        icon: '',
        iconSelected: '',
        settingsList: listData(settingData[key]),
        titleType: TITLE_OPTIONS.ACCORDION_TITLE,
        optionType: OPTION_TYPES.SIMPLE_OPTION,
        desc: null,
      }
    }
  })
  return newObj
}
