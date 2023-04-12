import {DateTime, Interval} from 'luxon'
import Label from '../components/Common/Label/Label'
import moment from 'moment'
import {
  ACT_SEC_ADD_SUBJECT,
  ACT_SEC_ASSIGN_SUB_TEACHER,
  ACT_SEC_CLASS_ASSIGN_STUDENTS,
  ACT_SEC_CLASS_ASSIGN_TEACHER,
} from './SchoolSetupConstants'
import {
  BROWSER_STORAGE_KEYS,
  INSTITUTE_TYPES,
  INSTITUTE_TYPES_INFO,
} from '../constants/institute.constants'
import {events} from './EventsConstants'
import {t} from 'i18next'
import {DEFAULT_CURRENCY} from '../constants/common.constants'
import {currencyMap} from './currencyMap'
import {saveAs} from 'file-saver'
import {Tooltip} from '@teachmint/krayon'

export const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

export const daysWithSunday = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export const months = {
  JANUARY: 1,
  FEBRUARY: 2,
  MARCH: 3,
  APRIL: 4,
  MAY: 5,
  JUNE: 6,
  JULY: 7,
  AUGUST: 8,
  SEPTEMBER: 9,
  OCTOBER: 10,
  NOVEMBER: 11,
  DECEMBER: 12,
}

export const frequencies = [
  'One time',
  'Daily',
  'Weekly',
  'Monthly',
  'Quarterly',
  'Half yearly',
  'Yearly',
]

export const frequencyLabels = [
  'Only Once',
  'Per Day',
  'Per Week',
  'Per Month',
  'Per Quarter',
  'Per Half Year',
  'Per Year',
]

const daysShortForm = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const CURRENCIES = {
  RUPEE: '₹',
  DOLLAR: '$',
}

function toFixed(x) {
  if (Math.abs(x) < 1.0) {
    let e = parseInt(x.toString().split('e-')[1])
    if (e) {
      x *= Math.pow(10, e - 1)
      x = '0.' + new Array(e).join('0') + x.toString().substring(2)
    }
  } else {
    let e = parseInt(x.toString().split('+')[1])
    if (e > 20) {
      e -= 20
      x /= Math.pow(10, e)
      x += new Array(e + 1).join('0')
    }
  }
  return x
}

export const roundWithPrecision = (num, dec = 2) => {
  num = Math.round(num + 'e' + dec)
  // return Number(num + 'e-' + dec)
  return Number(toFixed(num) + 'e-' + dec)
}

export const getAmountWithCurrency = (amount, currency = DEFAULT_CURRENCY) => {
  if (amount === null) {
    return getSymbolFromCurrency(currency || DEFAULT_CURRENCY)
  }

  return (
    getSymbolFromCurrency(currency || DEFAULT_CURRENCY) +
    ' ' +
    roundWithPrecision(amount)
  )
}

export const getAmountFixDecimalWithCurrency = (
  amount,
  currency = DEFAULT_CURRENCY
) => {
  return (
    <>
      <div className="inline-flex justify-start">
        <label className="ml-0 text-inherit" style={{fontSize: 'inherit'}}>
          {getSymbolFromCurrency(currency || DEFAULT_CURRENCY)}
        </label>
        <label className="ml-1 text-inherit" style={{fontSize: 'inherit'}}>
          {roundWithPrecision(amount).toLocaleString(
            currency === DEFAULT_CURRENCY ||
              currency === '' ||
              currency === null
              ? 'en-IN'
              : 'en-US'
          )}
        </label>
      </div>
    </>
  )
}

export const getPlainAmountFixDecimalWithCurrency = (
  amount,
  currency = DEFAULT_CURRENCY
) => {
  return roundWithPrecision(amount).toLocaleString(
    currency === DEFAULT_CURRENCY || currency === '' || currency === null
      ? 'en-IN'
      : 'en-US'
  )
}

// following function is equivalent to toFixed but it won't auto round to next integer
Number.prototype.toFixedNoRounding = function (n) {
  const reg = new RegExp('^-?\\d+(?:\\.\\d{0,' + n + '})?', 'g')
  const a = this.toString().match(reg)[0]
  const dot = a.indexOf('.')
  if (dot === -1) {
    // integer, insert decimal dot and pad up zeros
    return a + '.' + '0'.repeat(n)
  }
  const b = n - (a.length - dot) + 1
  return b > 0 ? a + '0'.repeat(b) : a
}

const formatNumber = (value, currency = DEFAULT_CURRENCY) => {
  if (currency === DEFAULT_CURRENCY || currency === '' || currency === null) {
    switch (true) {
      case value >= 10000000:
        return (value / 10000000).toFixed(2) + 'Cr'
      case value >= 100000:
        return (value / 100000).toFixed(2) + 'L'
      case value >= 1000:
        return (value / 1000).toFixed(2) + 'T'
      default:
        return value.toFixed(2)
    }
  } else {
    switch (true) {
      case value >= 1000000000:
        return (value / 1000000000).toFixed(2) + 'B'
      case value >= 1000000:
        return (value / 1000000).toFixed(2) + 'M'
      case value >= 1000:
        return (value / 1000).toFixed(2) + 'K'
      default:
        return value.toFixed(2)
    }
  }
}

export const numDifferentiation = (value, currency = DEFAULT_CURRENCY) => {
  const isNegative = value < 0
  const val = Math.abs(value)
  const formattedNumber = formatNumber(val, currency)
  const symbol = getSymbolFromCurrency(currency || DEFAULT_CURRENCY)

  return (
    <div className="flex justify-center">
      <label className="ml-0 text-inherit" style={{fontSize: 'inherit'}}>
        {symbol}
      </label>
      <label className="ml-1 text-inherit" style={{fontSize: 'inherit'}}>
        {isNegative ? '-' : ''}
        {formattedNumber}
      </label>
    </div>
  )
}

export const numDifferentiationWithoutStyling = (
  value,
  currency = DEFAULT_CURRENCY
) => {
  const isNegative = value < 0
  const absValue = Math.abs(value)
  const formattedNumber = formatNumber(absValue, currency)
  const symbol = getSymbolFromCurrency(currency || DEFAULT_CURRENCY)

  return (
    <>
      <div className="flex">
        <label className="ml-0 text-inherit" style={{fontSize: 'inherit'}}>
          {symbol}
        </label>
        <label className="ml-1 text-inherit" style={{fontSize: 'inherit'}}>
          {isNegative && <span>-</span>}
          <span>{formattedNumber}</span>
        </label>
      </div>
    </>
  )
}

export const getTodayDate = () => {
  let day = daysWithSunday[new Date().getDay()]
  let date = new Date().toDateString()
  date = date.split(' ')
  return `${day}, ${date[2]} ${date[1]} ${date[3]}`
}

export const getToday = () => {
  let date = new Date().toDateString()
  date = date.split(' ')
  let w = daysShortForm.indexOf(date[0])
  return w
}

export const getDate = (p = 0) => {
  let date = new Date()
  date.setDate(date.getDate() - p)

  let d = date,
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
}

export const convertTime12to24 = (time12h) => {
  if (!time12h) return
  const [time, modifier] = time12h.split(' ')
  let [hours, minutes] = time.split(':')
  if (hours === '12') hours = '00'
  if (modifier === 'PM') hours = parseInt(hours, 10) + 12

  return `${hours}:${minutes}`
}

export const convertTime24to12 = (time24h) => {
  if (!time24h) return
  let [hours, minutes] = time24h.split(':')
  let modifier = 'AM'
  hours = parseInt(hours)
  if (hours >= 12) {
    modifier = 'PM'
    hours = hours - 12
  }
  if (hours === 0) hours = 12
  if (hours < 10) hours = `0${hours}`
  return `${hours}:${minutes} ${modifier}`
}

export const filterClasses = (allClasses) => {
  let liveClassesScheduled = []
  let day = getToday()

  for (let c of allClasses) if (c.timings[day]) liveClassesScheduled.push(c)
  return liveClassesScheduled
}

export const getTodayTiming = (timings) => {
  const timingsTemp = getConvertedTimings(timings)

  const curDayData = timingsTemp[getToday()]
  if (curDayData?.[0]) {
    return `${curDayData?.[0]?.from} - ${curDayData?.[0]?.to}`
  }
  return ''
}

export const getTeacherInviteMsg = (
  adminName,
  instituteId,
  instituteName,
  adminId,
  instituteType
) => `Your ${getInstituteType(
  instituteType
)} admin ${adminName} has invited you to join their institute ${instituteName} on Teachmint app.
Institute ID : ${instituteId}
Join the institute using the below link:
https://www.teachmint.com/join/institute/${instituteId}/${adminId}`

export const getCircularProgressColor = (value) => {
  if (value <= 50) return '#ff5e5e'
  else if (value <= 75) return '#ea8804'
  return '#36b37e'
}

export const getDateAndTime = (u) => {
  u = new Date(u * 1000)
  let vals = u.toDateString().split(' ')
  let date = `${vals[2]} ${vals[1]} ${vals[3]}`
  let hr = u.getHours()
  let min = u.getMinutes()
  return `${date}, ${hr > 12 ? hr - 12 : hr}:${min < 10 ? '0' + min : min} ${
    hr > 12 ? 'PM' : 'AM'
  }`
}

export const getDateFromTimeStamp = (u) => {
  u = new Date(u * 1000)
  let vals = u.toDateString().split(' ')
  let date = `${vals[2]} ${vals[1]} ${vals[3]}`
  return date
}

export const getTeacherWiseClassroomList = (classrooms) => {
  let tC = {}
  for (const c of classrooms) {
    if (c.etype === 1) {
      let id = c.teacherData._id
      if (!tC[id]) {
        let obj = {}
        obj.etype = c.etype
        obj.teacherData = {
          teacher_id: id,
          teacher_name: c.teacherData.name,
          phone_number: c.teacherData.phone_number,
          students: c.no_of_students,
          totalClasses: 1,
          img_url: c.teacherData.img_url,
          subjects: c.subject,
          etype: c.etype,
        }
        obj.classrooms = []
        obj.classrooms.push({
          class_name: c.name,
          subject: c.subject,
          no_of_students: c.no_of_students,
          class_id: c._id,
          requestType: c.requestType,
          etype: c.etype,
        })
        tC[id] = obj
      } else {
        if (tC[id]?.teacherData?.students)
          tC[id].teacherData.students += c.no_of_students
        if (tC[id]?.teacherData?.totalClasses)
          tC[id].teacherData.totalClasses += 1
        if (tC[id]?.teacherData?.subjects)
          tC[id].teacherData.subjects += ',' + c.subject
        if (tC[id]?.classrooms && Array.isArray(tC[id]?.classrooms))
          tC[id].classrooms.push({
            class_name: c.name,
            subject: c.subject,
            no_of_students: c.no_of_students,
            class_id: c._id,
            requestType: c.requestType,
            etype: c.etype,
          })
      }
    } else {
      let id = c.user_id
      let obj = {
        ...c,
        requestType: c.requestType,
        name: c.name,
        etype: c.etype,
      }
      tC[id] = obj
    }
  }
  return Object.values(tC)
}

export const getTopTeachers = (res) => {
  let mostLiveClasses = [...res]
  let bestAttendance = [...res]

  mostLiveClasses.sort((class1, class2) => {
    if (class1.live_classes < class2.live_classes) return 1
    if (class1.live_classes > class2.live_classes) return -1
    return 0
  })

  bestAttendance.sort((class1, class2) => {
    if (class1.avg_attendance < class2.avg_attendance) return 1
    if (class1.avg_attendance > class2.avg_attendance) return -1
    return 0
  })

  mostLiveClasses = mostLiveClasses.slice(0, 3)
  bestAttendance = bestAttendance
    .filter(({avg_attendance}) => avg_attendance !== null)
    .slice(0, 3)

  return {mostLiveClasses, bestAttendance}
}
export const getTotalDaysPresent = (props) => {
  const {dateRange, student, i, dayWiseAttendance} = props
  let present_count = 0
  const mapCount = dateRange?.map((day) => {
    const studentAttenadnce = dayWiseAttendance?.[day?.toSeconds()]?.[i]?.data
    if (
      studentAttenadnce?.present_students?.find((item) => item === student?._id)
    ) {
      present_count++
    }
    return present_count
  })
  return mapCount?.pop()
}
export const filterAttendance = (data) => {
  let aMap = {}
  let tAttendance = []
  let sAttendance = []

  for (const a of data) {
    aMap[a.dated] = a
  }
  for (let i = 6; i >= 0; i--) {
    let date = getDate(i)
    tAttendance.push(aMap[date] ? aMap[date].teachers_attendance : 0)
    sAttendance.push(aMap[date] ? aMap[date].avg_student_attendance : 0)
  }
  return [
    {
      title: 'Teachers Attendance %',
      attendance: tAttendance,
    },
    {
      title: 'Students Attendance %',
      attendance: sAttendance,
    },
  ]
}

export const getLastWeekDays = () => {
  let days = []
  let today = new Date()
  for (let i = 0; i <= 6; i++) {
    today.setDate(today.getDate() - (i === 0 ? 0 : 1))
    let arr = today.toDateString().split(' ')
    days.unshift(`${arr[1]} ${arr[2]}`)
  }
  return days
}

export const getScreenWidth = () => (window && window.innerWidth) || 0

export const getUnreadNotificationCount = (data) =>
  data.filter(({read}) => !read).length

export const getClassroomDays = (timings) => {
  if (timings)
    return timings
      .map((item, index) => {
        return item?.length > 0 ? daysShortForm[index] : ''
      })
      .filter((item) => item)
      .join(', ')
  return ''
}

export const getUniqueItems = (arr) => {
  let set = new Set(arr)
  return Array.from(set).filter((item) => item)
}

export const getDateNewFormat = (argDate) => {
  let date = null
  if (argDate) {
    date = new Date(argDate).toDateString()
  } else {
    date = new Date().toDateString()
  }
  date = date.split(' ')
  return `${date[2]} ${date[1]} '${String(date[3]).substring(2)}`
}

export const constructExistingStudentObj = (
  headers,
  mapper,
  data,
  defaultValues = {}
) => {
  let arr = data.map((obj) => {
    let row = {...obj}
    row.imember_id = row?._id || ''
    row.name = row?.full_name ? row?.full_name : row?.first_name || ''
    let classRoom = row?.classroom ? row.classroom.split('-') : ''
    row.standard =
      classRoom && classRoom.length > 0 ? classRoom?.splice(0, 1) : ''
    row.section = classRoom?.toString().replace(',', '-') || ''
    row.department = row?.standard || ''
    row.batch = row?.section || ''
    row.line1 = row?.current_address?.line1 || ''
    row.line2 = row?.current_address?.line2 || ''
    row.country = row?.current_address?.country || ''
    row.state = row?.current_address?.state || ''
    row.pin = row?.current_address?.pin || ''
    row.city = row?.current_address?.city || ''
    let phnNumber = row?.phone_number?.split('-') || ''
    row.country_code = phnNumber?.length === 2 ? phnNumber[0] : '91'
    row.phone_number = phnNumber[1] || phnNumber[0]
    row.father_contact_number = row?.father_contact_number?.split('-')[1] || ''
    row.mother_contact_number = row?.mother_contact_number?.split('-')[1] || ''
    row.guardian_number = row?.guardian_number?.split('-')[1] || ''
    row.enrollment_number = row?.enrollment_number?.split('@')[0]
    row.religion = row?.religion === 'NONE' ? '' : row?.religion
    row.category = row?.category === 'NONE' ? '' : row?.category
    row.pwd = row?.pwd ? 'Yes' : 'No'
    row.right_to_education = row?.right_to_education ? 'Yes' : 'No'
    row.date_of_birth = row?.date_of_birth
      ? DateTime.fromSeconds(row?.date_of_birth).toFormat(`dd/LL/yy`)
      : '-'
    let date = row?.admission_timestamp
      ? new Date(row?.admission_timestamp * 1000)
      : ''
    row.admission_timestamp =
      date !== ''
        ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        : ''
    let newObj = {}
    headers.forEach((key) => {
      if (key in defaultValues) {
        newObj[key] = defaultValues[key]
      } else {
        newObj[key] = row[mapper[key]]
      }
    })

    return newObj
  })
  return arr
}

export const CSVtoJSObject = (strData) => {
  // If empty, return empty headers and rows list
  if (!strData) return {headers: [], rows: []}

  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  let strDelimiter = ','
  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
    // Delimiters.
    '(\\' +
      strDelimiter +
      '|\\r?\\n|\\r|^)' +
      // Quoted fields.
      '(?:"([^"]*(?:""[^"]*)*)"|' +
      // Standard fields.
      '([^"\\' +
      strDelimiter +
      '\\r\\n]*))',
    'gi'
  )
  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]]
  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null
  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while ((arrMatches = objPattern.exec(strData))) {
    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[1]
    var strMatchedValue = ''
    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push([])
    }
    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[2]) {
      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      strMatchedValue = arrMatches[2].replace(new RegExp('""', 'g'), '"')
    } else {
      // We found a non-quoted value.
      strMatchedValue = arrMatches[3]
    }
    // Now that we have our value string, let's add
    // it to the data array.
    arrData[arrData.length - 1].push(String(strMatchedValue).trim())
  }

  var objArray = []
  for (var i = 1; i < arrData.length; i++) {
    objArray[i - 1] = {}
    for (var k = 0; k < arrData[0].length; k++) {
      var key = arrData[0][k]
      objArray[i - 1][key] = arrData[i][k] || ''
    }
  }
  return {headers: arrData[0], rows: objArray}
}

export const JSObjectToCSV = (headers, rows = []) => {
  let CSVObj = [headers, ...rows.map((item) => Object.values(item))]
  let CSVRows = CSVObj.map((item) => {
    let advanceItems = item.map((element) => {
      if (!element) return ''
      if (typeof element === 'string') return `"${element.replace(/"/g, '""')}"`
      return `"${element}"`
    })
    return advanceItems.join(',')
  })
  return CSVRows.join('\n')
}

const format1 = 'yyyy-LL-dd'
const format2 = 'dd-LL-yyyy'
const fullDate = 'yyyy-LL-dd hh:mm:ss'
export const changeDateFormat = (inputDate, toFormat = 'format2') => {
  const date = DateTime.fromFormat(
    inputDate,
    toFormat === 'format1' ? format2 : format1
  )
  return date.toFormat(toFormat === 'format1' ? format1 : format2)
}

export const changeDateFormateToSec = (inputDate, toFormat = 'format1') => {
  let formatData = ''
  if (toFormat === 'format1') formatData = format1
  if (toFormat === 'format2') formatData = format2
  if (toFormat === 'fullDate') formatData = fullDate

  return DateTime.fromFormat(inputDate, formatData).toSeconds()
}

// export const formatDateFormat = (date)=>{
// let value  = String(value).split("/").join("-").split(".").join("-");
// value.split("/")
// '0' + MyDate.getDate()).slice(-2)
// }

export const getRequestStatusLabel = (num) => {
  let [text, style] = ['', '']

  switch (num) {
    case 2: {
      text = t('pending')
      style = 'tm-color-red tm-bg-light-red'
      break
    }
    case 3: {
      text = t('rejected')
      style = 'tm-color-red tm-bg-light-red'
      break
    }

    case 4: {
      text = t('inactive')
      style = 'tm-color-gray tm-bg-dark-gray'
      break
    }

    default: {
      text = t('joined')
      style = 'tm-color-green tm-bg-light-green'
    }
  }

  return <Label text={text} textStyle={style} />
}

export const getSubjectsFromTeachersList = (teacherList) => {
  for (let teacher = 0; teacher < teacherList.length; teacher++) {
    let subjects = ''
    teacherList[teacher] &&
      teacherList[teacher].classrooms &&
      teacherList[teacher].classrooms.map((classroom) => {
        if (classroom.subject) subjects += classroom.subject + ','
      })
    teacherList[teacher].subjects = subjects
  }
  return teacherList
}

export const createAndDownloadCSV = (filename, text) => {
  let a = document.createElement('a')
  a.href = 'data:attachment/csv,' + encodeURIComponent(text)
  a.target = '_blank'
  a.download = `${filename}.csv`
  document.body.appendChild(a)
  a.click()
}

export const getBrowserName = () => {
  const {userAgent} = navigator

  if (userAgent.includes('Firefox/')) return 'Firefox'
  else if (userAgent.includes('Edg/')) return 'Edge'
  else if (userAgent.includes('Chrome/')) return 'Chrome'
  else if (userAgent.includes('Safari/')) return 'Safari'
  return ''
}

export const getInstituteType = (instituteType) => {
  return INSTITUTE_TYPES_INFO[instituteType]?.title || 'Institute'
}

export const checkSubscriptionType = (instituteInfo) =>
  !!(
    instituteInfo?.subscription_type === 2 ||
    instituteInfo?.subscription_type === 3
  )

export const getUpdatedInstituteInfoFromInstituteList = (
  currentInstitute,
  instituteList
) => {
  for (var i in instituteList) {
    if (currentInstitute._id === instituteList[i]._id) return instituteList[i]
  }
  return currentInstitute
}

export const toCamelCasedKeys = (obj) => {
  return obj
    ? Object.keys(obj).reduce(
        (res, e) => ({
          ...res,
          [e
            .split('_')
            .map((s, i) =>
              i == 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)
            )
            .join('')]: obj[e],
        }),
        {}
      )
    : obj
}

export const toSnakeCasedKeys = (obj) =>
  Object.keys(obj).reduce(
    (res, e) => ({
      ...res,
      [e.replace(/([A-Z])/g, (l) => `_${l.toLowerCase()}`)]: obj[e],
    }),
    {}
  )

export const toCamelCasedKeysRecursive = (obj, keyToSkip) =>
  Object.keys(obj).reduce((res, e) => {
    if (obj[e] === null || (keyToSkip && e == keyToSkip))
      return {...res, [e]: obj[e]}
    if (e === '_id') return {...res, [e]: obj[e]} // no changes to _id key
    if (typeof obj[e] === 'object' && !Array.isArray(obj[e]))
      // calling recurssively
      return {
        ...res,
        [e
          .split('_')
          .map((s, i) => (i == 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)))
          .join('')]: toCamelCasedKeysRecursive(obj[e]),
      }
    return {
      ...res,
      [e
        .split('_')
        .map((s, i) => (i == 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)))
        .join('')]: obj[e],
    }
  }, {})

export const toSnakeCasedKeysRecursive = (obj) =>
  Object.keys(obj).reduce((res, e) => {
    if (obj[e] === null) return {...res, [e]: ''}
    if (e !== null && typeof obj[e] === 'object' && !Array.isArray(obj[e]))
      return {
        ...res,
        [e.replace(/([A-Z])/g, (l) => `_${l.toLowerCase()}`)]:
          toSnakeCasedKeysRecursive(obj[e]),
      }
    return {
      ...res,
      [e.replace(/([A-Z])/g, (l) => `_${l.toLowerCase()}`)]: obj[e],
    }
  }, {})

export const toFormData = (obj) =>
  Object.keys(obj).reduce((res, e) => {
    obj[e] = typeof obj[e] === 'object' ? JSON.stringify(obj[e]) : obj[e]
    res.append(e, obj[e])
    return res
  }, new FormData())

export const toQueryString = (obj) => {
  var str = []
  for (var p in obj) str.push(p + '=' + obj[p])
  return str.join('&')
}

export const getSectionProgress = (sectionDetails) => {
  let progress = 30
  let nextStep = ''
  let lastSubjectNotCreated = ''
  let action = ''
  let subjectNode = null

  // Find Total Subjects and subject list without classes
  const totalSubjects = sectionDetails?.children?.length
  const subjectWithoutClass = sectionDetails?.children?.filter(
    ({teacher_detail}) =>
      !teacher_detail?.phone_number && !teacher_detail?.email
  )
  subjectWithoutClass?.forEach((item) => {
    if (!lastSubjectNotCreated) {
      subjectNode = item
      lastSubjectNotCreated = item?.name
    }
  })
  const subjectWithClassNum = totalSubjects - subjectWithoutClass?.length

  // If no subject
  if (totalSubjects === 0) {
    nextStep = 'Add Subject'
    action = ACT_SEC_ADD_SUBJECT
  }

  // Calculate subjects score
  if (totalSubjects === subjectWithClassNum && totalSubjects > 0) progress += 50
  else if (!nextStep) {
    progress += Math.min(subjectWithClassNum * 10, 50)
    nextStep = `${t('addTeacherTo')} ${lastSubjectNotCreated}`
    action = ACT_SEC_ASSIGN_SUB_TEACHER
  }

  // Calculate class teacher score
  if (sectionDetails?.class_teacher?.phone_number) progress += 10
  else if (!nextStep) {
    nextStep = 'Add Class Teacher'
    action = ACT_SEC_CLASS_ASSIGN_TEACHER
  }

  // Calculate student no. score
  if (sectionDetails?.section_students?.length > 0) progress += 10
  else if (!nextStep) {
    nextStep = 'Add Students'
    action = ACT_SEC_CLASS_ASSIGN_STUDENTS
  }

  return {progress, nextStep, action, subjectNode}
}

export const getDateSuffix = (date) => {
  if (date > 3 && date < 21) return 'th'
  switch (date % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}

export const getFormattedFrequencyDate = (date, frequency) => {
  let f = ''
  if ([0, 1, 3, 4, 5, 6].includes(frequency)) {
    f =
      (frequency === 1 ? ' from ' : ' on ') +
      date.getDate() +
      getDateSuffix(date.getDate()) +
      ([0, 1].includes(frequency)
        ? ' ' + date.toLocaleString('default', {month: 'short'})
        : '')
  } else if (frequency === 2) {
    f = ' on ' + days[date.getDay() - 1]
  }
  return frequencies[frequency] + f
}

export const getAcademicSessionMonths = (startTime, endTime) => {
  let startDatetime = DateTime.fromMillis(parseInt(startTime))
  let endDatetime = DateTime.fromMillis(parseInt(endTime))
  const interval = Interval.fromDateTimes(startDatetime, endDatetime)
  let months = []
  for (let month = 0; month < interval.length('months'); month++) {
    months.push({
      value: startDatetime.toFormat('LL-y'),
      label: startDatetime.toFormat('LLL yyyy'),
    })
    startDatetime = startDatetime.plus({months: 1})
  }
  return months
}

export const toArrayString = (arr) => {
  let str = '['
  str += arr.map((e) => `"${e}"`).join(',')
  str += ']'
  return str
}

export const createDateFromString = (dateString, delimiter) => {
  delimiter = delimiter ? delimiter : '-'
  let dateParts = dateString.split(delimiter)
  return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
}

export const getClassroomTimingsStructure = (dayInfo) => {
  const timings = Array(7).fill([])
  dayInfo.forEach(({status, from, to}, index) => {
    if (status) {
      const {st, dayIndex} = adustSlotsForUTC(from, index)
      const duration = getTimeDiff(from, to)
      timings[dayIndex] = [...timings[dayIndex], {st, duration}]
    }
  })
  return timings
}

export function adustSlotsForUTC(time, index) {
  let startOfWeek = moment().startOf('week').add(1, 'day')
  const number = moment(time, ['h:mm A']).format('HH:mm:ss')
  const date = moment(startOfWeek)
    .add(index, 'days')
    .format('YYYY-MM-DD ' + number)
  const finalUtc = moment.utc(moment(date)).format('HH:mm:ss')
  const week = moment.utc(moment(date)).day()
  return {st: finalUtc, dayIndex: week === 0 ? 6 : week - 1}
}

export function getStartEndDateTimestamps(date) {
  let start, end
  if (!date) date = moment()
  else date = moment(date)
  start = parseInt(date.startOf('day').valueOf() / 1000)
  end = parseInt(date.endOf('day').valueOf() / 1000)
  return {start, end}
}

export function getTimeDiff(from, to) {
  //getting difference in seconds between to times provided in AM/PM format
  const start = moment(from, ['h:mm A'])
  const end = moment(to, ['h:mm A'])
  return end.diff(start, 'seconds')
}

export const getConvertedTimings = (timings) => {
  const newTimingArray = Array(7).fill([])
  timings &&
    timings.forEach((slots, index) => {
      if (slots && slots.length)
        slots.forEach((slot) => {
          const {st, duration} = slot
          const {res: start, slotIndex} = convertUtcSlotsToLocal(st, index)
          const existingSlots = newTimingArray[slotIndex]
          const end = addSecondsToTime(start, duration)
          const startTime = convertToAmPMFormat(start)
          const endTime = convertToAmPMFormat(end)
          if (moment(start).date() !== moment(end).date()) {
            newTimingArray[slotIndex] = [
              ...existingSlots,
              {from: startTime, to: '11:59 PM'},
            ]
            const nextSlotIndex = slotIndex === 6 ? 0 : slotIndex + 1
            const nextDaySlots = newTimingArray[nextSlotIndex] || []
            newTimingArray[nextSlotIndex] = [
              {from: '12:00 AM', to: endTime},
              ...nextDaySlots,
            ]
          } else {
            newTimingArray[slotIndex] = [
              ...existingSlots,
              {from: startTime, to: endTime},
            ]
          }
        })
    })
  return newTimingArray
}

export function convertUtcSlotsToLocal(st, index) {
  let startOfWeek = moment.utc().startOf('week').add(1, 'day')
  const date = moment.utc(startOfWeek).add(index, 'days')
  const utcDate = moment.utc(moment.utc(date).format('YYYY-MM-DD') + ' ' + st)
  let res = moment(utcDate).local()
  const slotIndex = moment(utcDate).local().weekday()
  /* const date_ = moment.utc(`2017-02-02 ${st}`).local().format("HH:mm:ss"); */
  return {res, slotIndex: slotIndex === 0 ? 6 : slotIndex - 1}
}

export function convertToAmPMFormat(date) {
  return moment(date, ['HH:mm']).format('hh:mm A')
}
export function addSecondsToTime(start, duration) {
  return moment(start).add(duration, 'seconds')
}

export const convertTimestampToLocalTime = (timestamp) =>
  DateTime.fromMillis(parseInt(timestamp)).toFormat('yyyy-LL-dd')

export const convertTimestampToLocalDateTime = (timestamp) =>
  DateTime.fromSeconds(parseInt(timestamp)).toFormat('dd LLL yyyy')

export const getDifferenceBetweenDateNToday = (timestamp) => {
  let i = Interval.fromDateTimes(
    DateTime.fromSeconds(+timestamp),
    DateTime.now()
  )
  let diff = Math.floor(i.length('days'))
  return diff
}

export const arrayUniqueByKeys = (array, keys) => {
  if (array) {
    let seen = Object.create(null)
    return array.filter((o) => {
      var key = keys.map((k) => o[k]).join('|')
      if (!seen[key]) {
        seen[key] = true
        return true
      }
    })
  }
  return []
}

export const sendTeacherAddedEvent = (
  eventManager,
  instituteType,
  screen_name
) => {
  let teacherEvent = null
  switch (instituteType) {
    case INSTITUTE_TYPES.SCHOOL:
      teacherEvent = events.TEACHER_ADDED_IN_SCHOOL_TFI
      break

    case INSTITUTE_TYPES.COLLEGE:
      teacherEvent = events.TEACHER_ADDED_IN_COLLEGE_TFI
      break

    case INSTITUTE_TYPES.TUITION:
      teacherEvent = events.TEACHER_ADDED_IN_COACHING_TFI
      break

    default:
      break
  }
  if (teacherEvent)
    eventManager.send_event(teacherEvent, {screen_name: screen_name}, true)

  eventManager.send_event(
    events.TEACHER_ADDED_TFI,
    {screen_name: screen_name},
    true
  )
}

export const camelCaseText = (s) => {
  return s
    .split(' ')
    .map((e) => e.charAt(0).toUpperCase() + e.slice(1).toLowerCase())
    .join(' ')
}

export const hugeDateConverter = (setdate) => {
  let selectedDate = DateTime.fromFormat(setdate, 'yyyy-MM-dd')
  const currentDate = DateTime.now()
  selectedDate = selectedDate.plus({
    hours: currentDate.hour,
    minutes: currentDate.minute,
  })
  let hugeDate = selectedDate.toFormat('yyyy-MM-dd hh:mm:ss')
  return hugeDate
}

export const getShortTxnId = (str, n) => {
  return str.length > n ? str.substr(0, n - 1) + '...' : str
}

export const setToLocalStorage = (key, value) =>
  window.localStorage.setItem(key, value)

export const getFromLocalStorage = (key) => window.localStorage.getItem(key)

export const setToSessionStorage = (key, value) =>
  window.sessionStorage.setItem(key, value)

export const getFromSessionStorage = (key) => window.sessionStorage.getItem(key)

export const deleteFromSessionStorage = (key) =>
  window.sessionStorage.removeItem(key)

export const setAdminSpecificToLocalStorage = (key, value) => {
  const adminUUID = getFromSessionStorage(BROWSER_STORAGE_KEYS.ADMIN_UUID)
  const data = JSON.parse(
    getFromLocalStorage(BROWSER_STORAGE_KEYS.ADMINS_GLOBAL) || '{}'
  )
  const selectedAdminData = data[adminUUID] || {}
  selectedAdminData[key] = value
  data[adminUUID] = selectedAdminData
  setToLocalStorage(BROWSER_STORAGE_KEYS.ADMINS_GLOBAL, JSON.stringify(data))
}

export const getAdminSpecificFromLocalStorage = (key) => {
  const adminUUID = getFromSessionStorage(BROWSER_STORAGE_KEYS.ADMIN_UUID)
  const data = JSON.parse(
    getFromLocalStorage(BROWSER_STORAGE_KEYS.ADMINS_GLOBAL) || '{}'
  )
  return data?.[adminUUID]?.[key]
}

export const deleteAdminSpecificToLocalStorage = (adminUUID) => {
  const data = JSON.parse(
    getFromLocalStorage(BROWSER_STORAGE_KEYS.ADMINS_GLOBAL) || '{}'
  )
  if (data[adminUUID]) delete data[adminUUID]
  setToLocalStorage(BROWSER_STORAGE_KEYS.ADMINS_GLOBAL, JSON.stringify(data))
}

export const getDateObjFromString = (dateStr) => {
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

export const getUTCDateTimeStamp = ({year, month, day}) => {
  const utcTimeStamp = Date.UTC.apply(null, [year, month, day]) / 1000
  return utcTimeStamp
}

export const setInstituteLanguage = (instituteInfo) => {
  setToLocalStorage(
    BROWSER_STORAGE_KEYS.LANGUAGE,
    instituteInfo.language !== null ? instituteInfo.language : 'en-US'
  )
}

export const pdfPrint = async (pdfUrl, callback) => {
  if (getScreenWidth() < 1020) {
    window.open(pdfUrl, '_blank')
    if (callback) callback()
  } else {
    let iframe = document.createElement('iframe') //load content in an iframe to print later
    document.body.appendChild(iframe)
    iframe.style.display = 'none'
    const blob = await fetch(pdfUrl).then((r) => r.blob())
    iframe.src = URL.createObjectURL(blob)

    iframe.onload = function () {
      setTimeout(function () {
        iframe.focus()
        iframe.contentWindow.print()
        if (callback) callback()
      }, 100)
    }
  }
}

export const asyncDocStatusCheckPolling = (callBack, duration = 5000) => {
  return setInterval(() => {
    callBack()
  }, duration)
}

export const getDownloadCSV = (fileName, text) => {
  let downloadLink = document.createElement('a')
  let blob = new Blob(['\ufeff', text])
  let url = URL.createObjectURL(blob)
  downloadLink.href = url
  downloadLink.download = fileName
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
}

export const getTimeAndDate = (instituteCountry, countryList) => {
  // eslint-disable-next-line
  const timeZone = countryList.find(
    ({country}) => country === instituteCountry
  ).timezone
}

export const searchBoxFilter = (text = '', list = [], searchParams = []) => {
  /** Directions for giving parameters for this function :
     -text: A String(searchText) based on which you want to filter the objects
     -list: Array of objects which you want to filter out based on text
     -searchParams:[Array of [Array of strings]]
      Example:
      list= [obj1,obj2,....]
      text= 'somestring'
      searchParams= [[string1],[string21,string22]]
      For these parameters function will filter out obj if text not in obj[string1] or obj[string21][string22] for every obj in list
      and return the filtered list
    */
  const filterFunc = (params, text, item) => {
    for (let index1 = 0; index1 < params.length; index1++) {
      let cur = params[index1]
      let stringToCheck = item
      for (let index2 = 0; index2 < cur.length; index2++) {
        stringToCheck = stringToCheck[cur[index2]]
      }
      if (
        stringToCheck
          ?.toLowerCase()
          .replace('  ', ' ')
          .includes(text.toLowerCase())
      )
        return true
    }
    return false
  }
  if (text === '') return list
  else {
    let tempArray = list.filter((item) => filterFunc(searchParams, text, item))
    return tempArray
  }
}

export const numberWithCommas = (num = 0) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * @param func - function to be debounced
 * @param {number} delay - delay in milliseconds
 * @returns debounced function
 */
export const debounce = (func, delay) => {
  let timerId

  return (...args) => {
    timerId && clearTimeout(timerId)
    timerId = setTimeout(() => func(...args), delay)
  }
}

export const milisecondsToTime = (milisecs) => {
  let secs = Math.round(milisecs / 1000)
  let divisor_for_minutes = secs % (60 * 60)
  let minutes = Math.floor(divisor_for_minutes / 60)

  let divisor_for_seconds = divisor_for_minutes % 60
  let seconds = Math.ceil(divisor_for_seconds)

  if (seconds > 9) {
    return `${minutes}:${seconds}`
  } else {
    return `${minutes}:0${seconds}`
  }
}

export const capitalizeArrayValue = (arrayData) => {
  const newArray = arrayData.map((element) => {
    return element.charAt(0).toUpperCase() + element.slice(1).toLowerCase()
  })
  const newString = newArray.join(', ')
  return newString
}

export const capitalizeValue = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const upperCaseArrayValue = (arrayData) => {
  const newArray = arrayData.map((element) => {
    return element.toUpperCase()
  })
  const newString = newArray.join(', ')
  return newString
}
// Get object from array
export const arrayToObject = (array) =>
  array.reduce((acc, cur) => ({...acc, [cur]: cur}), {})

export const is_indian_institute = (instituteInfo) => {
  if ('address' in instituteInfo && 'country' in instituteInfo.address) {
    const country = instituteInfo.address.country
    if (country === 'India' || country === null) {
      return true
    } else {
      return false
    }
  } else {
    return true
  }
}

export const getRoleName = (roleLabelIdMap, fieldValue) => {
  let roleName = ''
  if (roleLabelIdMap?.length > 0) {
    const getRoleObj = roleLabelIdMap?.find((obj) => {
      if (obj.value === fieldValue) {
        return obj.label
      }
    })
    roleName = getRoleObj?.label
  }
  return roleName
}

export const CURRENCIES_LIST = [
  {
    key: 'Indian Rupee',
    code: 'INR',
  },
  {
    key: 'US Dollar',
    code: 'USD',
  },
  {
    key: 'Nigerian Naira',
    code: 'NGN',
  },
  {
    key: 'Philippine Peso',
    code: 'PHP',
  },
  {
    key: 'Kenyan Shilling',
    code: 'KES',
  },
  {
    key: 'Ghanaian Cedi',
    code: 'GHS',
  },
  {
    key: 'Egyptian Pound',
    code: 'EGP',
  },
  {
    key: 'South African Rand',
    code: 'ZAR',
  },
  {
    key: 'Malaysian Ringgit',
    code: 'MYR',
  },
  {
    key: 'Thai Baht',
    code: 'THB',
  },
  {
    key: 'Afghan Afghani',
    code: 'AFN',
  },
  {
    key: 'Albanian Lek',
    code: 'ALL',
  },
  {
    key: 'Algerian Dinar',
    code: 'DZD',
  },
  {
    key: 'Argentine Peso',
    code: 'ARS',
  },
  {
    key: 'Armenian Dram',
    code: 'AMD',
  },
  {
    key: 'Australian Dollar',
    code: 'AUD',
  },
  {
    key: 'Azerbaijani Manat',
    code: 'AZN',
  },
  {
    key: 'Bahraini Dinar',
    code: 'BHD',
  },
  {
    key: 'Bangladeshi Taka',
    code: 'BDT',
  },
  {
    key: 'Belarusian Ruble',
    code: 'BYN',
  },
  {
    key: 'Belize Dollar',
    code: 'BZD',
  },
  {
    key: 'Bolivian Boliviano',
    code: 'BOB',
  },
  {
    key: 'Bosnia-Herzegovina Convertible Mark',
    code: 'BAM',
  },
  {
    key: 'Botswanan Pula',
    code: 'BWP',
  },
  {
    key: 'Brazilian Real',
    code: 'BRL',
  },
  {
    key: 'British Pound',
    code: 'GBP',
  },
  {
    key: 'Brunei Dollar',
    code: 'BND',
  },
  {
    key: 'Bulgarian Lev',
    code: 'BGN',
  },
  {
    key: 'Burundian Franc',
    code: 'BIF',
  },
  {
    key: 'Cambodian Riel',
    code: 'KHR',
  },
  {
    key: 'Canadian Dollar',
    code: 'CAD',
  },
  {
    key: 'Cape Verdean Escudo',
    code: 'CVE',
  },
  {
    key: 'Central African CFA Franc',
    code: 'XAF',
  },
  {
    key: 'Dobra',
    code: 'STD',
  },
  {
    key: 'Chilean Peso',
    code: 'CLP',
  },
  {
    key: 'Chinese Yuan',
    code: 'CNY',
  },
  {
    key: 'Colombian Peso',
    code: 'COP',
  },
  {
    key: 'Comorian Franc',
    code: 'KMF',
  },
  {
    key: 'Congolese Franc',
    code: 'CDF',
  },
  {
    key: 'Costa Rican Colón',
    code: 'CRC',
  },
  {
    key: 'Croatian Kuna',
    code: 'HRK',
  },
  {
    key: 'Czech Koruna',
    code: 'CZK',
  },
  {
    key: 'Danish Krone',
    code: 'DKK',
  },
  {
    key: 'Djiboutian Franc',
    code: 'DJF',
  },
  {
    key: 'Dominican Peso',
    code: 'DOP',
  },
  {
    key: 'Eritrean Nakfa',
    code: 'ERN',
  },
  {
    key: 'Estonian Kroon',
    code: 'EEK',
  },
  {
    key: 'Ethiopian Birr',
    code: 'ETB',
  },
  {
    key: 'Euro',
    code: 'EUR',
  },
  {
    key: 'Georgian Lari',
    code: 'GEL',
  },
  {
    key: 'Guatemalan Quetzal',
    code: 'GTQ',
  },
  {
    key: 'Guinean Franc',
    code: 'GNF',
  },
  {
    key: 'Honduran Lempira',
    code: 'HNL',
  },
  {
    key: 'Hong Kong Dollar',
    code: 'HKD',
  },
  {
    key: 'Hungarian Forint',
    code: 'HUF',
  },
  {
    key: 'Icelandic Króna',
    code: 'ISK',
  },
  {
    key: 'Indonesian Rupiah',
    code: 'IDR',
  },
  {
    key: 'Iranian Rial',
    code: 'IRR',
  },
  {
    key: 'Iraqi Dinar',
    code: 'IQD',
  },
  {
    key: 'Israeli New Shekel',
    code: 'ILS',
  },
  {
    key: 'Jamaican Dollar',
    code: 'JMD',
  },
  {
    key: 'Japanese Yen',
    code: 'JPY',
  },
  {
    key: 'Jordanian Dinar',
    code: 'JOD',
  },
  {
    key: 'Kazakhstani Tenge',
    code: 'KZT',
  },
  {
    key: 'Kuwaiti Dinar',
    code: 'KWD',
  },
  {
    key: 'Kyrgystani Som',
    code: 'KGS',
  },
  {
    key: 'Latvian Lats',
    code: 'LVL',
  },
  {
    key: 'Lebanese Pound',
    code: 'LBP',
  },
  {
    key: 'Libyan Dinar',
    code: 'LYD',
  },
  {
    key: 'Lithuanian Litas',
    code: 'LTL',
  },
  {
    key: 'Macanese Pataca',
    code: 'MOP',
  },
  {
    key: 'Macedonian Denar',
    code: 'MKD',
  },
  {
    key: 'Malagasy Ariary',
    code: 'MGA',
  },
  {
    key: 'Mauritian Rupee',
    code: 'MUR',
  },
  {
    key: 'Mexican Peso',
    code: 'MXN',
  },
  {
    key: 'Moldovan Leu',
    code: 'MDL',
  },
  {
    key: 'Moroccan Dirham',
    code: 'MAD',
  },
  {
    key: 'Mozambican Metical',
    code: 'MZN',
  },
  {
    key: 'Myanmar Kyat',
    code: 'MMK',
  },
  {
    key: 'Namibian Dollar',
    code: 'NAD',
  },
  {
    key: 'Nepalese Rupee',
    code: 'NPR',
  },
  {
    key: 'New Taiwan Dollar',
    code: 'TWD',
  },
  {
    key: 'New Zealand Dollar',
    code: 'NZD',
  },
  {
    key: 'Nicaraguan Córdoba',
    code: 'NIO',
  },
  {
    key: 'Norwegian Krone',
    code: 'NOK',
  },
  {
    key: 'Omani Rial',
    code: 'OMR',
  },
  {
    key: 'Pakistani Rupee',
    code: 'PKR',
  },
  {
    key: 'Panamanian Balboa',
    code: 'PAB',
  },
  {
    key: 'Paraguayan Guarani',
    code: 'PYG',
  },
  {
    key: 'Peruvian Sol',
    code: 'PEN',
  },
  {
    key: 'Polish Zloty',
    code: 'PLN',
  },
  {
    key: 'Qatari Rial',
    code: 'QAR',
  },
  {
    key: 'Romanian Leu',
    code: 'RON',
  },
  {
    key: 'Russian Ruble',
    code: 'RUB',
  },
  {
    key: 'Rwandan Franc',
    code: 'RWF',
  },
  {
    key: 'Saudi Riyal',
    code: 'SAR',
  },
  {
    key: 'Serbian Dinar',
    code: 'RSD',
  },
  {
    key: 'Singapore Dollar',
    code: 'SGD',
  },
  {
    key: 'Somali Shilling',
    code: 'SOS',
  },
  {
    key: 'South Korean Won',
    code: 'KRW',
  },
  {
    key: 'Mauritanian Ouguiya',
    code: 'MRU',
  },
  {
    key: 'Sri Lankan Rupee',
    code: 'LKR',
  },
  {
    key: 'Sudanese Pound',
    code: 'SDG',
  },
  {
    key: 'South Sudanese Pound',
    code: 'SSP',
  },
  {
    key: 'Swedish Krona',
    code: 'SEK',
  },
  {
    key: 'Swiss Franc',
    code: 'CHF',
  },
  {
    key: 'Syrian Pound',
    code: 'SYP',
  },
  {
    key: 'Tajikistani Somoni',
    code: 'TJS',
  },
  {
    key: 'Tanzanian Shilling',
    code: 'TZS',
  },
  {
    key: 'Tongan Paʻanga',
    code: 'TOP',
  },
  {
    key: 'Trinidad & Tobago Dollar',
    code: 'TTD',
  },
  {
    key: 'Tunisian Dinar',
    code: 'TND',
  },
  {
    key: 'Turkish Lira',
    code: 'TRY',
  },
  {
    key: 'Turkmenistani Manat',
    code: 'TMT',
  },
  {
    key: 'Ugandan Shilling',
    code: 'UGX',
  },
  {
    key: 'Ukrainian Hryvnia',
    code: 'UAH',
  },
  {
    key: 'United Arab Emirates Dirham',
    code: 'AED',
  },
  {
    key: 'Uruguayan Peso',
    code: 'UYU',
  },
  {
    key: 'Uzbekistani Som',
    code: 'UZS',
  },
  {
    key: 'Venezuelan Bolívar',
    code: 'VEF',
  },
  {
    key: 'Vietnamese Dong',
    code: 'VND',
  },
  {
    key: 'West African CFA Franc',
    code: 'XOF',
  },
  {
    key: 'Yemeni Rial',
    code: 'YER',
  },
  {
    key: 'Zambian Kwacha',
    code: 'ZMW',
  },
  {
    key: 'Zimbabwean Dollar',
    code: 'ZWL',
  },
  {
    key: 'Malawian Kwacha',
    code: 'MWK',
  },
  {
    key: 'Saint Helena Pound',
    code: 'SHP',
  },
  {
    key: 'Liberian dollar',
    code: 'LRD',
  },
  {
    key: 'Sierra Leonean Leone',
    code: 'SLL',
  },
]

export const COUNTRY_CURRENCY_MAPPING = {
  India: 'en-IN',
}

export const formatCurrencyToCountry = (value, country = 'India') => {
  return new Intl.NumberFormat(COUNTRY_CURRENCY_MAPPING[country]).format(value)
}

export function getSymbolFromCurrency(currencyCode, showVal = null) {
  if (typeof currencyCode !== 'string') {
    return undefined
  }

  if (showVal !== null) {
    return showVal
  }

  const code = currencyCode.toUpperCase()
  return currencyCode === 'UZS' ? 'UZS' : currencyMap[code]
}

export const handleFileDownload = async (src, displayName) => {
  if (typeof src === 'string') {
    const fileName = src?.split('/')?.pop()
    let blob = await fetch(src).then((r) => r.blob())
    saveAs(blob, displayName || fileName)
  } else {
    saveAs(src, displayName || src.name)
  }
}

export const _displayInitials = (name) => {
  name = name.trim()
  let nameArr = name.split(' ')
  if (nameArr.length > 1) {
    return nameArr[0].charAt(0) + '' + nameArr[1].charAt(0)
  } else {
    return name.charAt(0) + '' + name.charAt(1)
  }
}

export const _stringToHslColor = (str, s = 30, l = 80) => {
  str = str.trim()
  var hash = 0
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  var h = hash % 360
  return 'hsl(' + h + ', ' + s + '%, ' + l + '%)'
}

export const truncateTextWithTooltip = (text, limit = 8) => {
  if (!text) {
    return '-'
  }

  if (text.length > limit) {
    return (
      <span>
        <a data-for={'tooltip' + text} data-tip>
          {text.substring(0, limit) + '...'}
        </a>
        <Tooltip toolTipBody={text} toolTipId={'tooltip' + text} />
      </span>
    )
  }

  return <span>{text}</span>
}
