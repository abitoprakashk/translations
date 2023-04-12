import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {ErrorBoundary} from '@teachmint/common'
import classNames from 'classnames'

import announcementIcon from '../../../../assets/images/icons/announcement-primary.svg'
import SliderScreenHeader from '../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import {events} from '../../../../utils/EventsConstants'

import {POLL_FORM_STEPS, announcementType, POST_TYPE} from '../../constants'
import communicationStyles from '../../Communication.module.css'
import {setAnnouncementTypeAction} from './../../redux/actions/commonActions'
import Steps from '../steps/Steps'
import ButtonPanel from '../ButtonPanel'
import ContentContainer from './components/ContentContainer'
import {
  postDurationSelectedTfi,
  userSegmentSelectedTfi,
} from '../../commonFunctions'
import {
  setQuestionAction,
  setQuestionOptionsAction,
} from './../../redux/actions/pollActions'
import {useTranslation} from 'react-i18next'
import {SaveDraftType} from '../../redux/actionTypes'

const Poll = ({createCommunication}) => {
  const {t} = useTranslation()

  const {eventManager} = useSelector((state) => state)
  const {poll, common} = useSelector((state) => state.communicationInfo)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [data, setData] = useState({
    message: '',
    question_options: {option1: '', option2: ''},
    is_poll_public: true,
  })
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setAnnouncementTypeAction(announcementType.POLL))
  }, [])

  useEffect(() => {
    setData(poll)
  }, [poll])

  const nextStep = () => {
    buttonPanelClickEvent()
    setCurrentStepIndex(currentStepIndex + 1)
    dispatch({type: SaveDraftType.SET_SAVE_DRAFT, payload: true})
  }

  const buttonPanelClickEvent = () => {
    if (currentStepIndex === 0) {
      eventManager.send_event(events.POLL_CHOICES_CREATED_TFI, {
        choices_count: Object.keys(data.question_options).length,
      })
      dispatch(setQuestionAction(data.message))
      dispatch(setQuestionOptionsAction(data.question_options))
    } else if (currentStepIndex === 1) {
      postDurationSelectedTfi({eventManager, events, post_type: POST_TYPE.poll})
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

  const disableNextButton = (givenStepIndex = null) => {
    if (!givenStepIndex) givenStepIndex = currentStepIndex
    switch (POLL_FORM_STEPS[givenStepIndex]) {
      case POLL_FORM_STEPS[0]:
        if (!data.message.trim()) {
          return true
        }
        return Object.values(data.question_options).some(
          (option) => option.trim() === ''
        )
      case POLL_FORM_STEPS[1]:
        return common.duration <= 0 || common.duration > 30
      case POLL_FORM_STEPS[2]:
        return !(common.segments.length && common.selected_users.length)
      case POLL_FORM_STEPS[3]:
        return false
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
        <SliderScreenHeader title={t('createPoll')} icon={announcementIcon} />
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
        {/* <div className={classNames(styles.subText, 'mb-2')}>{POLL_SUBTEXT}</div> */}
        <div
          className={classNames(
            communicationStyles.contentStepContainer,
            'lg:pt-4'
          )}
        >
          <ErrorBoundary>
            <Steps
              currentStepIndex={currentStepIndex}
              allSteps={POLL_FORM_STEPS}
            />
          </ErrorBoundary>
          <ErrorBoundary>
            <ContentContainer
              step={POLL_FORM_STEPS[currentStepIndex]}
              data={data}
              setData={setData}
            />
          </ErrorBoundary>
        </div>
        <ErrorBoundary>
          {!common.isUserFilterVisible && (
            <ButtonPanel
              isNext={currentStepIndex < POLL_FORM_STEPS.length - 1}
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

export default Poll
