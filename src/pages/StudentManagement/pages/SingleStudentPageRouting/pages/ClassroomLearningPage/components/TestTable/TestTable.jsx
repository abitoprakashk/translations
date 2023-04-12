import {
  Badges,
  BADGES_CONSTANTS,
  Heading,
  HEADING_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  Table,
} from '@teachmint/krayon'
import React from 'react'
import {CLASS_TEST_TABLE_HEADERS} from '../../ClassroomLearning.constants'
import styles from './TestTable.module.css'
import {DateTime} from 'luxon'
import {t} from 'i18next'

export default function TestTable({data}) {
  const STATUS_MAPPING = {
    SUBMITTED: {
      label: t('submitted'),
      badgeType: BADGES_CONSTANTS.TYPE.SUCCESS,
    },
    NOT_SUBMITTED: {
      label: t('notSubmitted'),
      badgeType: BADGES_CONSTANTS.TYPE.WARNING,
    },
    NOT_EVALUATED: {
      label: t('notEvaluated'),
      styleClass: styles.notEvaluatedStatus,
    },
    ABSENT: {
      label: t('absent'),
      badgeType: BADGES_CONSTANTS.TYPE.ERROR,
    },
  }

  const getScoreUI = (score, totalScore) => (
    <div className={styles.scoreWrapper}>
      {!(score === null || score === undefined) && (
        <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}>
          {score}
        </Heading>
      )}
      <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
        {score === null || score === undefined ? t('na') : `/${totalScore}`}
      </Para>
    </div>
  )

  const getTableRows = () => {
    const rows = []
    if (data?.tests?.length) {
      data.tests.forEach(
        (
          {
            name,
            begin_time,
            end_time,
            status,
            student_score,
            total_marks,
            class_avg_score,
          },
          i
        ) => {
          rows.push({
            id: i,
            title: <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}> {name}</Para>,
            assignedDate: (
              <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
                {begin_time
                  ? DateTime.fromSeconds(begin_time).toFormat('dd/MM/yyyy')
                  : t('na')}
              </Para>
            ),
            score: getScoreUI(student_score, total_marks),
            avgClassScore: getScoreUI(class_avg_score, total_marks),
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
                showIcon={false}
                {...(STATUS_MAPPING[status]?.styleClass
                  ? {className: STATUS_MAPPING[status]?.styleClass}
                  : {inverted: true, type: STATUS_MAPPING[status]?.badgeType})}
              />
            ),
          })
        }
      )
    }
    return rows
  }

  return (
    <Table
      rows={getTableRows()}
      cols={CLASS_TEST_TABLE_HEADERS}
      classes={{table: styles.table}}
    />
  )
}
