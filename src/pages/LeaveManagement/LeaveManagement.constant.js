import {t} from 'i18next'
import {ROLE_ID} from '../../constants/permission.constants'
import {PERMISSION_CONSTANTS} from '../../utils/permission.constants'

const manageViewCommonHeader = [
  {key: 'empDetails', label: t('staffDetails')},
  {key: 'manageLeaveType', label: t('leaveType')},
  {key: 'leaveDays', label: t('days')},
  {key: 'leaveDates', label: t('leaveDates')},
  {key: 'totalLeavesTaken', label: ' '},
]

const myViewCommonHeader = [
  {key: 'leaveType', label: t('leaveType')},
  {key: 'reason', label: t('reason')},
  {key: 'leaveDays', label: t('days')},
  {key: 'leaveDates', label: t('leaveDates')},
]

export const myViewPastLeavesTableHeader = [
  ...myViewCommonHeader,
  {
    key: 'leaveStatus',
    label: t('status'),
  },
  {key: 'threeDots', label: ' '},
]

export const myViewPendingLeavesTableHeader = [
  ...myViewCommonHeader,
  {key: 'threeDots', label: ' '},
]

export const manageViewPastLeavesTableHeader = [
  ...manageViewCommonHeader,
  {
    key: 'leaveStatus',
    label: t('status'),
  },
  {key: 'threeDots', label: ' '},
]

export const manageViewPendingLeavesTableHeader = [
  ...manageViewCommonHeader,
  {key: 'action', label: t('action')},
]

export const staffHistoryTableHeader = [
  {key: 'leaveType', label: t('leaveType')},
  {key: 'leaveDays', label: t('days')},
  {key: 'leaveDates', label: t('leaveDates')},
  {key: 'leaveStatus', label: t('status')},
]

export const colStyles = [
  {
    display: 'flex',
    flex: 1,
    paddingLeft: '15px',
  },
  {
    display: 'flex',
    flex: 1,
    paddingLeft: '15px',
  },
  {
    display: 'flex',
    flex: 1,
    paddingLeft: '15px',
  },
  {
    display: 'flex',
    flex: 1,
    paddingLeft: '15px',
  },
  {
    display: 'flex',
    flex: 1,
    paddingLeft: '15px',
  },
]

export const LEAVE_TYPE = {
  CASUAL: 'Casual',
  SICK: 'Sick',
  UNPAID: 'Unpaid',
}
export const LEAVE_STATUS = {
  APPROVED: 'Approved',
  CANCELED: 'Cancelled',
  CREATED: 'Created',
  REQUESTED: 'Requested',
  REJECTED: 'Rejected',
  UPDATED: 'Updated',
}

export const LEAVE_BASE_TYPE = {
  PENDING: 'PENDING',
  PAST: 'PAST',
  CASUAL: 'CASUAL',
  SICK: 'SICK',
  UNPAID: 'UNPAID',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELED: 'CANCELED',
  CREATED: 'CREATED',
  REQUESTED: 'REQUESTED',
}

export const leaveLabelmap = {
  SICK: {value: 'SICK', label: t('sickLeave')},
  CASUAL: {value: 'CASUAL', label: t('casualLeave')},
  UNPAID: {value: 'UNPAID', label: t('unpaidLeave')},
}

export const LEAVE_SHIFT_TYPE = {
  FULL_DAY: 'FULL_DAY',
  FIRST_HALF: 'FIRST_HALF',
  SECOND_HALF: 'SECOND_HALF',
}

export const leaveSlotTypeMap = {
  FULL_DAY: {value: 'FULL_DAY', label: t('fullDay')},
  FIRST_HALF: {value: 'FIRST_HALF', label: t('firstHalf')},
  SECOND_HALF: {value: 'SECOND_HALF', label: t('secondHalf')},
}

export const UPCOMING_LEAVE_DURATION = {
  TODAY: {value: 'TODAY', label: t('today')},
  THIS_WEEK: {value: 'THIS_WEEK', label: t('next7Days')},
  THIS_MONTH: {value: 'THIS_MONTH', label: t('next30Days')},
}

export const ROLE_NEEDED_TO_MANAGE_LEAVE = [ROLE_ID.ADMIN, ROLE_ID.SUPER_ADMIN]
export const ROLE_NEEDED_TO_MANAGE_LEAVE_LIMIT = [
  ROLE_ID.ADMIN,
  ROLE_ID.SUPER_ADMIN,
]

export const DOWNLOAD_REPORT_DURATIONS = {
  THIS_MONTH: {
    value: 'THIS_MONTH',
    label: t('thisMonth'),
    permissionId: PERMISSION_CONSTANTS.adminLeaveController_getReport_read,
  },
  LAST_MONTH: {
    value: 'LAST_MONTH',
    label: t('lastMonth'),
    permissionId: PERMISSION_CONSTANTS.adminLeaveController_getReport_read,
  },
  LAST_THREE_MONTH: {
    value: 'LAST_THREE_MONTH',
    label: t('last3Months'),
    permissionId: PERMISSION_CONSTANTS.adminLeaveController_getReport_read,
  },
}
