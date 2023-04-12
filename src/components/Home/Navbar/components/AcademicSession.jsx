import React, {useState, useEffect, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {events} from '../../../../utils/EventsConstants'
import {
  instituteActiveAcademicSessionIdAction,
  instituteHierarchyAction,
} from '../../../../redux/actions/instituteInfoActions'
import {Blinker, Button, useOutsideClickHandler} from '@teachmint/common'
import {Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import AcademicSessionDropdownItem from './AcademicSessionDropdownItem'
import SliderAcademicSession from './SliderAcademicSession/SliderAcademicSession'
import {schoolSystemScreenSelectedAction} from '../../../../redux/actions/schoolSystemAction'
import {
  handleHierarchyOpenClose,
  isHierarchyAvailable,
} from '../../../../utils/HierarchyHelpers'
import {NODE_SCHOOL_SYSTEM_OVERVIEW} from '../../../../utils/SchoolSetupConstants'
import {
  getFromLocalStorage,
  setAdminSpecificToLocalStorage,
  setToLocalStorage,
} from '../../../../utils/Helpers'
import {BROWSER_STORAGE_KEYS} from '../../../../constants/institute.constants'
import Permission from '../../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import styles from '../Navbar.module.css'
import SessionTransfer from '../../../SessionTransfer/SessionTransfer'
import {DASHBOARD} from '../../../../utils/SidebarItems'

const BLINKER_ACTIVE_TIME = 5000
const NAV_SESSION_ACCESSED_KEY = 'NAV_SESSION_ACCESSED'

export default function AcademicSession() {
  const [activeSessionObj, setActiveSessionObj] = useState(null)
  const [showSessionDropdown, setShowSessionDropdown] = useState(false)
  const [selectedSessionObj, setSelectedSessionObj] = useState(null)
  const [showSliderScreen, setSetShowSliderScreen] = useState(false)
  const [sessionImportIds, setSessionImportIds] = useState(null)
  const [showBlinker, setShowBlinker] = useState(false)

  const dispatch = useDispatch()
  const {t} = useTranslation()
  const {
    eventManager,
    instituteAcademicSessionInfo,
    instituteActiveAcademicSessionId,
    instituteHierarchy,
  } = useSelector((state) => state)

  const showEditSession = useSelector((state) => state.showEditSession)
  const [isCreateFlow, setIsCreateFlow] = useState(false)

  useEffect(() => {
    let timerId = null
    const wasNavbarSessionAccessed = JSON.parse(
      getFromLocalStorage(NAV_SESSION_ACCESSED_KEY)
    )
    if (!wasNavbarSessionAccessed) {
      setShowBlinker(true)
      timerId = setTimeout(() => setShowBlinker(false), BLINKER_ACTIVE_TIME)
    }
    return () => {
      clearTimeout(timerId)
    }
  }, [])

  useEffect(() => {
    if (showEditSession) {
      editAcademicSession(activeSessionObj)
    }
  }, [showEditSession, activeSessionObj])

  useEffect(() => {
    if (!showSliderScreen && isCreateFlow && !sessionImportIds?.source) {
      window.location.reload()
    }
  }, [showSliderScreen, sessionImportIds])

  useEffect(() => {
    setActiveSessionObj(
      instituteAcademicSessionInfo.find(
        ({_id}) => _id === instituteActiveAcademicSessionId
      )
    )
  }, [instituteAcademicSessionInfo, instituteActiveAcademicSessionId])

  const wrapperRef = useRef(null)
  useOutsideClickHandler(wrapperRef, () => {
    setShowSessionDropdown(false)
  })

  const closeSessionTransfer = () => {
    setSessionImportIds(null)
  }

  const handleAcademicSessionChange = (sessionId) => {
    if (isHierarchyAvailable(instituteHierarchy)) {
      dispatch(
        instituteHierarchyAction(
          handleHierarchyOpenClose(
            instituteHierarchy,
            NODE_SCHOOL_SYSTEM_OVERVIEW
          )
        )
      )
    }
    dispatch(schoolSystemScreenSelectedAction(null))
    dispatch(instituteActiveAcademicSessionIdAction(sessionId))
    setAdminSpecificToLocalStorage(
      BROWSER_STORAGE_KEYS.ACTIVE_ACADEMIC_SESSION_ID,
      sessionId
    )
    // Whenever academic session changes, redirect the user to dashboard and then reload
    location.pathname = DASHBOARD
    setShowSessionDropdown(false)
  }

  const editAcademicSession = (value) => {
    setSelectedSessionObj(value)
    setSetShowSliderScreen(true)
    setShowSessionDropdown(false)
  }

  const handleSessionConfigImport = (sourceId) => {
    setSessionImportIds({source: sourceId, target: selectedSessionObj._id})
    setShowSessionDropdown(false)
    setSetShowSliderScreen(false)
    eventManager.send_event(events.SESSION_IMPORT_START_CLICKED_TFI, {
      session_id: sourceId,
      from_session_id: selectedSessionObj._id,
    })
  }

  return (
    <div className="flex items-center sm:ml-6" ref={wrapperRef}>
      {instituteAcademicSessionInfo?.length > 0 && (
        <div
          className={`flex justify-between relative ${styles.academicSessionContainer}`}
          onClick={() => {
            eventManager.send_event(events.ACADEMIC_SESSION_LIST_OPENED_TFI)
            setShowSessionDropdown(!showSessionDropdown)
            setShowBlinker(false)
            setToLocalStorage(NAV_SESSION_ACCESSED_KEY, true)
          }}
        >
          <div className={styles.sessionCalendar}>
            <Icon
              color="basic"
              name="eventAvailable"
              size={ICON_CONSTANTS.SIZES.XX_SMALL}
              type="outlined"
            />
          </div>
          <div
            className={`truncate inline-block cursor-pointer ${styles.session}`}
          >
            <div className={styles.activeSession}>{activeSessionObj?.name}</div>
          </div>
          <div className={styles.chevronDown}>
            <Icon
              color="secondary"
              name="chevronDown"
              size={ICON_CONSTANTS.SIZES.X_SMALL}
              type="outlined"
            />
          </div>

          {showBlinker && <Blinker className={styles.blinker} />}

          {showSessionDropdown && (
            <div className={styles.academicSessionDropdownItemContainer}>
              <AcademicSessionDropdownItem
                handleAcademicSessionChange={handleAcademicSessionChange}
                editAcademicSession={editAcademicSession}
              />
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.instituteController_createSession_create
                }
              >
                <Button
                  className="hidden lg:block mt-2 mx-auto"
                  type="secondary"
                  onClick={() => {
                    eventManager.send_event(
                      events.CREATE_NEW_ACADEMIC_SESSION_CLICKED_TFI
                    )
                    setSetShowSliderScreen(true)
                    setShowSessionDropdown(false)
                  }}
                >
                  {t('addNewPlus')}
                </Button>
              </Permission>
            </div>
          )}
        </div>
      )}

      {showSliderScreen && (
        <SliderAcademicSession
          setSetShowSliderScreen={setSetShowSliderScreen}
          selectedSessionObj={selectedSessionObj}
          setSelectedSessionObj={setSelectedSessionObj}
          onImport={handleSessionConfigImport}
          setIsCreateFlow={setIsCreateFlow}
        />
      )}
      {!!sessionImportIds?.source && (
        <SessionTransfer
          sessionImportIds={sessionImportIds}
          onClose={closeSessionTransfer}
          onEditSession={(session) => {
            closeSessionTransfer()
            editAcademicSession(session)
          }}
        />
      )}
    </div>
  )
}
