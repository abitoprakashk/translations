import React from 'react'
import styles from './TemplateThumbnail.module.css'
import classNames from 'classnames'
import TemplateThumbnailImage from './../../../../../../../../../assets/images/dashboard/template-thumbnail.svg'

export default function TemplateThumbnail({
  details,
  onTemplateClick,
  isSelected,
}) {
  return (
    <div className={styles.wrapper} onClick={onTemplateClick}>
      <img
        className={classNames(
          {
            [styles.selected]: isSelected,
          },
          styles.thumbnail
        )}
        src={TemplateThumbnailImage}
      />
      <div>{details?.name}</div>
    </div>
  )
}
