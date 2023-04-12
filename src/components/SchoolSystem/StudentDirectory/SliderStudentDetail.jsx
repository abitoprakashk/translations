import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {t} from 'i18next'
import SliderScreen from '../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../Common/SliderScreenHeader/SliderScreenHeader'
// import FeeHistory from '../../../pages/fee/components/FeeHistory/FeeHistory'
import Student from '../../../pages/user-profile/components/Student/Student'
import examMobileImage from '../../../assets/images/dashboard/exam-mobile.svg'
import EmptyScreenV1 from '../../Common/EmptyScreenV1/EmptyScreenV1'
import {DASHBOARD} from '../../../utils/SidebarItems'
import history from '../../../history'
import FeeTab from './FeeTab/FeeTab'
import Documents from '../../../pages/DocumentUpload/Documents'
import {PERMISSION_CONSTANTS} from '../../../utils/permission.constants'
import {getSliderHeaderIcon} from '../../../pages/user-profile/commonFunctions'
import {events} from '../../../utils/EventsConstants'
import styles from './SliderStudentDetail.module.css'
import {checkSubscriptionType} from '../../../utils/Helpers'
const SLIDER_TAB_IDS = {
  BASIC_INFO: 'BASIC_INFO',
  FEE_HISTORY: 'FEE_HISTORY',
  DOCUMENTS: 'DOCUMENTS',
}

const SLIDER_TABS = [
  {
    id: SLIDER_TAB_IDS.BASIC_INFO,
    label: t('profileTab'),
  },
]

export default function SliderStudentDetail({
  setSliderScreen,
  studentId,
  localLoader,
  width,
  selectedSliderTab = SLIDER_TAB_IDS.BASIC_INFO,
}) {
  const [selectedTab, setSelectedTab] = useState(
    selectedSliderTab ?? SLIDER_TAB_IDS.BASIC_INFO
  )

  const {
    instituteInfo,
    currentAdminInfo,
    eventManager,
    instituteActiveAcademicSessionId,
  } = useSelector((state) => state)
  const headerIcon = getSliderHeaderIcon({
    color: 'basic',
    name: 'student',
    size: 's',
    type: 'filled',
    className: styles.sliderHeaderIcon,
  })
  const isPremium = checkSubscriptionType(instituteInfo)

  useEffect(() => {
    if (
      (instituteInfo.institute_type === 'SCHOOL' ||
        instituteInfo.institute_type === 'TUITION') &&
      !Object.values(SLIDER_TABS).find(
        (tab) => tab.id === SLIDER_TAB_IDS.FEE_HISTORY
      ) &&
      !currentAdminInfo?.role_ids.includes('adm.academic') &&
      isPremium
    ) {
      SLIDER_TABS.push({
        id: SLIDER_TAB_IDS.FEE_HISTORY,
        label: 'Fee',
        permissionId:
          PERMISSION_CONSTANTS.feeModuleController_getStudentFeeDetails_read,
      })
    }
  }, [instituteInfo])

  useEffect(() => {
    if (selectedTab) {
      if (selectedTab === SLIDER_TAB_IDS.FEE_HISTORY) {
        eventManager.send_event(events.PROFILE_DETAILS_FEE_TAB_CLICKED_TFI, {
          user_screen: 'student',
        })
      } else if (selectedTab === SLIDER_TAB_IDS.DOCUMENTS) {
        eventManager.send_event(
          events.PROFILE_DETAILS_DOCUMENTS_TAB_CLICKED_TFI,
          {
            user_screen: 'student',
          }
        )
      } else {
        eventManager.send_event(events.PROFILE_DETAILS_TAB_CLICKED_TFI, {
          user_screen: 'student',
        })
      }
    }
  }, [selectedTab])

  const handleSetSliderScreen = () => {
    setSliderScreen(null)
  }
  const sendClickEvents = (eventName, dataObj = {}) => {
    return eventManager.send_event(eventName, {
      student_id: studentId,
      session_id: instituteActiveAcademicSessionId,
      ...dataObj,
    })
  }

  const handleSelectSliderTab = (tabId) => {
    sendClickEvents(events.STUDENT_PROFILE_TAB_CLICKED_TFI, {
      tab: tabId,
    })
    setSelectedTab(tabId)
  }

  return (
    <div>
      <SliderScreen setOpen={() => handleSetSliderScreen()} width={width}>
        <>
          <SliderScreenHeader
            icon={headerIcon}
            title={t('studentDetails')}
            options={SLIDER_TABS}
            optionsSelected={selectedTab}
            handleChange={handleSelectSliderTab}
          />
          {localLoader ? (
            <div className="loading" />
          ) : (
            <>
              {selectedTab === SLIDER_TAB_IDS.BASIC_INFO && (
                <Student
                  iMemberId={studentId}
                  closeSlider={() => {
                    setSliderScreen()
                  }}
                />
              )}

              {selectedTab === SLIDER_TAB_IDS.FEE_HISTORY && (
                <>
                  <div className="lg:hidden mt-20">
                    <EmptyScreenV1
                      image={examMobileImage}
                      title={t('toUseTheFeaturePleaseOpenThePageInDesktop')}
                      desc=""
                      btnText={t('goToDashboard')}
                      handleChange={() => history.push(DASHBOARD)}
                      btnType="primary"
                    />
                  </div>
                  <div className={styles.feeTabWrapper}>
                    {(instituteInfo.institute_type === 'SCHOOL' ||
                      instituteInfo.institute_type === 'TUITION') && (
                      // <FeeHistory studentId={studentId} />
                      <FeeTab
                        studentId={studentId}
                        sendClickEvents={sendClickEvents}
                        handleSetSliderScreen={handleSetSliderScreen}
                      />
                    )}
                  </div>
                </>
              )}
              {/* {selectedTab === SLIDER_TAB_IDS.FEE_HISTORY &&
                (instituteInfo.institute_type === 'SCHOOL' ||
                  instituteInfo.institute_type === 'TUITION') && (
                  <div className="hidden lg:block h-full overflow-scroll mb-5">
                    <FeeHistory studentId={studentId} />
                  </div>
                )} */}
              {selectedTab === SLIDER_TAB_IDS.DOCUMENTS && (
                <div className="h-full">
                  <Documents memberId={studentId} persona="STUDENT" />
                </div>
              )}
            </>
          )}
        </>
      </SliderScreen>
    </div>
  )
}
