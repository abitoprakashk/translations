import {t} from 'i18next'

export const PAGES = {
  classPage: 'classPage',
  subjectPage: 'subjectPage',
  topicPage: 'topicPage',
  contentPage: 'contentPage',
}

export const PAGE_HEADING = {
  selectClass: 'select class',
  selectSubject: 'select subject',
  selectContent: 'select content',
}

export const COURSE_CATEGORY = {
  stateLevel: 'State Level',
  nationalLevel: 'National Level',
}

export const CHANGE_LANGUAGE = 'change language'

export const VIDEO = 'video'
export const VIDEOS = 'Videos'
export const CAPITALIZED_TEXT_VIDEO = 'Video'
export const CAPITALIZED_TEXT_STUDY_MATERIAL = 'Study Material'
export const STUDY_MATERIAL = 'study material'
export const STUDY_MATERIALS = 'Study Materials'
export const VIEW_ALL = 'view all'
export const CAPITALIZED_TEXT_PAGES = 'Pages'
export const VIEW_LESS = 'view less'

export const DROPDOWN_ITEMS = {
  reportContent: 'Report Content',
}

export const VIDEOS_NOT_FOUND = 'videos not found'
export const CLOSE = 'close'
export const REPORT_CONTENT_TEXT = 'report content'

export const REPORT_CONTENT_MODAL = {
  title: 'report content',
  subTitle:
    'You can report this content if you feel this is spam or inappropriate. Our team will be looking into it at the earliest.',
  reportedReqTitle: 'We have received your request',
  reportedReqSubTitle:
    'Our team will be reviewing the content and taking appropriate actions as soon as possible.',
  cancleBtnText: 'cancel',
  reportBtnText: 'report',
  okayBtnText: 'Okay',
  contentReported: 'Content Reported',
}

export const SUBJECT_COLOR_CLASSES = [
  'orange',
  'green',
  'purple',
  'lightBlue',
  'darkBlue',
  'skyBlue',
  'brown',
  'darkPink',
]

export const TFI_10_URL = 'https://tfi10.teachmint.life/'

export const URL_FETCH_TAXONOMY_LIST = TFI_10_URL + 'get/taxonomy/list'
export const URL_FETCH_CONTENT_LIST = TFI_10_URL + 'get/content/list'

export const PAYLOAD_FIELDS = {
  language: 'language',
  className: 'class_name',
  subjectName: 'Subject',
  topicName: 'Topic',
  course: 'Course',
}

export const CLASS_LIST_COUNT_KEY = {
  video: 'Video',
  studyMaterial: 'Study Material',
}

export const URL_PATH = '/institute/dashboard/content'

export const CONTENT_PATH = `${URL_PATH}/:course`

export const PAGE_PATH = {
  classPage: `${CONTENT_PATH}/:language?`,
  subjectPage: `${CONTENT_PATH}/:language/:class`,
  topicPage: `${CONTENT_PATH}/:language/:class/:subject/:topic?`,
}

export const NOT_FOUND_TEXT = {
  class: 'Class not found',
  subject: 'Subject not found',
  topic: 'Topic not found',
  content: 'Content not found',
}

export const SHOW_LIMITED_DATA_COUNT = {
  video: 6,
  studyMaterial: 8,
}

export const PDF_URL_PREFIX = 'https://teachmint.com/pdf?file='

export const REPORT_CONTENT_URL = TFI_10_URL + 'report/content/'

export const SELECT_SUBJECT_TEXT = 'Select Subject'
export const SELECT_CONTENT_TEXT = 'Select Content'

export const FEATURE_LOCK = {
  title: 'Feature Locked',
  description:
    'This feature is available in our Advanced Plan. Please contact us for further details.',
  contanctSalesCall: 'Have more questions? Talk to our expert at ',
  contactSalesUrl: 'https://teachmint.viewpage.co/contact-sales?uuid=',
  buyNowText: t('buyNow'),
  buyNowUrl: 'https://rzp.io/l/teachmint-content',
}

export const COLOR_PALLET_COUNT = 8

export const DEFAULT_LANGUAGE = 'English'

export const FILE_TYPES = ['Lectures', 'StudyMaterial']
