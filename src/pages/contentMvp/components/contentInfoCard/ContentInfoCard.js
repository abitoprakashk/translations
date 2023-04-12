import {Icon} from '@teachmint/common'
import classNames from 'classnames'
import React from 'react'
import {CLASS_LIST_COUNT_KEY, STUDY_MATERIALS, VIDEOS} from '../../constants'
import styles from './ContentInfoCard.module.css'

export default function ContentInfoCard({
  topSectionInfo,
  handleCardClick,
  contentCounts = {},
  className = '',
}) {
  return (
    <div
      className={classNames(styles.infoCardSection, className)}
      onClick={handleCardClick}
    >
      <div className={styles.topSection}>
        <div className={styles.topLeftSide}>{topSectionInfo}</div>
        <div>
          <div>
            <img
              className={styles.leftArrow}
              src="https://storage.googleapis.com/tm-assets/icons/primary/right-arrow-primary.svg"
              alt="left arrow"
            />
          </div>
        </div>
      </div>
      <div className={styles.bottomSection}>
        <div className={styles.iconAndTextSec}>
          <span className={styles.iconSpan}>
            <Icon color="secondary" name="camera" size="xxs" type="outlined" />
          </span>
          <span>
            {contentCounts[CLASS_LIST_COUNT_KEY.video] || 0} {VIDEOS}
          </span>
        </div>
        <div className={styles.iconAndTextSec}>
          <span>
            <Icon
              color="secondary"
              name="studyMaterial"
              size="xxs"
              type="outlined"
            />
          </span>
          <span>
            {contentCounts[CLASS_LIST_COUNT_KEY.studyMaterial] || 0}{' '}
            {STUDY_MATERIALS}
          </span>
        </div>
      </div>
    </div>
  )
}
