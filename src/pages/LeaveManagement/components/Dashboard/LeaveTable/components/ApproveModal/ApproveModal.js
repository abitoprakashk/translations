import {Button, Icon, Modal} from '@teachmint/common'
import {t} from 'i18next'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {events} from '../../../../../../../utils/EventsConstants'
import {
  approveLeave,
  hideApproveModal,
} from '../../../../../redux/actions/leaveManagement.actions'
import styles from './ApproveModal.module.css'

function ApproveModal() {
  const {showApproveModal, selectedItem} = useSelector(
    (state) => state.leaveManagement.pendingLeaves
  )
  const {eventManager} = useSelector((state) => state)

  const dispatch = useDispatch()

  const onClose = () => {
    dispatch(hideApproveModal())
    eventManager.send_event(events.APPROVE_LEAVE_POPUP_CANCEL_CLICKED_TFI, {
      employee_name: selectedItem.name,
      employee_user_id: selectedItem.id,
      employee_type:
        typeof selectedItem.rollName === 'object'
          ? selectedItem.rollName?.props?.children
          : selectedItem.rollName,
    })
  }
  const onApprove = () => {
    dispatch(approveLeave())
    eventManager.send_event(events.LEAVE_APPROVED_TFI, {
      employee_name: selectedItem.name,
      employee_user_id: selectedItem.id,
      employee_type:
        typeof selectedItem.rollName === 'object'
          ? selectedItem.rollName?.props?.children
          : selectedItem.rollName,
    })
  }
  return (
    <Modal
      show={showApproveModal}
      className={styles.modalWrapper}
      // widthInPercent={60}
    >
      <div className={styles.wrapper}>
        <div className={styles.iconWrapper}>
          <Icon size={'4xl'} name={'checkCircle'} color={'success'} />
        </div>
        <div className={styles.textwrapper}>
          <div className={styles.title}>{t('approveleaverequest')}</div>
          <div className={styles.subtext}>
            {t('thiswillapprovetherequestandleavewillbegranted')}
          </div>
        </div>
        <div className={styles.btnWrapper}>
          <Button
            onClick={onClose}
            size={'medium'}
            type="border"
            className={styles.cancelbtn}
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={onApprove}
            size={'medium'}
            type="primary"
            className={styles.approvebtn}
          >
            {t('approve')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ApproveModal
