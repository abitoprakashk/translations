import {t} from 'i18next'

export const WALLET_TRANSACTIONS_TABLE_COLS = [
  {key: 'transactionType', label: t('transactionType')},
  {key: 'amount', label: t('amount')},
  {key: 'date', label: t('date')},
  // {key: 'receipt', label: t('receipt')},
]

export const WALLET_TRANSACTION_REFUND_ID = 5
export const WALLET_TRANSACTION_CREDIT_ID = 9
export const WALLET_TRANSACTION_DEBIT_ID = 10

export const WALLET_TRANSACTION_TYPE = {
  [WALLET_TRANSACTION_REFUND_ID]: {
    key: 'WALLET_REFUND',
    text: t('walletRefund'),
  },
  [WALLET_TRANSACTION_CREDIT_ID]: {
    key: 'WALLET_CREDIT',
    text: t('walletCredit'),
  },
  [WALLET_TRANSACTION_DEBIT_ID]: {
    key: 'WALLET_DEBIT',
    text: t('walletDebit'),
  },
}

export const WALLET_TRANSACTIONS_TABLE_NO_DATA = [
  {
    id: `walletTab0`,
    transactionType: '',
    amount: t('noData'),
    date: '',
    receipt: '',
  },
]

export const WALLET_TRANSACTION_META_ORIGIN_ID = {
  FEE_ADJUSTMENT_BALANCE: 0,
  RECHARGE: 1,
  FEE_PAYMENT: 2,
}

export const WALLET_TRANSACTION_META_ORIGIN = {
  [WALLET_TRANSACTION_META_ORIGIN_ID.FEE_ADJUSTMENT_BALANCE]: {
    text: t('feeAdjustmentBalance'),
  },
  [WALLET_TRANSACTION_META_ORIGIN_ID.RECHARGE]: {
    text: t('recharge'),
  },
  [WALLET_TRANSACTION_META_ORIGIN_ID.FEE_PAYMENT]: {
    text: t('feePayment'),
  },
}
