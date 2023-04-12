import React from 'react'
import styles from './TopicCard.module.css'
import contentStyles from '../../../Content.module.css'
import classNames from 'classnames'
import {CAPITALIZED_TEXT_PAGES} from '../../../constants'
import {Card} from '@teachmint/common'
import DotsMenuButton from '../../dotsMenuButton/DotsMenuButton'

export default function StudyMaterialCard({
  studyMaterialInfo,
  handleStudyMaterialClick,
  dropdownMenuItems,
}) {
  return (
    <Card
      className={classNames(
        styles.studyMaterialSection,
        styles.topicCardSection
      )}
    >
      <div className={styles.studyMaterialHeaderSection}>
        <div className={styles.dotsBtnDiv}>
          <DotsMenuButton
            content={studyMaterialInfo}
            dropdownMenuItems={dropdownMenuItems}
          />
        </div>
      </div>
      <div
        className={styles.studyMaterialThumbnailDiv}
        onClick={() => handleStudyMaterialClick(studyMaterialInfo)}
      >
        <div className={styles.thumbnailDiv}>
          <img
            className={styles.studyThubmnailImg}
            src={studyMaterialInfo.thumbnail_url}
            alt="thumbnail image"
          />
          <div className={styles.videoTime}>
            {studyMaterialInfo.pdf_page_count} {CAPITALIZED_TEXT_PAGES}
          </div>
        </div>
      </div>
      <div className={styles.titleText}>
        <span
          className={contentStyles.ellipsisAfterTwoLines}
          title={studyMaterialInfo.content_file_name}
        >
          {studyMaterialInfo?.title}
        </span>
      </div>
    </Card>
  )
}
