import {useTranslation} from 'react-i18next'
import styles from './multipleStopAdditionForm.module.css'
import {Heading, HEADING_CONSTANTS, Para, PlainCard} from '@teachmint/krayon'
import stopCardImg from './stop-card.png'

export default function StopCard({data}) {
  const {t} = useTranslation()

  return (
    <PlainCard className={styles.stopCard}>
      <div className={styles.stopCardImg}>
        <img src={stopCardImg} />
      </div>
      <div className={styles.stopCardContent}>
        <Heading
          textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
          className={styles.textOverflowEllipsis}
        >
          {data.name}
        </Heading>
        <Para>{`${data.passenger_ids.length} ${t('passengers')}`}</Para>
      </div>
    </PlainCard>
  )
}
