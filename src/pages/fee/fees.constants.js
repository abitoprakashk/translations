import razorpayLogo from '../../assets/images/companyLogos/razorpay.svg'
import EasebuzzLogo from '../../assets/images/companyLogos/Easebuzz Logo.svg'
import PayuLogo from '../../assets/images/companyLogos/PayU.svg'
import CashFreeLogo from '../../assets/images/companyLogos/cashfree.svg'
import PaystackLogo from '../../assets/images/companyLogos/Paystack Logo.svg'
import {categoryList} from '../../utils/constants'
import {Icon} from '@teachmint/common'
import {DateTime} from 'luxon'
import {PERMISSION_CONSTANTS} from '../../utils/permission.constants'
import {t} from 'i18next'
import {events} from '../../utils/EventsConstants'
import feesPageStyles from './components/FeesPage/FeesPage.module.css'
import {Trans} from 'react-i18next'
import {REACT_APP_TEACHPAY_DASHBAORD} from '../../constants'

export const URL_DASHBOARD_FETCH_FEE_STATISTICS = `fee-module/fee/stats`
export const URL_FETCH_FEE_COLLECTIOIN_STATS = `fee-module/fee/collection/stats`
export const URL_FETCH_STUDENT_DUES_DATA = `fee-module/fee/report/students`
export const URL_DOWNLOAD_DEMAND_LETTER = `fee-module/demand/letter/download?student_id=:studentId`
export const URL_SEND_REMINDER = `fee-module/send/fee/reminder`
export const URL_FETACH_STUDENT_DETAIL = `v1/get/single/student/detail/:phoneNumber`
export const URL_FETACH_FEE_HISTORY = `fee-module/student/fee/details?student_id=:studentId`
export const URL_FETACH_FEE_STRUCTURE = `fee-module/all/fee/structures`
export const URL_FETCH_PREVIOUS_SESSION_DUES = `fee-module/previous/due/structure`
export const URL_SEARCH_STUDENT = `fee-module/search/student/fee?search=:searchTerm`
export const URL_GET_SECTION_OF_CLASS = `v1/get/node/details/:classId`
export const URL_FEE_STRUCTURE = `fee-module/fee/structure`
export const URL_IMPORT_PREVIOUS_SESSION_DUES = `fee-module/import/previous/session/due`
export const URL_FEE_MODIFY_PREVIOUS_DUES_STRUCTURE = `fee-module/modify/previous/dues`
export const URL_FEE_DELETE_STUDENT_PREVIOUS_SESSION_DUES = `fee-module/delete/single/due/imported`
export const URL_FEE_FETCH_IMPORTED_SESSION_DUE_DATA = `fee-module/imported/session/due/data`
export const URL_FEE_FETCH_FAILED_SESSION_TRANSFER_TASK = `fee-module/import/due/failed/task`
export const URL_FEE_ACKNOWLEDGE_FAILED_TASK = `fee-module/update/fee/task`
export const URL_FEE_STRUCTURE_DOWNLOAD_REPORT = `fee-module/fee/structure/report`
export const URL_UPDATE_FEE_STRUCTURE = `fee-module/update/fee/structure`
export const URL_DELETE_FEE_STRUCTURE = `fee-module/delete/fee/structure`
export const URL_CHECK_RECIPT_PREFIX = `fee-module/check/duplicate/receipt/prefix?receipt_prefix=:prefix`
export const URL_GET_FEE_STRUCTURE = `fee-module/fee/structure?structure_id=:feeStructureId`
export const URL_COLLECT_PAYMENT_DETAIL = `collect/payment/details/:studentId/`
export const URL_COLLECT_FEES = `fee-module/fee/student/payment`
export const URL_FETCH_FEE_CATEGORIES = `fee-module/fee/categories`
export const URL_FETCH_USED_FEE_CATEGORIES = `fee-module/used/fee/type/in/session`
export const URL_MODIFY_FEE_INSTALLMENT = `fee-module/update/category/amount`
export const URL_FETCH_DISCOUNTS = `fee-module/fee/discounts`
export const URL_CREATE_DISCOUNT = `fee-module/add/fee/discount`
export const URL_EDIT_DISCOUNT = `fee-module/fee/discount?discount_id=:discountId`
export const URL_UPDATE_DISCOUNT = `fee-module/update/fee/discount`
export const URL_FETCH_DISCOUNT_STUDENTS_LIST = `fee-module/student/list/filter/by/category`
export const URL_DELETE_DISCOUNT = `fee-module/delete/discount`
export const URL_GET_FEE_SETTING = 'fee-module/fee/settings'
export const URL_ADD_CUSTOM_CATEGORY = 'fee-module/create/fee/category/master'
export const URL_SETTING_UPDATE = 'fee-module/update/fee/settings'
export const URL_REVOKE_TRANSACTION = 'fee-module/revoke/transactions'
export const URL_REFRESH_TRANSACTION =
  'contingent-transactions/refresh/online/txn/status'
export const URL_FETCH_STUDENT_IDS_FOR_FEE_REMINDER = 'fee-module/students/dues'
export const URL_DOWNLOAD_RECEIPTS = 'fee-module/download/receipts/multiple'
export const URL_COLLECT_BACKDATED_PAYMENT = 'fee-module/collect/bulk/payment'
export const URL_GET_COLLECT_BACKDATED_PAYMENT_TASK = 'fee-module/fee/task'
export const URL_GET_COLLECT_BACKDATED_PAYMENT_TASK_ACKNOWLEDGE =
  'fee-module/update/fee/task'

export const SELECTED_FEE_TAB_INDEX = 'SELECTED_FEE_TAB_INDEX'
export const URL_DELETE_STUDENT_ADHOC_DISCOUNT =
  'fee-module/delete/adhoc/discount'

export const URL_ENABLE_TEACHPAY = 'fee-module/enable/teachpay'
export const URL_ADMIN_TO_TEACHPAY = 'fee-module/add/admin/to/teachpay'
export const URL_STUDENT_DATA_TO_TEACHPAY =
  'fee-module/send/fee/data/to/teachpay'

export const HELP_VIDEOS = {
  RECURRING_STRUCTURE: 'https://www.youtube.com/embed/M3trbOEysqs',
  ONETIME_STRUCTURE: 'https://www.youtube.com/embed/WTtM_Kw_DYk',
  TRANSPORT_STRUCTURE: 'https://www.youtube.com/embed/GBdYkesr13k',
  DISCOUNTS: 'https://www.youtube.com/embed/kTftFvWBvNk',
  DUE_REPORTS: 'https://www.youtube.com/embed/5rtkh1dWTYU',
  TRANSACTION: 'https://www.youtube.com/embed/lOnwxRTJjOc',
  ADD_ON_DISCOUNT: 'https://www.youtube.com/embed/6NAbVbQZRk0',
  DEMAND_LETTER: 'https://www.youtube.com/embed/p6T9FdcUF0Y',
  DUE_FEE_REMINDERS: 'https://www.youtube.com/embed/cucH7EVe5G0',
  FINE_MANAGEMENT: 'https://www.youtube.com/embed/QuJh_QWFX2M',
  NEW_STRUCTURE_FLOW: 'https://www.youtube.com/embed/jkD0hZvQhYc',
  RECEIPT_PAYMENT_SETTINGS: 'https://www.youtube.com/embed/FwpvKluX_M0',
  COLLECT_FEE: 'https://www.youtube.com/embed/iDJ87EZgWus',
}

export const INSTITUTE_HIERARCHY_TYPES = {
  SSO: 'SSO',
  DEPARTMENT: 'DEPARTMENT',
  UAC: 'UAC',
  STANDARD: 'STANDARD',
  SECTION: 'SECTION',
  SUBJECT: 'SUBJECT',
}

export const DateFormats = {
  year: 'yyyy-MM-dd',
  date: 'dd-MM-yyyy',
}

export const ICON_SIZES = {
  SIZES: {
    LARGE: 'l',
    MEDIUM: 'm',
    SMALL: 's',
    XXXX_LARGE: 'xxxx_l',
    XXXX_SMALL: 'xxxx_s',
    XXX_LARGE: 'xxx_l',
    XXX_SMALL: 'xxx_s',
    XX_LARGE: 'xx_l',
    XX_SMALL: 'xx_s',
    X_LARGE: 'x_l',
    X_SMALL: 'x_s',
  },
}

export const screenWidth = () => {
  let win = window.innerWidth || document.body.clientWidth
  return win
}

export const SliderScreens = {
  STUDENT_DETAILS_SLIDER: 'STUDENT_DETAILS_SLIDER',
  COLLECT_FEES_SLIDER: 'COLLECT_FEES_SLIDER',
  FEE_STRUCTURE_SLIDER: 'FEE_STRUCTURE_SLIDER',
  STRUCTURE_SLIDER: 'STRUCTURE_SLIDER',
  PREVIOUS_YEAR_DUE_SLIDER: 'PREVIOUS_YEAR_DUE_SLIDER',
  PREVIOUS_YEAR_DUE_MODIFY_SLIDER: 'PREVIOUS_YEAR_DUE_MODIFY_SLIDER',
  FEE_CATEGORY_MODIFY_SLIDER: 'FEE_CATEGORY_MODIFY_SLIDER',
  DISCOUNT_SLIDER: 'DISCOUNT_SLIDER',
}

export const FEE_STRUCTURE_SLIDER_TABS_IDS = {
  CLASSES: 'CLASSES',
  FEE_STRUCTURE: 'FEE_STRUCTURE',
  DUE_DATES: 'DUE_DATES',
  FEE_TYPE: 'FEE_TYPE',
  AMOUNT: 'AMOUNT',
}

export const RECURRING_SLIDER_TABS = [
  {
    sequenceNo: 1,
    id: FEE_STRUCTURE_SLIDER_TABS_IDS.CLASSES,
    label: 'Classes',
  },
  {
    sequenceNo: 2,
    id: FEE_STRUCTURE_SLIDER_TABS_IDS.FEE_TYPE,
    label: 'Fee Type',
  },
  {
    sequenceNo: 3,
    id: FEE_STRUCTURE_SLIDER_TABS_IDS.DUE_DATES,
    label: 'Due Dates',
  },
  {
    sequenceNo: 4,
    id: FEE_STRUCTURE_SLIDER_TABS_IDS.AMOUNT,
    label: 'Amount',
  },
]

export const ONETIME_SLIDER_TABS = [
  {
    sequenceNo: 1,
    id: FEE_STRUCTURE_SLIDER_TABS_IDS.CLASSES,
    label: 'Classes & Profiles',
  },
  {
    sequenceNo: 2,
    id: FEE_STRUCTURE_SLIDER_TABS_IDS.FEE_STRUCTURE,
    label: 'Fee Structure',
  },
]

export const TRANSPORT_SLIDER_TABS = [
  {
    sequenceNo: 1,
    id: FEE_STRUCTURE_SLIDER_TABS_IDS.CLASSES,
    label: 'Classes',
  },
  {
    sequenceNo: 2,
    id: FEE_STRUCTURE_SLIDER_TABS_IDS.FEE_STRUCTURE,
    label: 'Fee Structure',
  },
  {
    sequenceNo: 3,
    id: FEE_STRUCTURE_SLIDER_TABS_IDS.DUE_DATES,
    label: 'Due Dates',
  },
]

export const FEE_STRUCTURE_SLIDER_TABS = [
  {
    id: FEE_STRUCTURE_SLIDER_TABS_IDS.CLASSES,
    label: 'Classes',
  },
  {
    id: FEE_STRUCTURE_SLIDER_TABS_IDS.FEE_STRUCTURE,
    label: 'Fee Structure',
  },
]

export const DISCOUNT_SLIDER_TABS_IDS = {
  DISCOUNT: 'DISCOUNT',
  STUDENT_PROFILES: 'STUDENT_PROFILES',
}

export const DISCOUNT_SLIDER_TABS = [
  {
    id: DISCOUNT_SLIDER_TABS_IDS.DISCOUNT,
    label: 'Discount',
  },
  {
    id: DISCOUNT_SLIDER_TABS_IDS.STUDENT_PROFILES,
    label: 'Student Profiles',
  },
]

export const IS_ABSOLUTE_VALUE = {
  ABSOLUTE: 'true',
  PERCENTAGE: 'false',
}

export const IS_ABSOLUTE_VALUE_OPTIONS = [
  {key: '', value: '', label: 'Select One', disabled: true},
  {
    key: IS_ABSOLUTE_VALUE.ABSOLUTE,
    value: IS_ABSOLUTE_VALUE.ABSOLUTE,
    label: 'Absolute',
  },
  {
    key: IS_ABSOLUTE_VALUE.PERCENTAGE,
    value: IS_ABSOLUTE_VALUE.PERCENTAGE,
    label: 'Percentage',
  },
]

// Structure Actions
export const MANAGE_STRUCTURE_OPTIONS = {
  EDIT_STRUCTURE_ACTION: 'EDIT_STRUCTURE_ACTION',
  DELETE_STRUCTURE_ACTION: 'DELETE_STRUCTURE_ACTION',
}

export const FEE_STRUCTURE_VIEW = {
  STRUCTURE: 0,
  CLASS: 1,
}

export const FEE_STRUCTURE_VIEWS = [
  {label: t('structureView'), value: FEE_STRUCTURE_VIEW.STRUCTURE},
  {label: t('classView'), value: FEE_STRUCTURE_VIEW.CLASS},
]

export const FEE_STRUCTURE_TYPES_IDS = {
  RECURRING_FEE: 'STANDARD',
  ONE_TIME_FEE: 'ONE_TIME',
  TRANSPORT_FEE: 'TRANSPORT',
  // CUSTOM: 'CUSTOM',
}

export const getStructureFeeType = (feeStructure) => {
  return feeStructure.fee_type === FEE_STRUCTURE_TYPES_IDS.RECURRING_FEE
    ? 'RECURRING'
    : feeStructure.fee_type
}

export const FEE_STRUCTURE_TYPES = {
  [FEE_STRUCTURE_TYPES_IDS.RECURRING_FEE]: {
    key: FEE_STRUCTURE_TYPES_IDS.RECURRING_FEE,
    icon: <Icon name="autoRenew" size="m" color="secondary" />,
    label: 'Recurring Fee',
    description:
      'Create recurring fees like tuition fee, sports fee, hostel fee, maintenance fee, etc',
  },
  [FEE_STRUCTURE_TYPES_IDS.ONE_TIME_FEE]: {
    key: FEE_STRUCTURE_TYPES_IDS.ONE_TIME_FEE,
    icon: <Icon name="dateRange" size="m" color="secondary" />,
    label: 'One Time Fee',
    description:
      'Create one time fees like admission fee, caution deposit, uniform fee, etc',
  },
  [FEE_STRUCTURE_TYPES_IDS.TRANSPORT_FEE]: {
    key: FEE_STRUCTURE_TYPES_IDS.TRANSPORT_FEE,
    icon: <Icon name="bus" size="m" color="secondary" />,
    label: 'Transport Fee',
    description: 'Create transport fee based on distance range or stops',
  },
  // [FEE_STRUCTURE_TYPES_IDS.CUSTOM]: {
  //   key: FEE_STRUCTURE_TYPES_IDS.CUSTOM,
  //   icon: <Icon name="restore" size="m" color="secondary" />,
  //   label: 'Previous Session Dues',
  //   description:
  //     "Add previous session's due fee balance to student's current session fee by uploading CSV file",
  // },
}

export const ALL_STRUCTURE_SLIDER_TABS = {
  [FEE_STRUCTURE_TYPES_IDS.RECURRING_FEE]: RECURRING_SLIDER_TABS,
  [FEE_STRUCTURE_TYPES_IDS.ONE_TIME_FEE]: ONETIME_SLIDER_TABS,
  [FEE_STRUCTURE_TYPES_IDS.TRANSPORT_FEE]: TRANSPORT_SLIDER_TABS,
}

export const STUDENT_OPTIONS = {
  NONE: 'NONE',
  ALL: 'ALL',
  ONLY_NEW: 'NEW',
  ONLY_EXISTING: 'EXISTING',
}

export const STUDENT_PROFILE_OPTIONS = [
  {id: STUDENT_OPTIONS.ALL, label: 'Applicable for all'},
  {id: STUDENT_OPTIONS.ONLY_NEW, label: 'New students'},
  {id: STUDENT_OPTIONS.ONLY_EXISTING, label: 'Existing students'},
]

export const PROFILE_GENDER_OPTIONS = [
  {id: 'all', label: 'applicableForAll'},
  {id: 'male', label: 'male'},
  {id: 'female', label: 'female'},
  {id: 'others', label: 'others'},
]

// export const PROFILE_CATEGORY_OPTIONS = [
//   {id: 'all', label: 'applicableForAll'},
//   {id: 'NONE', label: 'NONE'},
//   {id: 'GEN', label: 'GEN'},
//   {id: 'GEN_EWS', label: 'GEN_EWS'},
//   {id: 'OBC', label: 'OBC'},
//   {id: 'OBC_NCL', label: 'OBC_NCL'},
//   {id: 'SC', label: 'SC'},
//   {id: 'ST', label: 'ST'},
//   {id: 'FOREIGNER', label: 'FOREIGNER'},
//   {id: 'OTHER', label: 'OTHER'},
// ]

export const PROFILE_CATEGORY_OPTIONS = categoryList.filter(
  (option) => option.value !== 'OBC_CL'
)

// Model Screen
export const TRANSACTION_UPDATE_STATUS = 'TRANSACTION_UPDATE_STATUS'
export const VIEW_TXN_TIMELINE = 'VIEW_TXN_TIMELINE'
export const ACT_DOWNLOAD_RECEIPT = 'ACT_DOWNLOAD_RECEIPT'
export const ACTION_DELETE_TRANSACTION = 'ACTION_DELETE_TRANSACTION'
export const ACTION_CANCEL_TRANSACTION = 'ACTION_CANCEL_TRANSACTION'
export const ACTION_CANCEL_TRANSACTION_RECEIPT =
  'ACTION_CANCEL_TRANSACTION_RECEIPT'
export const REFRESH_TXN_STATUS = 'REFRESH_TXN_STATUS'

// Actions
export const DISCOUNT_TOOLTIP_OPTION_IDS = {
  ACT_DISCOUNT_EDIT: 'ACT_DISCOUNT_EDIT',
  ACT_DOWNLOAD_STUDENT_LIST: 'ACT_DOWNLOAD_STUDENT_LIST',
  ACT_DISCOUNT_DELETE: 'ACT_DISCOUNT_DELETE',
}

export const DISCOUNT_TOOLTIP_OPTIONS = [
  {
    label: 'Edit Discount',
    action: DISCOUNT_TOOLTIP_OPTION_IDS.ACT_DISCOUNT_EDIT,
    labelStyle: '',
    permissionId:
      PERMISSION_CONSTANTS.feeModuleController_updateFeeDiscount_update,
  },
  {
    label: 'Download Student List',
    action: DISCOUNT_TOOLTIP_OPTION_IDS.ACT_DOWNLOAD_STUDENT_LIST,
    labelStyle: '',
    permissionId: PERMISSION_CONSTANTS.feeModuleController_getFeeDiscounts_read,
  },
  {
    label: 'Delete Discount',
    action: DISCOUNT_TOOLTIP_OPTION_IDS.ACT_DISCOUNT_DELETE,
    labelStyle: 'tm-cr-rd-1',
    permissionId:
      PERMISSION_CONSTANTS.feeModuleController_deleteDiscount_delete,
  },
]

// Student Dues Actions
export const STUDENT_DUES_TOOLTIP_OPTION_IDS = {
  SEND_REMINDER: 'SEND_REMINDER',
  DOWNLOAD_DEMAND_LETTER: 'DOWNLOAD_DEMAND_LETTER',
}

export const STUDENT_DUES_TOOLTIP_OPTIONS = [
  {
    label: 'Send Reminder',
    action: STUDENT_DUES_TOOLTIP_OPTION_IDS.SEND_REMINDER,
    labelStyle: '',
    permissionId:
      PERMISSION_CONSTANTS.feeModuleController_sendFeeReminder_create,
  },
  {
    label: 'Download Demand Letter',
    action: STUDENT_DUES_TOOLTIP_OPTION_IDS.DOWNLOAD_DEMAND_LETTER,
    labelStyle: '',
    permissionId:
      PERMISSION_CONSTANTS.feeModuleController_getDemandLetterDownload_read,
  },
]

export const KYC_INFO = {
  NONE: 'NONE',
  BUSINESS: 'BUSINESS',
  OWNER: 'OWNER',
  BANK: 'BANK',
  DOCUMENTS: 'DOCUMENTS',
  REQUESTED: 'REQUESTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  NEED_CLARIFICATION: 'NEED_CLARIFICATION',
  ACTIVATED: 'ACTIVATED',
  SUSPENDED: 'SUSPENDED',
}

export const DELETE_TRANSACTION_TITLE =
  'Are you sure you want to delete this receipt?'
export const DELETE_TRANSACTION_DESC =
  "The receipt will be deleted permanently and can't be undone later."
export const DELETE_TRANSACTION_PRIMARY_BTN_TEXT = 'No, Cancel'
export const DELETE_TRANSACTION_SECONDARY_BTN_TEXT = 'Yes, Delete'
export const CANCELLED_TRANSACTION_TITLE =
  'Are you sure you want to cancel the transaction?'
export const CANCELLED_TRANSACTION_DESC =
  'Upon cancellation, payment will be reverted.'
export const CANCELLED_TRANSACTION_PRIMARY_BTN_TEXT = 'No, Exit'
export const CANCELLED_TRANSACTION_SECONDARY_BTN_TEXT = 'Yes, Cancel'
export const ONLINE_PAYMENT_COLLECTION = 'Online Payment Collection'
export const COMPLETE_YOUR_KYC =
  'To collect payments via Payment Gateway please complete your KYC.'
export const ALL_PAYMENT_COLLECTED =
  'All payments collected online will be sent to account details shown below'
export const MANDATORY_FOR_REGULATORY_COMPLIANCE =
  'Mandatory for regulatory compliance'
export const COMPLETE_KYC = 'Complete KYC'
export const IN_PROCESS = 'Verification In Process'
export const THREE_WORKING_DAYS = 'It may take upto 3 working days'
export const NEED_MORE_INFORMATION = 'Need more information'
export const ISSUE_WITH_DOCUMENT =
  'There was some issue with the documents provided by you.'
export const REQUIRES_FEW_CLARIFICATIONS =
  'Razorpay requires some clarifications to activate your account. An email has been sent to '
export const UPDATE_ALTERNATIVELY =
  'Alternatively you can also update the same on the'
export const RAZORPAY_DASHBOARD = 'Razorpay Dashboard'
export const REMEMBER_PASSWORD =
  "In case you don't remember your password please use the forgot password option on the Razorpay login page."
export const KYC_COMPLETE =
  'Your KYC is completed. You can now start accepting online payments.'
export const ACTIVE_PAYMENT_GATEWAY = 'Active Payment Gateway: Razorpay'
export const VERIFICATION_FAILED = 'KYC verification failed'
export const NOT_ABLE_TO_COLLECT_ONLINE_PAYMENTS =
  'The documents provided by you failed the verification process. You will not be able to collect online payments.'
export const REJECT_APPLICATION = 'Razorpay has rejected your application.'
export const GET_IN_TOUCH_WITH_RAZORPAY =
  'Please get in touch with Razorpay customer support through'
export const MORE_DETAILS = 'for details.'
export const KYC_VERIFICATION = 'KYC Verification'
export const REGISTRATION_API = 'Registration & API Verification'
export const CHANGE = 'Change'
export const COMPLETE_KYC_SETUP = 'Please complete your KYC to setup'
export const REGULATORY_COMPLIANCE = '(Mandatory for regulatory compliance)'
export const REGISTER = 'Register'
export const ACCESS_TEACHPAY_DASHBOARD = 'Access TeachPay Panel'
export const ENTER_API_DETAILS = 'Enter the new API details'
export const ENTER_API_DETAILS_BELOW = 'Have API details? Enter them below'
export const freeCategoryNo = '08035073710'
export const paidCategoryNo = '08035073657'
export const REVOKED = 'REVOKED'
export const FAILED = 'FAILED'

export const paymentStatus = {
  SELECT_PAYMENT_METHOD: 'select payment method',
  CASH: 'CASH',
  CHEQUE: 'CHEQUE',
  DD: 'DD',
  // ONLINE: 'Online (PG)',
  ONLINE: 'ONLINE',
  BANK_TRANSFER: 'BANK_TRANSFER',
  UPI: 'UPI',
  POS: 'POS',
  CHALLAN: 'CHALLAN',
  OTHERS: 'OTHERS',
}

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  RECEIVED: 'SUCCESS',
  CLEARED: 'SUCCESS',
  RETURNED: 'RETURNED',
  SUCCESS: 'SUCCESS',
  SETTLED: 'SETTLED',
  BOUNCED: 'FAILED',
  FAILED: 'FAILED',
  REVOKED: 'DELETED',
  CANCELLED: 'CANCELLED',
}

export const paymentStatusLabels = {
  [paymentStatus.CASH]: {
    key: paymentStatus.CASH,
    actualLabel: 'Cash',
    label: 'cash',
    placeholder: '',
    visibleToInernational: true,
    internationalLabel: 'cash',
  },
  [paymentStatus.CHEQUE]: {
    key: paymentStatus.CHEQUE,
    actualLabel: 'Cheque',
    label: 'cheque',
    placeholder: 'Cheque number 212131',
    visibleToInernational: true,
    internationalLabel: 'cheque',
  },
  [paymentStatus.ONLINE]: {
    key: paymentStatus.ONLINE,
    actualLabel: 'Online (PG)',
    label: 'onlinePg',
    placeholder: '',
    visibleToInernational: false,
    internationalLabel: 'onlinePg',
  },
  [paymentStatus.DD]: {
    key: paymentStatus.DD,
    actualLabel: 'DD',
    label: 'dd',
    placeholder: 'DD number 213141',
    visibleToInernational: false,
    internationalLabel: 'dd',
  },
  [paymentStatus.BANK_TRANSFER]: {
    key: paymentStatus.BANK_TRANSFER,
    actualLabel: 'Bank Transfer/NEFT',
    label: 'bankTransferNeft',
    placeholder: 'Ref no ABCDN22025XXXXXX',
    visibleToInernational: true,
    internationalLabel: 'bankTransfer',
  },
  [paymentStatus.UPI]: {
    key: paymentStatus.UPI,
    actualLabel: 'UPI',
    label: 'UPI',
    placeholder: 'UPI ID rahulk@okbank',
    visibleToInernational: false,
    internationalLabel: 'UPI',
  },
  [paymentStatus.POS]: {
    key: paymentStatus.POS,
    actualLabel: 'POS',
    label: 'POS',
    placeholder: 'Transaction number QWE7654321',
    visibleToInernational: true,
    internationalLabel: 'POS',
  },
  [paymentStatus.CHALLAN]: {
    key: paymentStatus.CHALLAN,
    actualLabel: 'Challan',
    label: 'challan',
    placeholder: 'CIN 6360218 133207 3428972',
    visibleToInernational: false,
    internationalLabel: 'challan',
  },
  [paymentStatus.OTHERS]: {
    key: paymentStatus.OTHERS,
    actualLabel: 'Others',
    label: 'others',
    placeholder: 'Type here..',
    visibleToInernational: true,
    internationalLabel: 'others',
  },
}

export const PAYMENT_MODE_ENUM_CONVERSION = {
  // 0: t('None'),
  1: paymentStatusLabels[paymentStatus.ONLINE].actualLabel,
  2: paymentStatusLabels[paymentStatus.CASH].actualLabel,
  3: paymentStatusLabels[paymentStatus.CHEQUE].actualLabel,
  4: paymentStatusLabels[paymentStatus.DD].actualLabel,
  5: paymentStatusLabels[paymentStatus.POS].actualLabel,
  6: paymentStatusLabels[paymentStatus.BANK_TRANSFER].actualLabel,
  // 7: paymentStatus.RTE_GOVT,
  8: paymentStatusLabels[paymentStatus.UPI].actualLabel,
  9: paymentStatusLabels[paymentStatus.CHALLAN].actualLabel,
  10: paymentStatusLabels[paymentStatus.OTHERS].actualLabel,
}

export const simplePaymentModes = [
  paymentStatus.CASH,
  paymentStatus.BANK_TRANSFER,
  paymentStatus.UPI,
  paymentStatus.POS,
  paymentStatus.CHALLAN,
  paymentStatus.OTHERS,
]

export const bankTransactionModes = {
  RECEIVED: 'RECEIVED',
  DEPOSITED: 'DEPOSITED',
  CLEARED: 'CLEARED',
  BOUNCED: 'BOUNCED',
  RETURNED: 'RETURNED',
  CANCELLED: 'CANCELLED',
}

export const bankTransactionFilterModes = {
  RECEIVED: 'Received',
  DEPOSITED: 'Deposited',
  CLEARED: 'Cleared',
  BOUNCED: 'Bounced',
  RETURNED: 'Returned',
  CANCELLED: 'Cancelled',
}

export const transactionMethods = {
  PENDING: 'PENDING',
  RECEIVED: 'RECEIVED',
  CLEARED: 'CLEARED',
}

export const studentFeeStatus = {
  ALL: 'All',
  PAID: 'Paid',
  DUE: 'Due',
}

export const multiPaymentGateway = {
  EASEBUZZ: 'EASEBUZZ',
  RAZORPAY: 'RAZORPAY',
  PAYU: 'PAYU',
  CASHFREE: 'CASHFREE',
  PAYSTACK: 'PAYSTACK',
  TEACHPAY: 'TEACHPAY',
}
export const tableValues = {
  [multiPaymentGateway.RAZORPAY]: {
    upi: '0.05%',
    netBanking: '1.55%',
    rDebitCard: '0.10%',
    oDebitCardl: '0.45%',
    oDebitCardg: '0.90%',
    creditCard: '1.20%',
    wPaytm: '1.50%',
    wOthers: '1.50%',
    emi: '2.15%',
    corporateCard: '2.65%',
  },
  [multiPaymentGateway.EASEBUZZ]: {
    upi: 'FREE',
    netBanking: '₹10 Flat',
    rDebitCard: 'FREE',
    oDebitCardl: '0.40%',
    oDebitCardg: '0.60%',
    creditCard: '0.90%',
    wPaytm: '1.85%',
    wOthers: '1.45%',
    emi: '1.70%',
    corporateCard: '2.50%',
  },
  [multiPaymentGateway.PAYU]: {
    upi: '2%',
    netBanking: '2%',
    rDebitCard: '2%',
    oDebitCardl: '2%',
    oDebitCardg: '2%',
    creditCard: '2%',
    wPaytm: '2%',
    wOthers: '2%',
    emi: '3%',
    corporateCard: '3%',
  },
  [multiPaymentGateway.CASHFREE]: {
    upi: 'FREE',
    netBanking: '1.90%',
    rDebitCard: 'FREE',
    oDebitCardl: '1.90%',
    oDebitCardg: '1.90%',
    creditCard: '1.90%',
    wPaytm: '2.50%',
    wOthers: '2.50%',
    emi: '2.50%',
    corporateCard: '2.95%',
  },
}

export const paymentLogo = {
  [multiPaymentGateway.EASEBUZZ]: EasebuzzLogo,
  [multiPaymentGateway.RAZORPAY]: razorpayLogo,
  [multiPaymentGateway.PAYU]: PayuLogo,
  [multiPaymentGateway.CASHFREE]: CashFreeLogo,
  [multiPaymentGateway.PAYSTACK]: PaystackLogo,
}

export const easebuzzRegisterUrl =
  'https://auth.easebuzz.in/easebuzz/signup/TeachmintLVQ'

export const RazorPaymentGateway = new Set([multiPaymentGateway.RAZORPAY])

export const paymentDateways = new Set([
  multiPaymentGateway.EASEBUZZ,
  multiPaymentGateway.PAYU,
  multiPaymentGateway.CASHFREE,
])

export const payuCashfreeGateway = new Set([
  multiPaymentGateway.PAYU,
  multiPaymentGateway.CASHFREE,
])

export const paymentGatewayPricing = (tableData) => {
  return [
    {
      key: 'UPI',
      val: tableValues[tableData].upi,
    },
    {
      key: 'Net-banking (60+ banks)',
      val: tableValues[tableData].netBanking,
    },
    {
      key: 'Rupay Debit Card',
      val: tableValues[tableData].rDebitCard,
    },
    {
      key: 'Debit Card (transactions less than ₹2,000)',
      val: tableValues[tableData].oDebitCardl,
    },
    {
      key: 'Debit Card (transactions more than ₹2,000)',
      val: tableValues[tableData].oDebitCardg,
    },
    {
      key: 'Credit card (Visa/Master Card)',
      val: tableValues[tableData].creditCard,
    },
    {
      key: 'Wallets (Paytm)',
      val: tableValues[tableData].wPaytm,
    },
    {
      key: 'Wallets (others)',
      val: tableValues[tableData].wOthers,
    },
    {
      key: 'EMI',
      val: tableValues[tableData].emi,
    },
    {
      key: 'Corporate Card',
      val: tableValues[tableData].corporateCard,
    },
  ]
}

export const colsData = [
  {key: 'key', label: 'Payment Method'},
  {key: 'pricing', label: 'Pricing'},
]

export const rowdata = (rowsdata) => {
  return rowsdata.map((rowsdata) => ({
    key: rowsdata.key,
    pricing: rowsdata.val,
  }))
}

export const feesFields = [
  {
    labelName: 'API Key',
    type: 'text',
    fieldName: 'keyData',
    placeholder: '#ABCDEF1GH2',
  },
  {
    labelName: 'API Salt',
    type: 'text',
    fieldName: 'saltData',
    placeholder: '12ABCD3EFG',
  },
  {
    labelName: 'Merchant Email (used for registration)',
    type: 'text',
    fieldName: 'merchantEmail',
    placeholder: 'admin@delhipublicschool.com',
  },
]

export const initialValues = [
  {
    keyData: '',
    saltData: '',
  },
]

export const formDetails = {
  kyc: {
    subText: 'What to do next?',
    listData: [
      'Complete your KYC',
      'It takes 3-4 days for the verification to get done',
      'Start accepting payments',
    ],
  },
  saltKey: {
    subText: 'What to do next?',
    listData: [
      'Register on {gateway}',
      'Enter API Details received from {gateway}',
      'Start accepting payments',
    ],
  },
}

export const CUSTOM_CATEGORY = {
  text: 'None of the Above',
  value: 'custom_category',
  addNewPopup: {
    title: 'Add Custom Fee Type',
    placeholder: 'Add custom fee type here',
    charLimit: 40,
  },
}

export const MASTER_ID = 'master_id'
export const ERROR_MESSAGES = {
  customCategory: {
    notCreated: 'Custom category is not created',
    errorWhileCreating: 'Some Error happend while creating custom category',
  },
}

export const TRANSPORT_METHODS = {
  DISTANCE: 'DISTANCE',
  WAYPOINT: 'WAYPOINT',
  NONE: 'NONE',
}

export const FEE_STRUCTURE_TAB_SECTION_HEADING = {
  thirdSection: {
    number: 3,
    title: 'Add fee amount',
    subTitle: 'Select method for transport fee calculation',
    radioOptions: [
      {id: 'DISTANCE', label: 'Distance'},
      {id: 'WAYPOINT', label: 'Pickup or Drop Point'},
    ],
  },
}

export const TRANSPORT_METHODS_TABLE_HEADER = {
  pickupOrDropPoint: 'Pickup or Drop Point',
  amount: 'Amount',
}

export const FEE_REPORTS = {
  feePaidAndDueReports: 'paidAndDueFeeReports',
  paymentCollectionReports: 'paymentCollectionReports',
  miscellaneousReports: 'miscellaneousReports',
}

export const FEE_REPORTS_KEY_VALUE = {
  paidAndDueFeeReports: {
    key: 'paidAndDueFeeReports',
    label: FEE_REPORTS.feePaidAndDueReports,
  },
  paymentCollectionReports: {
    key: 'paymentCollectionReports',
    label: FEE_REPORTS.paymentCollectionReports,
  },
  miscellaneousReports: {
    key: 'miscellaneousReports',
    label: FEE_REPORTS.miscellaneousReports,
  },
}

export const FEE_REPORTS_CHILDREN_IDS = {
  studentWiseReport: 'studentWiseReport',
  classWiseReport: 'classWiseReport',
  departmentWiseReport: 'departmentWiseReport',
  monthWiseReport: 'monthWiseReport',
  feeTypeWiseReport: 'feeTypeWiseReport',
  paymentModeWiseReport: 'paymentModeWiseReport',
  sectionWiseReport: 'sectionWiseReport',
}

export const FEE_REPORTS_TITLE = {
  FEE_DUE_PAID_STUDENT: t('studentWisePaidDueFeeReport'),
  FEE_DUE_PAID_CLASS: t('paidDueFeeReportByClass'),
  FEE_DUE_PAID_DEPARTMENT: t('paidDueFeeReportByDepartment'),
  monthWisePaidAndDueFeeReport: t('monthlyPaidDueFeeReport'),
  FEE_DUE_PAID_INSTALLMENT: t('paidDueFeeReportByInstallment'),
  FEE_DUE_PAID_SECTION: t('paidDueFeeReportBySection'),

  FEE_COLLECTION_MONTH: t('monthlyPaymentCollectionReport'),
  FEE_COLLECTION_DAILY: t('dailyPaymentCollectionReport'),
  FEE_COLLECTION_DEPARTMENT: t('paymentCollectionReportByDepartment'),
  FEE_COLLECTION_CLASS: t('paymentCollectionReportByClass'),
  FEE_COLLECTION_FEETYPE: t('paymentCollectionReportByFeeType'),
  FEE_COLLECTION_PAYMENTMODE: t('paymentCollectionReportByPaymentMode'),
  FEE_COLLECTION_SECTION: t('paymnetCollectionReportBySection'),

  FEE_MISC_CHEQUE_STATUS: t('chequeDdStatusReport'),
  FEE_MISC_ALL_TRANSACTIONS: t('allTransactionsReport'),
}

// 0 - > Class Section
// 1 - > Fee Type
// 2 - > Installment
// 3 - > Department Type
// 4 - > Month Wise
// 5 - > Payment Mode
// 6 - > Time
// 7 - > Transaction Status
// Months

export const FEE_URL_TO_REPORT_TYPE = {
  'fee-due-paid-by-student': 'FEE_DUE_PAID_STUDENTWISE',
  'fee-due-paid-by-class': 'FEE_DUE_PAID_CLASSWISE',
  'fee-due-paid-by-department': 'FEE_DUE_PAID_DEPARTMENTWIS',
  'fee-due-paid-by-installment': 'FEE_DUE_PAID_INSTALLMENTWISE',
  'fee-due-paid-by-section': 'FEE_DUE_PAID_SECTIONWISE',
  'fee-collection-by-month': 'FEE_COLLECTION_MONTH',
  'fee-collection-by-day': 'FEE_COLLECTION_DAILY',
  'fee-collection-by-department': 'FEE_COLLECTION_DEPARTMENTWISE',
  'fee-collection-by-class': 'FEE_COLLECTION_CLASSWISE',
  'fee-collection-by-fee-type': 'FEE_COLLECTION_FEETYPEWISE',
  'fee-collection-by-payment-mode': 'FEE_COLLECTION_PAYMENTMODEWISE',
  'fee-collection-by-section': 'FEE_COLLECTION_SECTIONWISE',
  'all-transactions': 'FEE_MISC_ALL_TRANSACTIONS',
  'cheque-status': 'FEE_MISC_CHEQUE_STATUS',
}

export const FEE_REPORTS_TEMPLATES = {
  FEE_DUE_PAID_STUDENTWISE: {
    key: 'FEE_DUE_PAID_STUDENTWISE',
    // value: 'FEE_DUE_PAID:STUDENTWISE',
    value: 'FEE_DUE_PAID_STUDENT',
    sliderHeadingTranslationKey: 'studentWisePaidAndDueFeeReport',
    sort: [3, 2],
    filters: [
      {label: 'Class Section', value: 0},
      {label: 'Fee Type', value: 1},
    ],
    events: {type: 'paid_due', subType: 'student'},
    route: 'fee-due-paid-by-student',
  },
  FEE_DUE_PAID_CLASSWISE: {
    key: 'FEE_DUE_PAID_CLASSWISE',
    // value: 'FEE_DUE_PAID:CLASSWISE',
    value: 'FEE_DUE_PAID_CLASS',
    sliderHeadingTranslationKey: 'classWisePaidAndDueFeeReport',
    sort: [4, 2],
    filters: [
      {label: 'Class', value: 0},
      {label: 'Fee Type', value: 1},
    ],
    events: {type: 'paid_due', subType: 'class'},
    route: 'fee-due-paid-by-class',
  },
  FEE_DUE_PAID_DEPARTMENTWIS: {
    key: 'FEE_DUE_PAID_DEPARTMENTWIS',
    // value: 'FEE_DUE_PAID:DEPARTMENTWISE',
    value: 'FEE_DUE_PAID_DEPARTMENT',
    sliderHeadingTranslationKey: 'departmentWisePaidAndDueFeeReport',
    sort: [5],
    filters: [
      {label: 'Departments', value: 3},
      {label: 'Fee Type', value: 1},
    ],
    events: {type: 'paid_due', subType: 'department'},
    route: 'fee-due-paid-by-department',
  },
  // FEE_DUE_PAID_MONTHWISE: 'FEE_DUE_PAID:MONTHWISE',
  FEE_DUE_PAID_INSTALLMENTWISE: {
    key: 'FEE_DUE_PAID_INSTALLMENTWISE',
    // value: 'FEE_DUE_PAID:INSTALLMENTWISE',
    value: 'FEE_DUE_PAID_INSTALLMENT',
    sliderHeadingTranslationKey: 'instalmentWisePaidAndDueFeeReport',
    sort: [6],
    filters: [
      {label: 'Fee Type', value: 1},
      {label: 'Installments', value: 2},
    ],
    events: {type: 'paid_due', subType: 'instalment'},
    route: 'fee-due-paid-by-installment',
  },

  FEE_DUE_PAID_SECTIONWISE: {
    key: 'FEE_DUE_PAID_SECTIONWISE',
    // value: 'FEE_DUE_PAID:SECTIONWISE',
    value: 'FEE_DUE_PAID_SECTION',
    sliderHeadingTranslationKey: 'sectionWisePaidAndDueFeeReport',
    sort: [8],
    filters: [
      {label: 'Class Section', value: 0},
      {label: 'Fee Type', value: 1},
    ],
    events: {type: 'paid_due', subType: 'section'},
    route: 'fee-due-paid-by-section',
  },

  FEE_COLLECTION_DAILY: {
    key: 'FEE_COLLECTION_DAILY',
    // value: 'FEE_COLLECTION:MONTHWISE',
    value: 'FEE_COLLECTION_DAILY',
    sliderHeadingTranslationKey: 'dayWisePaymentCollectionReport',
    sort: [6],
    filters: [
      {label: 'Payment Mode', value: 5},
      {label: 'Fee Type', value: 1},
    ],
    events: {type: 'payment_collection', subType: 'day'},
    route: 'fee-collection-by-day',
  },
  FEE_COLLECTION_MONTH: {
    key: 'FEE_COLLECTION_MONTH',
    // value: 'FEE_COLLECTION:MONTHWISE',
    value: 'FEE_COLLECTION_MONTH',
    sliderHeadingTranslationKey: 'monthWisePaymentCollectionReport',
    sort: [6],
    filters: [
      {label: 'Payment Mode', value: 5},
      {label: 'Fee Type', value: 1},
    ],
    events: {type: 'payment_collection', subType: 'month'},
    route: 'fee-collection-by-month',
  },
  FEE_COLLECTION_DEPARTMENTWISE: {
    key: 'FEE_COLLECTION_DEPARTMENTWISE',
    // value: 'FEE_COLLECTION:DEPARTMENTWISE',
    value: 'FEE_COLLECTION_DEPARTMENT',
    sliderHeadingTranslationKey: 'departmentWisePaymentCollectionReport',
    sort: [5],
    filters: [
      {label: 'Payment Mode', value: 5},
      {label: 'Departments', value: 3},
      {label: 'Fee Type', value: 1},
    ],
    events: {type: 'payment_collection', subType: 'department'},
    route: 'fee-collection-by-department',
  },
  FEE_COLLECTION_CLASSWISE: {
    key: 'FEE_COLLECTION_CLASSWISE',
    // value: 'FEE_COLLECTION:CLASSWISE',
    value: 'FEE_COLLECTION_CLASS',
    sliderHeadingTranslationKey: 'classWisePaymentCollectionReport',
    sort: [4],
    filters: [
      {label: 'Payment Mode', value: 5},
      {label: 'Class', value: 0},
      {label: 'Fee Type', value: 1},
    ],
    events: {type: 'payment_collection', subType: 'class'},
    route: 'fee-collection-by-class',
  },
  FEE_COLLECTION_FEETYPEWISE: {
    key: 'FEE_COLLECTION_FEETYPEWISE',
    // value: 'FEE_COLLECTION:FEETYPEWISE',
    value: 'FEE_COLLECTION_FEETYPE',
    sliderHeadingTranslationKey: 'feeTypeWisePaymentCollectionReport',
    sort: [2],
    filters: [
      {label: 'Payment Mode', value: 5},
      {label: 'Fee Type', value: 1},
    ],
    events: {type: 'payment_collection', subType: 'fee_type'},
    route: 'fee-collection-by-fee-type',
  },
  FEE_COLLECTION_PAYMENTMODEWISE: {
    key: 'FEE_COLLECTION_PAYMENTMODEWISE',
    // value: 'FEE_COLLECTION:PAYMENTMODEWISE',
    value: 'FEE_COLLECTION_PAYMENTMODE',
    sliderHeadingTranslationKey: 'paymentModeWisePaymentCollectionReport',
    filters: [
      {label: 'Payment Mode', value: 5},
      {label: 'Fee Type', value: 1},
    ],
    events: {type: 'payment_collection', subType: 'payment_mode'},
    route: 'fee-collection-by-payment-mode',
  },
  FEE_COLLECTION_SECTIONWISE: {
    key: 'FEE_COLLECTION_SECTIONWISE',
    // value: 'FEE_COLLECTION:SECTIONWISE',
    value: 'FEE_COLLECTION_SECTION',
    sliderHeadingTranslationKey: 'sectionWisePaymentCollectionReport',
    sort: [8],
    filters: [
      {label: 'Payment Mode', value: 5},
      {label: 'Class Section', value: 0},
      {label: 'Fee Type', value: 1},
    ],
    events: {type: 'payment_collection', subType: 'section'},
    route: 'fee-collection-by-section',
  },

  FEE_MISC_ALL_TRANSACTIONS: {
    key: 'FEE_MISC_ALL_TRANSACTIONS',
    value: 'FEE_MISC_ALL_TRANSACTIONS',
    sliderHeadingTranslationKey: 'transactionReportMiscellaneousReport',
    sort: [7],
    filters: [
      {label: 'Payment Mode', value: 5},
      {label: 'Transaction Status', value: 7},
    ],
    events: {type: 'miscellaneous', subType: 'all_trans'},
    route: 'all-transactions',
  },
  FEE_MISC_CHEQUE_STATUS: {
    key: 'FEE_MISC_CHEQUE_STATUS',
    value: 'FEE_MISC_CHEQUE_STATUS',
    sliderHeadingTranslationKey: 'chequeDdStatusReportMiscellaneousReport',
    sort: [7],
    filters: [{label: 'Transaction Status', value: 7}],
    events: {type: 'miscellaneous', subType: 'cheque'},
    route: 'cheque-status',
  },
}

export const FEE_TYPE_YOU_WANT_TO_BE_INCLUDED_IN_YOUR_REPORT =
  'feeTypeYouWantToBeIncludedInYourReport'
export const CLASSES_OF_STUDENTS_YOU_WANT_TO_BE_INCLUDED_IN_YOUR_REPORT =
  'classesOfStudentsYouWantToBeIncludedInYourReport'
export const CLASSES_YOU_WANT_TO_BE_INCLUDED_IN_YOUR_REPORT =
  'classesYouWantToBeIncludedInYourReport'
export const DEPARTMENTS_YOU_WANT_TO_BE_INCLUDED_IN_YOUR_REPORT =
  'departmentsYouWantToBeIncludedInYourReport'

export const MONTHS_YOU_WANT_TO_BE_INCLUDED_IN_YOUR_REPORT =
  'monthsYouWantToBeIncludedInYourReport'
export const SELECT_DETAILS_OF_THE_REPORT_YOU_WANT_TO_BE_INCLUDED_IN_THE_REPORT =
  'selectDetailsOfTheReportYouWantToBeIncludedInTheReport'
export const SAVE_THIS_QUERY_YOU_CAN_ACCESS_IT_VIA_SAVED_REPORTS_QUERIES =
  'saveThisQueryYouCanAccessItViaSavedReportsQueries'

export const INCLUDE_PENDING_CHEQUE_DATA_IN_THE_REPORT =
  'includePendingChequeDataInTheReport'
export const INCLUDE_PENDING_CHEQUE_DD_DATA_IN_THE_REPORT =
  'includePendingChequeDdDataInTheReport'

export const DATE_RANGE = 'dateRange'
export const SELECT_DATE_RANGE = 'selectDateRange'

export const PAYMENT_MODES = 'paymentModes'
export const TRANSACTION_STATUS = 'transactionStatus'
export const SELECT_FEE_TYPE = 'selectFeeType'
export const SELECT_CLASSES = 'selectClasses'
export const SELECT_DEPARTMENTS = 'selectDepartments'
export const SELECT_MONTHS = 'selectMonths'
export const SELECT_SECTIONS = 'selectSections'

export const SELECT_DETAILS_FOR_WHICH_YOU_WANT_TO_DOWNLOAD_REPORT =
  'selectdetailsforwhichyouwanttodownloadreport'

export const DATE_RANGE_IDS = {
  from: 'from',
  to: 'to',
}

export const INSTALMENT_WISE_REPORT = 'instalmentWiseReport'

export const PLACEHOLDERS = {
  feeType: 'Recurring Fee',
  section: '10 A',
  classes: 'Select Classes',
  department: 'Primary',
  // months: `${new Date().getMonth()}, ${new Date().getFullYear()}`,
  months: `${DateTime.now().toFormat('MMM, yyyy')}`,
  dateRange: 'DD/MM/YYYY',
  paymentModes: 'Cash',
  instalment: 'DD/MM/YYYY',
  discountAmount: '300',
}

export const VIEW_ALL = 'viewAll'
export const VIEW_LESS = 'viewLess'
export const MULTI_SELECT_WITH_CHIPS = 'multiselectWithChips'
export const DATE_RANGE_INPUT_TYPE = 'dateRangeInputType'
export const INSTITUTE_TREE_TYPE = 'instituteTreeType'

export const SAVED_REPORTS_TABLE_COLUMNS = [
  {key: 'reportName', label: 'reportName'},
  {key: 'adminDetailsDate', label: 'adminDetailsAndDate'},
  {key: 'action', label: 'action'},
]

export const translationId = {
  studentWise: 'studentWise',
  classWise: 'classWise',
  departmentWise: 'departmentWise',
  monthWise: 'monthWise',
  feeTypeWise: 'feeTypeWise',
  paymentModeWise: 'paymentModeWise',
}
export const ATTENDANCE_DATA_IS_NOT_AVAILABLE_FOR_THIS_DATE_RANGE =
  'attendanceDataIsNotAvailableForThisDateRange'

export const FILE_HAS_BEEN_DOWNLOADED = 'fileHasBeenDownloaded'
export const NO_ACTIVITY = 'noActivity'
export const REPORT_DOWNLOAD_HISTORY_WILL_APPEAR_HERE =
  'reportDownloadHistoryWillAppearHere'

export const PROFILE_FILTERS_KEY = 'profile_filters'
export const SELECT_INSTALMENT_DATES = 'selectInstalmentDates'
export const INSTALMENT_DATES_YOU_WANT_TO_BE_INCLUDED_IN_YOUR_REPORT =
  'instalmentDatesYouWantToBeIncludedInYourReport'
export const SELECT_TRANSACTION_STATUS = 'selectTransactionStatus'

export const FIELD_SORT = {
  DEFAULT: [1, 2, 3, 4, 5, 6, 7, 8, 9],
}

export const CHEQUE_STATUS = [
  {
    value: 'PENDING',
    label: 'pending',
  },
  {
    value: 'SUCCESS',
    label: 'success',
  },
  {
    value: 'SETTLED',
    label: 'settled',
  },
  {
    value: 'CANCELLED',
    label: 'cancelled',
  },
  {
    value: 'DELETED',
    label: 'deleted',
  },
  {
    value: 'FAILED',
    label: 'failed',
  },
]

export const GROUP_BY = {
  classId: '_id',
  sectionId: '_id',
  departmentId: '_id',
  instalmentId: '_id',
}

export const DISCOUNTS_TYPES_IDS = {
  STANDARD_DISCOUNT: 'STANDARD_DISCOUNT',
  AD_HOC_DISCOUNT: 'AD_HOC_DISCOUNT',
}

export const DISCOUNTS_TYPES = [
  {
    labelTransKey: 'standardDiscount',
    originalLabel: 'Standard Discount',
    value: DISCOUNTS_TYPES_IDS.STANDARD_DISCOUNT,
  },
  {
    labelTransKey: 'addOnDiscount',
    originalLabel: 'Add-On Discount',
    value: DISCOUNTS_TYPES_IDS.AD_HOC_DISCOUNT,
  },
]

export const AD_HOC_DISCOUNT_TABLE_HEADERS = [
  {
    originalLable: 'Student Details',
    labelTranskey: 'studentDetails',
    key: 'studentDetails',
  },
  {
    originalLable: 'Class',
    labelTranskey: 'class',
    key: 'class',
  },
  {
    originalLable: 'Amount',
    labelTranskey: 'amount',
    key: 'amount',
  },
  {
    originalLable: 'Fee Type details',
    labelTranskey: 'feeTypeDetails',
    key: 'feeTypeDetails',
  },
  {
    originalLable: 'Receipt no',
    labelTranskey: 'receiptNo',
    key: 'receiptNo',
  },
  {
    originalLable: 'Reason',
    labelTranskey: 'reason',
    key: 'reason',
  },
  {
    originalLable: ' ',
    labelTranskey: 'moreOptions',
    key: 'moreOptions',
  },
  // {
  //   originalLable: ' ',
  //   labelTranskey: 'actions',
  //   key: 'actions',
  // },
]

export const ADD_AD_ON_DISCOUNT = 'addAdOnDiscount'
export const EXISTING_DISCOUNT = 'existingDiscount'

export const AD_HOC_DISCOUNT_DOT_BUTTON_OPTION_IDS = {
  DELETE_DISCOUNT: 'DELETE_DISCOUNT',
}

export const AD_HOC_DISCOUNT_DOT_BUTTON_OPTIONS = [
  {
    label: 'Delete Discount',
    action: AD_HOC_DISCOUNT_DOT_BUTTON_OPTION_IDS.DELETE_DISCOUNT,
    labelStyle: 'tm-cr-rd-1',
  },
]

export const APPLIED_FEE_FINE = {
  feeCollectionCheckbox: {
    fieldName: 'isFeeFineApplied',
    labelTxt: 'availableFine',
  },
  amountInput: {
    fieldName: 'fine_amount',
  },
}
export const BANK_CHEQUE_STATUS = [
  {
    key: 'Received',
    value: bankTransactionFilterModes.RECEIVED,
  },
  {
    key: 'Deposited',
    value: bankTransactionFilterModes.DEPOSITED,
  },
  {
    key: 'Cleared',
    value: bankTransactionFilterModes.CLEARED,
  },
  {
    key: 'Bounced',
    value: bankTransactionFilterModes.BOUNCED,
  },
  {
    key: 'Returned',
    value: bankTransactionFilterModes.RETURNED,
  },
  {
    key: 'Cancelled',
    value: bankTransactionFilterModes.CANCELLED,
  },
]

export const WEBINAR_STATUS = {
  NONE: 'NONE',
  REGISTERED: 'REGISTERED',
  ATTENDED: 'ATTENDED',
}

export const WEBINAR_STATUS_REGISTERED_TEXT =
  'thanksForRegisteringClickHereToAttendTheProductTrainingSessionOn'

export const SEND_REMINDER_TOOLTIP_BACKGROUND = '#e6eaef'
export const RECEIPT_METHOD = {
  download: 'DOWNLOAD',
  print: 'PRINT',
}

export const collectFeeOptionsIds = {
  BY_FEE_STRUCTURE: 'BY_FEE_STRUCTURE',
  BY_LUMPSUM_AMOUNT: 'BY_LUMPSUM_AMOUNT',
}

export const collectFeeOptionsEvents = {
  BY_FEE_STRUCTURE: 'installments',
  BY_LUMPSUM_AMOUNT: 'lump_sum',
}

export const collectFeeOptions = [
  {
    key: collectFeeOptionsIds.BY_LUMPSUM_AMOUNT,
    value: collectFeeOptionsIds.BY_LUMPSUM_AMOUNT,
    label: t('collectFeeByLumpsumAmount'),
  },
  {
    key: collectFeeOptionsIds.BY_FEE_STRUCTURE,
    value: collectFeeOptionsIds.BY_FEE_STRUCTURE,
    label: t('collectFeeByStructure'),
  },
]

export const LUMPSUM_DISCOUNT = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
}

export const FEE_DATE_TOGGLE_SWITCH = {
  ENTIRE: 'entire',
  CURRENT: 'current',
}

export const TRANSACTION_STATUS_OPTIONS = [
  {value: transactionMethods.RECEIVED, label: t('received')},
  {value: transactionMethods.CLEARED, label: t('cleared')},
]

export const RECORDED_BY_EVENTS_TYPE_VALUE = {
  LUMP_SUMP: 'lump_sum',
  FEE_STRUCTURE: 'fee_structure',
}
export const DUE_PAID_DROPDOWN = {
  APPLICABLE_TILL_DATE: t('applicableTillDate'),
  TOTAL_ANNUAL_FEE: t('totalAnnualFee'),
}

export const DUE_PAID_OPTIONS = [
  {
    value: DUE_PAID_DROPDOWN.APPLICABLE_TILL_DATE,
    label: DUE_PAID_DROPDOWN.APPLICABLE_TILL_DATE,
  },
  {
    value: DUE_PAID_DROPDOWN.TOTAL_ANNUAL_FEE,
    label: DUE_PAID_DROPDOWN.TOTAL_ANNUAL_FEE,
  },
]
export const FEE_WISE_DATE_FILTER = [
  {
    value: 'THIS_WEEK',
    label: t('thisWeek'),
  },
  {
    value: 'LAST_WEEK',
    label: t('lastWeek'),
  },
  {
    value: 'THIS_MONTH',
    label: t('thisMonth'),
  },
  {
    value: 'LAST_MONTH',
    label: t('lastMonth'),
  },
  {
    value: 'THIS_SESSION',
    label: t('thisSession'),
  },
  {
    value: 'CUSTOM_RANGE',
    label: screenWidth() > 1024 ? t('customDateRange') : t('customDate'),
  },
]

export const REPORT_HIERARCHY_TYPES = {
  [FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_STUDENTWISE.value]:
    INSTITUTE_HIERARCHY_TYPES.SECTION,

  [FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_DEPARTMENTWIS.value]:
    INSTITUTE_HIERARCHY_TYPES.DEPARTMENT,

  [FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_CLASSWISE.value]:
    INSTITUTE_HIERARCHY_TYPES.STANDARD,

  [FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_SECTIONWISE.value]:
    INSTITUTE_HIERARCHY_TYPES.SECTION,

  [FEE_REPORTS_TEMPLATES.FEE_COLLECTION_CLASSWISE.value]:
    INSTITUTE_HIERARCHY_TYPES.STANDARD,

  [FEE_REPORTS_TEMPLATES.FEE_COLLECTION_DEPARTMENTWISE.value]:
    INSTITUTE_HIERARCHY_TYPES.DEPARTMENT,

  [FEE_REPORTS_TEMPLATES.FEE_COLLECTION_SECTIONWISE.value]:
    INSTITUTE_HIERARCHY_TYPES.SECTION,
}

export const hierarchyTypes = [
  INSTITUTE_HIERARCHY_TYPES.DEPARTMENT,
  INSTITUTE_HIERARCHY_TYPES.STANDARD,
  INSTITUTE_HIERARCHY_TYPES.SECTION,
]

export const COLLECT_BACKDATED_PAYMENT_SETPS_LUMPSUM = {
  dos: [
    t('downloadTheStudentListCsvFile'),
    t('enterTheFeeAmountStepText'),
    t('multipleStudentStepText'),
    t('acceptablePaymentMethods'),
    t('collectionDateFormat'),
    t('uploadTheUpdatedCsvFile'),
  ],
  donts: [t('doNotChangeTheEntriesInUidColumn')],
}

export const COLLECT_BACKDATED_PAYMENT_SETPS_INSTALLMENT_WISE = {
  dos: [
    t('downloadTheStudentListCsvFile'),
    t('enterTheFeeAmountInFeeTypeStepText'),
    t('enterFeeAmountWarningStepText'),
    t('multipleStudentStepText'),
    t('acceptablePaymentMethods'),
    t('collectionDateFormat'),
    t('uploadTheUpdatedCsvFile'),
  ],
  donts: [t('doNotChangeTheEntriesInUidColumn')],
}

export const BACKDATED_PAYMENT_CSV_HEADERS = [
  'UID',
  'First Name*',
  'Middle Name',
  'Last Name',
  'Country Code',
  'Phone',
  'Enrollment ID*',
  'Date of Admission*',
  'Class',
  'Section',
  'Payment Mode*',
  'Collection Date*',
  'Reference Number (if Cheque/DD)',
  'Disbursal Date (if Cheque/DD)',
  'Transaction Id (Optional)',
]

export const BACKDATED_PAYMENT_CSV_ERROR_HEADERS = ['Upload Status']

export const MAX_CSV_ROWS = 50

export const BACKDATED_PAYMENT_CSV_ERROR_STATUS_IDS = {
  HAS_NO_DUE: 'HAS_NO_DUE',
  OK: 'OK',
  STUDENT_NOT_FOUND: 'STUDENT_NOT_FOUND',
  AMOUNT_GREATER_THAN_DUE: 'AMOUNT_GREATER_THAN_DUE',
  AMOUNT_LESS_THAN_THRESHOLD: 'AMOUNT_LESS_THAN_THRESHOLD',
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  INVALID_PAYMENT_MODE: 'INVALID_PAYMENT_MODE',
  INVALID_COLLECTION_DATE: 'INVALID_COLLECTION_DATE',
  INVALID_REFERENCE_NUMBER: 'INVALID_REFERENCE_NUMBER',
  INVALID_DISBURSAL_DATE: 'INVALID_DISBURSAL_DATE',
  INVALID_ADDITIONAL_NOTES: 'INVALID_ADDITIONAL_NOTES',
  MASTER_CATEGORY_NOT_FOUND: 'MASTER_CATEGORY_NOT_FOUND',
}

export const BACKDATED_PAYMENT_CSV_ERROR_STATUS = {
  [BACKDATED_PAYMENT_CSV_ERROR_STATUS_IDS.HAS_NO_DUE]: '',
  [BACKDATED_PAYMENT_CSV_ERROR_STATUS_IDS.OK]: '',
  [BACKDATED_PAYMENT_CSV_ERROR_STATUS_IDS.STUDENT_NOT_FOUND]:
    'Student(s) not found',
  [BACKDATED_PAYMENT_CSV_ERROR_STATUS_IDS.AMOUNT_GREATER_THAN_DUE]:
    'Amount greater than fee type due or total due',
  [BACKDATED_PAYMENT_CSV_ERROR_STATUS_IDS.AMOUNT_LESS_THAN_THRESHOLD]:
    'Amount less than threshold 0.01',
  [BACKDATED_PAYMENT_CSV_ERROR_STATUS_IDS.INVALID_AMOUNT]: 'Invalid amount',
  [BACKDATED_PAYMENT_CSV_ERROR_STATUS_IDS.INVALID_PAYMENT_MODE]:
    'Invalid payment mode',
  [BACKDATED_PAYMENT_CSV_ERROR_STATUS_IDS.INVALID_COLLECTION_DATE]:
    'Invalid collection date',
  [BACKDATED_PAYMENT_CSV_ERROR_STATUS_IDS.INVALID_REFERENCE_NUMBER]:
    'Invalid reference number',
  [BACKDATED_PAYMENT_CSV_ERROR_STATUS_IDS.INVALID_DISBURSAL_DATE]:
    'Invalid disbursal date',
  [BACKDATED_PAYMENT_CSV_ERROR_STATUS_IDS.INVALID_ADDITIONAL_NOTES]: '',
  [BACKDATED_PAYMENT_CSV_ERROR_STATUS_IDS.MASTER_CATEGORY_NOT_FOUND]:
    "Fee type doesn't exist",
}

export const HOW_TO_CORRECT_ERRORS_STEPS = [
  t('statusColumnIsAddedToUploadedFile'),
  t('downloadTheFileWithStatusColumn'),
  t('correctTheRowsWithErrorStatus'),
  t('reuploadTheFile'),
]

export const FILE_UPLOAD_ERROR_STATS_IDS = {
  OK: 'OK',
  STUDENT_NOT_FOUND: 'STUDENT_NOT_FOUND',
  AMOUNT_GREATER_THAN_DUE: 'AMOUNT_GREATER_THAN_DUE',
  AMOUNT_LESS_THAN_THRESHOLD: 'AMOUNT_LESS_THAN_THRESHOLD',
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  INVALID_PAYMENT_MODE: 'INVALID_PAYMENT_MODE',
  INVALID_COLLECTION_DATE: 'INVALID_COLLECTION_DATE',
  INVALID_REFERENCE_NUMBER: 'INVALID_REFERENCE_NUMBER',
  INVALID_DISBURSAL_DATE: 'INVALID_DISBURSAL_DATE',
  INVALID_ADDITIONAL_NOTES: 'INVALID_ADDITIONAL_NOTES',
  MASTER_CATEGORY_NOT_FOUND: 'MASTER_CATEGORY_NOT_FOUND',
}

export const FILE_UPLOAD_ERROR_STATS_KEYS = {
  studentNotFound: 'studentNotFound',
  amountGreaterThanDue: 'amountGreaterThanDue',
  amountLessThanThreshold: 'amountLessThanThreshold',
  invalidAmount: 'invalidAmount',
  invalidPaymentMode: 'invalidPaymentMode',
  invalidCollectionDate: 'invalidCollectionDate',
  invalidReferenceNumber: 'invalidReferenceNumber',
  invalidDisbursalDate: 'invalidDisbursalDate',
  invalidAdditionalNotes: 'invalidAdditionalNotes',
  masterCategoryNotFound: 'masterCategoryNotFound',
}

export const FILE_UPLOAD_ERROR_STATS_LABEL = {
  [FILE_UPLOAD_ERROR_STATS_KEYS.studentNotFound]: {
    translate: t('studentsNotFound'),
    english: 'students not found',
  },
  [FILE_UPLOAD_ERROR_STATS_KEYS.amountGreaterThanDue]: {
    translate: t('feeAmountEntriesGreaterThanDueAmount'),
    english: 'fee amount entries greater than due amount',
  },
  [FILE_UPLOAD_ERROR_STATS_KEYS.amountLessThanThreshold]: {
    translate: t('feeAmountEntriesLessThanThreshold'),
    english: 'fee amount entries have more than 2 decimal places (0.01)',
  },
  [FILE_UPLOAD_ERROR_STATS_KEYS.invalidAmount]: {
    translate: t('invalidFeeAmountEntries'),
    english: 'invalid amount',
  },
  [FILE_UPLOAD_ERROR_STATS_KEYS.invalidPaymentMode]: {
    translate: t('invalidPaymentModeEntries'),
    english: 'invalid payment mode',
  },
  [FILE_UPLOAD_ERROR_STATS_KEYS.invalidCollectionDate]: {
    translate: t('invalidCollectionDateEntries'),
    english: 'invalid collection date',
  },
  [FILE_UPLOAD_ERROR_STATS_KEYS.invalidReferenceNumber]: {
    translate: t('invalidReferenceNumberEntries'),
    english: 'invalid reference number',
  },
  [FILE_UPLOAD_ERROR_STATS_KEYS.invalidDisbursalDate]: {
    translate: t('invalidDisbursalDateEntries'),
    english: 'invalid disbursal date',
  },
  [FILE_UPLOAD_ERROR_STATS_KEYS.invalidAdditionalNotes]: {
    translate: t('invalidAdditionalNotesEntries'),
    english: 'invalid additional notes',
  },
  [FILE_UPLOAD_ERROR_STATS_KEYS.masterCategoryNotFound]: {
    translate: t('masterCategoryNotFound'),
    english: "Fee type doesn't exist",
  },
}

export const FILE_UPLOAD_ERROR_STATS = {
  [FILE_UPLOAD_ERROR_STATS_IDS.STUDENT_NOT_FOUND]: {
    key: 'studentNotFound',
    lable: t('studentsNotFound'),
  },
  [FILE_UPLOAD_ERROR_STATS_IDS.AMOUNT_GREATER_THAN_DUE]: {
    key: 'amountGreaterThanDue',
    label: t('feeAmountEntriesGreaterThanDueAmount'),
  },
  [FILE_UPLOAD_ERROR_STATS_IDS.AMOUNT_LESS_THAN_THRESHOLD]: {
    key: 'amountLessThanThreshold',
    label: t('feeAmountEntriesLessThanThreshold'),
  },
  [FILE_UPLOAD_ERROR_STATS_IDS.INVALID_AMOUNT]: {
    key: 'invalidAmount',
    label: t('invalidFeeAmountEntries'),
  },
  [FILE_UPLOAD_ERROR_STATS_IDS.INVALID_PAYMENT_MODE]: {
    key: 'invalidPaymentMode',
    label: t('invalidPaymentModeEntries'),
  },
  [FILE_UPLOAD_ERROR_STATS_IDS.INVALID_COLLECTION_DATE]: {
    key: 'invalidCollectionDate',
    label: t('invalidCollectionDateEntries'),
  },
  [FILE_UPLOAD_ERROR_STATS_IDS.INVALID_REFERENCE_NUMBER]: {
    key: 'invalidReferenceNumber',
    label: t('invalidReferenceNumberEntries'),
  },
  [FILE_UPLOAD_ERROR_STATS_IDS.INVALID_DISBURSAL_DATE]: {
    key: 'invalidDisbursalDate',
    label: t('invalidDisbursalDateEntries'),
  },
  [FILE_UPLOAD_ERROR_STATS_IDS.INVALID_ADDITIONAL_NOTES]: {
    key: 'invalidAdditionalNotes',
    label: t('invalidAdditionalNotesEntries'),
  },
  [FILE_UPLOAD_ERROR_STATS_IDS.MASTER_CATEGORY_NOT_FOUND]: {
    key: 'masterCategoryNotFound',
    label: t('masterCategoryNotFound'),
  },
}

export const feeTransactionTabs = [
  {
    route: 'bank',
    eventName: events.TRANSACTIONS_CLICKED_TFI,
    label: 'transactions',
  },
  {
    route: 'cheque/status',
    eventName: events.CHEQUE_DD_CLICKED_TFI,
    label: 'bankTransactions',
  },
]

export const feeConfigurationTabs = [
  {
    route: 'structure',
    eventName: events.FEE_STRUCTURE_CLICKED_TFI,
    label: 'feeStructure',
  },
  {
    route: 'discounts',
    eventName: events.OFFERS_AND_DISCOUNTS_CLICKED_TFI,
    label: 'offersDiscounts',
  },
  {
    route: 'payment-gateway-setup',
    eventName: events.PAYMENT_GATEWAY_CLICKED_TFI,
    label: 'paymentGateway',
  },
  {
    route: 'fee-fine',
    eventName: events.FEE_FINE_COLLECTION_CLICKED_TFI,
    label: 'fine',
  },
  {
    route: 'previous-session-dues',
    eventName: events.FEE_PREVIOUS_SESSION_DUES_CLICKED_TFI,
    label: 'previousSessionDues',
  },
  {
    route: 'settings',
    eventName: events.FEE_SETTINGS_CLICKED_TFI,
    label: 'settings',
  },
  {
    route: 'help-videos',
    eventName: events.FEES_HELP_VIDEOS_CLICKED_TFI,
    label: (
      <div className={feesPageStyles.tabSection}>
        <Icon name="video" color="error" size="xxs" />
        <Trans i18nKey={'helpVideos'}>Help Videos</Trans>
      </div>
    ),
  },
]

export const DEFAULT_PAGINATION_STATS = {
  pageLimit: 10,
  pageNumber: 1,
  totalEntries: 0,
  data: [],
}
export const isDateRangeVisible = (val) => {
  switch (val) {
    case FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_STUDENTWISE.key:
    case FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_CLASSWISE.key:
    case FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_SECTIONWISE.key:
    case FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_DEPARTMENTWIS.key:
    case FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_INSTALLMENTWISE.key:
      return false
  }
  return true
}

// TODO: Use translation
export const getColumnMap = (reportType, getSortSymbols) => {
  return {
    [FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_INSTALLMENTWISE.value]: [
      {key: 'a', label: getSortSymbols('Installments', 'a', 'date')},
      {
        key: 'applicable',
        label: getSortSymbols('Applicable Fee', 'applicable', 'count'),
      },
      {key: 'discount', label: getSortSymbols('Discount', 'discount', 'count')},
      {key: 'paid', label: getSortSymbols('Paid', 'paid', 'count')},
      {key: 'dues', label: getSortSymbols('Due', 'dues', 'count')},
    ],
    [FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_STUDENTWISE.value]: [
      {
        key: 'studentName',
        label: getSortSymbols('Student Details', 'studentName', 'name'),
        reportColumnName: 'Student Details',
      },
      {
        key: 'classroom',
        label: getSortSymbols('Class', 'classroom', 'class'),
        reportColumnName: 'Student Details',
      },
      {
        key: 'feeApplicableTillDate',
        label: getSortSymbols(
          'Fee Applicable Till Date',
          'feeApplicableTillDate',
          'count'
        ),
        reportColumnName: 'Student Details',
      },
      {
        key: 'paid',
        label: getSortSymbols('Paid', 'paid', 'count'),
        reportColumnName: 'Student Details',
      },
      {
        key: 'pendingDues',
        label: getSortSymbols('Due', 'pendingDues', 'count'),
        reportColumnName: 'Student Details',
      },
    ],
    [FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_DEPARTMENTWIS.value]: [
      {
        key: 'departmentName',
        label: getSortSymbols('Department', 'departmentName', 'name'),
      },
      {
        key: 'studentCount',
        label: getSortSymbols('Total Students', 'studentCount', 'count'),
      },
      {
        key: 'feeOverdueStudentCount',
        label: getSortSymbols(
          'Students with due',
          'feeOverdueStudentCount',
          'count'
        ),
      },
      {
        key: 'applicable',
        label: getSortSymbols('Fee Applicable', 'applicable', 'count'),
      },
      {key: 'discount', label: getSortSymbols('Discount', 'discount', 'count')},
      {key: 'paid', label: getSortSymbols('Paid', 'paid', 'count')},
      {key: 'dues', label: getSortSymbols('Due', 'dues', 'count')},
    ],
    [FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_CLASSWISE.value]: [
      {
        key: 'className',
        label: getSortSymbols('Classes', 'className', 'class'),
      },
      {
        key: 'studentCount',
        label: getSortSymbols('Total Students', 'studentCount', 'count'),
      },
      {
        key: 'feeOverdueStudentCount',
        label: getSortSymbols(
          'Students with due',
          'feeOverdueStudentCount',
          'count'
        ),
      },
      {
        key: 'applicable',
        label: getSortSymbols('Fee Applicable', 'applicable', 'count'),
      },
      {key: 'discount', label: getSortSymbols('Discount', 'discount', 'count')},
      {key: 'paid', label: getSortSymbols('Paid', 'paid', 'count')},
      {key: 'dues', label: getSortSymbols('Due', 'dues', 'count')},
    ],
    [FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_SECTIONWISE.value]: [
      {
        key: 'className',
        label: getSortSymbols('Section', 'className', 'class'),
      },
      {
        key: 'studentCount',
        label: getSortSymbols('Total Students', 'studentCount', 'count'),
      },
      {
        key: 'feeOverdueStudentCount',
        label: getSortSymbols(
          'Students with due',
          'feeOverdueStudentCount',
          'count'
        ),
      },
      {
        key: 'applicable',
        label: getSortSymbols('Fee Applicable', 'applicable', 'count'),
      },
      {key: 'discount', label: getSortSymbols('Discount', 'discount', 'count')},
      {key: 'paid', label: getSortSymbols('Paid', 'paid', 'count')},
      {key: 'dues', label: getSortSymbols('Due', 'dues', 'count')},
    ],
    [FEE_REPORTS_TEMPLATES.FEE_COLLECTION_CLASSWISE.value]: [
      {
        key: 'className',
        label: getSortSymbols('Classes', 'className', 'class'),
      },
      {
        key: 'noOfStudents',
        label: getSortSymbols('No of Students', 'noOfStudents', 'count'),
      },
      {
        key: 'amountCollected',
        label: getSortSymbols('Amount Collected', 'amountCollected', 'count'),
      },
      {
        key: 'amountAwaiting',
        label: getSortSymbols('Pending Cheque & DD', 'amountAwaiting', 'count'),
      },
    ],
    [FEE_REPORTS_TEMPLATES.FEE_COLLECTION_DEPARTMENTWISE.value]: [
      {
        key: 'departmentName',
        label: getSortSymbols('Department Name', 'departmentName', 'class'),
      },
      {
        key: 'noOfStudents',
        label: getSortSymbols('No of Students', 'noOfStudents', 'count'),
      },
      {
        key: 'amountCollected',
        label: getSortSymbols('Amount Collected', 'amountCollected', 'count'),
      },
      {
        key: 'amountAwaiting',
        label: getSortSymbols('Pending Cheque & DD', 'amountAwaiting', 'count'),
      },
    ],
    [FEE_REPORTS_TEMPLATES.FEE_COLLECTION_SECTIONWISE.value]: [
      {
        key: 'className',
        label: getSortSymbols('Section', 'className', 'class'),
      },
      {
        key: 'noOfStudents',
        label: getSortSymbols('No of Students', 'noOfStudents', 'count'),
      },
      {
        key: 'amountCollected',
        label: getSortSymbols('Amount Collected', 'amountCollected', 'count'),
      },
      {
        key: 'amountAwaiting',
        label: getSortSymbols('Pending Cheque & DD', 'amountAwaiting', 'count'),
      },
    ],
    [FEE_REPORTS_TEMPLATES.FEE_COLLECTION_FEETYPEWISE.value]: [
      {key: 'feeType', label: getSortSymbols('Fee Type', 'feeType', 'name')},
      {
        key: 'amountCollected',
        label: getSortSymbols('Amount Collected', 'amountCollected', 'count'),
      },
      {
        key: 'amountAwaiting',
        label: getSortSymbols('Pending Cheque & DD', 'amountAwaiting', 'count'),
      },
    ],
    [FEE_REPORTS_TEMPLATES.FEE_COLLECTION_PAYMENTMODEWISE.value]: [
      {
        key: 'paymentMode',
        label: getSortSymbols('Payment mode', 'paymentMode', 'name'),
      },
      {
        key: 'paymentStatus',
        label: getSortSymbols('Payment Status', 'paymentStatus', 'name'),
      },
      {
        key: 'amountCollected',
        label: getSortSymbols('Amount Paid', 'amountCollected', 'count'),
      },
    ],
    [FEE_REPORTS_TEMPLATES.FEE_COLLECTION_DAILY.value]: [
      {key: 'day', label: getSortSymbols('Date', 'day', 'date')},
      {
        key: 'amountCollected',
        label: getSortSymbols('Amount Collected', 'amountCollected', 'count'),
      },
      {
        key: 'amountAwaiting',
        label: getSortSymbols('Pending Cheque & DD', 'amountAwaiting', 'count'),
      },
    ],
    [FEE_REPORTS_TEMPLATES.FEE_COLLECTION_MONTH.value]: [
      {key: 'month', label: getSortSymbols('Month', 'month', 'date')},
      {
        key: 'amountCollected',
        label: getSortSymbols('Amount Collected', 'amountCollected', 'count'),
      },
      {
        key: 'amountAwaiting',
        label: getSortSymbols('Pending Cheque & DD', 'amountAwaiting', 'count'),
      },
    ],
    [FEE_REPORTS_TEMPLATES.FEE_MISC_CHEQUE_STATUS.value]: [
      {
        key: 'studentName',
        label: getSortSymbols('Student Details', 'studentName', 'name'),
      },
      {key: 'class', label: getSortSymbols('Class', 'class', 'class')},
      {
        key: 'paymentMode',
        label: getSortSymbols('Mode', 'paymentMode', 'name'),
      },
      {key: 'amount', label: getSortSymbols('Amount', 'amount', 'count')},
      {
        key: 'disbursalDate',
        label: getSortSymbols('Disbursal Date', 'disbursalDate', 'date'),
      },
      {
        key: 'paymentDate',
        label: getSortSymbols('Payment Date', 'paymentDate', 'name'),
      },
      {key: 'status', label: getSortSymbols('Status', 'status', 'name')},
    ],
    [FEE_REPORTS_TEMPLATES.FEE_MISC_ALL_TRANSACTIONS.value]: [
      {
        key: 'studentName',
        label: getSortSymbols('Student Details', 'studentName', 'name'),
      },
      {
        key: 'enrollmentNumber',
        label: getSortSymbols(
          'Enrollment no.',
          'enrollmentNumber',
          'enrollmentNumber'
        ),
      },
      {key: 'class', label: getSortSymbols('Class', 'class', 'class')},
      {
        key: 'paymentMode',
        label: getSortSymbols('Mode', 'paymentMode', 'name'),
      },
      {key: 'amount', label: getSortSymbols('Amount', 'amount', 'count')},
      {
        key: 'feeTypeBreakup',
        label: getSortSymbols(
          'Fee Category Breakup',
          'feeTypeBreakup',
          'feeTypeBreakup'
        ),
      },
      {
        key: 'receiptNumber',
        label: getSortSymbols('Receipt No', 'receiptNumber', 'name'),
      },
      {
        key: 'paymentDate',
        label: getSortSymbols('Payment Date', 'paymentDate', 'date'),
      },
      {key: 'status', label: getSortSymbols('status', 'status', 'name')},
    ],
  }[reportType]
}

export const getFilters = (reportType) => {
  // TODO: Add all report types
  switch (reportType) {
    case FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_STUDENTWISE.key: {
      return FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_STUDENTWISE.filters
    }
    case FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_DEPARTMENTWIS.key: {
      return FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_DEPARTMENTWIS.filters
    }
    case FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_CLASSWISE.key: {
      return FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_CLASSWISE.filters
    }
    case FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_SECTIONWISE.key: {
      return FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_SECTIONWISE.filters
    }
    case FEE_REPORTS_TEMPLATES.FEE_COLLECTION_MONTH.key: {
      return FEE_REPORTS_TEMPLATES.FEE_COLLECTION_MONTH.filters
    }
    case FEE_REPORTS_TEMPLATES.FEE_COLLECTION_DAILY.key: {
      return FEE_REPORTS_TEMPLATES.FEE_COLLECTION_DAILY.filters
    }
    case FEE_REPORTS_TEMPLATES.FEE_COLLECTION_PAYMENTMODEWISE.key: {
      return FEE_REPORTS_TEMPLATES.FEE_COLLECTION_PAYMENTMODEWISE.filters
    }
    case FEE_REPORTS_TEMPLATES.FEE_COLLECTION_FEETYPEWISE.key: {
      return FEE_REPORTS_TEMPLATES.FEE_COLLECTION_FEETYPEWISE.filters
    }
    case FEE_REPORTS_TEMPLATES.FEE_COLLECTION_DEPARTMENTWISE.key: {
      return FEE_REPORTS_TEMPLATES.FEE_COLLECTION_DEPARTMENTWISE.filters
    }
    case FEE_REPORTS_TEMPLATES.FEE_COLLECTION_CLASSWISE.key: {
      return FEE_REPORTS_TEMPLATES.FEE_COLLECTION_CLASSWISE.filters
    }
    case FEE_REPORTS_TEMPLATES.FEE_COLLECTION_SECTIONWISE.key: {
      return FEE_REPORTS_TEMPLATES.FEE_COLLECTION_SECTIONWISE.filters
    }
    case FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_INSTALLMENTWISE.key: {
      return FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_INSTALLMENTWISE.filters
    }
    case FEE_REPORTS_TEMPLATES.FEE_MISC_CHEQUE_STATUS.key: {
      return FEE_REPORTS_TEMPLATES.FEE_MISC_CHEQUE_STATUS.filters
    }
    case FEE_REPORTS_TEMPLATES.FEE_MISC_ALL_TRANSACTIONS.key: {
      return FEE_REPORTS_TEMPLATES.FEE_MISC_ALL_TRANSACTIONS.filters
    }
  }
}

export const getPaymentStatusClass = (status, styles) => {
  switch (status) {
    case 'RECEIVED':
    case 'CLEARED':
    case 'RETURNED':
    case 'SETTLED':
    case 'SUCCESS':
      return styles.settledStatus
    case 'PENDING':
      return styles.pendingStatus
    case 'REVOKED':
    case 'FAILED':
    case 'BOUNCED':
    case 'DELETED':
    case 'CANCELLED':
      return styles.cancelledStatus
  }
}

export const dispatchFeeReportType = (
  reportType,
  getHierarchyIdMap,
  instituteHierarchy,
  dispatch,
  setFeeReports,
  categoryIds,
  instalmentTimestampList,
  months
) => {
  // TODO: Add all report types
  switch (reportType) {
    case FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_STUDENTWISE.key:
    case FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_DEPARTMENTWIS.key:
    case FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_CLASSWISE.key:
    case FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_SECTIONWISE.key: {
      const hierarchy_ids = getHierarchyIdMap(
        instituteHierarchy?.children,
        REPORT_HIERARCHY_TYPES[FEE_REPORTS_TEMPLATES[reportType].value]
      )
      dispatch(
        setFeeReports({
          masterCategoryIds: categoryIds,
          hierarchyIds: hierarchy_ids,
        })
      )
      break
    }
    case FEE_REPORTS_TEMPLATES.FEE_COLLECTION_DEPARTMENTWISE.key:
    case FEE_REPORTS_TEMPLATES.FEE_COLLECTION_CLASSWISE.key:
    case FEE_REPORTS_TEMPLATES.FEE_COLLECTION_SECTIONWISE.key: {
      const hierarchy_ids = getHierarchyIdMap(
        instituteHierarchy?.children,
        REPORT_HIERARCHY_TYPES[FEE_REPORTS_TEMPLATES[reportType].value]
      )
      dispatch(
        setFeeReports({
          paymentModes: Object.keys(paymentStatusLabels),
          masterCategoryIds: categoryIds,
          hierarchyIds: hierarchy_ids,
          isPendingChequeDataIncluded: true,
        })
      )
      break
    }
    case FEE_REPORTS_TEMPLATES.FEE_COLLECTION_FEETYPEWISE.key: {
      dispatch(
        setFeeReports({
          masterCategoryIds: categoryIds,
          paymentModes: Object.keys(paymentStatusLabels),
          isPendingChequeDataIncluded: true,
        })
      )
      break
    }
    case FEE_REPORTS_TEMPLATES.FEE_COLLECTION_PAYMENTMODEWISE.key: {
      dispatch(
        setFeeReports({
          masterCategoryIds: categoryIds,
          paymentModes: Object.keys(paymentStatusLabels),
          isPendingChequeDataIncluded: false,
        })
      )
      break
    }
    case FEE_REPORTS_TEMPLATES.FEE_COLLECTION_MONTH.key: {
      dispatch(
        setFeeReports({
          masterCategoryIds: categoryIds,
          months: months,
          paymentModes: Object.keys(paymentStatusLabels),
          isPendingChequeDataIncluded: true,
        })
      )
      break
    }
    case FEE_REPORTS_TEMPLATES.FEE_COLLECTION_DAILY.key: {
      dispatch(
        setFeeReports({
          masterCategoryIds: categoryIds,
          months: months,
          paymentModes: Object.keys(paymentStatusLabels),
          isPendingChequeDataIncluded: true,
        })
      )
      break
    }
    case FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_INSTALLMENTWISE.key: {
      dispatch(
        setFeeReports({
          masterCategoryIds: categoryIds,
          selectedInstalmentTimestamp: instalmentTimestampList,
        })
      )
      break
    }
    case FEE_REPORTS_TEMPLATES.FEE_MISC_CHEQUE_STATUS.key: {
      dispatch(
        setFeeReports({
          chequeStatus: BANK_CHEQUE_STATUS.map((status) => status.key),
        })
      )
      break
    }
    case FEE_REPORTS_TEMPLATES.FEE_MISC_ALL_TRANSACTIONS.key: {
      dispatch(
        setFeeReports({
          paymentModes: Object.keys(paymentStatusLabels),
          chequeStatus: CHEQUE_STATUS.map((status) => status.value),
        })
      )
    }
  }
}

export const getDoughnutGraphData = (
  installmentsOptions,
  getClassNames,
  handleReporttypeSelection
) => {
  return [
    {
      title: t('feeOverview'),
      labels: [
        {
          color: '#CCCCCC',
          label: t('totalFees'),
          amount: '50 L',
        },
        {
          color: '#A8D793',
          label: t('feePaid'),
          amount: '50 L',
        },
        {
          color: '#FF6666',
          label: t('feeOverDue'),
          amount: '50 L',
        },
        {
          color: '#6EC2D4',
          label: t('discount'),
          amount: '50L',
        },
      ],
      detailedReportRedirection: () => {
        handleReporttypeSelection(
          FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_STUDENTWISE.key,
          true
        )
      },
      reportTypeCard: FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_STUDENTWISE.key,
      options: installmentsOptions,
      field: 0,
      cardType: 'graph',
    },
    {
      title: t('studentOverview'),
      labels: [
        {
          color: '#CCCCCC',
          label: t('feeAppliedOn'),
          amount: '100',
        },
        {
          color: '#A8D793',
          label: t('feePaidBy'),
          amount: '50 L',
        },
        {
          color: '#FF6666',
          label: t('feeDueFor'),
          amount: '50 L',
        },
      ],
      detailedReportRedirection: () => {
        handleReporttypeSelection(
          FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_CLASSWISE.key,
          true
        )
      },
      reportTypeCard: FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_CLASSWISE.key,
      options: getClassNames(),
      field: 1,
      cardType: 'graph',
    },
  ]
}

export const getPayDuesCardDetails = (
  handleReporttypeSelection,
  StudentWiseImg,
  InstallmentWiseImg,
  ClassWiseFeeImg
) => {
  return [
    {
      title: t('studentWiseReport'),
      description: t('getPaidAndDueDetailsOfStudents'),
      icon: StudentWiseImg,
      click: () => {
        handleReporttypeSelection(
          FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_STUDENTWISE.key
        )
      },
    },
    {
      title: t('byInstallment'),
      description: t('getDetailsOfPaidAndDueInstallments'),
      icon: InstallmentWiseImg,
      click: () => {
        handleReporttypeSelection(
          FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_INSTALLMENTWISE.key
        )
      },
    },
    {
      title: t('byDepartment'),
      description: t('getDetailsOfPaidAndDueOfTheEntireDept'),
      icon: ClassWiseFeeImg,
      click: () => {
        handleReporttypeSelection(
          FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_DEPARTMENTWIS.key
        )
      },
    },
    {
      title: t('byClass'),
      description: t('getDetailsOfPaidAndDueFeeEntireClass'),
      icon: ClassWiseFeeImg,
      click: () => {
        handleReporttypeSelection(
          FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_CLASSWISE.key
        )
      },
    },
    {
      title: t('bySection'),
      description: t('getDetailsOfPaidAndDueEntireSection'),
      icon: ClassWiseFeeImg,
      click: () => {
        handleReporttypeSelection(
          FEE_REPORTS_TEMPLATES.FEE_DUE_PAID_SECTIONWISE.key
        )
      },
    },
  ]
}

export const getPayCollectionCardDetails = (
  handleReporttypeSelection,
  InstallmentWiseImg,
  PaymentModeImg,
  FeeWiseImg,
  ClassWiseFeeImg
) => {
  return [
    {
      title: t('dayWise'),
      description: t('getTotalPaymentCollInDifferentDays'),
      icon: InstallmentWiseImg,
      click: () => {
        handleReporttypeSelection(
          FEE_REPORTS_TEMPLATES.FEE_COLLECTION_DAILY.key
        )
      },
    },
    {
      title: t('monthlyWise'),
      description: t('getTotalPaymentCollInDifferentMonths'),
      icon: InstallmentWiseImg,
      click: () => {
        handleReporttypeSelection(
          FEE_REPORTS_TEMPLATES.FEE_COLLECTION_MONTH.key
        )
      },
    },
    {
      title: t('byPaymentMode'),
      description: t('getTotalPaymentCollDifferentPayModes'),
      icon: PaymentModeImg,
      click: () => {
        handleReporttypeSelection(
          FEE_REPORTS_TEMPLATES.FEE_COLLECTION_PAYMENTMODEWISE.key
        )
      },
    },
    {
      title: t('byFeeType'),
      description: t('getTotalPayemntCollDifferentFeeTypes'),
      icon: FeeWiseImg,
      click: () => {
        handleReporttypeSelection(
          FEE_REPORTS_TEMPLATES.FEE_COLLECTION_FEETYPEWISE.key
        )
      },
    },
    {
      title: t('byDepartment'),
      description: t('getTotalPaymentCollDifferentDepartments'),
      icon: ClassWiseFeeImg,
      click: () => {
        handleReporttypeSelection(
          FEE_REPORTS_TEMPLATES.FEE_COLLECTION_DEPARTMENTWISE.key
        )
      },
    },
    {
      title: t('byClass'),
      description: t('getTotalPaymentCollDifferentClasses'),
      icon: ClassWiseFeeImg,
      click: () => {
        handleReporttypeSelection(
          FEE_REPORTS_TEMPLATES.FEE_COLLECTION_CLASSWISE.key
        )
      },
    },
    {
      title: t('bySection'),
      description: t('getTotalPaymentCollDifferentSections'),
      icon: ClassWiseFeeImg,
      click: () => {
        handleReporttypeSelection(
          FEE_REPORTS_TEMPLATES.FEE_COLLECTION_SECTIONWISE.key
        )
      },
    },
  ]
}

export const getMiscCardDetails = (
  handleReporttypeSelection,
  ChequeStatusImg,
  AllTransactionImg
) => {
  return [
    {
      title: t('chequesDDStatus'),
      description: t('getAllChqStatusToTrackComplete'),
      icon: ChequeStatusImg,
      click: () => {
        handleReporttypeSelection(
          FEE_REPORTS_TEMPLATES.FEE_MISC_CHEQUE_STATUS.key
        )
      },
    },
    {
      title: t('allTransactions'),
      description: t('getDetailsOfAllTransactions'),
      icon: AllTransactionImg,
      click: () => {
        handleReporttypeSelection(
          FEE_REPORTS_TEMPLATES.FEE_MISC_ALL_TRANSACTIONS.key
        )
      },
    },
  ]
}

export const LABEL_BY_REPORT_WISE = {
  CLASS_WISE: 0,
  DEPARTMENT_WISE: 3,
}

export const SELECT_ALL_OPTION = {
  label: 'Select All',
  value: 'SELECT_ALL',
}

export const CSV_PROCESS_STATUS = {
  NONE: 'NONE',
  CREATED: 'CREATED',
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
}

export const MWEB_FEE_TABLE_CARD_DATA = {
  FEE_DUE_PAID_STUDENTWISE: [
    {label: '', key: 'paymentStatus'},
    {label: '', key: 'studentName'},
    {label: '', key: 'phoneNumber'},
    {label: '', key: 'email'},
    {label: `${t('class')} : `, key: 'classroom'},
  ],
  FEE_DUE_PAID_CLASSWISE: [
    {label: '', key: 'paymentStatus'},
    {label: t('class'), key: 'className'},
    {label: `${t('totalStudents')} : `, key: 'studentCount'},
    {label: 'divider', key: ''},
    {
      label: `${t('applicableFee')} :`,
      key: 'applicable',
    },
    {
      label: `${t('discount')} :`,
      key: 'discount',
    },
  ],
  FEE_DUE_PAID_DEPARTMENTWIS: [
    {label: '', key: 'paymentStatus'},
    {label: '', key: 'departmentName'},
    {label: `${t('totalStudents')} : `, key: 'studentCount'},
    {label: 'divider', key: ''},
    {
      label: `${t('applicableFee')} :`,
      key: 'applicable',
    },
    {
      label: `${t('discount')} :`,
      key: 'discount',
    },
  ],
  FEE_DUE_PAID_INSTALLMENTWISE: [
    {label: '', key: 'paymentStatus'},
    {label: '', key: 'a'},
    {label: `${t('applicableFee')} :`, key: 'applicable'},
  ],
  FEE_DUE_PAID_SECTIONWISE: [
    {label: '', key: 'paymentStatus'},
    {label: '', key: 'className'},
    {label: `${t('totalStudents')} : `, key: 'studentCount'},
    {label: 'divider', key: ''},
    {
      label: `${t('applicableFee')} :`,
      key: 'applicable',
    },
    {
      label: `${t('discount')} :`,
      key: 'discount',
    },
  ],
  FEE_COLLECTION_MONTH: [
    {label: '', key: 'paymentStatus'},
    {label: '', key: 'month'},
    {label: `${t('paymentCollected')} :`, key: 'amountCollected'},
    {label: `${t('pendingChequeAndDD')} :`, key: 'amountAwaiting'},
  ],
  FEE_COLLECTION_DAILY: [
    {label: '', key: 'paymentStatus'},
    {label: '', key: 'day'},
    {label: `${t('paymentCollected')} :`, key: 'amountCollected'},
    {label: `${t('pendingChequeAndDD')} :`, key: 'amountAwaiting'},
  ],
  FEE_COLLECTION_DEPARTMENTWISE: [
    {label: '', key: 'paymentStatus'},
    {label: '', key: 'departmentName'},
    {label: `${t('strength')} :`, key: 'noOfStudents'},
    {label: 'divider', key: ''},
    {label: `${t('amountCollected')} :`, key: 'amountCollected'},
    {label: `${t('pendingChequeAndDD')} :`, key: 'amountAwaiting'},
  ],
  FEE_COLLECTION_CLASSWISE: [
    {label: '', key: 'paymentStatus'},
    {label: t('class'), key: 'className'},
    {label: `${t('strength')} :`, key: 'noOfStudents'},
    {label: 'divider', key: ''},
    {label: `${t('amountCollected')} :`, key: 'amountCollected'},
    {label: `${t('pendingChequeAndDD')} :`, key: 'amountAwaiting'},
  ],
  FEE_COLLECTION_FEETYPEWISE: [
    {label: '', key: 'paymentStatus'},
    {label: '', key: 'feeType'},
    {label: `${t('amountCollected')} :`, key: 'amountCollected'},
    {label: `${t('pendingChequeAndDD')} :`, key: 'amountAwaiting'},
  ],
  FEE_COLLECTION_PAYMENTMODEWISE: [
    {label: '', key: 'paymentStatus'},
    {label: '', key: 'paymentMode'},
    {label: t('amountPaid'), key: 'amountCollected'},
  ],
  FEE_COLLECTION_SECTIONWISE: [
    {label: '', key: 'paymentStatus'},
    {label: t('class'), key: 'className'},
    {label: `${t('strength')} :`, key: 'noOfStudents'},
    {label: 'divider', key: ''},
    {label: `${t('amountCollected')} :`, key: 'amountCollected'},
    {label: `${t('pendingChequeAndDD')} :`, key: 'amountAwaiting'},
  ],
  FEE_MISC_ALL_TRANSACTIONS: [
    {label: '', key: 'status'},
    {label: '', key: 'studentName'},
    {label: '', key: 'studentMobileNumber'},
    {label: '', key: 'email'},
    {label: `${t('class')} : `, key: 'class'},
  ],
  FEE_MISC_CHEQUE_STATUS: [
    {label: '', key: 'status'},
    {label: '', key: 'studentName'},
    {label: '', key: 'studentMobileNumber'},
    {label: '', key: 'email'},
    {label: `${t('class')} : `, key: 'class'},
  ],
}

export const MWEB_FEE_BOTTOM_SHEET_DATA = {
  FEE_DUE_PAID_STUDENTWISE: [
    {label: '', key: 'studentName'},
    {label: '', key: 'phoneNumber'},
    {label: '', key: 'email'},
    {label: 'divider', key: ''},
    {label: t('applicableTillDate'), key: 'feeApplicableTillDate'},
    {label: t('paid'), key: 'paid'},
    {label: t('due'), key: 'pendingDues'},
  ],
  FEE_DUE_PAID_INSTALLMENTWISE: [
    {label: '', key: 'a'},
    {label: '', key: 'phoneNumber'},
    {label: '', key: 'email'},
    {label: 'divider', key: ''},
    {label: t('applicableFee'), key: 'applicable'},
    {label: t('discount'), key: 'discount'},
    {label: t('paid'), key: 'paid'},
    {label: t('due'), key: 'dues'},
  ],
  FEE_DUE_PAID_CLASSWISE: [
    {label: t('class'), key: 'className'},
    {label: `${t('totalStudents')} :`, key: 'studentCount'},
    {label: '', key: 'email'},
    {label: 'divider', key: ''},
    {
      label: `${t('applicableFee')}`,
      key: 'applicable',
    },
    {
      label: `${t('discount')}`,
      key: 'discount',
    },
    {label: t('studentWithDue'), key: 'feeOverdueStudentCount'},
    {label: t('paid'), key: 'paid'},
    {label: t('due'), key: 'dues'},
  ],
  FEE_DUE_PAID_DEPARTMENTWIS: [
    {label: '', key: 'departmentName'},
    {label: `${t('totalStudents')} :`, key: 'studentCount'},
    {label: '', key: 'email'},
    {label: 'divider', key: ''},
    {
      label: `${t('applicableFee')}`,
      key: 'applicable',
    },
    {
      label: `${t('discount')}`,
      key: 'discount',
    },
    {label: t('studentWithDue'), key: 'feeOverdueStudentCount'},
    {label: t('paid'), key: 'paid'},
    {label: t('due'), key: 'dues'},
  ],
  FEE_DUE_PAID_SECTIONWISE: [
    {label: '', key: 'className'},
    {label: `${t('totalStudents')} :`, key: 'studentCount'},
    {label: '', key: 'email'},
    {label: 'divider', key: ''},
    {
      label: `${t('applicableFee')}`,
      key: 'applicable',
    },
    {
      label: `${t('discount')}`,
      key: 'discount',
    },
    {label: t('studentWithDue'), key: 'feeOverdueStudentCount'},
    {label: t('paid'), key: 'paid'},
    {label: t('due'), key: 'dues'},
  ],
  FEE_MISC_ALL_TRANSACTIONS: [
    {label: '', key: 'studentName'},
    {label: '', key: 'studentMobileNumber'},
    {label: '', key: 'email'},
    {label: 'divider', key: ''},
    {label: t('modeOfPayment'), key: 'paymentMode'},
    {label: t('amount'), key: 'amount'},
    {label: t('receiptNumber'), key: 'receiptNumber'},
    {label: t('paymentDate'), key: 'paymentDate'},
  ],
  FEE_MISC_CHEQUE_STATUS: [
    {label: '', key: 'studentName'},
    {label: '', key: 'studentMobileNumber'},
    {label: '', key: 'email'},
    {label: 'divider', key: ''},
    {label: t('modeOfPayment'), key: 'paymentMode'},
    {label: t('amount'), key: 'amount'},
    {label: t('disbursalDate'), key: 'disbursalDate'},
    {label: t('paymentDate'), key: 'paymentDate'},
  ],
}

export const DELETE_FEE_STRUCTURE_DEPENDANCY_COLS = [
  {key: 'txnId', label: t('transactionId')},
  {key: 'receiptNo', label: t('receiptNo')},
  {key: 'studentDetails', label: t('studentDetails')},
  {key: 'class', label: t('class')},
  {key: 'amount', label: t('amount')},
  {key: 'mode', label: t('mode')},
  {key: 'status', label: t('status')},
  {key: 'receipt', label: t('receipt')},
]

export const INSTALLMENT_WISE_DETAILS_DOT_BUTTON_OPTION_IDS = {
  ADD_INSTALLMENT: 'ADD_INSTALLMENT',
  VIEW_PAYMENT_HISTORY: 'VIEW_PAYMENT_HISTORY',
}

export const INSTALLMENT_WISE_DETAILS_DOT_BUTTON_OPTION = [
  {
    label: t('addInstallment'),
    action: INSTALLMENT_WISE_DETAILS_DOT_BUTTON_OPTION_IDS.ADD_INSTALLMENT,
    permissionId:
      PERMISSION_CONSTANTS.feeModuleController_feeStudentPayment_create,
  },
  {
    label: 'View Payment History',
    action: INSTALLMENT_WISE_DETAILS_DOT_BUTTON_OPTION_IDS.VIEW_PAYMENT_HISTORY,
    permissionId:
      PERMISSION_CONSTANTS.feeModuleController_getStudentFeeDetails_read,
  },
]

export const getTeachPayUrlByPhoneNo = (
  institute_id,
  country_code,
  phone_number
) => {
  return `${REACT_APP_TEACHPAY_DASHBAORD}?user_type=10&institute_id=${institute_id}&'tm_country_code='${country_code}&tm_phone_number=${phone_number}`
}

export const getTeachPayUrlByEmail = (institute_id, email) => {
  return `${REACT_APP_TEACHPAY_DASHBAORD}?user_type=10&institute_id=${institute_id}&tm_phone_number=${email}`
}

export const SECTION_WISE_FILTER = {
  all: {label: t('classWiseFilterAll'), value: 'all'},
  due: {label: t('classWiseFilterDue'), value: 'due'},
  paid: {label: t('classWiseFilterPaid'), value: 'paid'},
}

export const TYPING_PLACEHOLDER = {
  PLACEHOLDER_VALUES: [
    t('rotatingPlaceholderValue1'),
    t('rotatingPlaceholderValue2'),
    t('rotatingPlaceholderValue3'),
    t('rotatingPlaceholderValue4'),
    t('rotatingPlaceholderValue5'),
    t('rotatingPlaceholderValue6'),
  ],
  TYPING_INTERVAL_TIME: 60,
  ERASE_INTERVAL_TIME: 60,
  DELAY_TIME: 700,
}

export const CLASSNAME_TRUNCATE_LIMIT = 15
export const CLASSNAME_HEADER_TRUNCATE_LIMIT = 8
export const STUDENT_NAME_SECTION_TRUNCATE_LIMIT = 30
export const CLASSNAME_TRUNCATE_LIMIT_MOBILE = 4

export const UPLOAD_BACKDATED_PAYMENT_OPTION_VALUES = {
  LUMPSUM_AMOUNT: 'LUMPSUM_COLLECTION',
  INSTALLMENT_WISE: 'FEE_TYPE_WISE',
}

export const UPLOAD_BACKDATED_PAYMENT_OPTION_MAP = {
  [UPLOAD_BACKDATED_PAYMENT_OPTION_VALUES.LUMPSUM_AMOUNT]: {
    label: 'recordByLumpSumLabel',
    value: UPLOAD_BACKDATED_PAYMENT_OPTION_VALUES.LUMPSUM_AMOUNT,
  },
  [UPLOAD_BACKDATED_PAYMENT_OPTION_VALUES.INSTALLMENT_WISE]: {
    label: 'recordByInstallmentLabel',
    value: UPLOAD_BACKDATED_PAYMENT_OPTION_VALUES.INSTALLMENT_WISE,
  },
}
