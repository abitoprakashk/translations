import {DateTime} from 'luxon'
import {INSTITUTE_HIERARCHY_TYPES} from '../../fee/fees.constants'
import {DATE_FORMAT} from '../constants/feeCustomization.constants'

const getNumberSuffix = (num) => {
  return ['st', 'nd', 'rd'][((((num + 90) % 100) - 10) % 10) - 1] || 'th'
}

export const getInstallmentLabels = (arr = []) => {
  let tempArr = [],
    instIndex = 0
  for (let inst of arr) {
    instIndex++
    tempArr.push({
      label: `${instIndex}${getNumberSuffix(
        instIndex
      )} Installment - ${DateTime.fromJSDate(new Date(inst * 1000)).toFormat(
        DATE_FORMAT
      )}`,
      value: inst,
      isSelected: false,
    })
  }
  return tempArr
}

const traverse = (data, setData, type) => {
  if (type === data.type) {
    setData[data.id] = data.name
  }
  data?.children?.map((child) => {
    traverse(child, setData, type)
  })
}

export const getClassList = (
  arr = [],
  type = INSTITUTE_HIERARCHY_TYPES.STANDARD
) => {
  const classes = {}
  traverse(arr, classes, type)
  return classes
}

export const spanSize = (arr, i, j) => {
  let x
  if (i !== 0) {
    let asc, end
    let noDraw = true
    for (
      x = 0, end = j, asc = end >= 0;
      asc ? x <= end : x >= end;
      asc ? x++ : x--
    ) {
      if (arr[i - 1][x] !== arr[i][x]) {
        noDraw = false
      }
    }
    if (noDraw) {
      return -1
    }
  }
  let len = 0
  while (i + len < arr.length) {
    let asc1, end1
    let stop = false
    for (
      x = 0, end1 = j, asc1 = end1 >= 0;
      asc1 ? x <= end1 : x >= end1;
      asc1 ? x++ : x--
    ) {
      if (arr[i][x] !== arr[i + len][x]) {
        stop = true
      }
    }
    if (stop) {
      break
    }
    len++
  }
  return len
}
