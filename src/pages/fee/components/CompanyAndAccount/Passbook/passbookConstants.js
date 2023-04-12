import {t} from 'i18next'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'

export const PASSBOOK_COLUMNS = [
  {key: 'transactionId', label: t('transactionId')},
  {key: 'receiptNo', label: t('recieptNo')},
  {key: 'studentDetails', label: t('studentDetails')},
  {key: 'class', label: t('class')},
  {key: 'amount', label: t('amount')},
  {key: 'feeType', label: t('feeType')},
  {key: 'mode', label: t('mode')},
  {key: 'status', label: 'status'},
  {key: 'action', label: ''},
]

export const PASSBOOK_TOOLTIP_OPTIONS_IDS = {
  DOWNLOAD_RELATED_RECEIPT: 'DOWNLOAD_RELATED_RECEIPT',
  CHANGE_ACCOUNT: 'CHANGE_ACCOUNT',
  ACCOUNT_CHANGE_HISTORY: 'ACCOUNT_CHANGE_HISTORY',
}

export const PASSBOOK_TOOLTIP_OPTIONS = [
  {
    label: t('downloadRelatedReceipt'),
    action: PASSBOOK_TOOLTIP_OPTIONS_IDS.DOWNLOAD_RELATED_RECEIPT,
    labelStyle: '',
    permissionId: PERMISSION_CONSTANTS.accountController_passbook_read,
  },
  {
    label: t('changeAccount'),
    action: PASSBOOK_TOOLTIP_OPTIONS_IDS.CHANGE_ACCOUNT,
    labelStyle: '',
    permissionId: PERMISSION_CONSTANTS.accountController_change_update,
  },
  {
    label: t('accountChangeHistory'),
    action: PASSBOOK_TOOLTIP_OPTIONS_IDS.ACCOUNT_CHANGE_HISTORY,
    labelStyle: '',
    permissionId: PERMISSION_CONSTANTS.accountController_passbook_read,
  },
]

export const PASSBOOK_ROWS_LIMIT = 10
