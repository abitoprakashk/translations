import {Button, Modal, useOutsideClickHandler} from '@teachmint/common'
import React, {useMemo, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {LEAVE_BASE_TYPE} from '../../../../../LeaveManagement.constant'
import {
  hideLeaveDetails,
  showApproveModal,
  showCancelModal,
  showEditLeavePopup,
  showRejectModal,
  showStaffHsitoryModal,
} from '../../../../../redux/actions/leaveManagement.actions'
import defaultUserImage from '../../../../../../../assets/images/icons/user-profile.svg'
import classNames from 'classnames'
import styles from './LeaveDetailsPopup.module.css'
import {events} from '../../../../../../../utils/EventsConstants'
import {Trans, useTranslation} from 'react-i18next'
import {
  canApprovePendingLeave,
  canCancelPastLeave,
  canCancelPendingLeave,
  canEditPastLeave,
  canEditPendingLeave,
  canRejectPendingLeave,
} from '../../../../../LeaveMangement.permission'
import useRoleFilter from '../../../../../../../hooks/useRoleFilter'
import BottomStatsInfo from './BottomStatsInfo'
import PopupLeaveInfo from './PopupLeaveInfo'

function LeaveDetailsPopup() {
  const {showLeaveDetailsModal, selectedLeave, from, manage} = useSelector(
    (state) => state.leaveManagement.leave
  )

  const eventManager = useSelector((state) => state.eventManager)
  const currentUserRoles = useSelector(
    (state) => state.currentAdminInfo?.role_ids
  )
  const currentUserIid = useSelector(
    (state) => state.currentAdminInfo?.imember_id
  )

  const dispatch = useDispatch()
  const {t} = useTranslation()

  const [canManageLeave] = useRoleFilter()

  const modalContentRef = useRef()
  useOutsideClickHandler(modalContentRef, () => dispatch(hideLeaveDetails()))

  const onApprove = () => {
    dispatch(hideLeaveDetails())
    dispatch(showApproveModal(selectedLeave))
    eventManager.send_event(events.APPROVE_LEAVE_CLICKED_TFI, {
      employee_name: selectedLeave.name,
      employee_user_id: selectedLeave.id,
      employee_type:
        typeof selectedLeave.rollName === 'object'
          ? selectedLeave.rollName?.props?.children
          : selectedLeave.rollName,
    })
  }

  const onReject = () => {
    dispatch(hideLeaveDetails())
    dispatch(showRejectModal(selectedLeave))
    eventManager.send_event(events.REJECT_LEAVE_CLICKED_TFI, {
      employee_name: selectedLeave.name,
      employee_user_id: selectedLeave.id,
      employee_type:
        typeof selectedLeave.rollName === 'object'
          ? selectedLeave.rollName?.props?.children
          : selectedLeave.rollName,
    })
  }

  const onCancel = () => {
    dispatch(hideLeaveDetails())
    dispatch(showCancelModal({...selectedLeave, manage}))
    eventManager.send_event(events.CANCEL_LEAVE_CLICKED_TFI, {
      employee_name: selectedLeave.name,
      employee_user_id: selectedLeave.id,
      screen: 'USER_DETAILS',
      employee_type:
        typeof selectedLeave.rollName === 'object'
          ? selectedLeave.rollName?.props?.children
          : selectedLeave.rollName,
    })
  }

  const onEdit = () => {
    dispatch(hideLeaveDetails())
    const request = !manage && selectedLeave.iid === currentUserIid
    dispatch(
      showEditLeavePopup({
        leave: selectedLeave,
        request,
      })
    )
    eventManager.send_event(
      request
        ? events.EDIT_LEAVE_FOR_SELF_CLICKED_TFI
        : events.EDIT_LEAVE_FOR_EMPLOYEE_CLICKED_TFI,
      {
        employee_name: selectedLeave.name,
        employee_user_id: selectedLeave.id,
        screen: 'USER_DETAILS',
        employee_type:
          typeof selectedLeave.rollName === 'object'
            ? selectedLeave.rollName?.props?.children
            : selectedLeave.rollName,
      }
    )
  }

  const canCancel = useMemo(() => {
    if (from === LEAVE_BASE_TYPE.PENDING)
      return canCancelPendingLeave({leave: selectedLeave})
    if (from === LEAVE_BASE_TYPE.PAST)
      return canCancelPastLeave({
        leave: selectedLeave,
        manage,
        canManageLeave,
        operator: {roles: currentUserRoles, iid: currentUserIid},
      })
    return false
  }, [canManageLeave])

  const canEdit = useMemo(() => {
    if (from === LEAVE_BASE_TYPE.PENDING)
      return canEditPendingLeave({leave: selectedLeave, manage})
    if (from === LEAVE_BASE_TYPE.PAST)
      return canEditPastLeave({
        leave: selectedLeave,
        manage,
        canManageLeave,
        operator: {roles: currentUserRoles, iid: currentUserIid},
      })
    return false
  }, [canManageLeave])

  const canApprove = useMemo(() => {
    if (from === LEAVE_BASE_TYPE.PENDING)
      return canApprovePendingLeave({manage, canManageLeave})
    return false
  }, [canManageLeave])

  const canReject = useMemo(() => {
    if (from === LEAVE_BASE_TYPE.PENDING)
      return canRejectPendingLeave({manage, canManageLeave})
    return false
  }, [canManageLeave])

  const handleViewDetails = () => {
    dispatch(hideLeaveDetails())
    dispatch(showStaffHsitoryModal(selectedLeave))
  }

  return selectedLeave ? (
    <Modal show={showLeaveDetailsModal} className={styles.modalWrapper}>
      <div className={styles.wrapper} ref={modalContentRef}>
        <div className={styles.headerwrapper}>
          {manage && (
            <>
              <div className={styles.flex}>
                <img
                  className={styles.img}
                  src={selectedLeave.img_url || defaultUserImage}
                  alt=""
                />
                <div>
                  <div className={styles.leavedate}>{selectedLeave.name}</div>
                  <div className={styles.staffType}>
                    {selectedLeave.rollName}
                  </div>
                </div>
              </div>
              <div onClick={handleViewDetails} className={styles.link}>
                {selectedLeave?.leaveDates?.count > 0 && (
                  <div className={styles.leaveCount}>
                    {selectedLeave?.leaveDates?.count}{' '}
                    {selectedLeave?.leaveDates?.count == 1
                      ? t('leaveTaken')
                      : t('leavesTaken')}
                  </div>
                )}
                <div className={styles.viewDetails}>{t('viewDetails')}</div>
              </div>
            </>
          )}
          {!manage && (
            <div className={styles.staffType}>
              <Trans i18nKey={'requestedon'}>
                Requested on {{requestedOn: selectedLeave.requestedOn}}
              </Trans>
            </div>
          )}
          {/* <span
            className={styles.closebtn}
            onClick={() => {
              dispatch(hideLeaveDetails())
            }}
          >
            <Icon size={'xs'} name="close" />
          </span> */}
        </div>

        <hr className={styles.hr} />

        <PopupLeaveInfo leave={selectedLeave} manage={manage} />

        {/*
          NOTE: make change below only if you understand the whole permission concepts in leave management
                otherwise it can be injurious to mental health
                change at your own risk
         */}
        <div className={classNames(styles.footer)}>
          {/* if leave is from pending list & has access to approve/reject
              then show both buttons accordingly otherwise user can always
              cancel the leave
          */}
          {from === LEAVE_BASE_TYPE.PENDING && (
            <>
              {canApprove || canReject ? (
                <div className={styles.btnWrapper}>
                  {canReject && (
                    <Button
                      onClick={onReject}
                      size="medium"
                      type="border"
                      className={styles.rejectbtn}
                    >
                      {t('reject')}
                    </Button>
                  )}
                  {canApprove && (
                    <Button
                      onClick={onApprove}
                      size="medium"
                      type="solid"
                      className={styles.approvebtn}
                    >
                      {t('approve')}
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  {canCancel || canEdit ? (
                    <div className={styles.btnWrapper}>
                      {canEdit && (
                        <Button
                          size="medium"
                          className={styles.editbtn}
                          onClick={onEdit}
                          type="border"
                        >
                          {t('edit')}
                        </Button>
                      )}
                      {canCancel && (
                        <Button
                          size="medium"
                          type="solid"
                          className={styles.cancelbtn}
                          onClick={onCancel}
                        >
                          {manage ? t('cancelLeave') : t('cancelRequest')}
                        </Button>
                      )}
                    </div>
                  ) : (
                    <BottomStatsInfo leave={selectedLeave} />
                  )}
                </>
              )}
            </>
          )}

          {/* from leave from past list, those who can cancel leave show the cancel button
              otherwise status info only
          */}
          {from === LEAVE_BASE_TYPE.PAST && (canCancel || canEdit) && (
            <div className={styles.btnWrapper}>
              {canEdit && (
                <Button
                  size="medium"
                  className={styles.editbtn}
                  onClick={onEdit}
                  type="border"
                >
                  {t('edit')}
                </Button>
              )}
              {canCancel && (
                <Button
                  size="medium"
                  className={styles.cancelbtn}
                  onClick={onCancel}
                >
                  {manage ? t('cancelLeave') : t('cancelRequest')}
                </Button>
              )}
            </div>
          )}

          {from === LEAVE_BASE_TYPE.PAST && !canCancel && !canEdit && (
            <BottomStatsInfo leave={selectedLeave} />
          )}
        </div>
      </div>
    </Modal>
  ) : null
}

export default LeaveDetailsPopup
