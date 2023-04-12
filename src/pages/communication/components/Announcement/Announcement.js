import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {ErrorBoundary} from '@teachmint/common'
import classNames from 'classnames'

import announcementIcon from '../../../../assets/images/icons/announcement-primary.svg'
import SliderScreenHeader from '../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import {events} from '../../../../utils/EventsConstants'

import {ANNOUNCEMENT_FORM_STEPS, announcementType} from '../../constants'
import styles from '../../Communication.module.css'
import {setAnnouncementTypeAction} from './../../redux/actions/commonActions'
import Steps from '../steps/Steps'
import ContentContainer from './components/ContentContainer'
import ButtonPanel from '../ButtonPanel'
import {useTranslation} from 'react-i18next'
import {
  setMessageAction,
  setTitleAction,
  setVoiceAction,
  setVoiceDurationAction,
} from '../../redux/actions/announcementActions'
import {SaveDraftType} from '../../redux/actionTypes'

const Announcement = ({createCommunication}) => {
  const {t} = useTranslation()
  const createAnnouncement = t('createAnnouncement')
  const editAnnouncement = t('editAnnouncement')
  const eventManager = useSelector((state) => state.eventManager)
  const {announcement, common, comm_templates, isButtonEnabled} = useSelector(
    (state) => state.communicationInfo
  )
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [data, setData] = useState({
    title: '',
    message: '',
    voice: null,
    voice_note_duration: 0,
  })
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setAnnouncementTypeAction(announcementType.ANNOUNCEMENT))
  }, [])

  useEffect(() => {
    setData({
      title: announcement.title,
      message: announcement.message,
      voice: announcement.voice,
      voice_note_duration: announcement.voice_note_duration,
    })
  }, [announcement])

  const nextStep = () => {
    if (currentStepIndex === 0) {
      eventManager.send_event(events.ANNOUNCEMENT_MESSAGE_CREATED_TFI, {
        template_type: comm_templates.currentTemplate,
      })
      dispatch(setTitleAction(data.title))
      dispatch(setMessageAction(data.message))
      dispatch(setVoiceAction(data.voice))
      dispatch(setVoiceDurationAction(data.voice_note_duration))
      dispatch({type: SaveDraftType.SET_SAVE_DRAFT, payload: true})
    }
    setCurrentStepIndex(currentStepIndex + 1)
  }

  const disableNextButton = (givenStepIndex = null) => {
    if (!givenStepIndex) givenStepIndex = currentStepIndex
    switch (ANNOUNCEMENT_FORM_STEPS[givenStepIndex]) {
      case ANNOUNCEMENT_FORM_STEPS[0]:
        return !(
          data.title.trim() &&
          (data.voice || data.message.trim()) &&
          isButtonEnabled.isEnabled
        )
      case ANNOUNCEMENT_FORM_STEPS[1]:
        return !(common.segments.length && common.selected_users.length)
      default:
        return true
    }
  }

  const postAnnouncement = async () => {
    createCommunication()
  }

  const handlePreviousButtonClick = () => {
    if (currentStepIndex === 0) return
    setCurrentStepIndex(currentStepIndex - 1)
  }

  return (
    <>
      <ErrorBoundary>
        <SliderScreenHeader
          title={common.editPost ? editAnnouncement : createAnnouncement}
          icon={announcementIcon}
        />
      </ErrorBoundary>
      <div
        className={classNames(
          'px-4',
          'lg:px-10',
          'py-2',
          'lg:py-6',
          styles.announcementSection
        )}
      >
        <div className={classNames(styles.contentStepContainer, 'lg:pt-4')}>
          <ErrorBoundary>
            <Steps
              currentStepIndex={currentStepIndex}
              allSteps={ANNOUNCEMENT_FORM_STEPS}
            />
          </ErrorBoundary>
          <ErrorBoundary>
            <ContentContainer
              step={ANNOUNCEMENT_FORM_STEPS[currentStepIndex]}
              data={data}
              setData={setData}
            />
          </ErrorBoundary>
        </div>
        <ErrorBoundary>
          {!common.isUserFilterVisible && (
            <ButtonPanel
              isNext={currentStepIndex < ANNOUNCEMENT_FORM_STEPS.length - 1}
              nextStep={nextStep}
              postAnnouncement={postAnnouncement}
              isDisable={disableNextButton()}
              handlePreviousButtonClick={handlePreviousButtonClick}
              showPrevious={currentStepIndex > 0}
            />
          )}
        </ErrorBoundary>
      </div>
    </>
  )
}

export default Announcement
