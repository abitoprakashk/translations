import React from 'react'
import styles from './ReportContentModal.module.css'
import classNames from 'classnames'
import {Icon} from '@teachmint/common'
import {REPORT_CONTENT_MODAL} from '../../../constants'

export default function ReportContent({
  handleCancleBtnClick,
  handleReportConfirmBtnClick,
}) {
  return (
    <div className={styles.section}>
      <div className={classNames(styles.alertIconDiv, styles.alertDivOrange)}>
        <Icon
          name="error"
          type="outlined"
          size="4xl"
          className={styles.alertIcon}
          color="warning"
        />
      </div>
      <div className={styles.reportContentText}>
        {REPORT_CONTENT_MODAL.title}
      </div>
      <div className={styles.reportContentsubTitleText}>
        {REPORT_CONTENT_MODAL.subTitle}
      </div>
      <div className={styles.buttonSection}>
        <button className={styles.cancleBtn} onClick={handleCancleBtnClick}>
          {REPORT_CONTENT_MODAL.cancleBtnText}
        </button>
        <button
          className={styles.reportBtn}
          onClick={handleReportConfirmBtnClick}
        >
          {REPORT_CONTENT_MODAL.reportBtnText}
        </button>
      </div>
    </div>
  )
}
