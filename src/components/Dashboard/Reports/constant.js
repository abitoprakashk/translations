export const REPORTS = 'reports'
export const DOWNLOAD_REPORTS = 'downloadReports'
export const DOWNLOAD_LOG = 'downloadLog'
export const DOWNLOAD_REPORT = 'downloadReport'
export const DEPARTMENT = 'DEPARTMENT'
export const STANDARD = 'STANDARD'
export const SECTION_UPERCASE_TEXT = 'SECTION'
export const DATA_NOT_FOUND = 'dataNotFound'
export const REPORT_DOWNLOAD_LOG = 'reportDownloadLog'
export const DOWNLOADING = 'downloading'
export const SUPER_ADMIN_ROLE_ID = 'owner'
export const ADMIN_ROLE_ID = 'admin'
export const ACCOUNTANT__ROLE_ID = 'adm.fee'
export const SCHOOL = 'SCHOOL'
export const COACHING = 'COACHING'
export const COLLEGE = 'COLLEGE'
export const DOWNLOAD_IN_PROGRESS = 'downloadInProgress'
export const DOWNLOAD_FEE_REPORT = 'downloadFeeReport'
export const DOWNLOAD_ATTENDANCE_REPORT = 'downloadAttendanceReport'
export const FROM = 'from'
export const TO = 'to'
export const CLASS = 'class'
export const SECTION = 'section'
export const FILE_IS_BEING_DOWNLOADED_PLEASE_WAIT =
  'fileIsBeingDownloadedPleaseWait'
export const FEE = 'fee'
export const CLASS_ATTENDANCE = 'classAttendance'
export const PERFORMANCE = 'performance'
export const VIEW_DOWNLOADE_AND_TRANSACTIONCS_REPORT =
  'viewDownloadAndTransactionsReport'
export const TRANSACTIONCS_REPORT = 'transactionsReport'
export const YOU_CAN_VIEW_AND_DOWNLOAD_CUSTOMIESED_TRANSACTION_REPORTS =
  'youCanViewAndDownloadCustomisedTransactionReports'
export const DOWNLOAD_COLLECTION_REPORT = 'downloadCollectionReport'
export const COLLECTION_REPORT = 'collectionReport'
export const COLLECTION_REPORT_SUB_TITLE =
  'theReportContainsAllTheCollectionsForAllClassesTillDate'
export const UNABLE_TO_GET_SECTION_DETAILS = 'unableToGetSectionDetails'
export const UNABLE_TO_GET_ATTENDANCE = 'unableToGetAttendance'
export const OTHER = 'otherTextInLowerCase'

export const ACCESSIBLE_ROLES = [
  SUPER_ADMIN_ROLE_ID,
  ADMIN_ROLE_ID,
  ACCOUNTANT__ROLE_ID,
]

export const FEE_REPORTS_ACCESSIBLE_ROLES = [
  SUPER_ADMIN_ROLE_ID,
  ADMIN_ROLE_ID,
  ACCOUNTANT__ROLE_ID,
]
export const ATTENDANCE_REPORTS_ACCESSIBLE_ROLES = [
  SUPER_ADMIN_ROLE_ID,
  ADMIN_ROLE_ID,
]

export const PREFORMANCE_REPORTS_ACCESSIBLE_ROLES = [
  SUPER_ADMIN_ROLE_ID,
  ADMIN_ROLE_ID,
]

export const DOWNLOAD_REPORT_LOGS_ACCESSIBLE_ROLES = [SUPER_ADMIN_ROLE_ID]

export const API_RESPONCE_OBJ_KEYS = {
  ATTENDANCE: 'ATTENDANCE',
  FEE: 'FEE',
  MISCELLANEOUS: 'MISCELLANEOUS',
  PERFORMANCE: 'PERFORMANCE',
}

export const DOWNLOAD_REPORT_LOG_TABS_IDS = {
  feeReports: 'feeReports',
  attendanceReports: 'attendanceReports',
  performance: 'performance',
}

export const DOWNLOAD_REPORT_LOG_TABS = [
  {id: DOWNLOAD_REPORT_LOG_TABS_IDS.feeReports, label: 'feeReports'},
  {
    id: DOWNLOAD_REPORT_LOG_TABS_IDS.attendanceReports,
    label: 'attendanceReports',
  },
  {id: DOWNLOAD_REPORT_LOG_TABS_IDS.performance, label: 'performance'},
]

export const FEE_REPORT_LOG_TABLE_COLUMNS = [
  {key: 'empName', label: 'employeeName'},
  {key: 'reportType', label: 'reportType'},
  {key: 'dateRange', label: 'dateRange'},
  {key: 'downloadDate', label: 'downloadDate'},
]

export const ATTENDANCE_REPORT_LOG_TABLE_COLUMNS = [
  {key: 'empName', label: 'employeeName'},
  {key: 'classrooms', label: 'class'},
  {key: 'dateRange', label: 'dateRange'},
  {key: 'downloadDate', label: 'downloadDate'},
]

export const PERFORMANCE_REPORT_LOG_TABLE_COLUMNS = [
  {key: 'empName', label: 'employeeName'},
  {key: 'downloadUrl', label: 'downloadUrl'},
  {key: 'downloadDate', label: 'downloadDate'},
]

export const FEE_REPORT_TYPE = {
  TRANSACTION: 'TRANSACTION',
  COLLECTIONS: 'COLLECTIONS',
}

export const FEE_REPORT_MODAL_CARD_IDS = {
  transactionReport: 'transactionReport',
  collectionReport: 'collectionReport',
}

export const EVENT_TRACKER = {
  UNLOCKED: 'UNLOCKED',
  LOCKED: 'LOCKED',
}

export const SIDEBAR_ACCESS_NUMBERS = {fee: 15}
