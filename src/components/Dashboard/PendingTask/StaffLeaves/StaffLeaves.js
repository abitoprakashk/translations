import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import classNames from 'classnames'
import {t} from 'i18next'
import styles from './StaffLeaves.module.css'
import StaffLeavsCard from './StaffLeavsCard'
import {
  approveLeaveSuccess,
  getPendingLeaves,
  rejectLeaveSuccess,
} from '../../../../pages/LeaveManagement/redux/actions/leaveManagement.actions'
import {LEAVE_BASE_TYPE} from '../../../../pages/LeaveManagement/LeaveManagement.constant'
import {events} from '../../../../utils/EventsConstants'
import {
  showErrorToast,
  showFeatureLockAction,
  showSuccessToast,
} from '../../../../redux/actions/commonAction'
import {updateLeaveStatusApi} from '../../../../pages/LeaveManagement/apiService'
import {checkSubscriptionType} from '../../../../utils/Helpers'

const StaffLeaves = ({pendingLeavesLength, pendingTasksContainerRef}) => {
  const [buttonText, setButtonText] = useState(false)
  const [pendingStaffLeaves, setPendingStaffLeaves] = useState([])

  const {data: pendingLeavesData} = useSelector(
    (state) => state.leaveManagement.pendingLeaves
  )
  const eventManager = useSelector((state) => state.eventManager)
  const {instituteInfo} = useSelector((state) => state)
  const isPremium = checkSubscriptionType(instituteInfo)
  const dispatch = useDispatch()

  const handleLeaveApproved = ({role_name, name, _id}) => {
    eventManager.send_event(events.APPROVE_LEAVE_CLICKED_TFI, {
      employee_name: name,
      employee_user_id: _id,
      employee_type: role_name,
      screen_name: 'dashboard',
    })
    updateLeaveStatusApi({
      status: LEAVE_BASE_TYPE.APPROVED,
      request_id: _id,
    })
      .then((res) => {
        res.status === true &&
          dispatch(showSuccessToast(t('leaveApprovedSuccessMessage')))
        dispatch(approveLeaveSuccess([res.obj]))
        dispatch(
          getPendingLeaves({
            count: 100,
          })
        )
        eventManager.send_event(events.LEAVE_APPROVED_TFI, {
          employee_name: name,
          employee_user_id: _id,
          employee_type: role_name,
          screen_name: 'dashboard',
        })
      })
      .catch(() => {
        dispatch(showErrorToast(t('somethingWentWrong')))
      })
  }

  const handleLeaveCancelled = ({role_name, name, _id}) => {
    eventManager.send_event(events.REJECT_LEAVE_CLICKED_TFI, {
      employee_name: name,
      employee_user_id: _id,
      employee_type: role_name,
      screen_name: 'dashboard',
    })
    updateLeaveStatusApi({
      status: LEAVE_BASE_TYPE.REJECTED,
      request_id: _id,
    })
      .then((res) => {
        res.status &&
          dispatch(showSuccessToast(t('leaveRejectedSuccessMessage')))
        dispatch(rejectLeaveSuccess([res.obj]))
        dispatch(
          getPendingLeaves({
            count: 100,
          })
        )
        eventManager.send_event(events.LEAVE_REJECTED_TFI, {
          employee_name: name,
          employee_user_id: _id,
          employee_type: role_name,
          screen_name: 'dashboard',
        })
      })
      .catch(() => {
        dispatch(showErrorToast(t('somethingWentWrong')))
      })
  }

  useEffect(() => {
    setPendingStaffLeaves(pendingLeavesData)
    eventManager.send_event(events.LEAVE_CARD_LOADED_TFI, {
      screen_name: 'dashboard',
    })
  }, [pendingLeavesData])

  return (
    <div className={styles.staffLeavesContainer}>
      <div className={styles.staffLeavesContainerTitle}>{`${t(
        'staffLeaves'
      )} (${pendingLeavesLength})`}</div>
      <div className={styles.staffLeavesContainerCards}>
        <div
          className={classNames(
            !buttonText && styles.staffLeavesCardsContainerWrapper,
            buttonText === 'open' && styles.staffLeavesCardsContainerMin
          )}
          onClick={() => {
            if (isPremium) {
              setButtonText('hide')
            } else {
              dispatch(showFeatureLockAction(true))
            }
          }}
          id="staffLeavesCardsContainer"
        >
          {pendingStaffLeaves?.map((pendingStaffLeave, index) => (
            <StaffLeavsCard
              key={index}
              pendingStaffLeave={pendingStaffLeave}
              handleLeaveApproved={handleLeaveApproved}
              handleLeaveCancelled={handleLeaveCancelled}
              buttonText={buttonText}
            />
          ))}
          {pendingLeavesData?.length > 1 &&
            (!buttonText || buttonText === 'open') && (
              <div className={styles.staffLeavesContainerCardsAfter}></div>
            )}
        </div>
        {pendingStaffLeaves?.length > 1 && buttonText === 'hide' && (
          <div
            className={styles.staffLeavesCardsContainerButton}
            onClick={() => {
              pendingTasksContainerRef.current?.scrollIntoView({
                behaviour: 'smooth',
              })
              setButtonText('open')
            }}
          >
            {buttonText === 'hide' && t('hide')}
            <Icon
              name="upArrow"
              size={ICON_CONSTANTS.SIZES.XXX_SMALL}
              type={ICON_CONSTANTS.TYPES.INVERTED}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default StaffLeaves
