import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import styles from './Message.module.css'

import AddAttachment from '../../../AddAttachment/AddAttachment'
import Title from '../Title/Title'
import {events} from '../../../../../../utils/EventsConstants'
import {useTranslation} from 'react-i18next'
import VoiceRecorder from '../VoiceRecorder/VoiceRecorder'
import {isAndroidWebview} from '@teachmint/common'
import {isIOSWebview} from '@teachmint/common'
import {setRequestSize} from '../../../../redux/actions/commonActions'
import {MAX_REQUEST_SIZE} from '../../../../constants.js'
export default function Message({data, setData}) {
  const {t} = useTranslation()
  const {eventManager} = useSelector((state) => state)
  const {request_file_size} = useSelector(
    (state) => state.communicationInfo.common
  )
  const dispatch = useDispatch()

  const maxLengthCheck = (e) => {
    let {value} = e.target
    setData({...data, message: value})
  }
  const onStop = ({file, duration, prevSize}) => {
    if (file.size + request_file_size > MAX_REQUEST_SIZE) {
      alert('file too big')
    } else {
      setData({...data, voice: file, voice_note_duration: duration})
      dispatch(
        setRequestSize(file ? file.size : 0 + request_file_size - prevSize)
      )
    }
  }
  return (
    <>
      <Title data={data} setData={setData} />
      <div className={styles.messageLabel}>
        {t('sMessage')} <span className="text-red-600">*</span>
      </div>
      <div className={styles.messageTextareaSection}>
        <div className={styles.messageTextarea}>
          <textarea
            className={styles.messageBody}
            placeholder={t('enterMoreDetailsAboutTheAnnouncement')}
            rows="5"
            value={data.message}
            onChange={maxLengthCheck}
            onBlur={() => {
              eventManager.send_event(events.ANNOUNCEMENT_TEXT_FILLED_TFI, {
                letters_count: data.message.length,
              })
            }}
          ></textarea>
          {!isAndroidWebview() && !isIOSWebview() && (
            <div className={styles.voiceRecorder}>
              <VoiceRecorder onStop={onStop} />
            </div>
          )}
        </div>
        <AddAttachment />
      </div>
    </>
  )
}
