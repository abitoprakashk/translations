import {t} from 'i18next'
import {ACTION_DELETE_TRANSACTION} from '../../../../pages/fee/fees.constants'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'

export const FEE_UPDATE_HISTORY_DEFAULT_TABLE_COLS = [
  {key: 'installment', label: t('installment')},
  {key: 'feeType', label: t('tableFieldsFeeType')},
  {key: 'previousFee', label: t('previousFee')},
  {key: 'currentFee', label: t('currentFee')},
]

export const FEE_UPDATE_HISTORY_DISCOUNT_TABLE_COLS = [
  {key: 'installment', label: t('installment')},
  {key: 'feeType', label: t('tableFieldsdiscountName')},
  {key: 'previousFee', label: t('previousDiscount')},
  {key: 'currentFee', label: t('currentDiscount')},
]

export const INSTALMENT_DETAIL_TABLE_COLS = [
  {key: 'feeType', label: t('feeType')},
  {key: 'amount', label: t('amount')},
  {key: 'discount', label: t('discount')},
  {key: 'paid', label: t('paidFee')},
  {key: 'due', label: t('due')},
]

export const PAYMENT_HISTORY_TABLE_COLS = [
  {key: 'receiptNo', label: t('receiptNo')},
  {key: 'amount', label: t('amount')},
  {key: 'mode', label: t('mode')},
  {key: 'date', label: t('date')},
  {key: 'status', label: t('status')},
  {key: 'receipt', label: t('action')},
]

export const UPDATE_HISTORY_TYPE_KEYS = {
  UPSERT_FEE_STRUCTURE: 'UPSERT_FEE_STRUCTURE',
  DELETE_FEE_STRUCTURE: 'DELETE_FEE_STRUCTURE',
  FEE_CATEGORY_AMOUNT: 'FEE_CATEGORY_AMOUNT',
  MODIFY_PREVIOUS_DUE: 'MODIFY_PREVIOUS_DUE',
  IMIS: 'IMIS',
  TRANSPORT_PICKUP: 'TRANSPORT_PICKUP',
}

export const UPDATE_HISTORY_TYPE = {
  [UPDATE_HISTORY_TYPE_KEYS.UPSERT_FEE_STRUCTURE]: 'UPSERT_FEE_STRUCTURE',
  [UPDATE_HISTORY_TYPE_KEYS.DELETE_FEE_STRUCTURE]: 'DELETE_FEE_STRUCTURE',
  [UPDATE_HISTORY_TYPE_KEYS.FEE_CATEGORY_AMOUNT]: 'FEE_CATEGORY_AMOUNT',
  [UPDATE_HISTORY_TYPE_KEYS.MODIFY_PREVIOUS_DUE]: 'MODIFY_PREVIOUS_DUE',
  [UPDATE_HISTORY_TYPE_KEYS.IMIS]: 'IMIS',
  [UPDATE_HISTORY_TYPE_KEYS.TRANSPORT_PICKUP]: 'TRANSPORT_PICKUP',
}

export const DISCOUNT_TILL_DATE_MODAL_COLS = [
  {key: 'discountType', label: t('discountType')},
  {key: 'amount', label: t('amount')},
  {key: 'feeType', label: t('appliedOnFeeTypeCol')},
  {key: 'addedOn', label: `${t('addedOn')} (${t('date')})`},
]

export const PAYMENT_HISTORY_MODALS_FOR = {
  viewPaymentHistory: 'viewPaymentHistory',
  viewReceipts: 'viewReceipts',
}

export const PAYMENT_HISTORY_TABLE_NO_DATA = [
  {
    id: `paymentHistory0`,
    receiptNo: '',
    amount: '',
    mode: t('noData'),
    date: '',
    status: '',
    receipt: '',
  },
]

export const DISCOUNT_TILL_DATE_TABLE_NO_DATA = [
  {
    id: `discountTIllDate0`,
    discountType: '',
    amount: '',
    feeType: t('noData'),
    addedOn: '',
  },
]

export const EVENTS_SCREEN_NAMES = {
  student_details: 'student_details',
  student_details_payment_history: 'student_details_payment_history',
  student_details_view_receipts: 'student_details_view_receipts',
}

export const FEE_TAB_TRANSACTION_DOWNLOAD_OPTIONS = [
  {
    label: 'Download Receipt',
    action: 'ACT_DOWNLOAD_RECEIPT',
    labelStyle: '',
    permissionId:
      PERMISSION_CONSTANTS.feeModuleController_getReceiptDownload_read,
    active: true,
  },
  {
    label: 'Delete Receipt',
    action: ACTION_DELETE_TRANSACTION,
    labelStyle: 'tm-cr-rd-1',
    permissionId:
      PERMISSION_CONSTANTS.feeModuleController_revokeTransactions_delete,
    active: true,
  },
]

export const requestDispatchFrom = {
  FEE_TAB_PAYMENT_HISTORY: 'FEE_TAB_PAYMENT_HISTORY',
}

export const ADD_ON_FEE_TABS = {
  ADD_ON_FEE: 'ADD_ON_FEE',
  ADD_ON_DISCOUNT: 'ADD_ON_DISCOUNT',
}

export const ADD_ON_FEE_TAB_DATA = [
  {
    id: ADD_ON_FEE_TABS.ADD_ON_FEE,
    label: t('addOnFeeHeader'),
  },
  {
    id: ADD_ON_FEE_TABS.ADD_ON_DISCOUNT,
    label: t('addOnDiscountHeader'),
  },
]

export const ADD_ON_FEE_TABLE_COLS = [
  {key: 'feeType', label: t('tableFieldsFeeType')},
  {key: 'existingFeeAmount', label: t('Existing Fee Amount')},
  {key: 'addOnAmount', label: t('addOnAmountColumn')},
  {key: 'newFeeAmount', label: t('newFeeAmountColumn')},
]

export const ADD_ON_DISCOUNT_TABLE_COLS = [
  {key: 'feeType', label: t('tableFieldsFeeType')},
  {key: 'existingDiscount', label: t('existingDiscount')},
  {key: 'addOnDiscount', label: t('addOnDiscount')},
  {key: 'newDiscount', label: t('newDiscountColumn')},
]
