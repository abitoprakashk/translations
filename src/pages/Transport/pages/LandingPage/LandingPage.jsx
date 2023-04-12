import React, {useEffect, useState} from 'react'
import RouteMapping, {TRANSPORT_TABLIST} from './RouteMapping'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {Route, Switch, useHistory, useRouteMatch} from 'react-router-dom'
import styles from './LandingPage.module.css'
import {BUTTON_CONSTANTS, HeaderTemplate, TabGroup} from '@teachmint/krayon'
import EmptyScreenV1 from '../../../../components/Common/EmptyScreenV1/EmptyScreenV1'
import {DASHBOARD} from '../../../../utils/SidebarItems'
import globalActions from '../../../../redux/actions/global.actions'
import {showLoadingAction} from '../../../../redux/actions/commonAction'
import {events} from '../../../../utils/EventsConstants'
import OnboardingPage from '../OnboardingPage/OnboardingPage'
import SetupTransportBanner from './components/SetupTransportBanner/SetupTransportBanner'
import TransportSetupGuideVideoModal from './components/TransportSetupGuideVideo/TransportSetupGuideVideoModal'
import useTransportSetupPercentage from '../../utils/CustomHooks/getTransportSetupPercentageHook'
import LandingPageEmptyState from './components/LandingPageEmptyState/LandingPageEmptyState'

export const TRANSPORT_ONBOARDING_SUB_ROUTE = 'setup-configuration'

export default function LandingView() {
  const [selectedTab, setSelectedTab] = useState(1)
  const [showSetupGuideVideo, setShowSetupGuideVideo] = useState(false)

  const {t} = useTranslation()
  const {path} = useRouteMatch()
  let history = useHistory()
  const dispatch = useDispatch()
  const {eventManager} = useSelector((state) => state)

  const registerEvent = (page) => {
    switch (page) {
      case 'overview':
        eventManager.send_event(events.TRANSPORT_OVERVIEW_TAB_CLICKED_TFI, {
          ingress: 'toggle_menu',
        })
        break
      case 'stops':
        eventManager.send_event(events.STOPS_TAB_CLICKED_TFI, {
          ingress: 'toggle_menu',
        })
        break
      case 'vehicles':
        eventManager.send_event(events.VEHICLES_TAB_CLICKED_TFI, {
          ingress: 'toggle_menu',
        })
        break
      case 'staff':
        eventManager.send_event(events.TRANSPORT_STAFF_TAB_CLICKED_TFI, {
          ingress: 'toggle_menu',
        })
        break
      case 'routes':
        eventManager.send_event(events.ROUTES_TAB_CLICKED_TFI, {
          ingress: 'toggle_menu',
        })
        break
      default:
        break
    }
  }

  const globalData = useSelector((state) => state?.globalData)

  // Handle loading functionality
  const loadingList = [
    globalData?.transportAggregates?.isLoading,
    globalData?.transportPassengers?.isLoading,
    globalData?.deleteTransportPassengers?.isLoading,
    globalData?.transportStops?.isLoading,
    globalData?.updateTransportStops?.isLoading,
    globalData?.deleteTransportStops?.isLoading,
    globalData?.transportVehicles?.isLoading,
    globalData?.updateTransportVehicles?.isLoading,
    globalData?.deleteTransportVehicles?.isLoading,
    globalData?.transportStaff?.isLoading,
    globalData?.updateTransportStaff?.isLoading,
    globalData?.deleteTransportStaff?.isLoading,
    globalData?.fetchSchoolTransportSettings?.isLoading,
    globalData?.updateSchoolLocation?.isLoading,
    globalData?.transportRoutes?.isLoading,
    globalData?.updateTransportRoutes?.isLoading,
    globalData?.deleteTransportRoutes?.isLoading,
    globalData?.requestTransportGPS?.isLoading,
    globalData?.acknowledgeVehicleSOS?.isLoading,
    globalData?.transportLiveTracking?.isLoading,
  ]
  const handleLoading = () => {
    const isLoading = loadingList.some((item) => item === true)
    dispatch(showLoadingAction(isLoading))
  }
  useEffect(handleLoading, loadingList)

  const handleTabClick = (tab) => {
    history.push(`${path}/${tab.link}`)
    registerEvent(tab.link)
  }

  useEffect(() => {
    let currentRoute = window.location.pathname.split('/').slice(-1)[0]
    if (currentRoute === TRANSPORT_ONBOARDING_SUB_ROUTE) return
    let currentPage = transportTabOptions.find(
      (obj) => obj.link === currentRoute
    )
    // If random route called redirect to transport overview
    if (!currentPage) {
      currentPage = transportTabOptions[0]
      history.push(`${path}/${currentPage.link}`)
    }
    setSelectedTab(currentPage.id)
  }, [window?.location?.pathname])

  useEffect(() => {
    dispatch(globalActions?.fetchSchoolTransportSettings?.request())
    dispatch(globalActions?.transportStops?.request())
    dispatch(globalActions?.transportVehicles?.request())
    dispatch(globalActions?.transportStaff?.request())
    dispatch(globalActions?.transportRoutes?.request())
    dispatch(globalActions?.transportAggregates?.request())
  }, [])

  const transportTabOptions = Object.values(TRANSPORT_TABLIST).map(
    (page, index) => ({
      id: index + 1,
      label: page.label,
      link: page.route,
    })
  )

  const setupGuideButtonObj = {
    id: 'primary-btn',
    onClick: () => {
      setShowSetupGuideVideo(true)
      eventManager.send_event(events.TRANSPORT_SETUP_GUIDE_CLICKED_TFI, {})
    },
    children: t('setupGuide'),
    category: BUTTON_CONSTANTS.CATEGORY.PRIMARY,
    type: BUTTON_CONSTANTS.TYPE.OUTLINE,
    size: BUTTON_CONSTANTS.SIZE.SMALL,
    width: BUTTON_CONSTANTS.WIDTH.FIT,
    classes: {},
  }

  const transportSetupPercentage = useTransportSetupPercentage()

  return (
    <div className={styles.wrapper}>
      <div className={styles.emptyScreen}>
        <EmptyScreenV1
          title={t('toUseTheFeaturePleaseOpenThePageInDesktop')}
          desc=""
          btnText={t('goToDashboardBtn')}
          handleChange={() => history.push(DASHBOARD)}
          btnType="primary"
        />
      </div>
      <div className={styles.transport}>
        <Switch>
          <Route path={`${path}/${TRANSPORT_ONBOARDING_SUB_ROUTE}`}>
            <OnboardingPage />
          </Route>
          <Route>
            <>
              <HeaderTemplate
                showBreadcrumb={false}
                mainHeading={t('transportManagement')}
                classes={{
                  subHeading: styles.subHeading,
                  divider: styles.divider,
                }}
                actionButtons={
                  transportSetupPercentage > 0 ? [setupGuideButtonObj] : []
                }
              />
              <SetupTransportBanner />
              {transportSetupPercentage > 0 ? (
                <>
                  <div className={styles.tabGroupWrapper}>
                    <TabGroup
                      showMoreTab={false}
                      tabOptions={transportTabOptions}
                      selectedTab={selectedTab}
                      onTabClick={handleTabClick}
                    />
                  </div>
                  <RouteMapping />
                </>
              ) : (
                <LandingPageEmptyState />
              )}
            </>
          </Route>
        </Switch>
      </div>
      <TransportSetupGuideVideoModal
        showModal={showSetupGuideVideo}
        setShowModal={setShowSetupGuideVideo}
      />
    </div>
  )
}
