export const DEFAULT_SLIDER_VALUE = 75
export const REPORT_DEFAULT_SLIDER_VALUE = 100
export const INSIGHT_FILTER = {
  MONTH: 'MONTH',
  SESSION: 'SESSION',
}

export const TREND_FILTER = {
  DAILY: 'DAILY',
  MONTHLTY: 'MONTHLY',
}

export const SORT_TYPE = {
  ASC: 'ASC',
  DESC: 'DESC',
}

export const DATE_FILTER = {
  THIS_WEEK: {
    value: 'THIS_WEEK',
    label: 'thisWeekSentenceCase',
  },
  THIS_MONTH: {
    value: 'THIS_MONTH',
    label: 'thisMonthSentenceCase',
  },
  LAST_WEEK: {
    value: 'LAST_WEEK',
    label: 'lastWeek',
  },
  LAST_MONTH: {
    value: 'LAST_MONTH',
    label: 'lastMonthSentenceCase',
  },
  THIS_SESSION: {
    value: 'THIS_SESSION',
    label: 'thisSessionSentenceCase',
  },
  CUSTOM: {
    value: 'CUSTOM',
    label: 'customDateRange',
  },
}

export const DATE_RANGE = {
  DAILY: 'DAILY',
  MONTH: 'MONTH',
  SESSION: 'SESSION',
}

export const DEFAULT_MARKED_FILTER = {
  MARKED: {
    title: 'Marked',
    id: 'MARKED',
    isSelected: true,
    sliderValue: DEFAULT_SLIDER_VALUE,
  },
  NOT_MARKED: {
    title: 'Not marked',
    id: 'NOT_MARKED',
  },
}

export const ATTENDANCE_FILTER = {
  ALL: {
    title: 'all',
    id: 'ALL',
    isSelected: true,
  },
  PRESENT: {
    title: 'present',
    id: 'P',
    isSelected: true,
  },
  ABSENT: {
    title: 'absent',
    id: 'A',
    isSelected: true,
  },
  NOT_MARKED: {
    title: 'notMarkedSentenceCase',
    id: 'NM',
    isSelected: true,
  },
}

export const STUDENT_STATUS = {
  APPROVED: 1,
  PENDING: 2,
  REJECTED: 3,
  LEFT: 4,
}

export const DATE_FORMAT = 'dd LLL yyyy'
