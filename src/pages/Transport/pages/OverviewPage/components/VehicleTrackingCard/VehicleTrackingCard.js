import {useTranslation} from 'react-i18next'
import styles from './vehicleTrackingCard.module.css'
import {
  // Badges,
  // BADGES_CONSTANTS,
  Icon,
  IconFrame,
  ICON_CONSTANTS,
  ICON_FRAME_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  PlainCard,
} from '@teachmint/krayon'
import {VEHICLE_OPTIONS} from '../../../VehiclesPage/constants'

export default function VehicleTrackingCard({data, setSelectedVehicle}) {
  const {t} = useTranslation()
  const handleVehicleSelect = () => {
    setSelectedVehicle(data)
  }

  // const TRIP_STATUS_MAPPING = {
  //   DELAYED: t('delayed'),
  //   ONTIME: t('onTime'),
  //   'Not Available': t('notAvailable'),
  // }
  return (
    <PlainCard className={styles.card} onClick={handleVehicleSelect}>
      <IconFrame
        size={ICON_FRAME_CONSTANTS.SIZES.XXXX_LARGE}
        type={ICON_FRAME_CONSTANTS.TYPES.INVERTED}
      >
        <Icon
          size={ICON_CONSTANTS.SIZES.SMALL}
          name="bus1"
          className={styles.busIcon}
        />
      </IconFrame>
      <div className={styles.busInfo}>
        <Para
          weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
          type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
        >
          {data.number}
        </Para>
        <Para
          textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
          className={styles.busDesc}
        >
          {data?.vehicle_name && (
            <>
              <div>{data?.vehicle_name}</div>
              <div className={styles.dot}></div>
            </>
          )}
          <div>{`${data.seating_capacity}
          ${t('seater')} ${
            VEHICLE_OPTIONS.find((item) => item.value === data?.vehicle_type)
              .label
          }`}</div>
        </Para>
      </div>
      {/* <Badges
        label={TRIP_STATUS_MAPPING[data?.trip_status]}
        type={
          data?.trip_status === 'ONTIME'
            ? BADGES_CONSTANTS.TYPE.SUCCESS
            : BADGES_CONSTANTS.TYPE.ERROR
        }
        size={BADGES_CONSTANTS.SIZE.SMALL}
        showIcon={false}
        className={styles.badge}
      /> */}
    </PlainCard>
  )
}
