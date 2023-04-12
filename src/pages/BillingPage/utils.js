import {BADGES_CONSTANTS} from '@teachmint/krayon'
import {paymentStatusOptions} from './constants'

export const parseIntHandleNull = (value) => {
  return parseInt(value) ? parseInt(value) : 0
}

export const handleNull = (value) => {
  return value ? value : '-'
}

export const statusBadge = {
  [paymentStatusOptions.PAID]: {
    type: BADGES_CONSTANTS.TYPE.SUCCESS,
    label: paymentStatusOptions.PAID,
  },
  [paymentStatusOptions.UNPAID]: {
    type: BADGES_CONSTANTS.TYPE.WARNING,
    label: paymentStatusOptions.UNPAID,
  },
  [paymentStatusOptions.PARTIAL]: {
    type: BADGES_CONSTANTS.TYPE.PRIMARY,
    label: paymentStatusOptions.PARTIAL,
  },
}

export const convertListToSeparatedString = (oldList) => {
  let list = [...oldList]
  if (!list || list.length === 0) return ''
  if (list?.length <= 5) return list.join(', ')
  return `${list.slice(0, 5).join(', ')} + ${list.length - 5} more`
}
