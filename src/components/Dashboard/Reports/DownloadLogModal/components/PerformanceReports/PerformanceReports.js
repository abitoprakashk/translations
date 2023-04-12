import React from 'react'
import reportStyles from '../../../Reports.module.css'
import {DateTime} from 'luxon'
import UserProfile from '../../../../../Common/UserProfile/UserProfile'
import {PERFORMANCE_REPORT_LOG_TABLE_COLUMNS} from '../../../constant'
import {Icon, Table} from '@teachmint/common'
import classNames from 'classnames'
import {useTranslation} from 'react-i18next'
import NoActivity from '../NoActivity/NoActivity'

export default function PerformanceReports({reportList}) {
  const {t} = useTranslation()

  const rows = reportList.map((rowData) => ({
    id: rowData._id,
    empName: (
      <div className="flex">
        <UserProfile
          name={rowData?.user.name}
          phoneNumber={rowData?.user.role_name}
        />
      </div>
    ),
    downloadUrl: (
      <div
        className={classNames(reportStyles.dFlex, reportStyles.justifyCenter)}
      >
        {rowData?.download_url ? (
          <a href={`${rowData?.download_url}`} target="_blank" rel="noreferrer">
            <Icon
              color="primay"
              name="download"
              size="xs"
              type="filled"
              className={classNames(
                reportStyles.downlodUlrIcon,
                reportStyles.higherspecifisity
              )}
            />
          </a>
        ) : (
          '-'
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

  const cols = PERFORMANCE_REPORT_LOG_TABLE_COLUMNS.map((col) => {
    return {...col, label: t(col.label)}
  })

  return <Table rows={rows} cols={cols} uniqueKey="id" />
}
