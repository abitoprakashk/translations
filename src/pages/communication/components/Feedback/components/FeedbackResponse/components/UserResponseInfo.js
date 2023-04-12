import classNames from 'classnames'
import {DateTime} from 'luxon'
import React from 'react'
import {useTranslation} from 'react-i18next'
import styles from '../FeedbackResponse.module.css'

export default function UserResponseInfo({isAnonymous, userResponse}) {
  const {t} = useTranslation()

  const createdTime = (timeStamp) => {
    let dateTimestamp = DateTime.fromSeconds(timeStamp)
    let dateTime = dateTimestamp.toRelativeCalendar()
    if (dateTime === 'today' || dateTime === 'yesterday') {
      dateTime = `${dateTime}, ${dateTimestamp.toLocaleString(
        DateTime.TIME_SIMPLE
      )}`
    } else {
      dateTime = dateTimestamp.toFormat('ff')
    }
    return dateTime
  }

  return (
    <div className={classNames(styles.feedbackResponseUserSec, 'flex', 'py-3')}>
      <div>
        <img
          className={styles.feedbackResponseUserImage}
          src="https://storage.googleapis.com/tm-assets/icons/white/profile-white.svg"
          alt=""
        />
      </div>
      <div className={styles.feedbackResponseUserInfoSection}>
        <div>
          <div className={styles.feedbackResponseUserName}>
            {!isAnonymous
              ? `${userResponse?.institute_member?.name}`
              : t('anonymous')}
          </div>
          <div className={styles.feedbackResponseUserProfession}>
            {!isAnonymous &&
              userResponse?.institute_member?.type === 1 &&
              t('admin')}
            {!isAnonymous &&
              userResponse?.institute_member?.type === 2 &&
              t('teacher')}
            {!isAnonymous &&
              userResponse?.institute_member?.type === 3 &&
              t('superAdmin')}
            {!isAnonymous &&
              userResponse?.institute_member?.type === 4 &&
              t('student')}
          </div>
        </div>
        <div className={classNames('mt-2', styles.feedbackResponseOfUser)}>
          {userResponse.response &&
            userResponse.response.map((response, idx) => {
              return <div key={`${idx}-${response}`}>{response}</div>
            })}
        </div>
        <div className={classNames('mt-2', styles.feedbackResponseDatetime)}>
          {createdTime(userResponse.submitted_on)}
        </div>
      </div>
    </div>
  )
}
