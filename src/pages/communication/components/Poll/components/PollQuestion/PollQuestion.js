import React, {useState} from 'react'
import classNames from 'classnames'
import {useSelector} from 'react-redux'

import AddAttachment from '../../../AddAttachment/AddAttachment'
import CommunicationStyles from './../../../../Communication.module.css'
import MessageStyles from './../../../Announcement/components/Message/Message.module.css'
import styles from './PollQuestion.module.css'
import {pollCharacterLimit} from '../../../../constants'
import {events} from '../../../../../../utils/EventsConstants'
import {useTranslation} from 'react-i18next'

export default function PollQuestion({data, setData}) {
  const {t} = useTranslation()

  const eventManager = useSelector((state) => state.eventManager)
  const {question_options, message} = data

  const [showOptionCount, setshowOptionCount] = useState({
    option1: false,
    option2: false,
  })

  const [showQuestionCount, setShowQuestionCount] = useState(false)

  const rearrangeOptions = (newQuestionOptions) => {
    let newOptions = {}
    Object.keys(newQuestionOptions).map((option, idx) => {
      return (newOptions[`option${idx + 1}`] = question_options[option])
    })

    return newOptions
  }

  const handleAddNewOption = () => {
    let newOptions = {}
    let newOptionKey = ''
    Object.keys(question_options).map((option, idx) => {
      newOptionKey = `option${idx + 2}`
      return (newOptions[`option${idx + 1}`] = question_options[option])
    })

    eventManager.send_event(events.ADD_NEW_POLL_CHOICE_CLICKED_TFI, {
      choice_no: newOptionKey,
    })

    // dispatch(setQuestionOptionsAction({...newOptions, [newOptionKey]: ''}))
    setData({...data, question_options: {...newOptions, [newOptionKey]: ''}})
  }

  const handleChangeVal = (val, key) => {
    if (val.length >= pollCharacterLimit.option - 50) {
      setshowOptionCount({...showOptionCount, [key]: true})
    } else {
      setshowOptionCount({...showOptionCount, [key]: false})
    }

    if (val.length <= pollCharacterLimit.option) {
      const items = {...question_options}
      items[key] = val
      // dispatch(setQuestionOptionsAction(items))
      setData({...data, question_options: items})
    }
  }

  const handleRemoveOption = (optionKey) => {
    const newOptions = {...question_options}
    delete newOptions[optionKey]
    let arrangedOptions = rearrangeOptions(newOptions)
    // dispatch(setQuestionOptionsAction(arrangedOptions))
    setData({...data, question_options: arrangedOptions})

    eventManager.send_event(events.REMOVE_POLL_CHOICE_CLICKED_TFI, {
      choice_no: optionKey,
    })
  }

  const handlePollQuestionChange = (e) => {
    let {value, maxLength} = e.target
    if (value.length >= maxLength - 50) {
      setShowQuestionCount(true)
    } else {
      setShowQuestionCount(false)
    }
    if (value.length <= maxLength) {
      // dispatch(setQuestionAction(value))
      setData({...data, message: value})
    }
  }

  const handleOnBlurQuestion = (e) => {
    eventManager.send_event(events.POST_QUESTION_FILLED_TFI, {
      post_type: 'poll',
      letters_count: e.target.value.length,
    })
  }

  const handleOnBlurOption = (option) => {
    eventManager.send_event(events.POLL_CHOICE_FILLED_TFI, {
      choice_no: option,
    })
  }

  const renderOptions = () => {
    return Object.keys(question_options).map((optionKey, idx) => (
      <div key={idx} className={classNames('mb-3', 'py-2')}>
        <div className={classNames('flex', 'justify-between')}>
          <div className={styles.pollQuestionOptionLabel}>
            {t('optionLabel')} {idx + 1}
            <span className={styles.pollQuestionLabelStart}>*</span>
          </div>
          {Object.keys(question_options).length > 2 && idx + 1 > 2 && (
            <span
              className={classNames(
                CommunicationStyles.cursorPointer,
                styles.pollQuestionLabelStart
              )}
              onClick={() => handleRemoveOption(optionKey)}
            >
              {t('remove')}
            </span>
          )}
        </div>
        <div>
          <input
            className={classNames(styles.pollQuestionInput, 'outline-none')}
            placeholder={t('enterOptionHere')}
            type="text"
            name={`option${idx + 1}`}
            value={question_options[optionKey]}
            onChange={(e) =>
              handleChangeVal(e.target.value, `option${idx + 1}`)
            }
            maxLength={pollCharacterLimit.option}
            onBlur={() => handleOnBlurOption(`option${idx + 1}`)}
          />
          {showOptionCount[`option${idx + 1}`] && (
            <div className={styles.pollMessageTextareaCount}>
              <span
                className={classNames({
                  [styles.letterLimit]:
                    question_options[optionKey].length >=
                    pollCharacterLimit.option,
                })}
              >
                {question_options[optionKey].length}
              </span>
              /{pollCharacterLimit.option}
            </div>
          )}
        </div>
      </div>
    ))
  }

  return (
    <div className={classNames(styles.pollQuestionSec, 'px-2')}>
      <div className="mb-3">
        <div className={classNames(styles.pollQuestionHeading, 'my-2')}>
          {t('questionLabel')}
          <span className={styles.pollQuestionLabelStart}>*</span>
        </div>
        <div className={styles.pollTextareaSection}>
          <textarea
            className={MessageStyles.pollQuestionTextarea}
            placeholder={t('WhatIsTheBestDaySuitableForMeeting') + '?'}
            rows="5"
            value={message}
            onChange={handlePollQuestionChange}
            maxLength={pollCharacterLimit.question}
            onBlur={handleOnBlurQuestion}
          ></textarea>
          {showQuestionCount && (
            <div className={styles.pollMessageTextareaCount}>
              <span
                className={classNames({
                  [styles.letterLimit]:
                    message && message.length >= pollCharacterLimit.question,
                })}
              >
                {message.length}
              </span>
              /{pollCharacterLimit.question}
            </div>
          )}
          <AddAttachment />
        </div>
      </div>
      <hr />
      <div className={styles.pollOptionsSec}>
        <div className={styles.pollOptionSelectHeading}>
          {t('enterChoicesBelow')}
        </div>
        <div className={classNames(styles.pollOptionsMap, 'px-3')}>
          {renderOptions()}
          <div className={styles.pollOptionsAddMoreBtn}>
            <span
              className={CommunicationStyles.cursorPointer}
              onClick={handleAddNewOption}
            >
              {t('addAnOption')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
