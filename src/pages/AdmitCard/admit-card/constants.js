export const SCREENS = {
  noExamStructure: {
    title: 'admitCard',
    hasBreadcrum: false,
  },
  classList: {
    title: 'admitCard',
    hasBreadcrum: false,
  },
  editTemplate: {
    title: 'admitCardTemplate',
    hasBreadcrum: false,
    hasPrefix: true,
  },
  studentList: {
    title: '',
    hasBreadcrum: true,
    hasPrefix: true,
  },
}

export const STANDARD = 'STANDARD'

export const DEPARTMENT = 'DEPARTMENT'

export const STUDENT_DIRECTORY_COL = [
  {key: 'name', label: 'Student Details'},
  {
    key: 'enrollmentId',
    label: '#Enrollment no.',
  },
  {key: 'status', label: 'Status'},
  {key: 'action', label: 'Action'},
]
