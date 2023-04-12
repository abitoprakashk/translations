import {useTranslation} from 'react-i18next'
import styles from './landingPageEmptyState.module.css'
import {Heading, HEADING_CONSTANTS, Para, PlainCard} from '@teachmint/krayon'
import TransportSetupVideo from '../../../../components/TransportSetupVideo/TransportSetupVideo'

export default function LandingPageEmptyState() {
  const {t} = useTranslation()

  return (
    <div className={styles.wrapper}>
      <PlainCard className={styles.setupVideoCard}>
        <TransportSetupVideo className={styles.video} />
      </PlainCard>
      <div className={styles.textContent}>
        <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}>
          {t('howToSetupTransportTitle')}
        </Heading>
        <Para>{t('howToSetupTransportDesc')}</Para>
      </div>
    </div>
  )
}
