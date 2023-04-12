import classNames from 'classnames'
import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import {events} from '../../../../../../utils/EventsConstants'
import styles from './Title.module.css'
import AnnouncementStyles from '../../Announcement.module.css'
import {announcementCharacterLimit} from '../../../../constants'
import {useTranslation} from 'react-i18next'

export default function Title({data, setData}) {
  const {t} = useTranslation()
  const {eventManager} = useSelector((state) => state)
  const [showTitleCount, setShowTitleCount] = useState(false)

  const handleTitleOnChange = (e) => {
    let {value, maxLength} = e.target
    if (value.length >= maxLength - 50) {
      setShowTitleCount(true)
    } else {
      setShowTitleCount(false)
    }
    if (value.length <= maxLength) {
      setData({...data, title: value})
    }
  }

  return (
    <div className={styles.titleSection}>
      <div className={styles.titleLabel}>
        {t('Title')} <span className="text-red-600">*</span>
      </div>
      <div>
        <input
          className={classNames(styles.titleInput, 'outline-none')}
          type="text"
          // placeholder="Enter the title of the announcement"
          placeholder={t('enterTheTitleOfTheAnnouncement')}
          value={data.title}
          onChange={handleTitleOnChange}
          maxLength={announcementCharacterLimit.TITLE} // 100 limit
          onBlur={() => {
            eventManager.send_event(events.ANNOUNCEMENT_TITLE_FILLED_TFI)
          }}
        />
      </div>
      {showTitleCount && (
        <div className={AnnouncementStyles.messageTextareaCount}>
          <span
            className={
              data.title.length >= announcementCharacterLimit.TITLE
                ? AnnouncementStyles.letterLimit
                : ''
            }
          >
            {data.title.length}
          </span>
          /{announcementCharacterLimit.TITLE}
        </div>
      )}
    </div>
  )
}
