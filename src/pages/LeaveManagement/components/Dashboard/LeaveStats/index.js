import classNames from 'classnames'
import {t} from 'i18next'
import React from 'react'
import {leaveLabelmap} from '../../../LeaveManagement.constant'

import styles from './styles.module.scss'

const PENDING = 'pending'
const AVAILABLE = 'available'
const TOTAL = 'total'

const statsInfoToShow = [
  {
    key: PENDING,
    label: t('pendingRequests'),
  },
  {
    key: AVAILABLE,
    label: t('available'),
  },
  {
    key: TOTAL,
    label: t('total'),
  },
]

export const LeaveStatsCard = ({type, stats, text = '', className}) => {
  if (!stats || !Object.keys(stats).length) return null

  return (
    <div className={classNames(styles.statsCard, className)}>
      <p className={styles.primary}>{text || leaveLabelmap[type]?.label}</p>
      <div className={classNames(styles.flex, styles.statsInfoWrapper)}>
        {statsInfoToShow.map(({key: infoKey, label}, index) => (
          <React.Fragment key={infoKey}>
            {index > 0 && <div className={styles.statsDivider} />}
            <div className={styles.statsInfo}>
              <span
                className={classNames(styles.statsCount, {
                  [styles.orange]: infoKey == PENDING,
                  [styles.green]: infoKey == AVAILABLE,
                })}
              >
                {stats[infoKey] == 0
                  ? stats[infoKey] || 0
                  : String(stats[infoKey] || 0).padStart(2, 0)}
              </span>
              <br />
              {label}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

const LeaveStats = ({stats, className}) => {
  return (
    <div className={classNames(styles.wrapper, styles.flex, className)}>
      {stats &&
        Object.entries(stats).map(([key, infoStats]) => (
          <LeaveStatsCard key={key} type={key} stats={infoStats} />
        ))}
    </div>
  )
}

export default LeaveStats
