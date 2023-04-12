import React from 'react'
import {useTranslation} from 'react-i18next'

import styles from './SliderHeading.module.css'

const SliderHeading = ({text, icon, iconSize}) => {
  const {t} = useTranslation()
  return (
    <div className={styles.sliderHeadingWrapper}>
      <div className={styles.sliderIconAndHeadingSection}>
        <img
          className={iconSize === 'small' ? styles.smallIcon : ''}
          src={icon}
          alt={t('sliderHeadingIcon')}
        />
        <span className={styles.sliderHeading}>{text}</span>
      </div>
    </div>
  )
}

export default SliderHeading
