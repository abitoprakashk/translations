import styles from './CustomTooltip.module.css'
import {
  Heading,
  HEADING_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  Badges,
  BADGES_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
} from '@teachmint/krayon'
import classNames from 'classnames'
import GeoFenceTooltipImage from '../../assets/images/geofence-tooltip.svg'
import BiometricTooltipImage from '../../assets/images/biometric-tooltip.svg'
import {ATTENDANCE_METHOD} from '../../constants/shift.constants'

export default function CustomTooltip({
  type,
  header,
  text,
  subHeader,
  subTextList,
}) {
  const TOOLTIP_MAP = {
    [ATTENDANCE_METHOD.GEOFENCE]: {
      imgSrc: GeoFenceTooltipImage,
      styleClass: 'geofence',
    },
    [ATTENDANCE_METHOD.BIOMETRIC]: {
      imgSrc: BiometricTooltipImage,
      styleClass: 'biometric',
    },
  }
  return (
    <div className={styles.tooltipBody}>
      <div>
        <Heading
          textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
          className={styles.tooltipHeader}
        >
          {header}
        </Heading>
        <Para
          type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}
          textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
          className={classNames(styles.tooltipText)}
        >
          {text}
        </Para>
        {subHeader && (
          <Badges
            type={BADGES_CONSTANTS.TYPE.SUCCESS}
            label={subHeader}
            inverted
            showIcon={false}
            className={styles.badge}
          />
        )}
        {subTextList?.length > 0 && (
          <div>
            {subTextList?.map((text, index) => {
              return (
                <Para
                  key={index}
                  type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}
                  textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                  className={styles.tooltipText}
                >
                  <Icon
                    name="checkCircle"
                    type={ICON_CONSTANTS.TYPES.SUCCESS}
                    size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                  />
                  {text}
                </Para>
              )
            })}
          </div>
        )}
      </div>
      <div>
        <img
          alt="tooltip-img"
          src={TOOLTIP_MAP[type].imgSrc}
          className={styles[TOOLTIP_MAP[type].styleClass]}
        />
      </div>
    </div>
  )
}
