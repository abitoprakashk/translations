import React from 'react'
import styles from './ReportContentModal.module.css'
import classNames from 'classnames'
import {Icon} from '@teachmint/common'
import {REPORT_CONTENT_MODAL} from '../../../constants'

export default function ContentReported({handleReportedBtnClick}) {
  return (
    <div className={styles.section}>
      <div className={classNames(styles.alertIconDiv, styles.alertDivGreen)}>
        <Icon
          name="checkCircle"
          type="filled"
          size="4xl"
          className={styles.checkedIcon}
          color="success"
        />
      </div>
      <div className={styles.reportContentText}>
        {REPORT_CONTENT_MODAL.reportedReqTitle}
      </div>
      <div className={styles.reportContentsubTitleText}>
        {REPORT_CONTENT_MODAL.reportedReqSubTitle}
      </div>

      <div className={styles.buttonSection}>
        <button
          className={classNames(styles.reportBtn, styles.reportedSuccesBtn)}
          onClick={handleReportedBtnClick}
        >
          {REPORT_CONTENT_MODAL.okayBtnText}
        </button>
      </div>
    </div>
  )
}
