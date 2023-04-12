import styles from './VoiceRecorder.module.css'
import {useEffect, useState, useRef} from 'react'
import {Icon} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import AudioPlayer from './AudioPlayer'
import classNames from 'classnames'
import {Tooltip} from '@teachmint/krayon'
import {useSelector, useDispatch} from 'react-redux'
import {events} from '../../../../../../utils/EventsConstants'
import {setVoiceRecordingAction} from '../../../../redux/actions/announcementActions'
import {showErrorToast} from '../../../../../../redux/actions/commonAction'
import {milisecondsToTime} from '../../../../../../utils/Helpers'

export default function VoiceRecorder({onStop}) {
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [showNew, setShowNew] = useState(true)
  const [label, setLabel] = useState('')
  const [audioUrl, setAudioUrl] = useState(null)
  const [blobArray, setBlobArray] = useState([])
  const [startTime, setStartTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isdeleted, setIsDeleted] = useState(false)
  const [durationId, setDurationId] = useState(null)
  const [isDisabled, setIsDisabled] = useState(false)
  const [tooltipBody, setTooltipBody] = useState('')
  const [voiceSize, setVoiceSize] = useState(0)
  const durationRef = useRef(null)
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const eventManager = useSelector((state) => state.eventManager)
  const {voice, voice_note_duration} = useSelector(
    (state) => state.communicationInfo.announcement
  )

  const initRecorder = async () => {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia
    if (navigator.mediaDevices) {
      return navigator.mediaDevices
        .getUserMedia({audio: true})
        .then((stream) => handlerFunction(stream))
        .catch((error) => {
          throw error
        })
    } else {
      return null
    }
  }

  const handlerFunction = (stream) => {
    const rec = new MediaRecorder(stream)
    rec.start(10)
    setMediaRecorder(rec)
    const tempChunk = []
    rec.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        tempChunk.push(e.data)
      }

      if (rec?.state == 'inactive') {
        if (blobArray === []) {
          setBlobArray(tempChunk)
        } else {
          setBlobArray((prev) => [...prev, ...tempChunk])
          var track = stream.getTracks()[0]
          track.stop()
        }
      }
    }
  }
  useEffect(() => {
    if (blobArray.length !== 0) {
      let blob = new Blob(blobArray, {type: 'audio/mpeg-3'})
      let file = new File([blob], 'voiceNote.mp3')
      let url = URL.createObjectURL(blob)
      setAudioUrl(url)
      setIsSaved(true)
      onStop({file, duration, prevSize: voiceSize})
      setVoiceSize(file.size)
    }
  }, [blobArray])

  useEffect(() => {
    if (voice) {
      if (typeof voice === 'string') {
        setAudioUrl(voice)
      } else {
        setAudioUrl(URL.createObjectURL(voice))
      }

      setIsDisabled(true)
      setDuration(voice_note_duration)
      setIsRecording(false)
      setLabel('Continue')
      setShowNew(false)
      setIsSaved(true)
      setTooltipBody('Recording not allowed. Delete to record new voicenote')
    }
  }, [voice])

  useEffect(() => {
    if (isRecording) {
      if (durationId) return
      var id = setInterval(
        () => {
          const curr = new Date().getTime()
          if (curr - startTime + duration > 5 * 60 * 1000) {
            handlePause()
            setIsDisabled(true)
            setTooltipBody('Voice recording duration limit reached')
          } else {
            durationRef.current.textContent = `${milisecondsToTime(
              curr - startTime + duration
            )} / 5:00`
          }
        },

        100
      )
      setDurationId(id)
    } else {
      clearInterval(durationId)
      setDurationId(null)
    }
  }, [isRecording, durationId])

  const handleStart = async () => {
    if (isDisabled) {
      return null
    }
    if (label === '' && !isdeleted) {
      eventManager.send_event(events.VOICE_NOTE_RECORDING_STARTED_TFI, {
        post_type: 'announcement',
        recording_type: 'new',
      })
    }
    if (label === 'Continue') {
      eventManager.send_event(events.VOICE_NOTE_RECORDING_STARTED_TFI, {
        post_type: 'announcement',
        recording_type: 'append',
      })
    }
    if (isdeleted) {
      eventManager.send_event(events.VOICE_NOTE_RECORDING_RESTARTED_TFI, {
        post_type: 'announcement',
      })
    }
    try {
      await initRecorder()
      setStartTime(new Date().getTime())
      setIsRecording(true)
      setLabel('Pause')
      setShowNew(false)
      setAudioUrl(null)
      setIsSaved(false)
      setIsDeleted(false)
      dispatch(setVoiceRecordingAction(false))
    } catch (error) {
      dispatch(
        showErrorToast(`Unable to detect microphone. Please check your system`)
      )
    }
  }

  const handlePause = () => {
    eventManager.send_event(events.VOICE_NOTE_RECORDING_PAUSE_TFI, {
      post_type: 'announcement',
    })
    const current = new Date().getTime()
    setDuration((prev) => prev + current - startTime)
    mediaRecorder.stop()
    setIsRecording(false)
    setLabel('Continue')
    setTooltipBody('Recording is saved. Click here to continue')
    dispatch(setVoiceRecordingAction(true))
  }

  const handleDelete = () => {
    eventManager.send_event(events.VOICE_NOTE_RECORDING_DELETED_TFI, {
      post_type: 'announcement',
    })
    setIsDisabled(false)
    setStartTime(0)
    setDuration(0)
    setDurationId(null)
    setBlobArray([])
    setAudioUrl(null)
    setLabel('')
    setIsRecording(false)
    setIsSaved(false)
    setIsDeleted(true)
    onStop({file: null, duration: 0, prevSize: voiceSize})
    setShowNew(true)
    dispatch(setVoiceRecordingAction(true))
  }
  const onVoicePlayback = () => {
    eventManager.send_event(events.VOICE_NOTE_RECORDING_PLAYED_TFI, {
      post_type: 'announcement',
    })
  }
  const onVoicePlaybackPause = () => {
    eventManager.send_event(events.VOICE_NOTE_PLAYING_PAUSED_TFI, {
      post_type: 'announcement',
    })
  }
  return (
    <div className={styles.wrapper}>
      <div
        className={classNames(
          styles.leftArea,
          {[styles.pulse]: isRecording},
          {[styles.disabled]: isDisabled}
        )}
        onClick={isRecording ? handlePause : handleStart}
        data-for="recordingInfo"
        data-tip
      >
        <Icon
          name={isRecording ? 'pause1' : 'micOn'}
          type="primary"
          size="xx_s"
          className={styles.icon}
        />
        {label}
      </div>
      {isSaved && (
        <Tooltip
          toolTipId="recordingInfo"
          toolTipBody={tooltipBody}
          classNames={{toolTipBody: styles.toolTipBody}}
        />
      )}
      <div className={styles.playbackArea}>
        {audioUrl ? (
          <AudioPlayer
            audioSource={audioUrl}
            duration={duration}
            onPlay={onVoicePlayback}
            onPause={onVoicePlaybackPause}
          />
        ) : isRecording ? (
          `${t('RECORD_START')}`
        ) : (
          <p>{t('RECORDER_PLACEHOLDER')}</p>
        )}
      </div>
      {isRecording && (
        <div ref={durationRef} className={styles.durationDisplay}></div>
      )}
      {isSaved && (
        <div className={styles.rightArea} onClick={handleDelete}>
          <Icon
            name="delete"
            type="error"
            size="xx_s"
            data-tip
            data-for="deleteIcon"
          />
          <Tooltip
            toolTipId="deleteIcon"
            toolTipBody="Remove voice note"
            classNames={{toolTipBody: styles.toolTipBody}}
          />
        </div>
      )}
      {showNew && <div className={styles.newLabel}>{t('NEW_LABEL')}</div>}
    </div>
  )
}
