import {EVENTS_ACTIVITIES} from '../../../pages/YearlyCalendar/YearlyCalendar.constants'
import {PERMISSION_CONSTANTS} from '../../../utils/permission.constants'

export const QUICK_ACTIONS_DETAILS = {
  TITLE: 'Quick Actions',
}

export const QUICK_ACTIONS_LIST = {
  COLLECT_FEE: {
    iconName: 'cash',
    id: 'COLLECT_FEE',
    iconType: 'inverted',
    text: 'Collect Fee',
    redirectURL: '/institute/dashboard/fees/collection',
    backgroundColor: '#A8D793',
    permission: PERMISSION_CONSTANTS.feeModuleController_feeStructure_create,
  },
  CREATE_ANNOUNCEMENT: {
    iconName: 'alert1',
    id: 'CREATE_ANNOUNCEMENT',
    iconType: 'inverted',
    text: 'Send Communication',
    redirectURL: '/institute/dashboard/communication',
    backgroundColor: '#E0C091',
    permission:
      PERMISSION_CONSTANTS.communicationController_announcement_create,
  },
  MARK_STAFF_ATTENDANCE: {
    iconName: 'hrms',
    id: 'MARK_STAFF_ATTENDANCE',
    iconType: 'inverted',
    text: 'Mark Staff Attendance',
    redirectURL: '/institute/dashboard/attendance/staff',
    backgroundColor: '#EAA7A7',
    permission:
      PERMISSION_CONSTANTS.staffAttendanceController_markAttendance_create,
  },
  MARK_STAFF_LEAVE: {
    iconName: 'eventBusy',
    id: 'MARK_STAFF_LEAVE',
    iconType: 'inverted',
    text: 'Mark Staff Leave',
    redirectURL: '/institute/dashboard/leave-management/manage-leaves',
    backgroundColor: '#94D2DF',
    permission: PERMISSION_CONSTANTS.adminLeaveController_updateStatus_update,
  },
  CREATE_EVENT: {
    iconName: 'event',
    id: 'CREATE_EVENT',
    iconType: 'inverted',
    text: 'Create Event',
    redirectURL: `/institute/dashboard/calendar?activeTab=${EVENTS_ACTIVITIES}`,
    backgroundColor: '#B8A7EA',
    permission: PERMISSION_CONSTANTS.academicPlannerController_upsert_create,
  },
  GENERATE_CERTIFICATE: {
    iconName: 'cardMembership',
    id: 'GENERATE_CERTIFICATE',
    iconType: 'inverted',
    text: 'Generate Certificate',
    status: false,
    redirectURL: '/institute/dashboard/certificate-templates/student/',
    backgroundColor: '#A7DDC9',
    permission: PERMISSION_CONSTANTS.documentController_generateSingle_create,
  },
  TODAYS_SCHEDULE: {
    iconName: 'calendarToday',
    id: 'TODAYS_SCHEDULE',
    iconType: 'inverted',
    text: `Today's Schedule`,
    status: false,
    redirectURL: '/institute/dashboard/todays-schedule',
    backgroundColor: '#DAC7D7',
    permission: PERMISSION_CONSTANTS.InstituteController_getTodaySchedule_read,
  },
}
