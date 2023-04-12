import {ROLE_ID} from '../../constants/permission.constants'
import {LEAVE_BASE_TYPE} from './LeaveManagement.constant'
import {isFutureDate} from './LeaveManagement.utils'

export const canCancelPastLeave = ({
  leave,
  manage,
  canManageLeave,
  operator = {roles: [], iid: null},
}) => {
  const {status = '', leaveDates = {}} = leave
  const {APPROVED, REQUESTED, CANCELED, REJECTED} = LEAVE_BASE_TYPE
  if (status === CANCELED || status === REJECTED) return false

  // can't do any action to your own leave on manage leave view
  if (manage && leave.iid == operator.iid) {
    return false
  }

  // if admin in manage view, leave can be canceled any time
  if (manage && canManageLeave) {
    return hasPrecidenceOnRole(operator?.roles, leave.roles)
  }

  const isFuture = isFutureDate(leaveDates.from)
  // special handle for super admin in my leave section
  if (!manage && isFuture && leave.roles?.includes(ROLE_ID.SUPER_ADMIN))
    return true
  // now for staff only cases or admin in myLeave
  if (isFuture && [REQUESTED, APPROVED].includes(status)) return true

  return false
}

export const canEditPastLeave = ({
  leave,
  manage,
  canManageLeave,
  operator = {roles: [], iid: null},
}) => {
  const {status = '', leaveDates = {}} = leave
  const {APPROVED, REQUESTED, CANCELED, REJECTED, CREATED} = LEAVE_BASE_TYPE

  if (status === CANCELED || status === REJECTED) return false

  const isCurrentSuperAdmin = operator?.roles?.includes(ROLE_ID.SUPER_ADMIN)

  // can't do any action to your own leave on manage leave view
  if (manage && leave.iid == operator.iid) {
    return false
  }

  const isFuture = isFutureDate(leaveDates.from)

  // super admin/admin on manage leave can edit those leave only who have precedence
  if (
    manage &&
    isFuture &&
    canManageLeave &&
    status === CREATED &&
    operator?.roles?.length &&
    hasPrecidenceOnRole(operator?.roles, leave.roles) &&
    leave.iid !== operator.iid
  )
    return true

  // for staff only cases & admin leave created by himself
  if (!manage && isFuture && [REQUESTED, APPROVED].includes(status)) return true

  // now for super admin in my view can edit his leave despite of who created the leave for him
  // either him or some other super admin
  if (
    !manage &&
    isFuture &&
    isCurrentSuperAdmin &&
    status === CREATED &&
    leave.iid == operator.iid
  )
    return true

  return false
}

export const canCancelPendingLeave = ({leave}) =>
  isFutureDate(leave.leaveDates?.from)

export const canEditPendingLeave = ({leave, manage}) =>
  manage || (!manage && isFutureDate(leave.leaveDates?.from))

export const canApprovePendingLeave = ({manage, canManageLeave}) => {
  if (manage && canManageLeave) return true
  return false
}

export const canRejectPendingLeave = ({manage, canManageLeave}) => {
  if (manage && canManageLeave) return true
  return false
}

export const hasPrecidenceOnRole = (currentRole = [], targetRole = []) => {
  if (!currentRole.length) return false

  const isCurrentSuperAdmin = currentRole.includes(ROLE_ID.SUPER_ADMIN)

  // if super admin, no question asked, just allow it
  if (isCurrentSuperAdmin) return true
  // add restrictions on admin here over super admin
  else if (targetRole.includes(ROLE_ID.SUPER_ADMIN)) return false
  else return true
}
