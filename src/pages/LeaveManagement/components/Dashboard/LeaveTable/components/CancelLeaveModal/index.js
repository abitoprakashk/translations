import {Button, Icon, Modal} from '@teachmint/common'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {
  cancelLeave,
  cancelLeaveByStaff,
  hideCancelModal,
} from '../../../../../redux/actions/leaveManagement.actions'
import styles from './styles.module.scss'

function CancelLeaveModal() {
  const {showCancelModal, selectedItem} = useSelector(
    (state) => state.leaveManagement.pendingLeaves
  )

  const dispatch = useDispatch()
  const {t} = useTranslation()

  const onClose = () => {
    dispatch(hideCancelModal())
  }

  const onCancel = () => {
    dispatch(
      selectedItem?.manage
        ? cancelLeave(selectedItem)
        : cancelLeaveByStaff(selectedItem)
    )
  }

  return (
    <Modal
      show={showCancelModal}
      className={styles.modalWrapper}
      // widthInPercent={60}
    >
      <div className={styles.wrapper}>
        <div className={styles.iconWrapper}>
          <div className={styles.removeicon}>
            <Icon size="xxl" name="remove" color="inverted" />
          </div>
        </div>
        <div className={styles.textwrapper}>
          <div className={styles.title}>{t('cancelLeaveRequest')}</div>
          <div className={styles.subtext}>
            {selectedItem?.manage
              ? t('confirmingWillCancelLeaveRequestAdmin')
              : t('confirmingWillCancelLeaveRequest')}
          </div>
        </div>
        <div className={styles.btnWrapper}>
          <Button
            onClick={onClose}
            size="medium"
            type="border"
            className={styles.cancelbtn}
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={onCancel}
            size="medium"
            type="primary"
            className={styles.approvebtn}
          >
            {t('confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default CancelLeaveModal
