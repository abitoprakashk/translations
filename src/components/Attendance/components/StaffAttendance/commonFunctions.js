import {DateTime} from 'luxon'
import {getUTCDateTimeStamp} from '../../../../utils/Helpers'

// Get current date
export const getCurrentDate = () => {
  return DateTime.now().toFormat('yyyy-MM-dd')
}

// Get UTC TimeStamp
export const getUTCTimeStamp = (selectedDate) => {
  const passUTCTimeStampParams = {
    year: DateTime.fromFormat(selectedDate, 'yyyy-MM-dd').toFormat('yyyy'),
    month: DateTime.fromFormat(selectedDate, 'yyyy-MM-dd').toFormat('MM') - 1,
    day: DateTime.fromFormat(selectedDate, 'yyyy-MM-dd').toFormat('dd'),
  }
  const getTimeStampValue = getUTCDateTimeStamp(passUTCTimeStampParams)
  return getTimeStampValue
}

// Get Staff Filter collection list
export const newStaffFilterCollectionList = (staffListData, statusValue) => {
  const newStaffListData = staffListData?.map((item) => {
    return {
      ...item,
      status: statusValue,
    }
  })
  return newStaffListData
}

export const sortOnProperty = (arr, property, asc = true) => {
  arr.sort((a, b) => {
    const item1 = a[property]
    const item2 = b[property]
    if (asc) {
      if (item1 < item2) return -1
      if (item1 > item2) return 1
    } else {
      if (item1 < item2) return 1
      if (item1 > item2) return -1
    }
    return 0
  })
  return arr
}

export const isURLValid = (img_url) => {
  let checkURL = false
  if (img_url && img_url !== '') {
    let url
    try {
      url = new URL(img_url)
    } catch (_) {
      return false
    }
    return url.protocol === 'http:' || url.protocol === 'https:'
  }
  return checkURL
}
