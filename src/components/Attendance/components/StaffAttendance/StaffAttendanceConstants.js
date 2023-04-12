import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import {BADGES_CONSTANTS, ALERT_CONSTANTS} from '@teachmint/krayon'
import {t} from 'i18next'

const REQUESTED = 'REQUESTED'
const PRESENT = 'PRESENT'
const ABSENT = 'ABSENT'
const NOT_MARKED = 'NOT_MARKED'
const TOTAL_STAFF = 'TOTAL_STAFF'
const ON_LEAVE_FULL_DAY = 'ON_LEAVE_FULL_DAY'
const PRESENT_HALF_DAY = 'PRESENT_HALF_DAY'
const HALF_DAY_PRESENT = 'HALF_DAY_PRESENT'
const PRESENT_ARRIVE_LATE = 'PRESENT_ARRIVE_LATE'
const PRESENT_LEFT_EARLY = 'PRESENT_LEFT_EARLY'
const PRESENT_ARRIVE_LATE_LEFT_EARLY = 'PRESENT_ARRIVE_LATE_LEFT_EARLY'
const ARRIVE_LATE_LEFT_EARLY = 'ARRIVE_LATE_LEFT_EARLY'
const ARRIVE_LATE = 'ARRIVE_LATE'
const LEFT_EARLY = 'LEFT_EARLY'
const ABSENT_CASUAL_LEAVE = 'ABSENT_CASUAL_LEAVE'
const ABSENT_SICK_LEAVE = 'ABSENT_SICK_LEAVE'
const ABSENT_UNPAID_LEAVE = 'ABSENT_UNPAID_LEAVE'
const MARKED_THIS_DAY = 'MARKED_THIS_DAY'
const NOT_MARKED_THIS_DAY = 'NOT_MARKED_THIS_DAY'
const HOLIDAY = 'HOLIDAY'
const WEEKLY_OFF = 'WEEKLY_OFF'
const ALL_MARKED = 'ALL_MARKED'
const FILTER_EMPTY_RESULT = 'FILTER_EMPTY_RESULT'
const GRACE_ALLOWED = 'GRACE_ALLOWED'
const GRACE_USED = 'GRACE_USED'
const PENALTY = 'PENALTY'
const FULL_DAY = 'FULL_DAY'
const SECOND_HALF = 'SECOND_HALF'
const FIRST_HALF = 'FIRST_HALF'

const {WARNING, SUCCESS, PRIMARY, ERROR} = BADGES_CONSTANTS.TYPE

export const STAFF_ATTENDANCE_USERS_STATUS_TABS = [
  {
    id: 'STAFF_ATTENDANCE_USERS_PRESENT_TAB',
    label: 'present',
    status: true,
  },
  {id: 'STAFF_ATTENDANCE_USERS_ABSENT_TAB', label: 'absent', status: true},
  {
    id: 'STAFF_ATTENDANCE_USERS_NOT_MARKED_TAB',
    label: 'notMarked',
    status: true,
  },
]

export const DOWNLOAD_TOOLTIP_OPTIONS = [
  {
    label: 'thisMonth',
    action: 'THIS_MONTH',
    labelStyle: '',
    permissionId: PERMISSION_CONSTANTS.staffAttendanceController_getReport_read,
    active: true,
  },
  {
    label: 'last3Months',
    action: 'LAST_THREE_MONTHS',
    labelStyle: '',
    permissionId: PERMISSION_CONSTANTS.staffAttendanceController_getReport_read,
    active: true,
  },
  {
    label: 'thisSession',
    action: 'SESSION',
    labelStyle: '',
    permissionId: PERMISSION_CONSTANTS.staffAttendanceController_getReport_read,
    active: true,
  },
]

export const STAFF_ATTENDANCE_STATUS = {
  PRESENT,
  HALF_DAY_PRESENT,
  ABSENT,
  NOT_MARKED,
}

export const ATTENDANCE_VIEW_TYPE = {PRESENT, ABSENT, TOTAL_STAFF, NOT_MARKED}

export const ATTENDANCE_VIEW_TYPE_MAP = {
  [PRESENT]: {scope: [PRESENT, PRESENT_HALF_DAY, HALF_DAY_PRESENT]},
  [ABSENT]: {
    scope: [
      ABSENT,
      ABSENT_CASUAL_LEAVE,
      ABSENT_SICK_LEAVE,
      ABSENT_UNPAID_LEAVE,
      ON_LEAVE_FULL_DAY,
    ],
  },
  [NOT_MARKED]: {scope: [NOT_MARKED, REQUESTED]},
  [TOTAL_STAFF]: {scope: [TOTAL_STAFF]},
}

export const ATTENDANCE_LEAVE_STATUS = {
  REQUESTED,
  PRESENT,
  ABSENT,
  ON_LEAVE_FULL_DAY,
  PRESENT_HALF_DAY,
}

export const ATTENDANCE_LEAVE_STATUS_MAP = {
  [REQUESTED]: {type: PRIMARY, label: 'leaveRequested', value: REQUESTED},
  [PRESENT]: {type: SUCCESS, label: 'presentFullDay', value: PRESENT},
  [PRESENT_HALF_DAY]: {
    type: WARNING,
    label: 'presentHalfDay',
    value: PRESENT_HALF_DAY,
  },
  [PRESENT_ARRIVE_LATE]: {
    type: SUCCESS,
    label: 'presentArrivedLate',
    value: PRESENT_ARRIVE_LATE,
  },
  [PRESENT_LEFT_EARLY]: {
    type: SUCCESS,
    label: 'presentLeftEarly',
    value: PRESENT_LEFT_EARLY,
  },
  [PRESENT_ARRIVE_LATE_LEFT_EARLY]: {
    type: SUCCESS,
    label: 'presentLeftEarlyArriveLate',
    value: PRESENT_ARRIVE_LATE_LEFT_EARLY,
  },
  [ABSENT]: {type: ERROR, label: 'absent', value: ABSENT},
  [ABSENT_CASUAL_LEAVE]: {
    type: ERROR,
    label: 'absentCasualLeave',
    value: ABSENT_CASUAL_LEAVE,
  },
  [ABSENT_SICK_LEAVE]: {
    type: ERROR,
    label: 'absentSickLeave',
    value: ABSENT_SICK_LEAVE,
  },
  [ABSENT_UNPAID_LEAVE]: {
    type: ERROR,
    label: 'absentUnpaidLeave',
    value: ABSENT_UNPAID_LEAVE,
  },
  [ON_LEAVE_FULL_DAY]: {
    type: ERROR,
    label: 'onleaveFullDay',
    value: ON_LEAVE_FULL_DAY,
  },
}
export const CALENDAR_LEGEND = [
  {label: 'present', color: ['#A8D793']},
  {label: 'absent', color: ['#F19A8E']},
  {label: 'halfDayLeave', color: ['#A8D793', '#E9F5E4']},
  {label: 'fullDayLeave', color: ['#E0C091']},
  {label: 'holidayWeekly', color: ['#F4F4F4']},
  {label: 'lateLeftEarly', color: ['#E8E8E8'], hasDot: true},
]

export const ATTENDANCE_DAY_STATS = {
  [MARKED_THIS_DAY]: {
    type: null,
    value: MARKED_THIS_DAY,
    label: '',
  },
  [NOT_MARKED_THIS_DAY]: {
    type: ALERT_CONSTANTS.TYPE.WARNING,
    value: NOT_MARKED_THIS_DAY,
    label: 'attendanceNotMarkedForThisDay',
  },
  [HOLIDAY]: {
    type: ALERT_CONSTANTS.TYPE.INFO,
    value: HOLIDAY,
    label: 'holiday',
  },
  [WEEKLY_OFF]: {
    type: ALERT_CONSTANTS.TYPE.WARNING,
    value: WEEKLY_OFF,
    label: 'weeklyoffDynamic',
  },
}

export const STAFF_ATTENDANCE_EMPTY_STATUS = {
  [PRESENT]: {
    value: PRESENT,
    label: 'noOnePresentToday',
  },
  [ABSENT]: {
    value: ABSENT,
    label: 'noOneAbsentToday',
  },
  [NOT_MARKED]: {
    value: NOT_MARKED,
    label: 'attendanceNotMarkedForThisDay',
  },
  [ALL_MARKED]: {
    value: ALL_MARKED,
    label: 'attendanceMarkedForEveryone',
  },
  [FILTER_EMPTY_RESULT]: {
    value: FILTER_EMPTY_RESULT,
    label: 'staffNameNotFound',
  },
}

export const STAFF_ATTENDANCE_PAGE = {
  STAFF_ATTENDANCE: 'STAFF_ATTENDANCE',
  MY_ATTENDANCE: 'MY_ATTENDANCE',
  ATTENDANCE_REQUESTS: 'ATTENDANCE_REQUESTS',
  SHIFT_DETAILS: 'SHIFT_DETAILS',
}

export const STAFF_ATTENDANCE_BASE_ROUTE =
  '/institute/dashboard/attendance/staff/'

export const STAFF_ATTENDANCE_ROUTES = {
  [STAFF_ATTENDANCE_PAGE.STAFF_ATTENDANCE]: `${STAFF_ATTENDANCE_BASE_ROUTE}home`,
  [STAFF_ATTENDANCE_PAGE.MY_ATTENDANCE]: `${STAFF_ATTENDANCE_BASE_ROUTE}my-attendance`,
  [STAFF_ATTENDANCE_PAGE.ATTENDANCE_REQUESTS]: `${STAFF_ATTENDANCE_BASE_ROUTE}attendance-requests`,
  [STAFF_ATTENDANCE_PAGE.SHIFT_DETAILS]: `${STAFF_ATTENDANCE_BASE_ROUTE}shift-details`,
}

export const EDIT_ATTENDANCE_STATUS = {
  NOT_MARKED,
  REQUESTED,
  PRESENT,
  PRESENT_ARRIVE_LATE,
  PRESENT_LEFT_EARLY,
  PRESENT_ARRIVE_LATE_LEFT_EARLY,
  ARRIVE_LATE,
  LEFT_EARLY,
  ARRIVE_LATE_LEFT_EARLY,
  PRESENT_HALF_DAY,
  HALF_DAY_PRESENT,
  ABSENT,
  ABSENT_CASUAL_LEAVE,
  ABSENT_SICK_LEAVE,
  ABSENT_UNPAID_LEAVE,
  ON_LEAVE_FULL_DAY,
  WEEKLY_OFF,
  HOLIDAY,
  FULL_DAY,
  SECOND_HALF,
  FIRST_HALF,
}

export const ATTENDANCE_MARKED_STATUS = {
  [PRESENT]: {
    label: 'present',
    value: PRESENT,
  },
  [HALF_DAY_PRESENT]: {
    label: 'halfDay',
    value: HALF_DAY_PRESENT,
  },
  [ABSENT]: {
    label: 'absent',
    value: ABSENT,
  },
}

export const ABSENT_ATTENDANCE_COUNT_STATUS = [
  ABSENT_CASUAL_LEAVE,
  ABSENT_SICK_LEAVE,
  ABSENT_UNPAID_LEAVE,
  ON_LEAVE_FULL_DAY,
]

export const presentLeaveStatus = [
  {
    label: t('arrivedLate'),
    value: 'ARRIVE_LATE',
  },
  {
    label: t('leftEarly'),
    value: 'LEFT_EARLY',
  },
]

export const absentLeaveStatus = [
  ABSENT_CASUAL_LEAVE,
  ABSENT_SICK_LEAVE,
  ABSENT_UNPAID_LEAVE,
]

export const dateFromFormat = {
  yyyy_LL_dd: 'yyyy-LL-dd',
  dd_LLL_yyyy: 'dd LLL yyyy',
  LLL_dd_yyyy: 'LLL dd, yyyy',
  HH_MM_SS: 'HH:mm:ss',
  hh_mm_a: 'hh:mm a',
}

export const viewAttendanceStatus = [
  REQUESTED,
  ON_LEAVE_FULL_DAY,
  ABSENT_CASUAL_LEAVE,
  ABSENT_SICK_LEAVE,
  ABSENT_UNPAID_LEAVE,
]

export const GRACE_LABEL_CONST = {
  GRACE_ALLOWED,
  GRACE_USED,
  PENALTY,
}
