import {lazy, Suspense, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {t} from 'i18next'
import {TabGroup, Button, BUTTON_CONSTANTS} from '@teachmint/krayon'
import {ErrorBoundary} from '@teachmint/common'
import {
  matchPath,
  Redirect,
  Route,
  Switch,
  useLocation,
  useRouteMatch,
} from 'react-router-dom'
import QRCodeModal from '../Common/QRCode/QRCodeModal'
import history from '../../../../history'
import Loader from '../../../../components/Common/Loader/Loader'
import {admissionTabIds, admissionTabs} from '../../utils/constants'
import {
  useAdmissionCrmSettings,
  useLeadList,
} from '../../redux/admissionManagement.selectors'
import globalActions from '../../../../redux/actions/global.actions'
import styles from './Dashboard.module.css'
import {events} from '../../../../utils/EventsConstants'

const Leads = lazy(() => import('../Leads/Leads'))
const LeadProfile = lazy(() => import('../LeadsProfile/LeadProfile'))
const Settings = lazy(() => import('../Settings/Settings'))
const FollowUps = lazy(() => import('../FollowUps/FollowUps'))
const Transactions = lazy(() => import('../Transactions/Transactions'))

export default function Dashboard({isLeadProfilePage}) {
  const dispatch = useDispatch()
  const {path} = useRouteMatch()
  const eventManager = useSelector((state) => state.eventManager)
  const url = (link) => `${path}/${link}`
  const admissionCrmSettings = useAdmissionCrmSettings()
  const leadList = useLeadList()
  const [showQrModal, setShowQrModal] = useState(false)

  const location = useLocation()
  const isDashboardPage = matchPath(location.pathname, {
    path: '/institute/dashboard/admission-management/leads',
    exact: true,
    strict: false,
  })

  useEffect(() => {
    dispatch(globalActions.getLeadList.request())
  }, [])

  const getDefaultActiveTab = () => {
    return (
      admissionTabs.find((tab) => {
        const currentPath = history.location.state?.link ?? location.pathname
        return (
          tab.id === currentPath.substring(currentPath.lastIndexOf('/') + 1)
        )
      })?.id || admissionTabIds.LEADS
    )
  }

  const [selectedTab, setSelectedTab] = useState(getDefaultActiveTab())

  const handleTabClick = (tab) => {
    setSelectedTab(tab.id)
    const eventName = {
      [admissionTabIds.LEADS]: events.ADMISSION_LEADLIST_CLICKED_TFI,
      [admissionTabIds.TRANSACTIONS]: events.ADMISSION_TRANSACTIONS_CLICKED_TFI,
      [admissionTabIds.FOLLOWUPS]: events.ADMISSION_FOLLOWUPS_CLICKED_TFI,
    }
    if (Object.keys(eventName).includes(tab.id)) {
      eventManager.send_event(eventName[tab.id], {
        screen_name: 'admission_management',
      })
    } else eventManager.send_event(events.ADMISSION_SETTINGS_CLICKED_TFI)
    history.push(tab.id)
  }

  const handleQrCode = () => {
    eventManager.send_event(events.ADMISSION_QR_CODE_CLICKED_TFI, {
      screen_name: 'lead_list',
    })
    setShowQrModal(true)
  }

  if (admissionCrmSettings.isLoading || leadList.isLoading) {
    return <div className="loading"></div>
  }

  return (
    <div className={styles.tabContainer}>
      {showQrModal && (
        <QRCodeModal
          showQrModal={showQrModal}
          setShowQrModal={setShowQrModal}
        />
      )}
      {!isLeadProfilePage && (
        <div className={styles.tabbarSection}>
          <TabGroup
            tabOptions={admissionTabs}
            onTabClick={handleTabClick}
            selectedTab={selectedTab}
            showMoreTab={false}
          />
          <div className={styles.qrCode}>
            {isDashboardPage && (
              <Button
                onClick={() => handleQrCode()}
                type={BUTTON_CONSTANTS.TYPE.TEXT}
                prefixIcon="qrCode"
              >
                {t('dashboardPageQrCode')}
              </Button>
            )}
          </div>
        </div>
      )}
      <div className={!isLeadProfilePage ? styles.tabBody : ''}>
        <ErrorBoundary>
          <Suspense fallback={<Loader show />}>
            <Switch>
              <Route path={url(admissionTabIds.LEADS)} component={Leads}>
                <Switch>
                  <Route
                    exact
                    component={Leads}
                    path={url(admissionTabIds.LEADS)}
                  />
                  <Route
                    component={LeadProfile}
                    path={url(admissionTabIds.LEADS) + '/:leadId'}
                  />
                </Switch>
              </Route>
              <Route
                exact
                path={url(admissionTabIds.TRANSACTIONS)}
                component={Transactions}
              />
              <Route
                exact
                path={url(admissionTabIds.FOLLOWUPS)}
                component={FollowUps}
              />
              <Route
                exact
                path={url(admissionTabIds.SETTINGS)}
                component={Settings}
              />
              <Route exact path={url('')}>
                <Redirect to={url(admissionTabIds.LEADS)} />
              </Route>
              <Redirect to={url(admissionTabIds.LEADS)} />
            </Switch>
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  )
}
