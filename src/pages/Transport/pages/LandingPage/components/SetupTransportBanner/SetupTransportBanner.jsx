import {
  Button,
  BUTTON_CONSTANTS,
  Heading,
  HEADING_CONSTANTS,
  PlainCard,
  Para,
  ProgressTrackerCard,
  PROGRESS_TRACKER_CARD_CONSTANTS,
} from '@teachmint/krayon'
import React from 'react'
import {useHistory, useRouteMatch} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import styles from './setupTransportBanner.module.css'
import {TRANSPORT_ONBOARDING_SUB_ROUTE} from '../../LandingPage'
import useTransportSetupPercentage from '../../../../utils/CustomHooks/getTransportSetupPercentageHook'

export default function SetupTransportBanner() {
  const {t} = useTranslation()

  const setupPercentage = useTransportSetupPercentage()

  const {path} = useRouteMatch()
  let history = useHistory()

  const onSetupTransportClick = () => {
    history.push(`${path}/${TRANSPORT_ONBOARDING_SUB_ROUTE}`)
  }

  return setupPercentage === 100 ? null : (
    <PlainCard className={styles.card}>
      <div className={styles.infoSection}>
        <ProgressTrackerCard
          size={PROGRESS_TRACKER_CARD_CONSTANTS.SIZE.MEDIUM}
          progressPercentage={setupPercentage}
        />
        <div>
          <Heading
            className={styles.heading}
            textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
          >
            {t('setupTransportBannerTitle')}
          </Heading>
          <Para> {t('setupTransportBannerDesc')}</Para>
        </div>
      </div>

      <Button
        size={BUTTON_CONSTANTS.SIZE.LARGE}
        onClick={onSetupTransportClick}
      >
        {setupPercentage > 0 ? t('completeSetup') : t('setupNow')}
      </Button>
    </PlainCard>
  )
}
