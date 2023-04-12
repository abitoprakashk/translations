import React, {useState, useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {events} from '../../../../utils/EventsConstants'
import SliderScreen from '../../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../../Common/SliderScreenHeader/SliderScreenHeader'
import SliderPendingTeachers from './components/SliderPendingTeachers'
import styles from './PendingTeachers.module.css'
import SliderPendingTeachersAnnouncement from './components/SliderPendingTeachersAnnouncement'
import ButtonPanel from '../../../../pages/communication/components/ButtonPanel'
import {ErrorBoundary} from '@teachmint/common'
import Steps from '../../../../pages/communication/components/steps/Steps'
import {POST_TYPE} from '../../../../pages/communication/constants'
import {postChannelSelectedTfi} from '../../../../pages/communication/commonFunctions'
import {createNewCommunicationAction} from '../../../../pages/communication/redux/actions/commonActions'
import {PENDING_TEACHERS_ANNOUNCEMENT_STEPS} from '../constants'
import Permission from '../../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'

export default function PendingTeachers({setSliderScreen, pendingTeachers}) {
  const [filter, setFilter] = useState('')
  const [filteredTeachersList, setFilteredTeachersList] = useState([])
  const [selectedTeachersId, setSelectedTeachersId] = useState([])
  const [isAllSelected, setIsAllSelected] = useState(true)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const {eventManager} = useSelector((state) => state)
  const {common} = useSelector((state) => state.communicationInfo)
  const dispatch = useDispatch()
  const {adminInfo} = useSelector((state) => state)
  const {t} = useTranslation()

  const allPendingTeachersIds = filter
    ? filteredTeachersList.map((teacher) => teacher._id)
    : pendingTeachers.map((teacherId) => teacherId._id)

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
        events.ANNOUNCEMENT_TEACHER_ONBOARDING_NEXT_CLICKED_TFI,
        {teacher_id: selectedTeachersId}
      )
    } else if (currentStepIndex === 1) {
      eventManager.send_event(
        events.TEACHER_ONBOARDING_ANNOUNCEMENT_POST_CLICKED_TFI
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
    switch (PENDING_TEACHERS_ANNOUNCEMENT_STEPS[givenStepIndex]) {
      case PENDING_TEACHERS_ANNOUNCEMENT_STEPS[0]:
        return selectedTeachersId && !selectedTeachersId.length
      case PENDING_TEACHERS_ANNOUNCEMENT_STEPS[1]:
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
          <SliderPendingTeachers
            setSliderScreen={setSliderScreen}
            pendingTeachers={pendingTeachers}
            handleCheckboxToggle={handleCheckboxToggle}
            handleSelectAll={handleSelectAll}
            selectedTeachersId={selectedTeachersId}
            setSelectedTeachersId={setSelectedTeachersId}
            isAllSelected={isAllSelected}
            setIsAllSelected={setIsAllSelected}
            filter={filter}
            setFilter={setFilter}
            filteredTeachersList={filteredTeachersList}
            setFilteredTeachersList={setFilteredTeachersList}
          />
        )
      case 1:
        return (
          <SliderPendingTeachersAnnouncement
            disableNextButton={disableNextButton()}
          />
        )
      default:
        break
    }
  }

  const postAnnouncement = async () => {
    eventManager.send_event(events.TEACHER_ONBOARDING_ANNOUNCEMENT_POSTED_TFI)
    let obj = {...common, draft: false}
    ;(obj.title = t('pendingTeachersAnnouncementTitle')),
      (obj.message = t('pendingTeachersAnnouncementDescription')),
      (obj.creator_id = adminInfo._id),
      (obj.selected_users = selectedTeachersId),
      (obj.source = 'teacherNudge')
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
          title={t('pendingTeachersAnnouncement')}
          capitalizeTitle={false}
        />

        <div className={styles.pending_teacher_steps_container}>
          <ErrorBoundary>
            <div className={styles.margin_16}>
              <Steps
                currentStepIndex={currentStepIndex}
                allSteps={PENDING_TEACHERS_ANNOUNCEMENT_STEPS}
              />
            </div>
          </ErrorBoundary>
          <div
            className={`${styles.pending_teacher_component_container} ${styles.border_left_blue}`}
          >
            {getComponent(currentStepIndex)}
          </div>
        </div>
        <div className={styles.pending_teacher_button_container}>
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.communicationController_announcement_create
            }
          >
            <ButtonPanel
              isNext={
                currentStepIndex <
                PENDING_TEACHERS_ANNOUNCEMENT_STEPS.length - 1
              }
              nextStep={nextStep}
              postAnnouncement={postAnnouncement}
              isDisable={disableNextButton()}
              handlePreviousButtonClick={handlePreviousButtonClick}
              showPrevious={currentStepIndex > 0}
              screenName={'pendingTeachers'}
            />
          </Permission>
        </div>
      </>
    </SliderScreen>
  )
}
