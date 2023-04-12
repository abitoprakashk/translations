import {sidebarData} from '../../../../utils/SidebarItems'

const URL_PATH = `${sidebarData.REPORT_CARD.route}/structure`
export const EXAM_STRUCTURE_PATHS = {
  examPattern: URL_PATH,
  editExamPattern: `${URL_PATH}/edit`,
  importExamPattern: `${URL_PATH}/import`,
  addToTerm: `${URL_PATH}/add/exam`,
  viewResult: `${URL_PATH}/view-result`,
}

export const MARKS_GRADES_OPTIONS = {
  MARKS: 0,
  GRADES: 1,
  BOTH: 2,
}

export const MAX_LENGTH_TERM_NAME = 20

export const MAX_LENGTH_EXAM_NAME = 20
