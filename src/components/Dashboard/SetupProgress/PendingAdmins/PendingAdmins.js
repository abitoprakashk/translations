import {ErrorBoundary} from '@teachmint/common'
import {t} from 'i18next'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {postChannelSelectedTfi} from '../../../../pages/communication/commonFunctions'
import ButtonPanel from '../../../../pages/communication/components/ButtonPanel'
import Steps from '../../../../pages/communication/components/steps/Steps'
import {POST_TYPE} from '../../../../pages/communication/constants'
import {createNewCommunicationAction} from '../../../../pages/communication/redux/actions/commonActions'
import {events} from '../../../../utils/EventsConstants'
import SliderScreen from '../../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../../Common/SliderScreenHeader/SliderScreenHeader'
import {PENDING_ADMINS_ANNOUNCEMENT_STEPS} from '../constants'
import styles from './PendingAdmins.module.css'
import SliderPendingAdmins from './components/SliderPendingAdmins'
import SliderPendingAdminsAnnouncement from './components/SliderPendingAdminsAnnouncement'
import Permission from '../../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'

const PendingAdmins = ({setSliderScreen, pendingAdmins}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [selectedAdminsId, setSelectedAdminsId] = useState([])
  const [isAllSelected, setIsAllSelected] = useState(true)
  const [filter, setFilter] = useState('')
  const [filteredAdminsList, setFilteredAdminsList] = useState([])

  const {common} = useSelector((state) => state.communicationInfo)
  const {eventManager} = useSelector((state) => state)
  const {adminInfo} = useSelector((state) => state)
  const dispatch = useDispatch()

  const handleCheckboxToggle = (e) => {
    const {value, checked} = e.target
    setIsAllSelected(false)
    e.target.checked = !checked
    if (selectedAdminsId.includes(value)) {
      setSelectedAdminsId(selectedAdminsId.filter((ele) => ele != value))
    } else if (!selectedAdminsId.includes(value)) {
      setSelectedAdminsId([...selectedAdminsId, value])
    }
  }

  const allPendingAdminsIds = filter
    ? filteredAdminsList.map((admin) => admin._id)
    : pendingAdmins.map((adminId) => adminId._id)

  const handleSelectAllAdmin = (e) => {
    if (e.target.checked) {
      setSelectedAdminsId([...allPendingAdminsIds])
      setIsAllSelected(true)
    } else {
      setSelectedAdminsId([])
      setIsAllSelected(false)
    }
  }

  const nextStep = () => {
    if (currentStepIndex === 0) {
      eventManager.send_event(
        events.ANNOUNCEMENT_ADMIN_ONBOARDING_NEXT_CLICKED_TFI,
        {admin_id: selectedAdminsId, screen_name: 'pending_admin'}
      )
    } else if (currentStepIndex === 1) {
      eventManager.send_event(
        events.ADMINS_ONBOARDING_ANNOUNCEMENT_POST_CLICKED_TFI
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

  const handlePreviousButtonClick = () => {
    if (currentStepIndex === 0) return
    setCurrentStepIndex(currentStepIndex - 1)
  }

  const postAnnouncement = async () => {
    eventManager.send_event(events.ADMIN_ONBOARDING_ANNOUNCEMENT_POSTED_TFI)
    let obj = {...common, draft: false}
    ;(obj.title = t('pendingAdminsAnnouncementTitle')),
      (obj.message = t('pendingAdminsAnnouncementDescription')),
      (obj.creator_id = adminInfo._id),
      (obj.selected_users = selectedAdminsId),
      (obj.screen_name = 'pending_admin')
    dispatch(createNewCommunicationAction(obj))
    setSliderScreen(false)
  }

  const disableNextButton = (givenStepIndex = null) => {
    if (!givenStepIndex) givenStepIndex = currentStepIndex
    switch (PENDING_ADMINS_ANNOUNCEMENT_STEPS[givenStepIndex]) {
      case PENDING_ADMINS_ANNOUNCEMENT_STEPS[0]:
        return selectedAdminsId && !selectedAdminsId.length
      case PENDING_ADMINS_ANNOUNCEMENT_STEPS[1]:
        return false
      default:
        return true
    }
  }

  const getComponent = (currentStepIndex) => {
    switch (currentStepIndex) {
      case 0:
        return (
          <SliderPendingAdmins
            setSliderScreen={setSliderScreen}
            pendingAdmins={pendingAdmins}
            handleCheckboxToggle={handleCheckboxToggle}
            handleSelectAll={handleSelectAllAdmin}
            selectedAdminsId={selectedAdminsId}
            setSelectedAdminsId={setSelectedAdminsId}
            isAllSelected={isAllSelected}
            setIsAllSelected={setIsAllSelected}
            filter={filter}
            setFilter={setFilter}
            filteredAdminsList={filteredAdminsList}
            setFilteredAdminsList={setFilteredAdminsList}
          />
        )
      case 1:
        return (
          <SliderPendingAdminsAnnouncement
            disableNextButton={disableNextButton()}
          />
        )
      default:
        break
    }
  }

  useEffect(() => {
    setSelectedAdminsId([...allPendingAdminsIds])
  }, [])
  return (
    <SliderScreen setOpen={() => setSliderScreen(null)} width={900}>
      <ErrorBoundary>
        <SliderScreenHeader
          icon="https://storage.googleapis.com/tm-assets/icons/primary/announcement-primary.svg"
          title={t('pendingAdminsAnnouncement')}
          capitalizeTitle={false}
        />
        <div className={styles.pendingAdminsStepsContainer}>
          <ErrorBoundary>
            <div className={styles.pendingAdminsSteps}>
              <Steps
                currentStepIndex={currentStepIndex}
                allSteps={PENDING_ADMINS_ANNOUNCEMENT_STEPS}
              />
            </div>
          </ErrorBoundary>
          <div
            className={`${styles.pendingAdminsComponentContainer} ${styles.borderLeftBlue}`}
          >
            {getComponent(currentStepIndex)}
          </div>
        </div>

        <div className={styles.pendingAdminsButtonContainer}>
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.communicationController_announcement_create
            }
          >
            <ButtonPanel
              isNext={
                currentStepIndex < PENDING_ADMINS_ANNOUNCEMENT_STEPS.length - 1
              }
              nextStep={nextStep}
              postAnnouncement={postAnnouncement}
              isDisable={disableNextButton()}
              handlePreviousButtonClick={handlePreviousButtonClick}
              showPrevious={currentStepIndex > 0}
              screenName={'pending_admin'}
            />
          </Permission>
        </div>
      </ErrorBoundary>
    </SliderScreen>
  )
}

export default PendingAdmins
