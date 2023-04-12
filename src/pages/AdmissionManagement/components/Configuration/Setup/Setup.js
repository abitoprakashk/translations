import {useDispatch, useSelector} from 'react-redux'
import {t} from 'i18next'
import classNames from 'classnames'
import {
  Button,
  Heading,
  HEADING_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  PlainCard,
  ProgressTrackerCard,
  PROGRESS_TRACKER_CARD_CONSTANTS,
} from '@teachmint/krayon'
import {ErrorBoundary} from '@teachmint/common'
import styles from './Setup.module.css'
import {
  useAdmissionCrmSettingsProgress,
  useInitiateCrmSettings,
} from '../../../redux/admissionManagement.selectors'
import globalActions from '../../../../../redux/actions/global.actions'
import {getOnboardingProgress} from '../../../utils/helpers'
import {HELP_VIDEOS} from '../../../utils/constants'
import {events} from '../../../../../utils/EventsConstants'

export default function Setup() {
  const dispatch = useDispatch()
  const eventManager = useSelector((state) => state.eventManager)
  const initiateCrmSettings = useInitiateCrmSettings()
  const admissionCrmSettingsProgress = useAdmissionCrmSettingsProgress()

  const handleClick = () => {
    eventManager.send_event(events.ADMISSION_SETUP_INITIATED_TFI)
    dispatch(globalActions.initiateAdmissionCrmSettings.request())
  }

  if (initiateCrmSettings.isLoading) {
    return <div className="loader"></div>
  }

  return (
    <ErrorBoundary>
      <div className={styles.setup}>
        <PlainCard className={classNames(styles.setupCard, styles.bgColor)}>
          <div className={styles.setupCardBody}>
            <div className={styles.setupCardDescription}>
              <ProgressTrackerCard
                size={PROGRESS_TRACKER_CARD_CONSTANTS.SIZE.MEDIUM}
                showBorder={false}
                classes={{wrapper: styles.setupCardProgress}}
                progressPercentage={getOnboardingProgress(
                  admissionCrmSettingsProgress.data
                )}
              />
              <div className={styles.setupCardContent}>
                <Heading
                  textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
                  className={classNames(styles.setupCardHeading, styles.color)}
                >
                  {t('setupCardTitle')}
                </Heading>
                <Para weight={PARA_CONSTANTS.WEIGHT.MEDIUM}>
                  {t('setupCardDescription')}
                </Para>
              </div>
            </div>
            <Button onClick={handleClick}>{t('setupNowButton')}</Button>
          </div>
        </PlainCard>
        <div className={styles.setupContent}>
          <iframe
            width="400"
            height="300"
            src={HELP_VIDEOS.ADMISSION_CRM}
            title={t('onboardingVideoTitle')}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
            {t('onboardingSetupTitle')}
          </Heading>
          <Para weight={PARA_CONSTANTS.WEIGHT.MEDIUM}>
            {t('onboardingSetupDescription')}
          </Para>
        </div>
      </div>
    </ErrorBoundary>
  )
}
