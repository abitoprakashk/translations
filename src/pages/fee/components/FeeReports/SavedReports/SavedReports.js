import React from 'react'
import {Icon, Table} from '@teachmint/common'
import {useState} from 'react'
import styles from './SaveReports.module.css'
import classNames from 'classnames'
import {useTranslation} from 'react-i18next'
import {
  SAVED_REPORTS_TABLE_COLUMNS,
  VIEW_ALL,
  VIEW_LESS,
} from '../../../fees.constants'

export default function SavedReports({savedReportsList = []}) {
  const [isSavedReportsListShown, setIsSavedReportsListShown] = useState(false)
  const [viewAllSavedReportList, setViewAllSavedReportList] = useState(false)
  const {t} = useTranslation()

  const rows = savedReportsList.map((rowData) => ({
    reportName: (
      <div className={styles.flex}>
        <div className={styles.reportNameText}>{rowData.name}</div>
      </div>
    ),
    adminDetailsDate: (
      <div className={styles.adminDetailsAndDateSection}>
        <div className={styles.adminNameText}>{rowData.name}</div>
        <div className={styles.detailsText}>{rowData.mobile}</div>
      </div>
    ),
    action: (
      <div className={styles.actionSection}>
        <span className={styles.downloadReportBtnSection}>
          <Icon color="primary" name="download" size="xs" />{' '}
          <span className={styles.downloadReportText}>{t('download')}</span>
        </span>
        <span className={styles.verticalDivader}></span>
        <span className={styles.iconsButtonSection}>
          {/* <span>
            <Icon color="primary" name="edit" size="xs" type="outlined" />
          </span> */}
          <span>
            <Icon color="error" name="delete" size="xs" type="outlined" />
          </span>
        </span>
      </div>
    ),
  }))

  // const onRowSelect = (selectedRows) => console.log(selectedRows)
  return (
    <div>
      <div
        className={styles.headingSection}
        onClick={() => setIsSavedReportsListShown(!isSavedReportsListShown)}
      >
        <div className={styles.headingText}>SavedReports - 1000</div>
        <div
          // onClick={() => setIsSavedReportsListShown(!isSavedReportsListShown)}
          className={classNames(styles.headingSectionIcon, {
            [styles.headingSectionIconRight]: !isSavedReportsListShown,
          })}
        >
          <Icon color="basic" name="downArrow" size="xxs" />
        </div>
      </div>
      <div>
        {isSavedReportsListShown && (
          <div>
            <div
              className={classNames({
                [styles.SavedReportsTableSection]: !viewAllSavedReportList,
              })}
            >
              <Table
                rows={rows}
                cols={SAVED_REPORTS_TABLE_COLUMNS.map((col) => {
                  return {
                    key: col.key,
                    label: t(col.label),
                  }
                })}
                // onRowSelect={onRowSelect}
                allRowsSelected={true}
              />
            </div>
            <div className={styles.viewAllBtnSection}>
              <span
                className={styles.viewAllBtn}
                onClick={() =>
                  setViewAllSavedReportList(!viewAllSavedReportList)
                }
              >
                {!viewAllSavedReportList ? t(VIEW_ALL) : t(VIEW_LESS)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
