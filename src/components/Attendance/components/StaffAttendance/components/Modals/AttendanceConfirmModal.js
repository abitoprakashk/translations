import React from 'react'
import {
  BUTTON_CONSTANTS,
  Heading,
  HEADING_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
  Para,
} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'

import styles from './AttendanceConfirmModal.module.css'
import {ATTENDANCE_VIEW_TYPE} from '../../StaffAttendanceConstants'
import {IS_MOBILE} from '../../../../../../constants'

const AttendanceConfirmModal = React.memo(
  ({isOpen, onClose, onConfirm, stats = {}}) => {
    const {t} = useTranslation()
    const {PRESENT, ABSENT, NOT_MARKED, TOTAL_STAFF} = ATTENDANCE_VIEW_TYPE
    return (
      <Modal
        isOpen={isOpen}
        actionButtons={[
          {
            body: t('cancel'),
            onClick: onClose,
            type: BUTTON_CONSTANTS.TYPE.OUTLINE,
            width: IS_MOBILE
              ? BUTTON_CONSTANTS.WIDTH.FULL
              : BUTTON_CONSTANTS.WIDTH.FIT,
          },
          {
            body: t('confirm'),
            onClick: onConfirm,
            width: IS_MOBILE
              ? BUTTON_CONSTANTS.WIDTH.FULL
              : BUTTON_CONSTANTS.WIDTH.FIT,
          },
        ]}
        header={t('confirmAttendance')}
        onClose={onClose}
        size={MODAL_CONSTANTS.SIZE.SMALL}
      >
        <div className={styles.wrapper}>
          <div className={styles.row}>
            <div className={styles.rowItem}>
              <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
                {t('total')}
              </Heading>
            </div>
            <div className={styles.rowItem}>
              {' '}
              <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}>
                {stats[TOTAL_STAFF] || 0}
              </Heading>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.rowItem}>
              <Heading
                textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
                type={HEADING_CONSTANTS.TYPE.TEXT_SECONDARY}
              >
                {t('notMarked')}
              </Heading>
            </div>
            <div className={styles.rowItem}>
              <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}>
                {stats[NOT_MARKED] || 0}
              </Heading>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.rowItem}>
              <Heading
                textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
                type={HEADING_CONSTANTS.TYPE.SUCCESS}
              >
                {t('present')}
              </Heading>
            </div>
            <div className={styles.rowItem}>
              <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}>
                {stats[PRESENT] || 0}
              </Heading>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.rowItem}>
              <Heading
                textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
                type={HEADING_CONSTANTS.TYPE.ERROR}
              >
                {t('absent')}
              </Heading>
            </div>
            <div className={styles.rowItem}>
              <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}>
                {stats[ABSENT] || 0}
              </Heading>
            </div>
          </div>
          <Para>{t('canUpdateAttendanceAtAnyTime')}</Para>
        </div>
      </Modal>
    )
  }
)

AttendanceConfirmModal.displayName = 'AttendanceConfirmModal'

export default AttendanceConfirmModal
