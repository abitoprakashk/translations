import {t} from 'i18next'

//ADMISSION
export const ADMISSION_LABEL_MAPPING = {
  admissions: {label: 'Admissions', value: 'admissions'},
  allInquiries: {label: 'Inquiries', value: 'allInquiries'},
  allFeeCollected: {label: 'Collections', value: 'allFeeCollected'},
  allApplications: {
    label: 'Applications',
    value: 'allApplications',
  },
}

export const ADMISSION_CHART_BG_COLORS = [
  '#93B6D7',
  '#ADDDFA',
  '#D4EBC9',
  '#DBD3F4',
]

export const ADMISSION_CSV_HEADER = [
  t('schools'),
  t('inquiries'),
  t('collections'),
  t('applications'),
  t('admissions'),
]

export const ADMISSION_CSV_FILE_NAME = 'admissionReport.csv'

//FEE
export const CUMULATIVE_FEE_LABELS = [
  'Total',
  'Discount',
  'Collected',
  'Overdue',
]

export const CUMULATIVE_FEE_CHART_BG_COLORS = [
  '#E8E8E8',
  '#F8CCC6',
  '#A7DDC9',
  '#EFDFC8',
]

export const FEE_CSV_HEADERS = [
  t('schools'),
  t('collected'),
  t('discount'),
  t('overdue'),
  t('total'),
]

export const FEE_CSV_FILE_NAME = 'feeReport.csv'

export const FEE_LABEL_MAPPING = {
  Total: 'Total',
  Discount: 'Discount',
  Collected: 'Collection',
  Overdue: 'Due',
}

export const FEE_CHART_BG_COLORS = ['#E8E8E8', '#F8CCC6', '#A7DDC9', '#EFDFC8']

//STAFF
export const STAFF_CSV_HEADERS = [
  t('schools'),
  t('total'),
  t('absent'),
  t('present'),
  t('notMarked'),
]

export const STAFF_CSV_FILE_NAME = 'staffAttendanceReport.csv'

export const STAFF_LABEL_MAPPING = {
  total: {value: 'total', label: t('total')},
  absent: {value: 'absent', label: t('absent')},
  present: {value: 'present', label: t('present')},
  not_marked: {
    value: 'not_marked',
    label: t('notMarked'),
  },
}

export const STAFF_CHART_BG_COLORS = [
  '#FF6666',
  '#F8CCC6',
  '#94D2DF',
  '#E8E8E8',
]

//STUDENTS
export const STUDENT_LABEL_MAPPING = {
  total: {value: 'total', label: t('total')},
  absent: {value: 'absent', label: t('absent')},
  present: {value: 'present', label: t('present')},
  not_marked: {
    value: 'not_marked',
    label: t('notMarked'),
  },
}
export const STUDENT_CHART_BG_COLORS = [
  '#FF6666',
  '#F8CCC6',
  '#B8A7EA',
  '#E8E8E8',
]
export const STUDENT_CSV_HEADERS = [
  t('schools'),
  t('total'),
  t('absent'),
  t('present'),
  t('notMarked'),
]
export const STUDENT_CSV_FILE_NAME = 'studentAttendanceReport.csv'
