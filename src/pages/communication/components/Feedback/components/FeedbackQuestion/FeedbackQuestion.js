import React, {useState} from 'react'
import classNames from 'classnames'
import {useSelector} from 'react-redux'
import communicationStyles from './../../../../Communication.module.css'
import styles from './../../Feedback.module.css'

import AddAttachment from './../../../AddAttachment/AddAttachment'
import {feedbackCharacterLimit} from '../../../../constants'
import {events} from '../../../../../../utils/EventsConstants'
import {useTranslation} from 'react-i18next'

export default function FeedbackQuestion({data, setData}) {
  const {t} = useTranslation()
  const tQuestion = t('questionLabel')
  const typeQuestionHere = t('typeQuestionHere')

  const eventManager = useSelector((state) => state.eventManager)
  const [showQuestionCount, setShowQuestionCount] = useState(false)

  const maxLengthCheck = (e) => {
    let {value, maxLength} = e.target
    if (value.length >= maxLength - 50) {
      setShowQuestionCount(true)
    } else {
      setShowQuestionCount(false)
    }
    if (value.length <= maxLength) {
      setData({message: value})
    }
  }

  const handleOnBlurQiestion = (e) => {
    eventManager.send_event(events.POST_QUESTION_FILLED_TFI, {
      post_type: 'feedback',
      letters_count: e.target.value.length,
    })
  }

  return (
    <>
      {/* <div
        className={classNames(styles.title, communicationStyles.contentTitle)}
      >
        Feedback Question
      </div>

      <span className={classNames(styles.subText, styles.lightFont)}>
        (Based on your question users will leave a word remark)
      </span> */}
      <div className={styles.contentSubTitle}>{tQuestion}</div>
      <div className={styles.messageTextareaSection}>
        <textarea
          className={classNames(styles.messageTextarea, 'tm-bdr-gy-3')}
          placeholder={typeQuestionHere}
          rows="5"
          value={data.message}
          onChange={maxLengthCheck}
          maxLength={feedbackCharacterLimit.QUESTION}
          onBlur={handleOnBlurQiestion}
        ></textarea>
        {showQuestionCount && (
          <div className={styles.messageTextareaCount}>
            <span
              className={classNames({
                [communicationStyles.letterLimit]:
                  data.message.length >=
                  parseInt(feedbackCharacterLimit.QUESTION) - 1,
              })}
            >
              {data.message.length}
            </span>
            /{feedbackCharacterLimit.QUESTION}
          </div>
        )}
        <AddAttachment />
      </div>
    </>
  )
}
