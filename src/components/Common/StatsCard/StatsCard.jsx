import PropTypes from 'prop-types'
import styles from './StatsCard.module.css'
import {
  Heading,
  Icon,
  IconFrame,
  ICON_CONSTANTS,
  ICON_FRAME_CONSTANTS,
  Para,
  PlainCard,
  Tooltip,
  TOOLTIP_CONSTANTS,
} from '@teachmint/krayon'
import classNames from 'classnames'
import history from '../../../history'

export default function StatsCard({
  title,
  value,
  iconName,
  classes,
  handleClick,
  link,
  subTitleIcon,
  subTitleText,
  hideArrow,
}) {
  return (
    <PlainCard
      className={classNames(styles.card, classes?.card)}
      onClick={() => {
        if (link) history.push(link)
        handleClick?.()
      }}
    >
      <div className={`${styles.flexRow}`}>
        {iconName && (
          <div className={styles.header}>
            <IconFrame
              size={ICON_FRAME_CONSTANTS.SIZES.LARGE}
              className={classes?.iconFrame}
            >
              <Icon
                type={ICON_CONSTANTS.TYPES.INVERTED}
                size={ICON_CONSTANTS.SIZES.XX_SMALL}
                name={iconName}
                className={classes?.icon}
              />
            </IconFrame>
          </div>
        )}
        <div className={styles.flexColumn}>
          <Heading className={classNames(styles.value, classes?.value)}>
            {value}
          </Heading>
          <div className={styles.titleWrapper}>
            <Para className={classes?.title}> {title}</Para>

            {subTitleIcon && subTitleText && (
              <div>
                <div
                  data-tip
                  data-for="extraInfo"
                  className={styles.routeHeaderIconWrapper}
                >
                  <Icon
                    name={subTitleIcon}
                    version={ICON_CONSTANTS.VERSION.FILLED}
                    type={ICON_CONSTANTS.TYPES.WARNING}
                    size={ICON_CONSTANTS.SIZES.XX_SMALL}
                  />
                </div>

                <Tooltip
                  toolTipId="extraInfo"
                  place={TOOLTIP_CONSTANTS.TOOLTIP_POSITIONS.TOP}
                  toolTipBody={subTitleText}
                ></Tooltip>
              </div>
            )}
          </div>
        </div>
      </div>
      {!hideArrow && (
        <Icon size={ICON_CONSTANTS.SIZES.XX_SMALL} name="forwardArrow" />
      )}
    </PlainCard>
  )
}

StatsCard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
  iconName: PropTypes.string,
  handleClick: PropTypes.func,
  link: PropTypes.string,
  classes: PropTypes.shape({
    card: PropTypes.string,
    iconFrame: PropTypes.string,
    icon: PropTypes.string,
    title: PropTypes.string,
    value: PropTypes.string,
  }),
}

StatsCard.defaultProps = {
  title: '',
  value: '',
  iconName: '',
  handleClick: () => {},
  link: null,
  classes: {},
}
