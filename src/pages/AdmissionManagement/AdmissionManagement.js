import {lazy, Suspense, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {t} from 'i18next'
import {matchPath, useLocation} from 'react-router-dom'
import {ErrorBoundary} from '@teachmint/common'
import desktopPreview from '../../assets/images/dashboard/exam-mobile.svg'
import EmptyScreen from '../../components/Common/EmptyScreenV1/EmptyScreenV1'
import {DASHBOARD} from '../../utils/SidebarItems'
import {
  Divider,
  HeaderTemplate,
  Heading,
  HEADING_CONSTANTS,
  Para,
  ProgressTrackerCard,
} from '@teachmint/krayon'
import styles from './AdmissionManagement.module.css'
import globalActions from '../../redux/actions/global.actions'
import {
  useAdmissionCrmSettings,
  useAdmissionCrmSettingsProgress,
  useAllSessionHierarchies,
} from './redux/admissionManagement.selectors'
import Setup from './components/Configuration/Setup/Setup'
import Onboarding from './components/Configuration/Onboarding/Onboarding'
import {defaultOnboardingFlowStepsProgress} from './utils/constants'
import {
  getOnboardingProgress,
  isCrmSettingsConfigured,
  isCrmSettingsInitialized,
} from './utils/helpers'
import Loader from '../../components/Common/Loader/Loader'
import emptyScreenImage from '../../assets/images/dashboard/exam-new-session.svg'
import EmptyScreenV1 from '../../components/Common/EmptyScreenV1/EmptyScreenV1'
import {INSTITUTE_TYPES} from '../../constants/institute.constants'
import {utilsGetAdmissionManagementUrl} from '../../routes/dashboard'
import {
  showErrorOccuredAction,
  showLoadingAction,
} from '../../redux/actions/commonAction'

const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'))

export default function AdmissionManagement() {
  const dispatch = useDispatch()
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [selectedStep, setSelectedStep] = useState(null)
  const {instituteInfo, instituteAcademicSessionInfo} = useSelector(
    (state) => state
  )

  const admissionCrmSettings = useAdmissionCrmSettings()
  const allSessionHierarchies = useAllSessionHierarchies()
  const admissionCrmSettingsProgress = useAdmissionCrmSettingsProgress()

  const location = useLocation()
  const isLeadProfilePage = matchPath(location.pathname, {
    path: '/institute/dashboard/admission-management/leads/:leadId',
    exact: true,
    strict: false,
  })

  const isFeatureAvailable =
    instituteInfo.institute_type === INSTITUTE_TYPES.SCHOOL ||
    instituteInfo.institute_type === INSTITUTE_TYPES.TUITION

  useEffect(() => {
    if (isFeatureAvailable) {
      // Fetch all sessions hierarchies
      dispatch(globalActions.allSessionHierarchies.request())
      // Default onboarding steps progress
      dispatch(
        globalActions.admissionCrmSettingsProgress.request(
          defaultOnboardingFlowStepsProgress
        )
      )
      // Get CRM settings
      dispatch(globalActions.getAdmissionCrmSettings.request())
    }
  }, [instituteInfo])

  if (!isFeatureAvailable) {
    return (
      <div className={styles.emptyScreenMessage}>
        <EmptyScreenV1
          image={emptyScreenImage}
          title={t('admissionManagementEmptyScreenTitle')}
          desc={t('admissionManagementEmptyScreenDescription')}
        />
      </div>
    )
  }

  if (admissionCrmSettings.isLoading || allSessionHierarchies.isLoading) {
    return <div className="loader"></div>
  }

  const handleRedirect = () => {
    dispatch(showLoadingAction(true))
    utilsGetAdmissionManagementUrl(instituteInfo?._id)
      .then(({data}) => window.open(data))
      .catch((_err) => dispatch(showErrorOccuredAction(true)))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const getHeaderContent = () => {
    const settingsInitialized =
      isCrmSettingsInitialized(admissionCrmSettings.data) &&
      !isCrmSettingsConfigured(admissionCrmSettingsProgress.data)
    return (
      <div className={styles.stepsProgressPercentage}>
        <div>
          <HeaderTemplate
            showBreadcrumb={false}
            classes={{divider: styles.displayNone}}
            mainHeading={
              settingsInitialized
                ? t('setupConfigurationTitle')
                : t('admissionManagementTitle')
            }
            subHeading={
              <div className={styles.headerDescription}>
                {settingsInitialized
                  ? t('setupConfigurationDescription')
                  : t('admissionManagementDescription')}
                <div onClick={() => handleRedirect()}>
                  {t('olderVersionAdmission')}
                </div>
              </div>
            }
          />
        </div>
        {settingsInitialized ? (
          <ProgressTrackerCard
            progressPercentage={getOnboardingProgress(
              admissionCrmSettingsProgress.data
            )}
          />
        ) : (
          <>
            {admissionCrmSettings.data?.enable_session && (
              <div>
                <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}>
                  {
                    instituteAcademicSessionInfo.find(
                      (session) =>
                        session._id ===
                        admissionCrmSettings.data?.enable_session?.session_id
                    )?.name
                  }
                </Heading>
                <Para>{t('admissionCrmSession')}</Para>
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <div className={styles.mediaContainer}>
      <div className={styles.empty}>
        <EmptyScreen
          btnType="primary"
          image={desktopPreview}
          btnText={t('goToDashboard')}
          title={t('toUseTheFeaturePleaseOpenThePageInDesktop')}
          handleChange={() => history.push(DASHBOARD)}
        />
      </div>
      <div className={styles.container}>
        <ErrorBoundary>
          {!isLeadProfilePage && (
            <>
              {getHeaderContent()}
              <Divider spacing="20px" thickness="1px" />
            </>
          )}
          {isCrmSettingsConfigured(admissionCrmSettingsProgress.data) ? (
            <Suspense fallback={<Loader show />}>
              <Dashboard isLeadProfilePage={isLeadProfilePage} />
            </Suspense>
          ) : (
            <>
              {isCrmSettingsInitialized(admissionCrmSettings.data) ? (
                <Onboarding
                  showModal={showConfigModal}
                  setShowModal={setShowConfigModal}
                  selectedStep={selectedStep}
                  setSelectedStep={setSelectedStep}
                />
              ) : (
                <Setup />
              )}
            </>
          )}
        </ErrorBoundary>
      </div>
    </div>
  )
}
