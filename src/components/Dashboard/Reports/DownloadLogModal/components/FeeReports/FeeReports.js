import {Table} from '@teachmint/common'
import React from 'react'
import styles from '../../DownloadLogModal.module.css'
import reportStyles from '../../../Reports.module.css'
import {FEE_REPORT_LOG_TABLE_COLUMNS, FEE_REPORT_TYPE} from '../../../constant'
import UserProfile from '../../../../../Common/UserProfile/UserProfile'
import {DateTime} from 'luxon'
import classNames from 'classnames'
import {useTranslation} from 'react-i18next'
import NoActivity from '../NoActivity/NoActivity'

export default function FeeReports({reportList = []}) {
  const {t} = useTranslation()

  const rows = reportList.map((rowData) => ({
    id: rowData._id,
    empName: (
      <div className="flex">
        <UserProfile
          name={rowData?.user.name}
          phoneNumber={rowData?.user.role_name}
          image={rowData?.user?.img_url}
        />
      </div>
    ),
    reportType: (
      <div
        className={classNames(styles.tag, {
          [styles.tagPrimary]:
            rowData.meta_info?.fee_report_type === FEE_REPORT_TYPE.TRANSACTION,
          [styles.tagWarning]:
            rowData.meta_info?.fee_report_type === FEE_REPORT_TYPE.COLLECTIONS,
        })}
      >
        {rowData.meta_info?.fee_report_type}
      </div>
    ),
    dateRange: (
      <div>
        {rowData?.start_date && rowData?.end_date ? (
          `${DateTime.fromSeconds(rowData.start_date).toFormat(
            `dd LLL, yy`
          )} - ${DateTime.fromSeconds(rowData.end_date).toFormat(`dd LLL, yy`)}`
        ) : (
          <div
            className={classNames(
              reportStyles.dFlex,
              reportStyles.justifyCenter
            )}
          >
            -
          </div>
        )}
      </div>
    ),
    downloadDate: (
      <div>
        {DateTime.fromSeconds(rowData.c).toFormat(`hh:mm a, LLL dd, yyyy`)}
      </div>
    ),
  }))

  if (!reportList.length) {
    return <NoActivity />
  }

  const cols = FEE_REPORT_LOG_TABLE_COLUMNS.map((col) => {
    return {...col, label: t(col.label)}
  })

  return <Table rows={rows} cols={cols} uniqueKey="id" />
}
