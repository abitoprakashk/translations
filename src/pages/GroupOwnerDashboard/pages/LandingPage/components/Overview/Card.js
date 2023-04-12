import {
  Heading,
  Icon,
  ICON_CONSTANTS,
  Para,
  HEADING_CONSTANTS,
} from '@teachmint/krayon'
import classNames from 'classnames'
import React from 'react'
import styles from './Card.module.css'

export default function OverviewCard({iconName, text, value, className}) {
  return (
    <div className={classNames(styles.cardBase, className)}>
      <div>
        <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.MEDIUM}>{value}</Heading>
      </div>
      <div className={styles.subHeading}>
        <Icon
          size={ICON_CONSTANTS.SIZES.XX_SMALL}
          type={ICON_CONSTANTS.TYPES.BASIC}
          name={iconName}
          className={styles.iconClass}
        />
        <Para>{text}</Para>
      </div>
    </div>
  )
}
