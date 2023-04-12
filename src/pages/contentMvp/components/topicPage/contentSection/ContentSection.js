import React from 'react'
import styles from '../TopicPage.module.css'
import {Icon} from '@teachmint/common'
import {VIDEOS, VIDEOS_NOT_FOUND} from '../../../constants'
import ViewAll from './ViewAll'
import NotFoundCard from '../../notFoundCard/NotFoundCard'

export default function ContentSection({
  pageSectionClass,
  contentFor = VIDEOS,
  headingText,
  isShowAll,
  handleShowHideData,
  children,
  remaingCounts,
  totalCount,
  iconNmae,
}) {
  return (
    <div className={pageSectionClass}>
      <div className={styles.headingSection}>
        <Icon name={iconNmae} type="outlined" size="xs" />
        <span className={styles.headingText}>{headingText}</span>
      </div>
      {totalCount > 0 && children}
      {totalCount === 0 && <NotFoundCard text={VIDEOS_NOT_FOUND} />}

      {/* {!isShowAll && remaingCounts > 0 && ( */}
      {remaingCounts > 0 && (
        <ViewAll
          handleShowHideData={handleShowHideData}
          contentFor={contentFor}
          remaingCounts={remaingCounts}
          isShowAll={isShowAll}
        />
      )}
    </div>
  )
}
