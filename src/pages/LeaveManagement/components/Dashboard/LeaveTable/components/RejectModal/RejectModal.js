import {Button, Icon, Modal} from '@teachmint/common'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {events} from '../../../../../../../utils/EventsConstants'
import {
  hideRejectModal,
  rejectLeave,
} from '../../../../../redux/actions/leaveManagement.actions'
import styles from './RejectModal.module.css'
function RejectModal() {
  const {showRejectModal, selectedItem} = useSelector(
    (state) => state.leaveManagement.pendingLeaves
  )
  const {eventManager} = useSelector((state) => state)
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const onClose = () => {
    dispatch(hideRejectModal())
    eventManager.send_event(events.REJECT_LEAVE_POPUP_CANCEL_CLICKED_TFI, {
      employee_name: selectedItem.name,
      employee_user_id: selectedItem.id,
      employee_type:
        typeof selectedItem.rollName === 'object'
          ? selectedItem.rollName?.props?.children
          : selectedItem.rollName,
    })
  }
  const onReject = () => {
    dispatch(rejectLeave())
    eventManager.send_event(events.LEAVE_REJECTED_TFI, {
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
      show={showRejectModal}
      className={styles.modalWrapper}
      // widthInPercent={60}
    >
      <div className={styles.wrapper}>
        <div className={styles.iconWrapper}>
          <div className={styles.removeicon}>
            <Icon size={'xxl'} name={'remove'} color={'inverted'} />
          </div>
        </div>
        <div className={styles.textwrapper}>
          <div className={styles.title}>{t('rejectleaverequest')}</div>
          <div className={styles.subtext}>
            {t('thiswillcanceltherequestandleavewillnotbegranted')}
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
            onClick={onReject}
            size={'medium'}
            type="primary"
            className={styles.approvebtn}
          >
            {t('reject')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default RejectModal
