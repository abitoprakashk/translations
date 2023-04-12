import React from 'react'
import styles from '../../DownloadLogModal.module.css'
import reportStyles from '../../../Reports.module.css'
import {Table} from '@teachmint/common'
import {ATTENDANCE_REPORT_LOG_TABLE_COLUMNS, OTHER} from '../../../constant'
import UserProfile from '../../../../../Common/UserProfile/UserProfile'
import {DateTime} from 'luxon'
import classNames from 'classnames'
import {useTranslation} from 'react-i18next'
import NoActivity from '../NoActivity/NoActivity'

export default function AttendanceReports({reportList = []}) {
  const {t} = useTranslation()

  const classroomWithCount = (classroomsArray) => {
    let strClasses = ''
    if (classroomsArray.length > 2) {
      let slicedArr = classroomsArray.slice(0, 2)
      strClasses = `${slicedArr.join(', ')} + ${classroomsArray.length - 2} ${t(
        OTHER
      )}`
    } else {
      strClasses = classroomsArray.join(',')
    }

    return strClasses
  }

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
    classrooms: (
      <div className={classNames(styles.tag, styles.tagPrimary)}>
        {rowData.meta_info?.classrooms
          ? classroomWithCount(rowData.meta_info?.classrooms)
          : '-'}
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

  const cols = ATTENDANCE_REPORT_LOG_TABLE_COLUMNS.map((col) => {
    return {...col, label: t(col.label)}
  })

  return <Table rows={rows} cols={cols} uniqueKey="id" />
}
