import React, {useEffect, useState} from 'react'
import classNames from 'classnames'
import {useSelector, useDispatch} from 'react-redux'
import {ErrorBoundary} from '@teachmint/common'
import communicationStyles from './../../Communication.module.css'
import {events} from '../../../../utils/EventsConstants'

import SliderScreenHeader from '../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import Steps from '../steps/Steps'
import ContentContainer from './components/ContentContainer'
import ButtonPanel from '../ButtonPanel'

import announcementIcon from '../../../../assets/images/icons/announcement-primary.svg'
import {FEEDBACK_FORM_STEPS, announcementType, POST_TYPE} from '../../constants'
import {setAnnouncementTypeAction} from './../../redux/actions/commonActions'
import {setQuestionAction} from '../../redux/actions/feedbackActions'
import {
  postDurationSelectedTfi,
  userSegmentSelectedTfi,
} from '../../commonFunctions'
import {useTranslation} from 'react-i18next'
import {SaveDraftType} from '../../redux/actionTypes'

const Feedback = ({createCommunication}) => {
  const {t} = useTranslation()
  const createFeedback = t('createFeedback')

  const eventManager = useSelector((state) => state.eventManager)

  const {feedback, common} = useSelector((state) => state.communicationInfo)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [data, setData] = useState({message: ''})

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setAnnouncementTypeAction(announcementType.FEEDBACK))
  }, [])

  useEffect(() => {
    setData({message: feedback.message})
  }, [feedback])

  const nextStep = () => {
    dispatch({type: SaveDraftType.SET_SAVE_DRAFT, payload: true})
    buttonPanelClickEvent()
    setCurrentStepIndex(currentStepIndex + 1)
  }

  const buttonPanelClickEvent = () => {
    if (currentStepIndex === 0) {
      eventManager.send_event(events.FEEDBACK_QUESTION_CREATED_TFI, {
        letter_count: data.message.length,
        post_type: POST_TYPE.feedback,
      })
      dispatch(setQuestionAction(data.message))
    } else if (currentStepIndex === 1) {
      postDurationSelectedTfi({
        eventManager,
        events,
        post_type: POST_TYPE.feedback,
      })
    } else if (currentStepIndex === 2) {
      userSegmentSelectedTfi({
        eventManager,
        events,
        payload: {
          post_type: POST_TYPE.poll,
          post_title: data.message,
          selected: common.total_no_of_users,
          user_segments: common.user_filter_tags.length
            ? common.user_filter_tags.map((tag) => tag.name)
            : common.segments,
        },
      })
    }
  }

  const handlePreviousButtonClick = () => {
    if (currentStepIndex === 0) return
    setCurrentStepIndex(currentStepIndex - 1)
  }

  const disableNextButton = () => {
    switch (FEEDBACK_FORM_STEPS[currentStepIndex]) {
      case FEEDBACK_FORM_STEPS[0]:
        return data.message.trim().length > 0 ? false : true
      case FEEDBACK_FORM_STEPS[1]:
        return common.duration <= 0 || common.duration > 31
      case FEEDBACK_FORM_STEPS[2]:
        return !(common.segments.length && common.selected_users.length)
      case FEEDBACK_FORM_STEPS[3]:
        return false
    }
  }

  const postAnnouncement = async () => {
    createCommunication()
  }

  return (
    <>
      <ErrorBoundary>
        <SliderScreenHeader title={createFeedback} icon={announcementIcon} />
      </ErrorBoundary>
      <div
        className={classNames(
          'px-4',
          'lg:px-10',
          'py-2',
          'lg:py-6',
          communicationStyles.announcementSection
        )}
      >
        {/* <div className={styles.subText}>{FEEDBACK_SUBTEXT}</div> */}
        <div
          className={classNames(
            communicationStyles.contentStepContainer,
            'lg:pt-4'
          )}
        >
          <ErrorBoundary>
            <Steps
              currentStepIndex={currentStepIndex}
              allSteps={FEEDBACK_FORM_STEPS}
            />
          </ErrorBoundary>
          <ErrorBoundary>
            <ContentContainer
              step={FEEDBACK_FORM_STEPS[currentStepIndex]}
              data={data}
              setData={setData}
            />
          </ErrorBoundary>
        </div>
        <ErrorBoundary>
          {!common.isUserFilterVisible && (
            <ButtonPanel
              isNext={currentStepIndex < FEEDBACK_FORM_STEPS.length - 1}
              nextStep={nextStep}
              postAnnouncement={postAnnouncement}
              isDisable={disableNextButton()}
              handlePreviousButtonClick={handlePreviousButtonClick}
              showPrevious={currentStepIndex !== 0}
            />
          )}
        </ErrorBoundary>
      </div>
    </>
  )
}

export default Feedback
