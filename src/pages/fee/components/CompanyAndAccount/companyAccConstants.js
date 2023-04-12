import {t} from 'i18next'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import {
  payModeLabel,
  payStatusLabel,
  revokePaymentStatusLabel,
} from '../FeeTransaction/FeeTransactionConstants'

export const FEE_COMPANY_ACCOUNT_URL = {
  createCompanyAccountList: 'company/accounts/list',
  createNewCompany: 'company/create',
  updateCompany: 'company/update',
  verifyIFSC: 'account/validate/ifsc',
  createNewAccount: 'account/create',
  updateAccount: 'account/update',
  getAccountPassbook: 'account/passbook',
  changeReceiptAccount: 'account/change',
  accountChangeHistory: 'account/change/history',
  accountActivity: 'company/activities',
  createAccountMapping: 'account-mapping/create',
  updateAccountMapping: 'account-mapping/upsert',
  getAccountMappingList: 'account-mapping/list',
  // getSessionFeeTypes: 'fee-module/session/feetypes',
  getSessionFeeTypes: '/fee-module/fee/categories/institute',
  resetAccountMapping: 'account-mapping/reset',
}

export const TRANSLATIONS_CA = {
  groupClasses: t('groupClasses'),
  groupFeeTypes: t('groupFeeTypes'),
  iWantToMapAccountsOnTheBasisOf: t('iWantToMapAccountsOnTheBasisOf'),
  proceed: t('proceed'),
  filters: t('filters'),
  edit: t('edit'),
  group: t('group'),
  ungroup: t('ungroup'),
  saveAccountMappingHeader: t('saveAccountMappingHeader'),
  saveAccountMappingTitle: t('saveAccountMappingTitle'),
  resetAccountMappingTitle: t('resetAccountMappingTitle'),
  resetAccountMappingDesc: t('resetAccountMappingDesc'),
  resetAccountMappingHeader: t('resetAccountMappingHeader'),
  cancel: t('cancel'),
  reset: t('reset'),
  save: t('save'),
  removeSection: t('removeSection'),
  section: t('section'),
  removeFeeType: t('removeFeeType'),
  feeType: t('tableFieldsFeeType'),
  helpVideo: t('helpVideo'),
  viewActivity: t('viewActivity'),
  companyAndAccount: t('companyAndAccount'),
  passbook: t('passbook'),
  accountActivityHeading: t('accountActivityHeading'),
  activity: t('activity'),
  class: t('class'),
  account: t('account'),
  status: t('status'),
  confirm: t('confirm'),
  mode: t('mode'),
  selectAccount: t('selectAccount'),
  addAccount: t('addAccount'),
  none: t('none'),
  bankAccount: t('bankAccount'),
  passbookEmptyStateMsg: t('passbookEmptyStateMsg'),
  accountChangeHistoryEmptyStateMsg: t('accountChangeHistoryEmptyStateMsg'),
  companiesAndBankAccountsLabel: t('companiesAndBankAccountsLabel'),
  bankAccountMappingLabel: t('bankAccountMappingLabel'),
  selectFeeTypes: t('selectFeeTypes'),
}

export const COL_TYPE = {
  CLASS: 'class',
  SECTION: 'section',
  FEE_TYPE: 'feeType',
}

export const COMPANY_ACC_TAB_OPTIONS_IDS = {
  companyAndAccount: 'companyAndAccount',
  accountMapping: 'accountMapping',
}

export const COMPANY_ACC_TAB_OPTIONS = [
  {
    id: COMPANY_ACC_TAB_OPTIONS_IDS.companyAndAccount,
    label: TRANSLATIONS_CA.companiesAndBankAccountsLabel,
  },
  {
    id: COMPANY_ACC_TAB_OPTIONS_IDS.accountMapping,
    label: TRANSLATIONS_CA.bankAccountMappingLabel,
  },
]

export const CREATE_COMPANY_FIELDS_NAME = {
  companyName: 'companyName',
  cinNo: 'cinNo',
  companyAddress: 'companyAddress',
  gstNo: 'gstNo',
}

export const CREATE_COMPANY_DEFAULT_FIELDS_DATA = {
  [CREATE_COMPANY_FIELDS_NAME.companyName]: '',
  [CREATE_COMPANY_FIELDS_NAME.cinNo]: '',
  [CREATE_COMPANY_FIELDS_NAME.companyAddress]: '',
}

export const CREATE_ACCOUNT_FIELDS_NAME = {
  accountName: 'accountName',
  accountNumber: 'accountNumber',
  confirmAccountNumber: 'confirmAccountNumber',
  ifscCode: 'ifscCode',
  beneficiaryName: 'beneficiaryName',
}

export const CREATE_ACCOUNT_DEFAULT_FIELDS_DATA = {
  [CREATE_ACCOUNT_FIELDS_NAME.accountName]: '',
  [CREATE_ACCOUNT_FIELDS_NAME.accountNumber]: '',
  [CREATE_ACCOUNT_FIELDS_NAME.confirmAccountNumber]: '',
  [CREATE_ACCOUNT_FIELDS_NAME.ifscCode]: '',
  [CREATE_ACCOUNT_FIELDS_NAME.beneficiaryName]: '',
}

export const GROUPS_KEYS = {
  CLASS: 'class',
  SECTION: 'section',
  FEE_TYPE: 'feeType',
  GROUPED_BY_CLASS: 'groupedByClass',
  GROUPED_BY_SECTION: 'groupedBySection',
  GROUPED_BY_FEE_TYPE: 'groupedByFeeType',
}

export const DEFAULT_GROUPS_VALUE = {
  [GROUPS_KEYS.CLASS]: [],
  [GROUPS_KEYS.SECTION]: {},
  [GROUPS_KEYS.FEE_TYPE]: {
    [GROUPS_KEYS.GROUPED_BY_CLASS]: {},
    [GROUPS_KEYS.GROUPED_BY_SECTION]: {},
    [GROUPS_KEYS.GROUPED_BY_FEE_TYPE]: [],
  },
}

export const IS_EDIT_OR_CREATE_NEW = {
  EDIT: 'EDIT',
  CREATE_NEW: 'CREATE_NEW',
}

export const ERROR_CODES = {
  INVALID_PAYLOAD: 7501,
  NOT_FOUND: 7502,
  INVALID_ACCOUNT_ID: 7503,
  NO_ACCOUNT: 7504,
  INVALID_IFSC: 7505,
  NO_BANK_ACC: 7506,
  INVALID_ACCOUNT_MAPPING_TYPE: 7507,
  NO_ACCOUNT_MAPPING_FOUND: 7508,
  INVALID_INSTITUTE_COMPANY_DATA: 7509,
  MASTER_COMPANY_NOT_FOUND: 7510,
  DUPLICATE_COMPANY_FOUND: 7511,
  OPEARTION_RESTRICTED: 7512,
  INVALID_COMPANY_ID: 7513,
  INVALID_CURRENT_ACCOUNT_ID: 7514,
  DUPLICATE_ACCOUNT_NUMBER_FOUND: 7515,
  ACCOUNT_ENABLE_RESTRICTED: 7517,
}

export const ERROR_CODE_AND_MSG = {
  [ERROR_CODES.INVALID_PAYLOAD]: {
    code: ERROR_CODES.INVALID_PAYLOAD,
    msg: t('invalidDataProvided'),
  },
  [ERROR_CODES.NOT_FOUND]: {
    code: ERROR_CODES.NOT_FOUND,
    msg: t('dataDoesNotExist'),
  },
  [ERROR_CODES.INVALID_ACCOUNT_ID]: {
    code: ERROR_CODES.INVALID_ACCOUNT_ID,
    msg: t('invalidAccountIdProvided'),
  },
  [ERROR_CODES.NO_ACCOUNT]: {
    code: ERROR_CODES.NO_ACCOUNT,
    msg: t('noBankAccountFound'),
  },
  [ERROR_CODES.INVALID_IFSC]: {
    code: ERROR_CODES.INVALID_IFSC,
    msg: t('invalidIFSCCodeProvided'),
  },
  [ERROR_CODES.NO_BANK_ACC]: {
    code: ERROR_CODES.NO_BANK_ACC,
    msg: t('noBankAccountFound'),
  },
  [ERROR_CODES.INVALID_ACCOUNT_MAPPING_TYPE]: {
    code: ERROR_CODES.INVALID_ACCOUNT_MAPPING_TYPE,
    msg: t('invalidAccountTypeMappingProvided'),
  },
  [ERROR_CODES.NO_ACCOUNT_MAPPING_FOUND]: {
    code: ERROR_CODES.NO_ACCOUNT_MAPPING_FOUND,
    msg: t('noAccountMappingFound'),
  },
  [ERROR_CODES.INVALID_INSTITUTE_COMPANY_DATA]: {
    code: ERROR_CODES.INVALID_INSTITUTE_COMPANY_DATA,
    msg: t('invalidInstituteCompanyData'),
  },
  [ERROR_CODES.MASTER_COMPANY_NOT_FOUND]: {
    code: ERROR_CODES.MASTER_COMPANY_NOT_FOUND,
    msg: t('masterCompanyNotFound'),
  },
  [ERROR_CODES.DUPLICATE_COMPANY_FOUND]: {
    code: ERROR_CODES.DUPLICATE_COMPANY_FOUND,
    msg: t('duplicateCompanyFound'),
  },
  [ERROR_CODES.OPEARTION_RESTRICTED]: {
    code: ERROR_CODES.OPEARTION_RESTRICTED,
    msg: t('operationNotAllowed'),
  },
  [ERROR_CODES.INVALID_COMPANY_ID]: {
    code: ERROR_CODES.INVALID_COMPANY_ID,
    msg: t('invalidCompanyIDFound'),
  },
  [ERROR_CODES.INVALID_CURRENT_ACCOUNT_ID]: {
    code: ERROR_CODES.INVALID_CURRENT_ACCOUNT_ID,
    msg: t('invalidCurrentAccountID'),
  },
  [ERROR_CODES.DUPLICATE_ACCOUNT_NUMBER_FOUND]: {
    code: ERROR_CODES.DUPLICATE_ACCOUNT_NUMBER_FOUND,
    msg: t('duplicateAccountNumberFoundInCompany'),
  },
  [ERROR_CODES.ACCOUNT_ENABLE_RESTRICTED]: {
    code: ERROR_CODES.ACCOUNT_ENABLE_RESTRICTED,
    msg: t('errorEnablingAccount'),
  },
}

export const FEE_COMAPNY_ENABLED_OPTIONS = [
  {
    label: 'viewedit',
    action: 'VIEW_EDIT',
    labelStyle: '',
    permissionId: PERMISSION_CONSTANTS.companyController_updateRoute_update,
  },
  {
    label: 'enableCompany',
    action: 'DISABLED_ENABLED_COMPANY',
    labelStyle: 'enabledButton',
    permissionId: PERMISSION_CONSTANTS.companyController_updateRoute_update,
  },
]

export const FEE_COMAPNY_DISABLED_OPTIONS = [
  {
    label: 'viewedit',
    action: 'VIEW_EDIT',
    labelStyle: '',
    permissionId: PERMISSION_CONSTANTS.companyController_updateRoute_update,
  },
  {
    label: 'disableCompany',
    action: 'DISABLED_ENABLED_COMPANY',
    labelStyle: 'disabledButton',
    permissionId: PERMISSION_CONSTANTS.companyController_updateRoute_update,
  },
]

export const FEE_ACCOUNT_ENABLED_OPTIONS = [
  {
    label: 'viewedit',
    action: 'VIEW_EDIT',
    labelStyle: '',
    permissionId: PERMISSION_CONSTANTS.accountController_updateRoute_update,
  },
  {
    label: 'passbook',
    action: 'PASSBOOK',
    labelStyle: '',
    permissionId: PERMISSION_CONSTANTS.accountController_passbook_read,
  },
  {
    label: 'enableAccount',
    action: 'DISABLED_ENABLED_COMPANY',
    labelStyle: 'enabledButton',
    permissionId: PERMISSION_CONSTANTS.accountController_updateRoute_update,
  },
]

export const FEE_ACCOUNT_DISABLED_OPTIONS = [
  {
    label: 'viewedit',
    action: 'VIEW_EDIT',
    labelStyle: '',
    permissionId: PERMISSION_CONSTANTS.accountController_updateRoute_update,
  },
  {
    label: 'passbook',
    action: 'PASSBOOK',
    labelStyle: '',
    permissionId: '',
  },
  {
    label: 'disableAccount',
    action: 'DISABLED_ENABLED_COMPANY',
    labelStyle: 'disabledButton',
    permissionId: PERMISSION_CONSTANTS.accountController_updateRoute_update,
  },
]

export const ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES = {
  CLASS: 'CLASS',
  FEE_TYPE: 'FEE_TYPE',
  ALL: 'ALL',
}

export const EVENTS_OPTION_OBJ = {
  ACC_MAPPING_OPTIONS: {
    classes: 'classes',
    fee_type: 'fee_type',
    both: 'both',
  },
}

export const ACCOUNT_MAPPING_BASIS_OPTIONS = [
  {
    label: t('mappingByClasses'),
    value: ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES.CLASS,
  },
  {
    label: t('mappingByFeeTypes'),
    value: ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES.FEE_TYPE,
  },
  {
    label: t('bothClassesFeeType'),
    value: ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES.ALL,
  },
]

export const ACCOUNT_MAPPING_TABLE_COLS_KEYS = {
  CLASS: 'class',
  SECTION: 'section',
  FEE_TYPE: 'feeType',
  ACCOUNT: 'account',
}

export const ACCOUNT_MAPPING_TABLE_COLS = [
  {key: ACCOUNT_MAPPING_TABLE_COLS_KEYS.CLASS, label: t('class')},
  {key: ACCOUNT_MAPPING_TABLE_COLS_KEYS.SECTION, label: t('section')},
  {
    key: ACCOUNT_MAPPING_TABLE_COLS_KEYS.FEE_TYPE,
    label: TRANSLATIONS_CA.feeType,
  },
  {key: ACCOUNT_MAPPING_TABLE_COLS_KEYS.ACCOUNT, label: t('bankAccount')},
]

export const ACCOUNT_MAPPING_DOT_BTN_OPTIONS = [
  {
    label: t('reset'),
    action: 'RESET_MAPPING',
    labelStyle: 'accountMappingDotBtnOptionLabel',
    permissionId: PERMISSION_CONSTANTS.accountMappingController_upsert_update,
    active: true,
  },
]

export const ADD_REMOVE = {
  CLASS_SECTION: 'addRemoveClassSection',
  CLASS_FEE_TYPE: 'addRemoveClassFeeType',
  SECTION_FEE_TYPE: 'addRemoveSectionFeeType',
}

// GLOBAL OPTIONS
export const GLOBAL_ACTIONS_COMPANY_ACCOUNT = {
  getCompanyAccountListCA: 'getCompanyAccountListCA',
  createNewCompanyCA: 'createNewCompanyCA',
  updateCompanyCA: 'updateCompanyCA',
  verifyIFSCCA: 'verifyIFSCCA',
  createNewAccountCA: 'createNewAccountCA',
  updateAccountCA: 'updateAccountCA',
  getAccountPassbook: 'getAccountPassbook',
  changeReceiptAccount: 'changeReceiptAccount',
  accountChangeHistory: 'accountChangeHistory',
  accountActivityCA: 'accountActivityCA',
  getAccountMappingListCA: 'getAccountMappingListCA',
  createAccountMappingCA: 'createAccountMappingCA',
  updateAccountMappingCA: 'updateAccountMappingCA',
  getSessionFeeTypesCA: 'getSessionFeeTypesCA',
  resetAccountMappingCA: 'resetAccountMappingCA',
}

export const IFSC_CODE_STATUS = {
  INITIAL: 'INITIAL',
  VALID: 'VALID',
  INVALID: 'INVALID',
  VALIDATING: 'VALIDATING',
}

export const IFSC_CODE_STATUS_MESSAGE = {
  [IFSC_CODE_STATUS.INITIAL]: 'Verify',
  [IFSC_CODE_STATUS.VALID]: 'Verified',
  [IFSC_CODE_STATUS.INVALID]: 'Invalid',
  [IFSC_CODE_STATUS.VALIDATING]: 'Checking..',
}

export const IFSC_CODE_STATUS_STYLES = {
  [IFSC_CODE_STATUS.INITIAL]: 'verifyIFSC',
  [IFSC_CODE_STATUS.VALID]: 'verifiedIFSC',
  [IFSC_CODE_STATUS.INVALID]: 'invalidIFSC',
  [IFSC_CODE_STATUS.VALIDATING]: '',
}

export const ACCOUNT_ACTIVITY_EVENTS = {
  FEE_COMPANY_CREATED: 'FEE:COMPANY_CREATED',
  FEE_COMPANY_DISABLED: 'FEE:COMPANY_DISABLED',
  FEE_COMPANY_ENABLED: 'FEE:COMPANY_ENABLED',
  FEE_COMPANY_UPDATED: 'FEE:COMPANY_UPDATED',
  FEE_ACCOUNT_CREATED: 'FEE:ACCOUNT_CREATED',
  FEE_ACCOUNT_DISABLED: 'FEE:ACCOUNT_DISABLED',
  FEE_ACCOUNT_ENABLED: 'FEE:ACCOUNT_ENABLED',
  FEE_ACCOUNT_UPDATED: 'FEE:ACCOUNT_UPDATED',
  FEE_ACCOUNT_MAPPING_CREATED: 'FEE:ACCOUNT_MAPPING_CREATED',
  FEE_ACCOUNT_MAPPING_UPDATED: 'FEE:ACCOUNT_MAPPING_UPDATED',
  FEE_ACCOUNT_MAPPING_RESET: 'FEE:ACCOUNT_MAPPING_RESET',
}

export const ACCOUNT_ACTIVITY_EVENT_TYPES = {
  [ACCOUNT_ACTIVITY_EVENTS.FEE_COMPANY_CREATED]: {
    TYPE: ACCOUNT_ACTIVITY_EVENTS.FEE_COMPANY_CREATED,
    SENTENCE: 'companyAccountActivityCompanyCreated',
  },
  [ACCOUNT_ACTIVITY_EVENTS.FEE_COMPANY_DISABLED]: {
    TYPE: ACCOUNT_ACTIVITY_EVENTS.FEE_COMPANY_DISABLED,
    SENTENCE: 'companyAccountActivityCompanyDisabled',
  },
  [ACCOUNT_ACTIVITY_EVENTS.FEE_COMPANY_ENABLED]: {
    TYPE: ACCOUNT_ACTIVITY_EVENTS.FEE_COMPANY_ENABLED,
    SENTENCE: 'companyAccountActivityCompanyEnabled',
  },
  [ACCOUNT_ACTIVITY_EVENTS.FEE_COMPANY_UPDATED]: {
    TYPE: ACCOUNT_ACTIVITY_EVENTS.FEE_COMPANY_UPDATED,
    SENTENCE: 'companyAccountActivityCompanyUpdated',
  },
  [ACCOUNT_ACTIVITY_EVENTS.FEE_ACCOUNT_CREATED]: {
    TYPE: ACCOUNT_ACTIVITY_EVENTS.FEE_ACCOUNT_CREATED,
    SENTENCE: 'companyAccountActivityAccountCreated',
  },
  [ACCOUNT_ACTIVITY_EVENTS.FEE_ACCOUNT_DISABLED]: {
    TYPE: ACCOUNT_ACTIVITY_EVENTS.FEE_ACCOUNT_DISABLED,
    SENTENCE: 'companyAccountActivityAccountDisabled',
  },
  [ACCOUNT_ACTIVITY_EVENTS.FEE_ACCOUNT_ENABLED]: {
    TYPE: ACCOUNT_ACTIVITY_EVENTS.FEE_ACCOUNT_ENABLED,
    SENTENCE: 'companyAccountActivityAccountEnabled',
  },
  [ACCOUNT_ACTIVITY_EVENTS.FEE_ACCOUNT_UPDATED]: {
    TYPE: ACCOUNT_ACTIVITY_EVENTS.FEE_ACCOUNT_UPDATED,
    SENTENCE: 'companyAccountActivityAccountUpdated',
  },
  [ACCOUNT_ACTIVITY_EVENTS.FEE_ACCOUNT_MAPPING_CREATED]: {
    TYPE: ACCOUNT_ACTIVITY_EVENTS.FEE_ACCOUNT_MAPPING_CREATED,
    SENTENCE: 'companyAccountActivityAccountMappingAdded',
  },
  [ACCOUNT_ACTIVITY_EVENTS.FEE_ACCOUNT_MAPPING_UPDATED]: {
    TYPE: ACCOUNT_ACTIVITY_EVENTS.FEE_ACCOUNT_MAPPING_UPDATED,
    SENTENCE: 'companyAccountActivityAccountMappingUpdated',
  },
  [ACCOUNT_ACTIVITY_EVENTS.FEE_ACCOUNT_MAPPING_RESET]: {
    TYPE: ACCOUNT_ACTIVITY_EVENTS.FEE_ACCOUNT_MAPPING_RESET,
    SENTENCE: 'companyAccountActivityAccountMappingReset',
  },
}

export const ACCOUNT_ACTIVITY_FILTER_TYPES = {
  THIS_WEEK: 'THIS_WEEK',
  THIS_MONTH: 'THIS_MONTH',
  THIS_SESSION: 'THIS_SESSION',
  CUSTOM_DATERANGE: 'CUSTOM_DATERANGE',
}

export const ACCOUNT_ACTIVITY_FILTER_OPTIONS = {
  [ACCOUNT_ACTIVITY_FILTER_TYPES.THIS_WEEK]: {
    id: ACCOUNT_ACTIVITY_FILTER_TYPES.THIS_WEEK,
    label: 'accountActivityFilterThisWeek',
  },
  // [ACCOUNT_ACTIVITY_FILTER_TYPES.THIS_MONTH] : {
  //   id: ACCOUNT_ACTIVITY_FILTER_TYPES.THIS_MONTH,
  //   label: 'accountActivityFilterThisMonth'
  // },
  [ACCOUNT_ACTIVITY_FILTER_TYPES.THIS_SESSION]: {
    id: ACCOUNT_ACTIVITY_FILTER_TYPES.THIS_SESSION,
    label: 'accountActivityFilterThisSession',
  },
  // [ACCOUNT_ACTIVITY_FILTER_TYPES.CUSTOM_DATERANGE] : {
  //   id: ACCOUNT_ACTIVITY_FILTER_TYPES.CUSTOM_DATERANGE,
  //   label: 'accountActivityFilterCustomDateRange'
  // }
}

export const FILTER_OPTION_IDS = {
  CLASS: 'CLASS',
  FEE_TYPE: 'FEE_TYPE',
  ACCOUNT: 'ACCOUNT',
  STATUS: 'STATUS',
  MODE: 'MODE',
}

export const FILTER_FOR = {
  ACCOUNT_MAPPING: 'ACCOUNT_MAPPING',
  ACCOUNT_PASSBOOK: 'ACCOUNT_PASSBOOK',
}

export const FILTER_BY_STATUS = [
  {
    id: 'PENDING',
    label: payStatusLabel.PENDING,
  },
  {
    id: 'SUCCESS',
    label: payStatusLabel.SUCCESS,
  },
  {
    id: 'SETTLED',
    label: payStatusLabel.SETTLED,
  },
  {
    id: 'CANCELLED',
    label: payStatusLabel.CANCELLED,
  },
  {
    id: 'REVOKED',
    label: revokePaymentStatusLabel.REVOKED,
  },
  {
    id: 'FAILED',
    label: revokePaymentStatusLabel.FAILED,
  },
]

export const FILTER_BY_MODE = [
  {
    id: 'CASH',
    label: payModeLabel.CASH,
    visibleToInernational: true,
  },
  {
    id: 'CHEQUE',
    label: payModeLabel.CHEQUE,
    visibleToInernational: true,
  },
  {
    id: 'DD',
    label: payModeLabel.DD,
    visibleToInernational: false,
  },
  {
    id: 'ONLINE',
    label: payModeLabel.ONLINE,
    visibleToInernational: false,
  },
  {
    id: 'POS',
    label: payModeLabel.POS,
    visibleToInernational: true,
  },
  {
    id: 'BANK_TRANSFER',
    label: payModeLabel.BANK_TRANSFER,
    visibleToInernational: true,
  },
  {
    id: 'UPI',
    label: payModeLabel.UPI,
    visibleToInernational: false,
  },
  {
    id: 'CHALLAN',
    label: payModeLabel.CHALLAN,
    visibleToInernational: false,
  },
  {
    id: 'OTHERS',
    label: payModeLabel.OTHERS,
    visibleToInernational: true,
  },
]

export const INPUT_LIMITS = {
  companyName: {
    max: 60,
  },
  accountName: {
    max: 60,
  },
  accountNumber: {
    max: 40,
  },
}
