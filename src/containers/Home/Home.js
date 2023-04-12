import React, {lazy, useEffect, Suspense} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import Sidebar from '../../components/Home/Sidebar/Sidebar'
import {
  getFirebaseMessaging,
  utilsGetAdminInfo,
  utilsGetAttendanceStats,
  utilsGetUsersList,
  utilsGetAdminsList,
  utilsGetInstituteList,
  utilsGetInstituteAcademicDetails,
  utilsGetCurrentAdmin,
  utilsGetPendingInstituteList,
  utilsGetSidebar,
  utilsGetBillingData,
} from '../../routes/dashboard'
import {
  adminInfoAction,
  currentAdminInfoAction,
  sidebarAction,
} from '../../redux/actions/adminInfo'

import {
  instituteAllClassesAction,
  instituteAttendanceAction,
  instituteInfoAction,
  instituteStudentListAction,
  instituteTeacherListAction,
  instituteListInfoAction,
  instituteHierarchyAction,
  instituteAcademicSessionLoadingAction,
  instituteAcademicSessionInfoAction,
  instituteAcademicSessionErrorAction,
  instituteActiveAcademicSessionIdAction,
  pendingInstituteListInfoAction,
  instituteAdminListAction,
  kamListAction,
  studentListLoadingAction,
  teacherListLoadingAction,
  instituteBillingInfoAction,
} from '../../redux/actions/instituteInfoActions'
import {
  notificationCountAction,
  redirectAction,
  showErrorOccuredAction,
  showLoadingAction,
  showErrorMessageAction,
  showLogoutPopupAction,
  showToast,
  logoutUser,
  switchAdminAction,
  countryListAction,
  setLoadingListAction,
  resetLoadingListAction,
} from '../../redux/actions/commonAction'
import {utilsCheckLogin, utilsLogout} from '../../routes/login'
import {Redirect} from 'react-router-dom'
import Loader from '../../components/Common/Loader/Loader'
const ContentArea = lazy(() =>
  import('../../components/Home/ContentArea/ContentArea')
)
import Logout from '../../components/Home/Logout/Logout'
import FeatureLock from '../../components/Home/FeatureLock/featureLock'
import {
  checkSubscriptionType,
  deleteAdminSpecificToLocalStorage,
  filterAttendance,
  getAdminSpecificFromLocalStorage,
  getDate,
  getFromLocalStorage,
  getFromSessionStorage,
  getUnreadNotificationCount,
  setAdminSpecificToLocalStorage,
  setToSessionStorage,
} from '../../utils/Helpers'
import {v4 as uuidv4} from 'uuid'
import EditInstitute from '../../components/Home/EditInstitute/EditInstitute'
import {eventManagerAction} from '../../redux/actions/EventManagerAction'
import EventManager from '../../utils/EventManager'
import InstituteListPopup from '../../components/Common/InstituteList/InsituteListPopup'
import Navbar from '../../components/Home/Navbar/Navbar'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import {
  utilsGetInstituteHierarchy,
  utilsGetUncatergorizedClasses,
} from '../../routes/instituteSystem'
import {
  handleHierarchyOpenClose,
  hierarchyInitialization,
  isHierarchyAvailable,
} from '../../utils/HierarchyHelpers'
import {addAxiosResponseInterceptor} from '../../utils/apis.utils'
import {LOGIN} from '../../utils/SidebarItems'
import {events} from '../../utils/EventsConstants'
import {ErrorOverlay} from '@teachmint/common'
import {useActiveAcademicSessionId} from '../../utils/CustomHooks/AcademicSessionHook'
import {
  BROWSER_STORAGE_KEYS,
  INSTITUTE_MEMBER_TYPE,
} from '../../constants/institute.constants'
import {
  REACT_APP_TEACHMINT_ACCOUNTS_URL,
  REACT_APP_BASE_URL,
} from '../../constants'
import {schoolSystemScreenSelectedAction} from '../../redux/actions/schoolSystemAction'
import {NODE_SCHOOL_SYSTEM_OVERVIEW} from '../../utils/SchoolSetupConstants'
import {contentAccessCheckRequestedAction} from '../../pages/contentMvp/redux/actions/contentActions'
import {utilsGetCountryInfo} from '../../routes/login'
import globalActions from '../../redux/actions/global.actions'
import NPSFeatureContainer from '../../components/NPSForm/NPSFeatureContainer'
import {PERMISSION_CONSTANTS} from '../../utils/permission.constants'
import styles from './Home.module.scss'
import sidebarStyles from '../../components/Home/Sidebar/Sidebar.module.css'
import classNames from 'classnames'
import OrgLandingPage from '../../pages/GroupOwnerDashboard/pages/LandingPage/OrgLandingPage'
import {organisationInfoAction} from '../../redux/actions/organisationInfoAction'
import SwitchAdmin from '../../components/Home/Header/components/SwitchAdmin'
import {LOADER} from '../../constants/loader.constant'
import {localStorageKeys} from '../../pages/BillingPage/constants'
import {getNextActiveSessionId} from '../../utils/sessionUtils'

export default function Home() {
  const {
    redirect,
    showLoading,
    showSidebar,
    showLogoutPopup,
    showEditInstituteDetailsPopup,
    showFeatureLock,
    adminInfo,
    eventManager,
    showInstituteList,
    instituteInfo,
    instituteBillingInfo,
    organisationInfo,
    instituteListInfo,
    instituteHierarchy,
    instituteAcademicSessionError,
  } = useSelector((state) => state)

  const usersPermission = useSelector(
    (state) => state?.globalData?.userRolePermission?.data?.permission_ids
  )
  const isPremium = checkSubscriptionType(instituteInfo)

  const activeAcademicSessionId = useActiveAcademicSessionId()

  const CurrentOrgId = getAdminSpecificFromLocalStorage(
    BROWSER_STORAGE_KEYS.CURRENT_ORG_ID
  )

  const dispatch = useDispatch()
  const {t} = useTranslation()

  useEffect(() => {
    setLoader()
    getRedirect()
    checkLogin()
    getCountryData()
    addAxiosResponseInterceptor(dispatch)
  }, [])

  useEffect(() => {
    window.addEventListener('message', handleMessage, false)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  useEffect(() => {
    if (adminInfo?._id) createEventManager()
    if (adminInfo?.phone_number) {
      getPendingInstituteList(adminInfo?.phone_number, null)
    } else if (adminInfo?.email) {
      getPendingInstituteList(null, adminInfo?.email)
    }
  }, [adminInfo])

  useEffect(() => {
    if (instituteInfo?._id) {
      dispatch(
        globalActions?.userRolePermission?.request(null, null, () => {
          dispatch(resetLoadingListAction())
        })
      )
      getCurrentAdmin(instituteInfo?._id)
      getSidebar()
      getAcademicSessionDetails(instituteInfo?._id)
      getBillingInfo(instituteInfo?._id)
      getContentMvpAccess(instituteInfo?._id)
    }
  }, [instituteInfo])

  useEffect(() => {
    if (instituteInfo?._id) getSidebar()
  }, [instituteBillingInfo])

  useEffect(() => {
    if (instituteInfo?._id && activeAcademicSessionId) {
      setAdminSpecificToLocalStorage(
        BROWSER_STORAGE_KEYS.CURRENT_INSTITUTE_ID,
        instituteInfo?._id
      )
    }
  }, [activeAcademicSessionId])

  // API call after checking users permission
  useEffect(() => {
    if (instituteInfo?._id && activeAcademicSessionId && usersPermission) {
      getAttendanceStats(instituteInfo._id, getDate(6), getDate(0))
      getInstituteHierarchy(instituteInfo._id, instituteInfo?.hierarchy_id)
      getInstituteStudents(instituteInfo._id)
      getInstituteTeachers(instituteInfo._id)
      getInstituteClasses(instituteInfo._id)
    }
  }, [activeAcademicSessionId, usersPermission])

  useEffect(() => {
    if (instituteInfo?._id && usersPermission) {
      if (
        (checkPermission(
          PERMISSION_CONSTANTS.InstituteRoleController_getList_read
        ) ||
          checkPermission(
            PERMISSION_CONSTANTS.adminLeaveController_getUserList_read
          )) &&
        isPremium
      ) {
        dispatch(globalActions?.getAllRoles?.request())
      }
      getInstituteAdmins(instituteInfo?._id)
    }
  }, [instituteInfo, usersPermission])

  const checkPermission = (permissionId) => {
    return usersPermission?.includes(permissionId) ? true : false
  }

  const handleMessage = (event) => {
    switch (event.data) {
      case 'LOGOUT_ADMIN':
        logoutAdmin()
        break

      case 'CLOSE_IFRAME_ACCOUNTS':
        dispatch(switchAdminAction(false))
        break
    }
  }

  const logoutAdmin = async () => {
    dispatch(showLoadingAction(true))
    const adminUUID = getFromSessionStorage(BROWSER_STORAGE_KEYS.ADMIN_UUID)
    utilsLogout()
      .then(() => eventManager.destroy_session())
      .then(async () => {
        eventManager.send_event(events.LOGOUT_SUCCESSFUL_TFI)
        deleteAdminSpecificToLocalStorage(adminUUID)

        dispatch(logoutUser())
        window.location.href = `${REACT_APP_TEACHMINT_ACCOUNTS_URL}?client_id=tfi&redirect_uri=${REACT_APP_BASE_URL}${String(
          LOGIN
        ).substring(1)}&state=default&scope=all&utype=4&logout=${adminUUID}`
      })
      .catch(() => {
        dispatch(showLoadingAction(false))
        dispatch(showErrorOccuredAction(true))
      })
  }

  const createEventManager = () => {
    let newEventManager = new EventManager(
      adminInfo._id,
      eventManager.campaignUrl
    )
    newEventManager.getConfig()
    dispatch(eventManagerAction(newEventManager))
  }
  const setLoader = () => {
    if (CurrentOrgId) {
      dispatch(
        setLoadingListAction({
          [LOADER.checkLogin]: true,
        })
      )
    } else {
      dispatch(
        setLoadingListAction({
          [LOADER.checkLogin]: true,
          [LOADER.getAdminInfo]: true,
          [LOADER.getInsituteInfo]: true,
          [LOADER.getAcademicSessionDetails]: true,
          [LOADER.getSidebar]: true,
          [LOADER.getInstituteAdmins]: true,
          [LOADER.getCurrentAdmin]: true,
          [LOADER.getPendingInstituteList]: true,
          [LOADER.getInstituteClasses]: true,
          [LOADER.getInstituteTeachers]: true,
          [LOADER.getInstituteStudents]: true,
          [LOADER.getInstituteHierarchy]: true,
        })
      )
    }
  }

  const getRedirect = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const redirectParam = urlParams.get('redirect')
    const redirectKey = getFromSessionStorage('allow_redirect')
    if (redirectParam === 'true' && !redirectKey) {
      setToSessionStorage(
        'post_login_redirect_url',
        window.location.pathname + window.location.search
      )
      setToSessionStorage('allow_redirect', true)
    }
  }
  const checkLogin = () => {
    dispatch(setLoadingListAction({[LOADER.checkLogin]: true}))
    if (!getFromSessionStorage(BROWSER_STORAGE_KEYS.ADMIN_UUID)) {
      const adminsGlobal = Object.keys(
        JSON.parse(
          getFromLocalStorage(BROWSER_STORAGE_KEYS.ADMINS_GLOBAL) || '{}'
        )
      )
      if (adminsGlobal?.length > 0)
        setToSessionStorage(BROWSER_STORAGE_KEYS.ADMIN_UUID, adminsGlobal?.[0])
    }

    utilsCheckLogin()
      .then(async ({data}) => {
        if (data !== 'NAME') {
          dispatch(resetLoadingListAction())
          dispatch(redirectAction(true))
        } else {
          await getAdminInfo()
          try {
            await setFirebase()
            eventManager.add_unique_user(adminInfo)
          } catch {
            dispatch(showErrorOccuredAction(true))
          }
        }
      })
      .catch(() => {
        dispatch(resetLoadingListAction())
        dispatch(showErrorOccuredAction(true))
      })
      .finally(() => {
        dispatch(setLoadingListAction({[LOADER.checkLogin]: false}))
      })
  }

  const getAdminInfo = () => {
    dispatch(setLoadingListAction({[LOADER.getAdminInfo]: true}))
    utilsGetAdminInfo()
      .then(({admin}) => {
        dispatch(adminInfoAction(admin))
        getInsituteInfo(admin.user_type)
      })
      .catch((err) => {
        dispatch(resetLoadingListAction())
        dispatch(showErrorOccuredAction(true))
        if (err && err.msg) {
          dispatch(showErrorMessageAction(err.msg))
          dispatch(showLogoutPopupAction(true))
        }
      })
      .finally(() =>
        dispatch(setLoadingListAction({[LOADER.getAdminInfo]: false}))
      )
  }

  const getInsituteInfo = (userType) => {
    dispatch(setLoadingListAction({[LOADER.getInsituteInfo]: true}))
    utilsGetInstituteList(userType)
      .then(({institutes, organisation}) => {
        dispatch(instituteListInfoAction(institutes))
        dispatch(organisationInfoAction(organisation))

        // set Organisation ID to local storage if user selected Organisation
        if (
          organisation?._id &&
          CurrentOrgId &&
          CurrentOrgId !== organisation?._id
        ) {
          setAdminSpecificToLocalStorage(
            BROWSER_STORAGE_KEYS.CURRENT_ORG_ID,
            organisation?._id
          )
        }

        // set institute if user not selected Organisation
        if (!CurrentOrgId) {
          let institute = instituteInfo
          let localStoredInstitute = getAdminSpecificFromLocalStorage(
            BROWSER_STORAGE_KEYS.CURRENT_INSTITUTE_ID
          )

          if (
            instituteInfo === null ||
            Object.keys(instituteInfo).length === 0
          ) {
            if (localStoredInstitute) {
              for (var i in institutes)
                if (institutes[i]._id === localStoredInstitute)
                  institute = institutes[i]
            } else institute = institutes[0]
          }

          if (institute?._id) {
            dispatch(instituteInfoAction(institute))
          } else {
            dispatch(resetLoadingListAction())
            dispatch(showLogoutPopupAction(true))
          }
        }
      })
      .catch(() => {
        dispatch(resetLoadingListAction())
        dispatch(showErrorOccuredAction(true))
      })
      .finally(() =>
        dispatch(setLoadingListAction({[LOADER.getInsituteInfo]: false}))
      )
  }

  const getAcademicSessionDetails = (instituteId) => {
    dispatch(instituteAcademicSessionLoadingAction())
    dispatch(setLoadingListAction({[LOADER.getAcademicSessionDetails]: true}))
    utilsGetInstituteAcademicDetails(instituteId)
      .then(({status, obj}) => {
        if (status && obj?.length > 0) {
          dispatch(instituteAcademicSessionInfoAction(obj))
          let activeSessionId = getAdminSpecificFromLocalStorage(
            BROWSER_STORAGE_KEYS.ACTIVE_ACADEMIC_SESSION_ID
          )
          let sessionPresentId = null
          if (activeSessionId) {
            sessionPresentId = obj.find(
              (academicSession) => academicSession._id === activeSessionId
            )?._id
          }
          if (!activeSessionId || !sessionPresentId) {
            activeSessionId = getNextActiveSessionId(obj)
            setAdminSpecificToLocalStorage(
              BROWSER_STORAGE_KEYS.ACTIVE_ACADEMIC_SESSION_ID,
              activeSessionId
            )
          }

          // Set initail state of hierarchy
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
          dispatch(instituteActiveAcademicSessionIdAction(activeSessionId))
          setAdminSpecificToLocalStorage(
            BROWSER_STORAGE_KEYS.ACTIVE_ACADEMIC_SESSION_ID,
            activeSessionId
          )
        } else {
          dispatch(resetLoadingListAction())
          dispatch(showLogoutPopupAction(true))
        }
      })
      .catch(() => {
        dispatch(resetLoadingListAction())
        dispatch(instituteAcademicSessionErrorAction())
      })
      .finally(() => {
        dispatch(instituteAcademicSessionLoadingAction(false))
        dispatch(
          setLoadingListAction({[LOADER.getAcademicSessionDetails]: false})
        )
      })
  }

  const getBillingInfo = () => {
    localStorage.setItem(localStorageKeys.VERIFIED_SUITS, false)
    utilsGetBillingData(instituteInfo?._id)
      .then((res) => {
        dispatch(instituteBillingInfoAction(res?.data?.obj))
        localStorage.setItem(localStorageKeys.VERIFIED_SUITS, !!res?.data?.obj)
      })
      .catch(() => {
        dispatch(showErrorOccuredAction(false))
      })
  }

  const getSidebar = () => {
    utilsGetSidebar()
      .then(({data}) => {
        dispatch(sidebarAction(data))
      })
      .catch((_err) => dispatch(showErrorOccuredAction(true)))
      .finally(() =>
        dispatch(setLoadingListAction({[LOADER.getSidebar]: false}))
      )
  }

  const getInstituteAdmins = () => {
    if (
      !checkPermission(
        PERMISSION_CONSTANTS.InstituteAdminController_get_read
      ) ||
      !isPremium
    ) {
      dispatch(setLoadingListAction({[LOADER.getInstituteAdmins]: false}))
      return
    }
    dispatch(setLoadingListAction({[LOADER.getInstituteAdmins]: true}))
    utilsGetAdminsList()
      .then(({obj}) => {
        dispatch(instituteAdminListAction(obj?.admin))
        dispatch(kamListAction(obj?.kam)) // store KAM user List in redux
      })
      .catch(() => dispatch(showErrorOccuredAction(true)))
      .finally(() =>
        dispatch(setLoadingListAction({[LOADER.getInstituteAdmins]: false}))
      )
  }

  const getCurrentAdmin = (instituteId) => {
    dispatch(setLoadingListAction({[LOADER.getCurrentAdmin]: true}))
    utilsGetCurrentAdmin(instituteId)
      .then(({data}) => {
        dispatch(currentAdminInfoAction(data))
      })
      .catch((_err) => dispatch(showErrorOccuredAction(true)))
      .finally(() =>
        dispatch(setLoadingListAction({[LOADER.getCurrentAdmin]: false}))
      )
  }

  const getPendingInstituteList = (phone_number = null, email = null) => {
    dispatch(setLoadingListAction({[LOADER.getPendingInstituteList]: true}))
    utilsGetPendingInstituteList(phone_number, email)
      .then((response) => {
        dispatch(pendingInstituteListInfoAction(response?.obj))
      })
      .catch((err) => {
        dispatch(showErrorOccuredAction(true))
        if (err && err.msg) {
          dispatch(showErrorMessageAction(err.msg))
        }
      })
      .finally(() =>
        dispatch(
          setLoadingListAction({[LOADER.getPendingInstituteList]: false})
        )
      )
  }
  const getAttendanceStats = (instituteId, startDate, endDate) => {
    if (
      !checkPermission(
        PERMISSION_CONSTANTS.InstituteController_getStatsDaily_read
      ) ||
      !isPremium
    ) {
      return
    }
    utilsGetAttendanceStats(instituteId, startDate, endDate)
      .then(({data}) => {
        dispatch(instituteAttendanceAction(filterAttendance(data)))
      })
      .catch((_err) => dispatch(showErrorOccuredAction(true)))
  }

  const getInstituteClasses = (instituteId) => {
    if (
      !checkPermission(
        PERMISSION_CONSTANTS.InstituteClassController_getUncategorizedClassroom_read
      )
    ) {
      dispatch(setLoadingListAction({[LOADER.getInstituteClasses]: false}))
      return
    }

    dispatch(setLoadingListAction({[LOADER.getInstituteClasses]: true}))
    utilsGetUncatergorizedClasses(instituteId)
      .then(({status, obj}) => {
        if (status) dispatch(instituteAllClassesAction(obj))
      })
      .catch((_err) => dispatch(showErrorOccuredAction(true)))
      .finally(() =>
        dispatch(setLoadingListAction({[LOADER.getInstituteClasses]: false}))
      )
  }

  const getInstituteTeachers = () => {
    if (
      !checkPermission(PERMISSION_CONSTANTS.IpsController_directoryList_read)
    ) {
      dispatch(setLoadingListAction({[LOADER.getInstituteTeachers]: false}))
      return
    }
    dispatch(teacherListLoadingAction(true))
    dispatch(setLoadingListAction({[LOADER.getInstituteTeachers]: true}))
    utilsGetUsersList({type: [INSTITUTE_MEMBER_TYPE.TEACHER]})
      .then(({status, obj}) => {
        if (status) dispatch(instituteTeacherListAction(obj))
      })
      .catch(() => dispatch(showErrorOccuredAction(true)))
      .finally(() => {
        dispatch(teacherListLoadingAction(false))
        dispatch(setLoadingListAction({[LOADER.getInstituteTeachers]: false}))
      })
  }

  const getInstituteStudents = () => {
    if (
      !checkPermission(PERMISSION_CONSTANTS.IpsController_directoryList_read)
    ) {
      dispatch(setLoadingListAction({[LOADER.getInstituteStudents]: false}))
      return
    }

    dispatch(studentListLoadingAction(true))
    dispatch(setLoadingListAction({[LOADER.getInstituteStudents]: true}))
    utilsGetUsersList({type: [INSTITUTE_MEMBER_TYPE.STUDENT]})
      .then(({status, obj}) => {
        dispatch(studentListLoadingAction(false))
        if (status) dispatch(instituteStudentListAction(obj))
      })
      .catch(() => dispatch(showErrorOccuredAction(true)))
      .finally(() => {
        dispatch(setLoadingListAction({[LOADER.getInstituteStudents]: false}))
      })
  }

  const getInstituteHierarchy = (instituteId, hierarchyId) => {
    if (
      !checkPermission(
        PERMISSION_CONSTANTS.InstituteClassController_getInstituteHierarchy_read
      )
    ) {
      dispatch(setLoadingListAction({[LOADER.getInstituteHierarchy]: false}))
      return
    }

    dispatch(setLoadingListAction({[LOADER.getInstituteHierarchy]: true}))
    utilsGetInstituteHierarchy(instituteId, hierarchyId)
      .then(({status, obj}) => {
        if (status)
          dispatch(
            instituteHierarchyAction(
              hierarchyInitialization(
                instituteHierarchy,
                obj,
                instituteInfo?.institute_type
              )
            )
          )
        else
          dispatch(
            showToast({
              type: 'error',
              message: t('unableToAccessSchoolSystem'),
            })
          )
      })
      .catch((_err) => dispatch(showErrorOccuredAction(true)))
      .finally(() =>
        dispatch(setLoadingListAction({[LOADER.getInstituteHierarchy]: false}))
      )
  }

  const getContentMvpAccess = (instituteId) => {
    dispatch(contentAccessCheckRequestedAction(instituteId))
  }

  const getCountryData = () => {
    utilsGetCountryInfo().then(({status, obj}) => {
      if (status) {
        window.countryList = obj
        dispatch(countryListAction(obj))
      }
    })
  }

  const setFirebase = async () => {
    if (
      !getAdminSpecificFromLocalStorage(
        BROWSER_STORAGE_KEYS.ADMIN_NOTIFICATIONS
      )
    )
      setAdminSpecificToLocalStorage(
        BROWSER_STORAGE_KEYS.ADMIN_NOTIFICATIONS,
        '[]'
      )

    let notifArray = JSON.parse(
      getAdminSpecificFromLocalStorage(BROWSER_STORAGE_KEYS.ADMIN_NOTIFICATIONS)
    )

    dispatch(
      notificationCountAction(
        notifArray ? getUnreadNotificationCount(notifArray) : 0
      )
    )

    const messaging = getFirebaseMessaging()
    if (messaging) {
      // try {
      //   Notification.requestPermission((permission) => {
      //     eventManager.send_event(events.NOTIFICATION_ACCESS_REQUESTED_TFI, {
      //       action: null,
      //     })
      //     if (permission === 'granted') {
      //       // messaging.getToken().then(async (token) => {
      //       //   await sendTokentoServer(token)
      //       // })
      //       eventManager.send_event(events.NOTIFICATION_ACCESS_REQUESTED_TFI, {
      //         action: 'allowed',
      //       })
      //     } else if (permission === 'denied') {
      //       eventManager.send_event(events.NOTIFICATION_ACCESS_REQUESTED_TFI, {
      //         action: 'declined',
      //       })
      //       alert(t('pleaseUnblockToReceiveNotifications'))
      //     } else {
      //       eventManager.send_event(events.NOTIFICATION_ACCESS_REQUESTED_TFI, {
      //         action: 'clicked_cross',
      //       })
      //     }
      //   })
      // } catch (err) {
      //   //TODO: Move this log by calling a logging service
      // }
      messaging.onMessage(async (payload) => {
        let data = payload.data
        if (
          data.type === 'TEACHMINT_SCHOOL_PENDING_REQUEST_ADD' ||
          data.type === 'TEACHMINT_SCHOOL_PENDING_REQUEST_DELETE'
        ) {
          handleNotification(data)
        }
      })
    }
  }

  const handleNotification = (data) => {
    let notifArray = JSON.parse(
      getAdminSpecificFromLocalStorage(
        BROWSER_STORAGE_KEYS.ADMIN_NOTIFICATIONS
      ) || '[]'
    )

    if (notifArray.length > 200) {
      notifArray.sort((a, b) => {
        if (a.date > b.date) return -1
        else if (a.date < b.date) return 1
        else return 0
      })
      notifArray = notifArray.slice(0, 200)
    }
    notifArray.push({
      notif_id: uuidv4(),
      title: data.title,
      text: data.text,
      storage: data.storage,
      request_type: data.type,
      class_id: data.class_id,
      date: new Date(),
      read: false,
    })

    dispatch(
      notificationCountAction(
        notifArray ? getUnreadNotificationCount(notifArray) : 0
      )
    )
    setAdminSpecificToLocalStorage(
      BROWSER_STORAGE_KEYS.ADMIN_NOTIFICATIONS,
      JSON.stringify(notifArray)
    )
  }

  if (redirect) return <Redirect to={LOGIN} />

  return (
    <ErrorBoundary>
      <Loader show={showLoading} />
      {/* Sidebar for mobile*/}
      <div className="block lg:hidden">
        <ErrorBoundary>
          {showSidebar && !CurrentOrgId ? <Sidebar /> : null}
        </ErrorBoundary>
      </div>

      {showFeatureLock ? <FeatureLock /> : null}
      {showLogoutPopup ? <Logout /> : null}
      {showEditInstituteDetailsPopup ? <EditInstitute /> : null}
      {instituteListInfo.length > 1 && showInstituteList && (
        <InstituteListPopup closeActive={true} title={t('switchInstitute')} />
      )}
      <div className="h-screen">
        <ErrorBoundary>
          <NPSFeatureContainer />
          {(instituteInfo?._id || organisationInfo?._id) && <Navbar />}
          {CurrentOrgId ? (
            <div className="tm-sidebar-contentarea-parent">
              {organisationInfo?._id && <OrgLandingPage />}
              <SwitchAdmin />
            </div>
          ) : (
            <div className="tm-sidebar-contentarea-parent">
              {/* Sidebar for web*/}
              <div
                className={classNames(
                  'hidden lg:block',
                  sidebarStyles.sidebarContainer
                )}
              >
                <ErrorBoundary>
                  <Sidebar />
                </ErrorBoundary>
              </div>

              <div className={styles.contentAreaDiv}>
                <ErrorBoundary>
                  <Suspense fallback={<Loader />}>
                    {activeAcademicSessionId ? <ContentArea /> : null}
                  </Suspense>
                  {instituteAcademicSessionError && (
                    <ErrorOverlay>
                      {t('academicSessionsCouldNotBeLoadedErrorOverlay')}
                    </ErrorOverlay>
                  )}
                </ErrorBoundary>
              </div>
            </div>
          )}
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  )
}
