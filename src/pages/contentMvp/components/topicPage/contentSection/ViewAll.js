import React from 'react'
import styles from '../TopicPage.module.css'
import {VIEW_ALL, VIEW_LESS} from '../../../constants'

export default function ViewAll({
  handleShowHideData,
  contentFor,
  remaingCounts,
  isShowAll,
}) {
  return (
    <div className={styles.footSection}>
      <div
        className={styles.viewAllText}
        onClick={() => handleShowHideData(contentFor)}
      >
        {!isShowAll ? `${VIEW_ALL} (${remaingCounts})` : VIEW_LESS}
      </div>
    </div>
  )
}
