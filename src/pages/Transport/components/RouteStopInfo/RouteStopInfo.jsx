import styles from './RouteStopInfo.module.css'
import {Icon, ICON_CONSTANTS, Para, PARA_CONSTANTS} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'

export default function RouteStopInfo({firstStop, lastStop, stopsNum}) {
  const {t} = useTranslation()

  const BarWithCircularEnds = () => (
    <div className={styles.barWithCircularEnds}>
      <div className={styles.circle}></div>
      <div className={styles.straightBar}></div>
      <div className={styles.circle}></div>
    </div>
  )

  return (
    <div className={styles.wrapper}>
      <BarWithCircularEnds />
      <div className={styles.stopsInfoWrapper}>
        <div className={styles.routeStartStop}>
          {firstStop?.name ? (
            <>
              <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
                {firstStop.name}
              </Para>
              <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>{`${
                firstStop?.pickUpTime ? firstStop.pickUpTime : '-'
              } | ${firstStop?.dropTime ? firstStop?.dropTime : '-'}`}</Para>
            </>
          ) : (
            '-'
          )}
        </div>
        <div className={styles.stopsNumWrapper}>
          <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>{`${stopsNum} ${t(
            'stops'
          )}`}</Para>
          <Icon
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
            name="swapHorizontal"
            type={ICON_CONSTANTS.TYPES.SECONDARY}
          />
        </div>
        <div className={styles.routeEndStop}>
          {lastStop?.name ? (
            <>
              <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
                {lastStop.name}
              </Para>
              <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>{`${
                lastStop?.pickUpTime ? lastStop.pickUpTime : '-'
              } | ${lastStop?.dropTime ? lastStop?.dropTime : '-'}`}</Para>
            </>
          ) : (
            '-'
          )}
        </div>
      </div>
    </div>
  )
}
