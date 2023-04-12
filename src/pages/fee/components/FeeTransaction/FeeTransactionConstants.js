import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import {
  ACTION_CANCEL_TRANSACTION,
  ACTION_CANCEL_TRANSACTION_RECEIPT,
  ACTION_DELETE_TRANSACTION,
  bankTransactionModes,
} from '../../fees.constants'

export const REVOKED = 'REVOKED'

export const paymentStatus = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  SETTLED: 'SETTLED',
  FAILED: 'FAILED',
  REVOKED: 'DELETED',
  CANCELLED: 'CANCELLED',
}

export const payStatusTag = {
  PENDING: 'warning',
  SUCCESS: 'success',
  SETTLED: 'success',
  FAILED: 'danger',
  REVOKED: 'danger',
  CANCELLED: 'danger',
}

export const payStatusKrayonTag = {
  PENDING: 'warning',
  SUCCESS: 'success',
  SETTLED: 'success',
  FAILED: 'error',
  REVOKED: 'error',
  CANCELLED: 'error',
}

export const payStatusClass = {
  PENDING: 'tm-cr-og-1',
  SUCCESS: 'tm-color-green',
  SETTLED: 'tm-color-green',
  FAILED: 'tm-cr-rd-1',
}

export const payStatusLabel = {
  PENDING: 'Pending',
  SUCCESS: 'Success',
  SETTLED: 'Settled',
  FAILED: 'Failed',
  REVOKED: 'Deleted',
  CANCELLED: 'Cancelled',
}

export const TRANSACTION_STATUS_ENUM_CONVERSION = {
  0: paymentStatus.PENDING,
  1: paymentStatus.SUCCESS,
  2: paymentStatus.FAILED,
  3: paymentStatus.SETTLED,
  4: paymentStatus.CANCELLED,
  5: paymentStatus.REVOKED,
}

export const revokePaymentStatusLabel = {
  REVOKED: 'Deleted',
  FAILED: 'Failed',
}

export const defaultPaymentStatus = [
  paymentStatus.PENDING,
  paymentStatus.SUCCESS,
  paymentStatus.SETTLED,
  paymentStatus.CANCELLED,
]

export const defaultBankTransStatus = [
  bankTransactionModes.RECEIVED,
  bankTransactionModes.DEPOSITED,
  bankTransactionModes.CLEARED,
  bankTransactionModes.BOUNCED,
  bankTransactionModes.RETURNED,
  bankTransactionModes.CANCELLED,
]

export const payModeLabel = {
  CASH: 'Cash',
  CHEQUE: 'Cheque',
  DD: 'DD',
  ONLINE: 'Online (PG)',
  POS: 'POS',
  BANK_TRANSFER_NEFT: 'Bank Transfer/NEFT',
  UPI: 'UPI',
  CHALLAN: 'Challan',
  OTHERS: 'Others',
  BANK_TRANSFER: 'Bank Transfer',
}

export const FEE_TRANSACTION_PENDING_OPTIONS = [
  {
    label: 'Update Status',
    action: 'TRANSACTION_UPDATE_STATUS',
    labelStyle: '',
    permissionId:
      PERMISSION_CONSTANTS.contingentTransactionsController_updateTransactionStatus_update,
    active: true,
  },
  {
    label: 'View Txn Timeline',
    action: 'VIEW_TXN_TIMELINE',
    labelStyle: '',
    permissionId:
      PERMISSION_CONSTANTS.contingentTransactionsController_getTransactionTimeline_read,
    active: true,
  },
]

export const FEE_TRANSACTION_ONLINE_SUCCESS_OPTIONS = [
  {
    label: 'Download Receipt',
    action: 'ACT_DOWNLOAD_RECEIPT',
    labelStyle: '',
    permissionId:
      PERMISSION_CONSTANTS.feeModuleController_getReceiptDownload_read,
    active: true,
  },
]

export const FEE_TRANSACTION_SUCCESS_OPTIONS = [
  {
    label: 'Download Receipt',
    action: 'ACT_DOWNLOAD_RECEIPT',
    labelStyle: '',
    permissionId:
      PERMISSION_CONSTANTS.feeModuleController_getReceiptDownload_read,
    active: true,
  },
  // {
  //   label: 'View Txn Timeline',
  //   action: 'VIEW_TXN_TIMELINE',
  //   labelStyle: '',
  //   active: true,
  // },
  {
    label: 'Cancel Transaction',
    action: ACTION_CANCEL_TRANSACTION,
    labelStyle: 'tm-cr-rd-1',
    permissionId:
      PERMISSION_CONSTANTS.feeModuleController_revokeTransactions_delete,
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

export const FEE_TRANSACTION_FAILED_OPTIONS = [
  {
    label: 'View Txn Timeline',
    action: 'VIEW_TXN_TIMELINE',
    labelStyle: '',
    permissionId:
      PERMISSION_CONSTANTS.contingentTransactionsController_getTransactionTimeline_read,
    active: true,
  },
]

export const ONLINE_FEE_TRANSACTION_FAILED_OPTIONS = [
  {
    label: 'View Txn Timeline',
    action: 'VIEW_TXN_TIMELINE',
    labelStyle: '',
    permissionId:
      PERMISSION_CONSTANTS.contingentTransactionsController_getTransactionTimeline_read,
    active: true,
  },
  {
    label: 'Refresh Txn Status',
    action: 'REFRESH_TXN_STATUS',
    labelStyle: '',
    permissionId:
      PERMISSION_CONSTANTS.feeModuleController_refreshStudentTransactions_update,
    active: true,
  },
]

export const FEE_TRANSACTION_SUCCESS_CASH_OPTIONS = [
  {
    label: 'Download Receipt',
    action: 'ACT_DOWNLOAD_RECEIPT',
    labelStyle: '',
    permissionId:
      PERMISSION_CONSTANTS.feeModuleController_getReceiptDownload_read,
    active: true,
  },
  {
    label: 'Cancel Transaction',
    action: ACTION_CANCEL_TRANSACTION,
    labelStyle: 'tm-cr-rd-1',
    permissionId:
      PERMISSION_CONSTANTS.feeModuleController_revokeTransactions_delete,
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

export const FEE_TRANSACTION_CANCELLED_OPTIONS = [
  {
    label: 'Download Receipt',
    action: 'ACT_DOWNLOAD_RECEIPT',
    labelStyle: '',
    permissionId:
      PERMISSION_CONSTANTS.feeModuleController_getReceiptDownload_read,
    active: true,
  },
  {
    label: 'Download Cancelled Receipt',
    action: ACTION_CANCEL_TRANSACTION_RECEIPT,
    labelStyle: '',
    permissionId:
      PERMISSION_CONSTANTS.feeModuleController_getReceiptDownload_read,
    active: true,
  },
]

export const FEE_TRANSACTION_LABEL = {
  NO_RECORDS_AVAILABLE: 'No transaction records available',
  ADD_FILTERS: 'Add Filters',
  EDIT_STATUS: 'Edit Status',
  TRANSACTION_TIMELINE: 'Transaction Timeline',
  TXN_ID: 'Txn ID',
  AMOUNT: 'Amount',
  DATE: 'Date',
  MODE: 'Mode',
  MODES: 'Modes',
  STATUS: 'Status',
  CURRENT_STATUS: 'Current Status',
  UPDATE_STATUS_DROPDOWN: 'Updated Status',
  UPDATE_STATUS_DROPDOWN_PLACEHOLDER: 'Select One',
  UPDATE_STATUS_CONFIRM_BUTTON: 'Update Status',
  UPDATE_STATUS_SUCCESS: 'Success',
  UPDATE_STATUS_FAILED: 'Failed',
  UPDATE_STATUS_PENDING: 'Pending',
  DISBURSAL_DATE: 'Disbursal Date',
  CHEQUE_STATUS: 'Current Cheque Status',
  DD_STATUS: 'Current DD Status',
}

export const FEE_TIMELINE_LABEL = {
  LABEL: {
    RECEIVED: 'Payment',
    PENDING: 'Payment In Process',
    SUCCESS: 'Payment Success',
    SETTLED: 'Payment Settled',
    FAILED: 'Payment Failed',
  },
}
