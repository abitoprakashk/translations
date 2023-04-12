import {FEE_CUSTOMIZATION_API_KEYS_REQUEST} from './feeCustomization.api.constants'

export const ROW_OPTIONS = {
  STUDENT_DETAILS: {
    titleKey: 'studentDetails',
    value: 'STUDENT_DETAILS',
  },
  DEPARTMENT: {
    titleKey: 'department',
    value: 'DEPARTMENT',
  },
  CLASS: {
    titleKey: 'class',
    value: 'CLASS',
  },
  SECTION: {
    titleKey: 'section',
    value: 'SECTION',
  },
  INSTALLMENT_DATE: {
    titleKey: 'installmentDate',
    value: 'INSTALLMENT_DATE',
  },
  FEE_TYPE: {
    titleKey: 'tableFieldsFeeType',
    value: 'FEE_TYPE',
  },
  CHEQUE_NUMBER: {
    titleKey: 'chequeNo',
    value: 'CHEQUE_NUMBER',
  },
  RECEIPT_NUMBER: {
    titleKey: 'receiptNumberTitleCase',
    value: 'RECEIPT_NUMBER',
  },
  PAYMENT_MONTH: {
    titleKey: 'paymentMonth',
    value: 'PAYMENT_MONTH',
  },
  PAYMENT_DATE: {
    titleKey: 'paymentDate',
    value: 'PAYMENT_DATE',
  },
  PAYMENT_MODE: {
    titleKey: 'paymentMode',
    value: 'PAYMENT_MODE',
  },
  TRANSACTION_STATUS: {
    titleKey: 'transactionStatus',
    value: 'TRANSACTION_STATUS',
  },
}

export const COLUMN_OPTIONS = {
  DEPARTMENT: {
    titleKey: 'department',
    value: 'DEPARTMENT',
  },
  CLASS: {
    titleKey: 'class',
    value: 'CLASS',
  },
  SECTION: {
    titleKey: 'section',
    value: 'SECTION',
  },
  INSTALLMENT_DATE: {
    titleKey: 'installmentDate',
    value: 'INSTALLMENT_DATE',
  },
  FEE_TYPE: {
    titleKey: 'tableFieldsFeeType',
    value: 'FEE_TYPE',
  },
  PAYMENT_MONTH: {
    titleKey: 'paymentMonth',
    value: 'PAYMENT_MONTH',
  },
  PAYMENT_MODE: {
    titleKey: 'paymentMode',
    value: 'PAYMENT_MODE',
  },
  TRANSACTION_STATUS: {
    titleKey: 'transactionStatus',
    value: 'TRANSACTION_STATUS',
  },
}

export const VALUE = {
  VALUES: {
    titleKey: 'values',
    value: 'VALUES',
  },
}

export const VALUE_OPTIONS = {
  FEE_APPLICABLE: {
    titleKey: 'feeApplicable',
    value: 'FEE_APPLICABLE',
    isSelected: false,
    enum: 1,
  },
  DISCOUNT: {
    titleKey: 'discount',
    value: 'DISCOUNT',
    enum: 3,
    isSelected: false,
  },
  DUE: {
    titleKey: 'due',
    value: 'DUE',
    enum: 4,
    isSelected: false,
  },
  PAID_AMOUNT: {
    titleKey: 'paidAmount',
    value: 'PAID_AMOUNT',
    enum: 2,
    isSelected: false,
  },
}

export const FILTER_TYPES = {
  INSTITUTE_HEIRARCHY: 'INSTITUTE_HEIRARCHY',
  CHECKBOX: 'CHECKBOX',
}

export const FILTER_OPTIONS_CONSTANTS = {
  SECTION: 'SECTION',
  INSTALLMENT_DATE: 'INSTALLMENT_DATE',
  FEE_TYPE: 'FEE_TYPE',
  TRANSACTION_STATUS: 'TRANSACTION_STATUS',
  PAYMENT_MODE: 'PAYMENT_MODE',
}

export const FILTER_OPTIONS = {
  SECTION: {
    titleKey: 'classSection',
    value: FILTER_OPTIONS_CONSTANTS.SECTION,
    isSelected: true,
    data: [],
    type: FILTER_TYPES.INSTITUTE_HEIRARCHY,
  },
  INSTALLMENT_DATE: {
    titleKey: 'installmentDate',
    value: FILTER_OPTIONS_CONSTANTS.INSTALLMENT_DATE,
    isSelected: false,
    data: [],
  },
  FEE_TYPE: {
    titleKey: 'tableFieldsFeeType',
    value: FILTER_OPTIONS_CONSTANTS.FEE_TYPE,
    isSelected: false,
    data: [],
  },
  PAYMENT_MODE: {
    titleKey: 'paymentMode',
    value: FILTER_OPTIONS_CONSTANTS.PAYMENT_MODE,
    isSelected: false,
    data: [],
  },
  TRANSACTION_STATUS: {
    titleKey: 'transactionStatus',
    value: FILTER_OPTIONS_CONSTANTS.TRANSACTION_STATUS,
    isSelected: false,
    data: [],
  },
}

export const FEE_PAYMENT_STATUS = {
  CASH: 'CASH',
  CHEQUE: 'CHEQUE',
  ONLINE: 'ONLINE',
  DD: 'DD',
  BANK_TRANSFER: 'BANK_TRANSFER',
  UPI: 'UPI',
  POS: 'POS',
  CHALLAN: 'CHALLAN',
  OTHERS: 'OTHERS',
}

export const FEE_PAYMENT_MODE_OPTIONS = [
  {
    value: FEE_PAYMENT_STATUS.ONLINE,
    labelKey: 'onlinePg',
    enum: 1,
    isSelected: false,
  },
  {
    value: FEE_PAYMENT_STATUS.CASH,
    labelKey: 'cash',
    enum: 2,
    isSelected: false,
  },
  {
    value: FEE_PAYMENT_STATUS.CHEQUE,
    labelKey: 'cheque',
    enum: 3,
    isSelected: false,
  },
  {
    value: FEE_PAYMENT_STATUS.DD,
    labelKey: 'dd',
    enum: 4,
    isSelected: false,
  },
  {
    value: FEE_PAYMENT_STATUS.POS,
    labelKey: 'POS',
    enum: 5,
    isSelected: false,
  },
  {
    value: FEE_PAYMENT_STATUS.BANK_TRANSFER,
    labelKey: 'bankTransferNeft',
    enum: 6,
    isSelected: false,
  },
  {
    value: FEE_PAYMENT_STATUS.UPI,
    labelKey: 'UPI',
    enum: 8,
    isSelected: false,
  },
  {
    value: FEE_PAYMENT_STATUS.CHALLAN,
    labelKey: 'challan',
    enum: 9,
    isSelected: false,
  },
  {
    value: FEE_PAYMENT_STATUS.OTHERS,
    labelKey: 'others',
    enum: 10,
    isSelected: false,
  },
]

export const TRANSACTION_STATUS = [
  {
    value: 'NONE',
    labelKey: 'none',
    enum: -1,
    isSelected: false,
  },
  {
    value: 'PENDING',
    labelKey: 'pending',
    enum: 0,
    isSelected: false,
  },
  {
    value: 'SUCCESS',
    labelKey: 'success',
    enum: 1,
    isSelected: false,
  },
  {
    value: 'SETTLED',
    labelKey: 'settled',
    enum: 3,
    isSelected: false,
  },
  {
    value: 'CANCELLED',
    labelKey: 'cancelled',
    enum: 4,
    isSelected: false,
  },
  {
    value: 'DELETED',
    labelKey: 'deleted',
    enum: 5,
    isSelected: false,
  },
  {
    value: 'FAILED',
    labelKey: 'failed',
    enum: 2,
    isSelected: false,
  },
]

export const PIVOT_TABLE_EDITOR_DATA_FIELDS = {
  ROWS: 'rows',
  COLUMNS: 'columns',
  VALUES: 'values',
  DATERANGE: 'dateRange',
  FILTERS: 'filters',
}

export const PIVOT_TABLE_EDITOR_FILTER_FIELDS = {
  [FILTER_OPTIONS_CONSTANTS.SECTION]:
    FEE_CUSTOMIZATION_API_KEYS_REQUEST.SECTION,
  [FILTER_OPTIONS_CONSTANTS.INSTALLMENT_DATE]:
    FEE_CUSTOMIZATION_API_KEYS_REQUEST.INSTALLMENT_DATE,
  [FILTER_OPTIONS_CONSTANTS.FEE_TYPE]:
    FEE_CUSTOMIZATION_API_KEYS_REQUEST.FEE_TYPE,
  [FILTER_OPTIONS_CONSTANTS.PAYMENT_MODE]:
    FEE_CUSTOMIZATION_API_KEYS_REQUEST.PAYMENT_MODE,
  [FILTER_OPTIONS_CONSTANTS.TRANSACTION_STATUS]:
    FEE_CUSTOMIZATION_API_KEYS_REQUEST.TRANSACTION_STATUS,
}
