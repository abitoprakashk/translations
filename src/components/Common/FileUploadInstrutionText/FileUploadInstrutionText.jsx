import {Icon, ICON_CONSTANTS, Para, PARA_CONSTANTS} from '@teachmint/krayon'
import React from 'react'
import styles from './FileUploadInstrutionText.module.css'

export default function FileUploadInstrutionText({heading, helperTextList}) {
  return (
    <div className={styles.wrapper}>
      <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY} className={styles.heading}>
        {heading}
      </Para>
      <div className={styles.rowsWrapper}>
        {helperTextList?.map((info) => (
          <div key={info} className={styles.row}>
            <Icon
              name="checkCircle"
              type={ICON_CONSTANTS.TYPES.SUCCESS}
              size={ICON_CONSTANTS.SIZES.XX_SMALL}
            />
            <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>{info}</Para>
          </div>
        ))}
      </div>
    </div>
  )
}
