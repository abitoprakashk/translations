import {DateTime} from 'luxon'
import {getUTCDateTimeStamp} from '../../../../utils/Helpers'
import {getNodeDataWithChildrensParent} from '../../../../utils/HierarchyHelpers'

export const getDateObj = (dateStr) => {
  if (!dateStr || dateStr === '') return ''
  let date
  if (typeof dateStr === 'string') {
    let dateArr = dateStr.split('/')
    date = new Date(dateArr[2], dateArr[1] - 1, dateArr[0])
  } else {
    date = new Date(dateStr * 1000)
  }
  return isNaN(date.getTime()) ? '' : date
}

export const getDdMmYyyy = (date) => {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

export const getDateDdMmYyyy = (dateObject) => {
  return DateTime.fromJSDate(dateObject.date).toFormat(dateObject.dateFormat)
}

export const getDateRangeUTCTimeStamp = (selectedDate) => {
  const passUTCTimeStampParams = {
    year: DateTime.fromJSDate(selectedDate).toFormat('yyyy'),
    month: DateTime.fromJSDate(selectedDate).toFormat('MM'),
    day: DateTime.fromJSDate(selectedDate).toFormat('dd'),
  }
  const getTimeStampValue = getUTCDateTimeStamp(passUTCTimeStampParams)
  return getTimeStampValue
}

export const getClassSectionValues = ({
  studentDetails,
  classList,
  instituteHierarchy,
}) => {
  let sections = []
  if (studentDetails && studentDetails?.standard !== '') {
    let standardValue = ''
    if (classList) {
      standardValue =
        classList.find((item) => item.label === studentDetails.standard)
          ?.value || studentDetails?.standard
    }
    if (standardValue && standardValue !== '') {
      // if (studentDetails.standard) {
      //   studentDetails.standard = standardValue
      // }
      const node = getNodeDataWithChildrensParent(
        instituteHierarchy,
        standardValue
      )
      node?.children?.forEach((item) => {
        if (item.type === 'SECTION') {
          sections.push({label: item.name, value: item.name})
        }
      })
    }
  }
  return sections
}
