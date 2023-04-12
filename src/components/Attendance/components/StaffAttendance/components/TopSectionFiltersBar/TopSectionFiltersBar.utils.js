import {DateTime} from 'luxon'
// Get selected month
export const getSelectedMonth = (action) => {
  let selectMonth = 0
  if (action == 'ST_DOWN_REPORTS_FOR_LAST_THREE_MONTHS') {
    selectMonth = 3
  } else if (action == 'ST_DOWN_REPORTS_FOR_LAST_SIX_MONTHS') {
    selectMonth = 6
  } else {
    selectMonth = 1
  }
  return selectMonth
}

// Get month name
export const getMonthName = (monthsCount) => {
  return DateTime.now().minus({months: monthsCount}).toFormat('MMMM yyyy')
}

// Get report name
export const getReportName = (startMonthYear, endMonthYear, text) => {
  let reportFileName = `${text}.csv`
  if (startMonthYear && endMonthYear) {
    if (startMonthYear == endMonthYear) {
      reportFileName = `${text}${startMonthYear}.csv`
    } else {
      reportFileName = `${text}${startMonthYear} - ${endMonthYear}.csv`
    }
  }
  return reportFileName
}

// Get report label
export const reportLabel = (monthsCount, text) => {
  return `${text}${getMonthName(monthsCount - 1)} - ${getMonthName(0)}.csv`
}
