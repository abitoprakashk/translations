export default {
  overview: {
    route: 'overview/',
    fullPath: '/institute/dashboard/attendance-reports/overview/',
    name: 'OVERVIEW',
  },
  studentAttendance: {
    route: 'student-attendance/',
    fullPath: '/institute/dashboard/attendance-reports/student-attendance/',
    name: 'STUDENT_ATTENDANCE',
  },
  classAttendance: {
    route: 'class-attendance/',
    fullPath: '/institute/dashboard/attendance-reports/class-attendance/',
    name: 'CLASS_ATTENDANCE',
  },
  specificDateClassAttendance: {
    route: 'date-attendance/:date/:classId',
    fullPath:
      '/institute/dashboard/attendance-reports/date-attendance/:date/:classId',
    name: 'SPECIFIC_DATE_CLASS_ATTENDANCE',
  },
  dateAttendance: {
    route: 'date-attendance/',
    fullPath: '/institute/dashboard/attendance-reports/date-attendance/',
    name: 'DATE_ATTENDANCE',
  },
  specificDateAttendance: {
    route: 'date-attendance/:date',
    fullPath: '/institute/dashboard/attendance-reports/date-attendance/:date',
    name: 'SPECIFIC_DATE_ATTENDANCE',
  },
  todaysDetailedReport: {
    route: 'today-report/',
    fullPath: '/institute/dashboard/attendance-reports/today-report/',
    name: 'TODAY_DETAIL_REPORT',
  },
}
