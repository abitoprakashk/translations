import classNames from 'classnames'
import {t} from 'i18next'
import React from 'react'
import {announcementCharacterLimit} from '../../../../../pages/communication/constants'
import styles from '../PendingAdmins.module.css'

const SliderPendingAdminsAnnouncement = () => {
  return (
    <div>
      <div className="">
        <div className={styles.titleSection}>
          <div className={styles.titleLabel}>
            {t('Title')} <span className={styles.red_text}>*</span>
          </div>
          <div>
            <input
              className={`tm-h6 ${classNames(styles.titleInput)}`}
              type="text"
              placeholder={`${t('enterTheTitleOfTheAnnouncement')}`}
              value={`${t('pendingTeachersAnnouncementTitle')}`}
              maxLength={announcementCharacterLimit.TITLE} // 100 limit
            />
          </div>
        </div>
        <div className={styles.messageLabel}>
          {t('sMessage')} <span className={styles.red_text}>*</span>
        </div>
        <div className={styles.messageTextareaSection}>
          <textarea
            className={`tm-h6 ${styles.messageTextarea}`}
            placeholder={t('enterMoreDetailsAboutTheAnnouncement')}
            rows="5"
            maxLength={announcementCharacterLimit.MESSAGE}
            value={t('pendingTeachersAnnouncementDescription')}
          ></textarea>
        </div>
      </div>
    </div>
  )
}

export default SliderPendingAdminsAnnouncement
