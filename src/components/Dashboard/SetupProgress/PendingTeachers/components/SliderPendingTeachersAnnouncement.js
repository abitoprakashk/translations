import classNames from 'classnames'
import React from 'react'
import styles from '../../../../../pages/communication/components/Announcement/components/Message/Message.module.css'
import {announcementCharacterLimit} from '../../../../../pages/communication/constants'
import {useTranslation} from 'react-i18next'
import stylesTitle from '../PendingTeachers.module.css'

const SliderPendingTeachersAnnouncement = () => {
  const {t} = useTranslation()

  return (
    <div
      className={`${styles.pending_teacher_announcement_container} ${styles.background_announcement}`}
    >
      <div className="">
        <div className={stylesTitle.titleSection}>
          <div className={stylesTitle.titleLabel}>
            {t('Title')} <span className={styles.red_text}>*</span>
          </div>
          <div>
            <input
              className={`tm-h6 ${classNames(stylesTitle.titleInput)}`}
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

export default SliderPendingTeachersAnnouncement
