import {events} from './EventsConstants'

// import subRoutes here from your module folder
import {CUSTOM_CERTIFICATE_SUB_ROUTES} from '../pages/CustomCertificate/CustomCertificates.routes'
import LEAVE_MANAGEMENT_ROUTES from '../pages/LeaveManagement/LeaveManagement.routes'
import AttendanceReportRoutes from '../pages/AttendanceReport/AttendanceReport.routes'
import {CUSTOM_ID_CARD_ROUTE} from '../pages/CustomIDCard/CustomId.routes'

export const INSTITUTE = '/institute'
export const PRICING = INSTITUTE + '/pricing'
export const DASHBOARD = INSTITUTE + '/dashboard'
export const FEES = INSTITUTE + '/fees'
export const ERROR = INSTITUTE + '/error'
export const LOGIN = INSTITUTE + '/onboarding'

export const REDIRECT_ROUTES = {
  FEE_TRANSACTION_BANK: {
    from: INSTITUTE + '/dashboard/fees/transactions',
    to: INSTITUTE + '/dashboard/fee-transactions/bank',
  },
  FEE_TRANSACTION_CHEQUE: {
    from: INSTITUTE + '/dashboard/fees/cheque/status',
    to: INSTITUTE + '/dashboard/fee-transactions/cheque/status',
  },
}

export const sidebarData = {
  DASHBOARD: {
    id: 'DASHBOARD',
    eventName: events.DASHBOARD_CLICKED_TFI,
    route: '/institute/dashboard',
  },
  BILLING: {
    id: 'BILLING',
    route: '/institute/dashboard/billing',
    subRoutes: ['/institute/dashboard/billing/status'],
  },
  PENDING_REQUESTS: {
    id: 'PENDING_REQUESTS',
    eventName: events.PENDING_REQUESTS_CLICKED_TFI,
    route: '/institute/dashboard/pending-request',
  },
  SCHEDULE: {
    id: 'SCHEDULE',
    eventName: events.TODAYS_SCHEDULE_CLICKED_TFI,
    route: '/institute/dashboard/todays-schedule',
  },
  TEACHER_DIRECTORY: {
    id: 'TEACHER_DIRECTORY',
    eventName: events.TEACHERS_CLICKED_TFI,
    route: '/institute/dashboard/teachers',
    subRoutes: [
      '/institute/dashboard/teachers',
      '/institute/dashboard/teachers/add-teachers',
    ],
  },
  STUDENT_DIRECTORY: {
    id: 'STUDENT_DIRECTORY',
    eventName: events.STUDENTS_CLICKED_TFI,
    route: '/institute/dashboard/students',
    subRoutes: [
      '/institute/dashboard/students',
      '/institute/dashboard/students/add-students',
    ],
  },
  CLASSROOMS: {
    id: 'CLASSROOMS',
    eventName: events.CLASSROOMS_CLICKED_TFI,
    route: '/institute/dashboard/classrooms',
    subRoutes: [
      '/institute/dashboard/classrooms',
      '/institute/dashboard/classrooms/add-classrooms',
    ],
  },
  HELP: {
    id: 'HELP',
    eventName: events.HELP_CLICKED_TFI,
    route: '/institute/dashboard/help',
  },
  FEEDBACK: {
    id: 'FEEDBACK',
    eventName: events.SEND_FEEDBACK_CLICKED_TFI,
    route: '/institute/dashboard/feedback',
  },
  CONTACTUS: {
    id: 'CONTACTUS',
    eventName: events.CONTACT_US_CLICKED_TFI,
    route: '/institute/dashboard/contact-us',
  },
  ADMIN: {
    id: 'ADMIN',
    eventName: events.MANAGE_USERS_CLICKED_TFI,
    route: '/institute/dashboard/admin-list',
  },
  ANNOUNCEMENTS: {
    id: 'ANNOUNCEMENTS',
    eventName: events.COMMUNICATIONS_CLICKED_TFI,
    route: '/institute/dashboard/communication',
  },
  WEBSITE_BUILDER: {
    id: 'WEBSITE_BUILDER',
    eventName: events.WEBSITE_BUILDER_SIDEBAR_CLICKED_TFI,
    route: '/institute/dashboard/website-builder',
  },
  MANAGE_SCHOOL: {
    id: 'MANAGE_SCHOOL',
    eventName: events.MANAGE_SCHOOL_CLICKED_TFI,
    route: '/institute/dashboard/system/:tab',
  },
  ADMISSION: {
    id: 'ADMISSION',
    eventName: events.ADMISSION_MANAGEMENT_SIDEBAR_CLICKED_TFI,
    route: '/institute/dashboard/admission-management',
  },
  EXAM_PLANNER: {
    id: 'EXAM_PLANNER',
    eventName: events.EXAM_PLANNER_SIDE_BAR_CLICKED_TFI,
    route: '/institute/dashboard/exam-planner',
  },
  LIBRARY_MANAGEMENT: {
    id: 'LIBRARY_MANAGEMENT',
    eventName: events.LIBRARY_MANAGEMENT_CLICKED_TFI,
    route: '/institute/dashboard/library',
  },
  HOSTEL_MANAGEMENT: {
    id: 'HOSTEL_MANAGEMENT',
    eventName: events.HOSTEL_MANAGEMENT_CLICKED_TFI,
    route: '/institute/dashboard/hostel',
    subRoutes: ['/institute/dashboard/room'],
  },
  YEARLY_CALENDAR: {
    id: 'YEARLY_CALENDAR',
    eventName: events.YEARLY_CALENDAR_CLICKED_TFI,
    route: '/institute/dashboard/calendar',
  },
  SETTINGS: {
    id: 'SETTINGS',
    eventName: events.SETTINGS_CLICKED_TFI,
  },
  CONTENT_MVP: {
    id: 'CONTENT_MVP',
    eventName: events.CONTENT_CLICKED_TFI,
    route: '/institute/dashboard/content',
  },
  CERTIFICATE: {
    id: 'CERTIFICATE',
    eventName: events.CERTIFICATE_CLICKED_TFI,
    route: '/institute/dashboard/certificate-templates',
    subRoutes: Object.values(CUSTOM_CERTIFICATE_SUB_ROUTES),
  },
  TRANSPORT_MANAGEMENT: {
    id: 'TRANSPORT_MANAGEMENT',
    eventName: events.TRANSPORT_CLICKED_TFI,
    route: '/institute/dashboard/transport',
    subRoutes: [
      '/institute/dashboard/transport/overview',
      '/institute/dashboard/transport/stops',
      '/institute/dashboard/transport/vehicles',
      '/institute/dashboard/transport/routes',
      '/institute/dashboard/transport/staff',
    ],
  },
  SCHOOL_SETUP: {
    id: 'SCHOOL_SETUP',
    eventName: events.INSTITUTE_SETUP_CLICKED_TFI,
    route: '/institute/dashboard/system/setup',
  },
  USER_SETUP: {
    id: 'USER_SETUP',
    eventName: events.USER_SETUP_CLICKED_TFI,
    route: '/institute/dashboard/system/users',
  },
  LEAVE_MANAGEMENT: {
    id: 'LEAVE_MANAGEMENT',
    eventName: events.LEAVE_MANAGEMENT_CLICKED_TFI,
    route: '/institute/dashboard/leave-management',
    subRoutes: Object.values(LEAVE_MANAGEMENT_ROUTES),
  },
  ID_CARD: {
    id: 'ID_CARD',
    eventName: events.ID_CARD_SIDEBAR_CLICKED_TFI,
    route: CUSTOM_ID_CARD_ROUTE,
  },
  INVENTORY_MANAGEMENT: {
    id: 'INVENTORY_MANAGEMENT',
    eventName: events.INVENTORY_MANAGEMENT_TAB_CLICKED_TFI,
    route: '/institute/dashboard/inventory',
    subRoutes: [
      '/institute/dashboard/inventory/overview',
      '/institute/dashboard/inventory/overview/categories',
      '/institute/dashboard/inventory/overview/items',
      '/institute/dashboard/inventory/stores',
      '/institute/dashboard/inventory/items',
      '/institute/dashboard/inventory/categories',
      '/institute/dashboard/inventory/orders',
    ],
  },
  FEE: {
    id: 'FEE',
    eventName: events.FEES_CLICKED_TFI,
  },
  FEE_COLLECTION: {
    id: 'FEE_COLLECTION',
    eventName: events.FEE_SIDEBAR_COLLECTION_CLICKED_TFI,
    route: '/institute/dashboard/fees',
    subRoutes: [
      '/institute/dashboard/fees',
      '/institute/dashboard/fees/collection',
      '/institute/dashboard/fees/collection/dues',
      '/institute/dashboard/fees/help-videos',
      '/institute/dashboard/fees/config',
      '/institute/dashboard/fees/discounts',
      '/institute/dashboard/fees/payment-gateway-setup',
      '/institute/dashboard/fees/settings',
      '/institute/dashboard/fees/fee-fine',
    ],
  },
  FEE_CONFIGURATION: {
    id: 'FEE_CONFIGURATION',
    eventName: events.FEE_SIDEBAR_CONFIGURATION_CLICKED_TFI,
    route: '/institute/dashboard/fee-config',
    subRoutes: [
      '/institute/dashboard/fee-config',
      '/institute/dashboard/fee-config/structure',
      '/institute/dashboard/fee-config/discounts',
      '/institute/dashboard/fee-config/payment-gateway-setup',
      '/institute/dashboard/fee-config/settings',
      '/institute/dashboard/fee-config/fee-fine',
      '/institute/dashboard/fee-config/help-videos',
    ],
  },
  FEE_TRANSACTION: {
    id: 'FEE_TRANSACTION',
    eventName: events.TRANSACTIONS_CLICKED_TFI,
    route: '/institute/dashboard/fee-transactions',
    subRoutes: [
      '/institute/dashboard/fee-transactions',
      '/institute/dashboard/fee-transactions/cheque/status',
    ],
  },
  FEE_COMPANY_AND_ACCOUNT: {
    id: 'FEE_COMPANY_AND_ACCOUNT',
    eventName: events.FEE_SIDEBAR_COMPANY_AND_ACCOUNT_CLICKED_TFI,
    route: '/institute/dashboard/fee-company-and-account',
  },
  USER_ROLE_SETTING: {
    id: 'USER_ROLE_SETTING',
    eventName: events.ROLES_AND_PERMISSION_CLICKED_TFI,
    route: '/institute/dashboard/setting/roles',
    subRoutes: [
      '/institute/dashboard/setting/roles',
      '/institute/dashboard/setting/roles/view',
      '/institute/dashboard/setting/roles/create',
    ],
  },
  CLASSROOM_SETTING: {
    id: 'CLASSROOM_SETTING',
    eventName: events.CLASSROOMS_SETTINGS_CLICKED_TFI,
    route: '/institute/dashboard/setting/classroom',
    subRoutes: ['/institute/dashboard/setting/classroom'],
  },
  PREFERENCES: {
    id: 'PREFERENCES',
    eventName: events.PREFERENCES_CLICKED_TFI,
    route: '/institute/dashboard/setting/preferences',
    subRoutes: [
      '/institute/dashboard/setting/preferences',
      '/institute/dashboard/setting/preferences/language',
    ],
  },
  REPORT_CARD: {
    id: 'REPORT_CARD',
    eventName: events.EXAM_CLICKED_TFI,
    route: '/institute/dashboard/exam',
    subRoutes: [
      // '/institute/dashboard/exam/structure',
      // '/institute/dashboard/exam/planner',
      '/institute/dashboard/exam/reportcard',
      // '/institute/dashboard/exam/help-videos',
    ],
  },
  CLASSROOM_ATTENDANCE: {
    id: 'CLASSROOM_ATTENDANCE',
    eventName: events.CLASSROOM_ATTENDANCE_CLICKED_TFI,
    route: '/institute/dashboard/attendance/classroom',
  },
  STAFF_ATTENDANCE: {
    id: 'STAFF_ATTENDANCE',
    eventName: events.STAFF_ATTENDANCE_CLICKED_TFI,
    route: '/institute/dashboard/attendance/staff',
  },
  ATTENDANCE_REPORTS: {
    id: 'ATTENDANCE_REPORTS',
    eventName: events.STUDENT_ATTENDANCE_DETAILED_REPORTS,
    route: '/institute/dashboard/attendance-reports',
    subRoutes: [
      ...Object.values(AttendanceReportRoutes).map((route) => route.fullPath),
    ],
  },
  CLASSROOM_REPORTS: {
    id: 'CLASSROOM_REPORTS',
    eventName: events.CLASSROOM_REPORTS_CLICKED_TFI,
    route: '/institute/dashboard/classroom-reports',
  },
  PEOPLE: {
    id: 'PEOPLE',
    eventName: events.PEOPLE_CLICKED_TFI,
  },
  FEE_REPORTS: {
    id: 'FEE_REPORTS',
    eventName: events.FEE_REPORT_CLICKED_TFI,
    route: '/institute/dashboard/fee-reports',
    subRoutes: [
      '/institute/dashboard/fee-reports/fee-due-paid-by-student',
      '/institute/dashboard/fee-reports/fee-due-paid-by-installment',
      '/institute/dashboard/fee-reports/fee-due-paid-by-department',
      '/institute/dashboard/fee-reports/fee-due-paid-by-class',
      '/institute/dashboard/fee-reports/fee-due-paid-by-section',
      '/institute/dashboard/fee-reports/fee-collection-by-month',
      '/institute/dashboard/fee-reports/fee-collection-by-payment-mode',
      '/institute/dashboard/fee-reports/fee-collection-by-fee-type',
      '/institute/dashboard/fee-reports/fee-collection-by-department',
      '/institute/dashboard/fee-reports/fee-collection-by-class',
      '/institute/dashboard/fee-reports/fee-collection-by-section',
      '/institute/dashboard/fee-reports/cheque-status',
      '/institute/dashboard/fee-reports/all-transactions',
      '/institute/dashboard/fee-reports/custom-report/create',
    ],
  },
  PROFILE_SETTINGS: {
    id: 'PROFILE_SETTINGS',
    eventName: events.PROFILE_SETTINGS_CLICKED_TFI,
    route: '/institute/dashboard/profile-settings',
    subRoutes: [
      '/institute/dashboard/profile-settings/student',
      '/institute/dashboard/profile-settings/staff',
      '/institute/dashboard/profile-settings/category',
    ],
  },
  ADMIT_CARD: {
    id: 'ADMIT_CARD',
    eventName: events.ADMIT_CARD_CLICKED_TFI,
    route: '/institute/dashboard/admit-card',
  },
  ACADEMICS: {
    id: 'ACADEMICS',
    eventName: events.ACADEMICS_CLICKED_TFI,
  },
  REPORT_ANALYTICS: {
    id: 'REPORT_ANALYTICS',
    eventName: events.REPORTS_AND_ANALYTICS_CLICKED_TFI,
  },
  HRMS: {
    id: 'HRMS',
    eventName: events.HRMS_CLICKED_TFI,
  },
  ADMINISTRATION: {
    id: 'ADMINISTRATION',
    eventName: events.ADMINISTRATION_CLICKED_TFI,
  },
  FACILITY: {
    id: 'FACILITY',
    eventName: events.FACILITIES_CLICKED_TFI,
  },
  HRMS_CONFIGURATION: {
    id: 'HRMS_CONFIGURATION',
    eventName: events.HRMS_CONFIGURATION_CLICKED_TFI,
    route: '/institute/dashboard/hrms-configuration',
    subRoutes: [
      '/institute/dashboard/hrms-configuration/attendance-shifts',
      '/institute/dashboard/hrms-configuration/biometric-configuration',
    ],
  },
}

export const secondaryItems = {
  NOTIFICATION: {
    route: '/institute/dashboard/notification',
  },
  ATTENDANCE_MOBILE: {
    route: '/institute/dashboard/attendance/teacher',
  },
  EDIT_USER_DETAILS: {
    route: '/institute/dashboard/edit-details',
  },
  EDIT_INSTITUTE_DETAILS: {
    route: '/institute/dashboard/user-profile/institute',
  },
  EDIT_STUDENT_DETAILS: {
    route: '/institute/dashboard/user-profile/student',
  },
  EDIT_TEACHER_DETAILS: {
    route: '/institute/dashboard/user-profile/teacher',
  },
  USER_PROFILE: {
    route: '/institute/dashboard/user-profile/:type/:iMember?',
  },
}

// for Global Breadcrumb :
// location -> Breadcrumb details
export const secondaryRouteDetail = {
  '/institute/dashboard/teachers/add-teachers': {
    path: [
      {
        title: 'Teachers',
        route: '/institute/dashboard/teachers',
      },
      {
        title: 'Add Teachers',
      },
    ],
  },
  '/institute/dashboard/students/add-students': {
    path: [
      {
        title: 'Students',
        route: '/institute/dashboard/students',
      },
      {
        title: 'Add Students',
      },
    ],
  },
  '/institute/dashboard/user-profile/student': {
    path: [
      {
        title: 'Edit Student',
        route: '/institute/dashboard/user-profile/student/:imember_id?',
      },
      {
        title: 'Edit Student Details',
      },
    ],
  },
  '/institute/dashboard/classrooms/add-classrooms': {
    path: [
      {
        title: 'Classrooms',
        route: '/institute/dashboard/classrooms',
      },
      {
        title: 'Add Classrooms',
      },
    ],
  },
}

// location -> module ID
export const dataByRoute = {
  '/institute/dashboard': 'DASHBOARD',
  '/institute/dashboard/admin-list': 'ADMIN',
  '/institute/dashboard/admission-management': 'ADMISSION',
  '/institute/dashboard/attendance': 'ATTENDANCE',
  '/institute/dashboard/attendance/classroom': 'CLASSROOM_ATTENDANCE',
  '/institute/dashboard/attendance/staff': 'STAFF_ATTENDANCE',
  '/institute/dashboard/calendar': 'YEARLY_CALENDAR',
  '/institute/dashboard/certificate-templates': 'CERTIFICATE',
  '/institute/dashboard/classrooms': 'CLASSROOMS',
  '/institute/dashboard/communication': 'ANNOUNCEMENTS',
  '/institute/dashboard/contact-us': 'CONTACTUS',
  '/institute/dashboard/content': 'CONTENT_MVP',
  '/institute/dashboard/edit-details': 'EDIT_USER_DETAILS',
  '/institute/dashboard/exam-planner': 'EXAM_PLANNER',
  '/institute/dashboard/exam-structure': 'SCHOOL_SETUP',
  '/institute/dashboard/feedback': 'FEEDBACK',
  '/institute/dashboard/fees/config': 'FEE',
  '/institute/dashboard/help': 'HELP - removed for now',
  '/institute/dashboard/hostel': 'HOSTEL_MANAGEMENT',
  '/institute/dashboard/id-card': 'ID_CARD',
  '/institute/dashboard/inventory': 'INVENTORY_MANAGEMENT',
  '/institute/dashboard/leave-management': 'LEAVE_MANAGEMENT',
  '/institute/dashboard/library': 'LIBRARY_MANAGEMENT',
  '/institute/dashboard/notification': 'NOTIFICATION',
  '/institute/dashboard/pending-request': 'PENDING_REQUESTS',
  '/institute/dashboard/room': 'HOSTEL_MANAGEMENT',
  '/institute/dashboard/setting/classroom': 'CLASSROOM_SETTING',
  '/institute/dashboard/setting/roles': 'USER_ROLE_SETTING',
  '/institute/dashboard/setting/roles/create': 'USER_ROLE_SETTING',
  '/institute/dashboard/setting/roles/view': 'USER_ROLE_SETTING',
  '/institute/dashboard/students': 'STUDENTS',
  '/institute/dashboard/system': 'MANAGE_SCHOOL',
  '/institute/dashboard/teachers': 'TEACHERS',
  '/institute/dashboard/todays-schedule': 'SCHEDULE',
  '/institute/dashboard/transport': 'TRANSPORT_MANAGEMENT',
  '/institute/dashboard/user-profile/institute': 'EDIT_INSTITUTE_DETAILS',
  '/institute/dashboard/user-profile/student': 'EDIT_STUDENT_DETAILS',
  '/institute/dashboard/user-profile/teacher': 'EDIT_TEACHER_DETAILS',
  '/institute/dashboard/website-builder': 'WEBSITE_BUILDER',
  '/institute/dashboard/fee-company-and-account': 'FEE_COMPANY_AND_ACCOUNT',
  '/institute/dashboard/admit-card': 'ADMIT_CARD',
  '/institute/dashboard/billing': 'BILLING',
}
