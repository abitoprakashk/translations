import {t} from 'i18next'

export const ATTENDANCE_PAGE_TABS = [
  {
    id: 'ATTENDANCE_STUDENTS_TAB',
    label: 'studentAttendanceTitle',
    url: 'classroom',
    status: false,
  },
  {
    id: 'ATTENDANCE_STAFF_TAB',
    label: 'staffAttendance',
    url: 'staff',
    status: true,
  },
  {
    id: 'ATTENDANCE_TEACHERS_TAB',
    label: 'teachersAttendance',
    url: 'teacher',
    status: true,
  },
]

export const ATTENDANCE_INSTITUTE_TABLE_HEADERS = [
  {key: 'classSection', label: t('classSection')},
  {key: 'classTeacher', label: t('classTeacher')},
  {key: 'totalStudents', label: t('totalStudents')},
  {key: 'attendancePersent', label: t('attendancePersent')},
  {key: 'settings', label: t('viewDetails')},
]

export const ATTENDANCE_INSTITUTE_TABLE_MOBILE_HEADERS = [
  {key: 'classSection', label: t('classSection')},
  {key: 'attendancePersent', label: t('attendance')},
  {key: 'settings', label: t('viewDetails')},
]

export const ATTENDANCE_SECTION_TABLE_HEADERS = [
  {key: 'name', label: t('studentName')},
  // {key: 'enrollment_number', label: t('enrollmentNumber')},
  {key: 'roll_number', label: t('rollNumber')},
  {key: 'attendance', label: t('attendance')},
]
