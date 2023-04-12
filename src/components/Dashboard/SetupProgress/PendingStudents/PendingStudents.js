import React, {useState, useEffect} from 'react'
import SliderScreen from '../../../Common/SliderScreen/SliderScreen'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {events} from '../../../../utils/EventsConstants'
import SliderScreenHeader from '../../../Common/SliderScreenHeader/SliderScreenHeader'
import SliderPendingStudents from './components/SliderPendingStudents'
import styles from './PendingStudents.module.css'
import SliderPendingStudentsAnnouncement from './components/SliderPendingStudentsAnnouncement'
import ButtonPanel from '../../../../pages/communication/components/ButtonPanel'
import {ErrorBoundary} from '@teachmint/common'
import Steps from '../../../../pages/communication/components/steps/Steps'
import {POST_TYPE} from '../../../../pages/communication/constants'
import {postChannelSelectedTfi} from '../../../../pages/communication/commonFunctions'
import {createNewCommunicationAction} from '../../../../pages/communication/redux/actions/commonActions'
import {PENDING_STUDENTS_ANNOUNCEMENT_STEPS} from '../constants'
import Permission from '../../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'

export default function PendingStudents({
  setSliderScreen,
  allPendingTeachersIds,
  getPendingStudentList,
}) {
  const [selectedTeachersId, setSelectedTeachersId] = useState([])
  const [eventsPayload, setEventsPayload] = useState([])
  const [isAllSelected, setIsAllSelected] = useState(true)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const {eventManager} = useSelector((state) => state)
  const {common} = useSelector((state) => state.communicationInfo)
  const dispatch = useDispatch()
  const {adminInfo} = useSelector((state) => state)
  const {t} = useTranslation()

  const img_urls = [
    'https://storage.googleapis.com/teachmint/public/banner-mob.svg',
    'https://storage.googleapis.com/teachmint/public/banner-web.svg',
  ]

  const hasId = (id) => selectedTeachersId.includes(id)

  const handleCheckboxToggle = (e) => {
    const {value, checked} = e.target
    setIsAllSelected(false)
    e.target.checked = !checked
    if (selectedTeachersId.includes(value)) {
      setSelectedTeachersId(selectedTeachersId.filter((ele) => ele != value))
    } else if (!selectedTeachersId.includes(value)) {
      setSelectedTeachersId([...selectedTeachersId, value])
    }
  }
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTeachersId([...allPendingTeachersIds])
      setIsAllSelected(true)
    } else {
      setSelectedTeachersId([])
      setIsAllSelected(false)
    }
  }

  const nextStep = () => {
    if (currentStepIndex === 0) {
      eventManager.send_event(
        events.STUDENT_ONBOARDING_ANNOUNCEMENT_NEXT_CLICKED_TFI,
        {
          eventsPayload,
        }
      )
    } else if (currentStepIndex === 1) {
      eventManager.send_event(
        events.STUDENT_ONBOARDING_ANNOUNCEMENT_POST_CLICKED_TFI
      )
      postChannelSelectedTfi({
        eventManager,
        events,
        post_type: POST_TYPE.announcement,
        channels: common.channels.length ? common.channels.join(',') : '',
      })
    }
    setCurrentStepIndex(currentStepIndex + 1)
  }

  const disableNextButton = (givenStepIndex = null) => {
    if (!givenStepIndex) givenStepIndex = currentStepIndex
    switch (PENDING_STUDENTS_ANNOUNCEMENT_STEPS[givenStepIndex]) {
      case PENDING_STUDENTS_ANNOUNCEMENT_STEPS[0]:
        return selectedTeachersId && !selectedTeachersId.length
      case PENDING_STUDENTS_ANNOUNCEMENT_STEPS[1]:
        return false
      default:
        return true
    }
  }
  const handlePreviousButtonClick = () => {
    if (currentStepIndex === 0) return
    setCurrentStepIndex(currentStepIndex - 1)
  }

  const getComponent = (currentStepIndex) => {
    switch (currentStepIndex) {
      case 0:
        return (
          <SliderPendingStudents
            setSliderScreen={setSliderScreen}
            pendingStudentsObj={getPendingStudentList}
            handleCheckboxToggle={handleCheckboxToggle}
            handleSelectAll={handleSelectAll}
            selectedTeachersId={selectedTeachersId}
            isAllSelected={isAllSelected}
            allPendingTeachersIds={allPendingTeachersIds}
            hasId={hasId}
            setEventsPayload={setEventsPayload}
            eventsPayload={eventsPayload}
          />
        )
      case 1:
        return (
          <SliderPendingStudentsAnnouncement
            disableNextButton={disableNextButton()}
          />
        )
      default:
        break
    }
  }

  const postAnnouncement = async () => {
    eventManager.send_event(events.ANNOUNCEMENT_STUDENT_ONBOARDING_POSTED_TFI)
    let obj = {...common, draft: false}
    ;(obj.title = t('pendingStudentsAnnouncementTitle')),
      (obj.message = t('pendingStudentsAnnouncementDescription')),
      (obj.creator_id = adminInfo._id),
      (obj.selected_users = selectedTeachersId),
      (obj.source = 'classTeacherNudge')
    dispatch(createNewCommunicationAction(obj))
    setSliderScreen(false)
  }

  useEffect(() => {
    setSelectedTeachersId([...allPendingTeachersIds])
  }, [])
  return (
    <SliderScreen setOpen={() => setSliderScreen(null)} width={900}>
      <>
        <SliderScreenHeader
          icon="https://storage.googleapis.com/tm-assets/icons/primary/announcement-primary.svg"
          title={t('pendingStudentsAnnouncement')}
          capitalizeTitle={false}
        />

        <div className={`${styles.pending_students}`}>
          <ErrorBoundary>
            <img
              className={`${styles.banner_container_mweb}`}
              src={img_urls[0]}
            ></img>
            <div className={styles.pending_students_steps}>
              <Steps
                currentStepIndex={currentStepIndex}
                allSteps={PENDING_STUDENTS_ANNOUNCEMENT_STEPS}
              />
            </div>
          </ErrorBoundary>
          <div
            className={`${styles.border_left_blue} ${styles.pending_students_container}`}
          >
            <img
              className={`${styles.banner_container_web}`}
              src={img_urls[1]}
            ></img>
            {getComponent(currentStepIndex)}
          </div>
        </div>
        <div className={styles.pending_students_button_container}>
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.communicationController_announcement_create
            }
          >
            <ButtonPanel
              isNext={
                currentStepIndex <
                PENDING_STUDENTS_ANNOUNCEMENT_STEPS.length - 1
              }
              nextStep={nextStep}
              postAnnouncement={postAnnouncement}
              isDisable={disableNextButton()}
              handlePreviousButtonClick={handlePreviousButtonClick}
              showPrevious={currentStepIndex > 0}
              screenName={'pendingStudents'}
            />
          </Permission>
        </div>
      </>
    </SliderScreen>
  )
}
