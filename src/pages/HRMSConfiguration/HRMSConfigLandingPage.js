import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import HRMSConfigurationRouteMapping, {
  hrmsConfigurationTablist,
  BiometricConfigurationRouteMapping,
} from './HRMSConfigRouteMapping'
import {useTranslation} from 'react-i18next'
import {useHistory, useLocation} from 'react-router-dom'
import styles from './HRMSConfigLandingPage.module.css'
import {HeaderTemplate, TabGroup} from '@teachmint/krayon'
import biometricSubRoutesList from './BiometricAttendance/utils/routing.constants'
import EmptyScreenV1 from '../../components/Common/EmptyScreenV1/EmptyScreenV1'
import examMobileImage from '../../assets/images/dashboard/exam-mobile.svg'
import {DASHBOARD} from '../../utils/SidebarItems'
import {events} from '../../utils/EventsConstants'

export default function HRMSConfigurationLandingPage() {
  const eventManager = useSelector((state) => state.eventManager)
  const [selectedTab, setSelectedTab] = useState(1)
  const [currentRoute, setCurrentRoute] = useState('')
  const currentLocation = useLocation()
  const {t} = useTranslation()
  let history = useHistory()

  const handleTabClick = (tab) => {
    let eventID
    if (tab.id === 1) {
      eventID = events.ATTENDANCE_SHIFTS_TAB_CLICKED_TFI
    } else if (tab.id === 2) {
      eventID = events.BIOMETRIC_CONFIGURATION_TAB_CLICKED_TFI
    }
    eventManager.send_event(eventID)
    history.push(tab.link)
  }

  const hrmsConfigurationTabOptions = Object.values(
    hrmsConfigurationTablist
  ).map((page) => ({
    id: page.id,
    label: page.label,
    link: page.route,
  }))

  useEffect(() => {
    let currentPage = hrmsConfigurationTabOptions.find(
      (obj) => obj.link === currentLocation.pathname
    )
    setCurrentRoute(currentLocation.pathname)
    if (currentPage?.id) {
      setSelectedTab(currentPage.id)
    }
  }, [currentLocation.pathname])

  return (
    <div className={styles.hrmsWrapper}>
      <div className={styles.emptyScreen}>
        <EmptyScreenV1
          image={examMobileImage}
          title={t('toUseTheFeaturePleaseOpenThePageInDesktop')}
          desc=""
          btnText={t('goToDashboardBtn')}
          handleChange={() => history.push(DASHBOARD)}
          btnType="primary"
        />
      </div>

      <div className={styles.mainContent}>
        {biometricSubRoutesList.includes(currentRoute) ? (
          <BiometricConfigurationRouteMapping />
        ) : (
          <div className={styles.wrapper}>
            <div className={styles.hrmsConfigHeader}>
              <HeaderTemplate
                showBreadcrumb={false}
                mainHeading={t('hrmsConfiguration')}
                classes={{
                  subHeading: styles.subHeading,
                  divider: styles.divider,
                }}
              />
              <div className={styles.tabGroupWrapper}>
                <TabGroup
                  showMoreTab={false}
                  tabOptions={hrmsConfigurationTabOptions}
                  selectedTab={selectedTab}
                  onTabClick={handleTabClick}
                />
                <div id="shift-configuration-header"></div>
              </div>
              <HRMSConfigurationRouteMapping />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
