import React, {useEffect, useState} from 'react'

import RouteMapping, {TABLIST} from '../RouteMapping'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {useHistory, useRouteMatch} from 'react-router-dom'
import styles from './OrgLandingPage.module.css'
import {
  HEADING_CONSTANTS,
  Heading,
  TabGroup,
  Para,
  Icon,
  ICON_CONSTANTS,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import events from '../../constant/events'
import {showLoadingAction} from '../../../../redux/actions/commonAction'
export const TRANSPORT_ONBOARDING_SUB_ROUTE = 'setup-configuration'
import OverviewSection from './components/Overview/OverviewSection'
import useSendEvent from '../../../AttendanceReport/hooks/useSendEvent'

export default function OrgLandingPage() {
  const [selectedTab, setSelectedTab] = useState(1)

  const {t} = useTranslation()
  const {path} = useRouteMatch()
  let history = useHistory()
  const dispatch = useDispatch()
  const sendEvent = useSendEvent()

  const {
    orgOverviewDetails,
    orgFeeReport,
    orgAdmissionReport,
    orgStudentAttendanceReport,
    orgStaffAttendanceReport,
  } = useSelector((state) => state?.globalData)

  // Handle loading functionality
  const loadingList = [
    orgOverviewDetails?.isLoading,
    orgFeeReport?.isLoading,
    orgAdmissionReport?.isLoading,
    orgStudentAttendanceReport?.isLoading,
    orgStaffAttendanceReport?.isLoading,
  ]
  const handleLoading = () => {
    const isLoading = loadingList.some((item) => item === true)
    dispatch(showLoadingAction(isLoading))
  }

  useEffect(handleLoading, loadingList)

  const handleTabClick = (tab) => {
    sendEvent(events.MULTI_INSTITUTE_HOME_TAB_SWITCH_TFI, {
      tab_name: tab.label,
    })
    history.push(`${path}/${tab.link}`)
  }

  useEffect(() => {
    let currentRoute = window.location.pathname.split('/').slice(-1)[0]
    let currentPage = tabOptions.find((obj) => obj.link === currentRoute)
    // If random route called redirect
    if (!currentPage) {
      currentPage = tabOptions[0]
      history.push(`${path}/${currentPage.link}`)
    }
    setSelectedTab(currentPage.id)
  }, [window?.location?.pathname])

  const tabOptions = Object.values(TABLIST).map((page, index) => ({
    id: index + 1,
    label: page.label,
    link: page.route,
    icon: page.icon,
  }))

  return (
    <div className={styles.wrapper}>
      <div>
        <Heading
          textSize={HEADING_CONSTANTS.TEXT_SIZE.MEDIUM}
          weight={HEADING_CONSTANTS.WEIGHT.BOLD}
          className={styles.pageHeader}
        >
          {t('overview')}
          <Para
            className={styles.pageSubHeading}
            weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
          >
            <Icon
              name={'info'}
              version={ICON_CONSTANTS.VERSION.OUTLINED}
              type={ICON_CONSTANTS.TYPES.SECONDARY}
              size={ICON_CONSTANTS.SIZES.XXX_SMALL}
            />
            {t('LastUpdatedYesterday')}
          </Para>
        </Heading>
        <OverviewSection />
      </div>
      <div className={styles.tabSection}>
        <TabGroup
          showMoreTab={false}
          tabOptions={tabOptions}
          selectedTab={selectedTab}
          onTabClick={handleTabClick}
        />
      </div>

      <RouteMapping />
    </div>
  )
}
