export const paymentStatusOptions = {
  PAID: 'Paid',
  PARTIAL: 'Partially paid',
  OVERDUE: 'Overdue',
  UNPAID: 'Unpaid',
}

export const installmentsListTableCols = [
  {key: 'installment_number', label: 'Instalment No.'},
  {key: 'duration', label: 'Billing Period'},
  {key: 'due_date', label: 'Due Date'},
  {key: 'module', label: 'Module'},
  {key: 'total_amount', label: 'Total Amount'},
  {key: 'paid_amount', label: 'Paid Amount'},
  {key: 'pending_amount', label: 'Pending Amount'},
  {key: 'status', label: 'Status'},
]

export const paymentStatusDropdownOptions = [
  {_id: 1, label: 'Paid', value: 'Paid'},
  {_id: 2, label: 'Partially paid', value: 'Partially paid'},
  {_id: 3, label: 'Overdue', value: 'Overdue'},
  {_id: 4, label: 'Unpaid', value: 'Unpaid'},
]

export const localStorageKeys = {
  VERIFIED_SUITS: 'verifiedOnSuits',
  BANNER_LAST_SHOWN: 'bannerLastShown',
  POPUP_LAST_SHOWN: 'popupLastShown',
}
