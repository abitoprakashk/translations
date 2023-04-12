import {useTranslation} from 'react-i18next'
import styles from './multipleRouteAdditionForm.module.css'
import {Heading, HEADING_CONSTANTS, Para, PlainCard} from '@teachmint/krayon'
import routeCardImg from './route-card.png'

export default function RouteCard({data}) {
  const {t} = useTranslation()

  return (
    <PlainCard className={styles.routeCard}>
      <div className={styles.routeCardImg}>
        <img src={routeCardImg} />
      </div>
      <div>
        <Heading
          textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}
          className={styles.textOverflowEllipsis}
        >
          {data.name}
        </Heading>
        <div className={styles.routeDetails}>
          <Para>{`${data.nStops} ${t('stops')}`}</Para>
          <div className={styles.dotSeparator}></div>
          <Para>{`${data.nPassengers} ${t('passengers')}`}</Para>
        </div>
      </div>
    </PlainCard>
  )
}
