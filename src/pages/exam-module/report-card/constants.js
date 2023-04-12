export const SCREENS = {
  noExamStructure: {
    title: 'reportCard',
    hasBreadcrum: false,
  },
  classList: {
    title: 'reportCard',
    hasBreadcrum: false,
  },
  editTemplate: {
    title: 'reportCardTemplate',
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

export const POLLING_TIMELIMIT = 15 * 60 * 1000 // min -> ms

export const DELAY_BETWEEN_POLLS = 10 * 1000 // seconds -> ms

export const REPORT_CARD_TITLE_DEFAULT = 'Report Card'

export const SCHOLASTIC_TITLE_DEFAULT = 'Scholastic Area'

export const CO_SCHOLASTIC_TITLE_DEFAULT = 'Co-Scholastic Area'

export const TERM_LIST_DEFAULT = []

export const STUDENT_DIRECTORY_COL = [
  {key: 'name', label: 'Student Name'},
  {key: 'rollNumber', label: 'Roll No.'},
  {
    key: 'enrollmentId',
    label: 'Enrollment No.',
  },
  {key: 'status', label: 'Status'},
  {key: 'action', label: ''},
]

export const STUDENT_DETAILS = [
  {
    label: 'Student Name',
    value: 'name',
  },
  {
    label: 'Class',
    value: 'standard',
  },
  {
    label: `Father's Name`,
    value: 'father_name',
  },
  {
    label: 'Section',
    value: 'section',
  },
  {
    label: `Mother's Name`,
    value: 'mother_name',
  },
  {
    label: 'Roll Number',
    value: 'roll_number',
  },
  {
    label: 'Enrollment Number',
    value: 'enrollment_number',
  },
  {
    label: 'Date of Birth',
    value: 'date_of_birth',
  },
]

export const SCHOLASTIC_AREA_LIST = [
  {
    label: 'Grand Total',
    value: 'grand_total',
  },
  {
    label: 'Percentage',
    value: 'percentage',
  },
  // {
  //   label: 'Rank',
  //   value: 'rank',
  // },
  {
    label: 'Final Grade',
    value: 'overall_grade',
  },
]

export const SIGNATURE_LIST = [
  {
    label: `Class Teacher's Signature`,
    value: 'class_teacher_signature',
  },
  {
    label: `Parent's Signature`,
    value: 'parents_signature',
  },
  {
    label: `Principal's Signature`,
    value: 'principal_signature',
  },
]

// export const EXAM_TYPES = {
//   THEORY: {
//     value: 0,
//     label: 'Th',
//   },
//   PRACTICAL: {
//     value: 1,
//     label: 'Pr',
//   },
//   VIVA: {
//     value: 2,
//     label: 'Vi',
//   },
// }

export const EXAM_TYPES = {
  0: 'Th',
  1: 'Pr',
  2: 'Vi',
}

export const GRADE_VISIBLITY_OPTIONS = {
  MARKS: 0,
  GRADES: 1,
  BOTH: 2,
  NONE: 3,
}

export const EDIT_TEMPLATE_SECTIONS = {
  HEADER: 'header',
  STUDENT_DETAILS: 'studentDetails',
  SCHOLASTIC: 'scholastic',
  CO_SCHOLASTIC: 'coScholastic',
  ADDITIONAL_INFO: 'additionalInfo',
  SIGN_MANAGE: 'signature',
}

export const SCHOLASTIC_BLOCKS = {
  SUBJECTS: 'scholasticSubjects',
  EXAM_TYPES: 'examTypes',
  GRADES: 'grades',
  MANAGE_EXAM: 'manageExam',
}

export const ATTENDANCE_TYPES = {
  OVERALL: {
    label: 'Overall',
    value: 1,
  },
  TERMWISE: {
    label: 'Term wise',
    value: 2,
  },
  MONTHLY: {
    label: 'Monthly',
    value: 3,
  },
}

export const REMARKS_TYPES = {
  OVERALL: {
    label: 'Overall',
    value: 1,
  },
  TERMWISE: {
    label: 'Term wise',
    value: 2,
  },
}

export const TEMPLATE_SECTIONS = {
  HEADER_DETAILS: 'header_details',
  STUDENT_DETAILS: 'student_details',
  SCHOLASTIC: 'scholastic',
  COSCHOLASTIC: 'co_scholastice',
  ATTENDANCE: 'attendance',
  REMARKS: 'remarks',
  RESULT: 'result',
  SIGNATURES: 'signatures',
}
export const EVALUATION_TYPE = {
  SCHOLASTIC: 'scholastic',
  OTHER: 'other',
  CO_SCHOLASTIC: 'co_scholastic',
  ATTENDANCE: 'attendance',
  REMARKS: 'remarks',
  RESULTS: 'results',
}

export const EVALUATION_DURATION_TYPE = {
  OVERALL: 'overall',
  TERM: 'term',
  MONTH: 'month',
}

export const TEMPLATE_SECTIONS_ID = {
  HEADER: 'header',
  SCHOLASTIC: 'scholastic',
  CO_SCHOLASTIC: 'co_scholastic',
  COMMON_SUBJECTS: 'common_subjects',
}

export const OTHER_TAB_NAME = 'others'

export const CO_SCHOLASTIC = 'co_scholastic'

export const ATTENDANCE = 'attendance'

export const REMARKS = 'remarks'

export const RC_IMPORT_TYPE = {
  include_structure: {
    label: 'Include only structure',
    value: 'include_structure',
    eventValue: 'Only structure',
  },
  include_customization: {
    label: 'Include only customised theme',
    value: 'include_customization',
    eventValue: 'Only theme',
  },
  include_both: {
    label: 'Include both',
    value: 'include_both',
    eventValue: 'Both',
  },
}

const PORTRAIT = 'portrait'
const LANDSCAPE = 'landscape'

const ORIENTATION = {PORTRAIT, LANDSCAPE}

const PAGE_TYPE = {
  A4: {
    [PORTRAIT]: {width: 8.27, height: 11.69},
    [LANDSCAPE]: {height: 8.27, width: 11.69},
  },
}

const CONVERTER = {
  inchToPixel: (inchs) => inchs * 96,
  pixelToInch: (pixels) => pixels / 96,
}

export const RC_PREVIEW = {ORIENTATION, PAGE_TYPE, CONVERTER}
