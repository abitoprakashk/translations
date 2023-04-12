import {
  Badges,
  BADGES_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  Table,
} from '@teachmint/krayon'
import React from 'react'
import {CLASS_HOMEWORK_TABLE_HEADERS} from '../../ClassroomLearning.constants'
import styles from './HomeworkTable.module.css'
import {DateTime} from 'luxon'
import {t} from 'i18next'

const STATUS_MAPPING = {
  ON_TIME: {label: t('on_Time'), badgeType: BADGES_CONSTANTS.TYPE.SUCCESS},
  LATE: {
    label: t('lateSubmission'),
    badgeType: BADGES_CONSTANTS.TYPE.WARNING,
  },
  NOT_SUBMITTED: {
    label: t('notSubmitted'),
    badgeType: BADGES_CONSTANTS.TYPE.ERROR,
  },
}

export default function HomeworkTable({data}) {
  const getTableRows = () => {
    const rows = []
    if (data?.homeworks?.length) {
      data.homeworks.forEach(({name, start_time, end_time, status}, i) => {
        rows.push({
          id: i,
          title: <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>{name}</Para>,
          assignedDate: (
            <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
              {start_time
                ? DateTime.fromSeconds(start_time).toFormat('dd/MM/yyyy')
                : t('na')}
            </Para>
          ),
          dueDate: (
            <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
              {end_time
                ? DateTime.fromSeconds(end_time).toFormat('dd/MM/yyyy')
                : t('na')}
            </Para>
          ),
          status: (
            <Badges
              label={STATUS_MAPPING[status]?.label}
              inverted={true}
              type={STATUS_MAPPING[status]?.badgeType}
              showIcon={false}
            />
          ),
        })
      })
    }
    return rows
  }

  return (
    <Table
      rows={getTableRows()}
      cols={CLASS_HOMEWORK_TABLE_HEADERS}
      classes={{table: styles.table}}
    />
  )
}
