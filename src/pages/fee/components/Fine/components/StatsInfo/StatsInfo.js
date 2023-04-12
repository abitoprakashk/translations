import React from 'react'
import {useTranslation} from 'react-i18next'
import StatsCard from '../../../tfi-common/StatsCard/StatsCard'
import styles from './StatsInfo.module.css'
import {numDifferentiation} from '../../../../../../utils/Helpers'

export default function StatsInfo({applied = 0, paid = 0, due = 0}) {
  const {t} = useTranslation()
  const statsData = [
    {
      id: 1,
      type: 'basic',
      title: numDifferentiation(Number(applied).toFixed(2)),
      subText: t('totalApplied'),
    },
    {
      id: 2,
      type: 'success',
      title: numDifferentiation(Number(paid).toFixed(2)),
      subText: t('collected'),
    },
    {
      id: 3,
      type: 'error',
      title: numDifferentiation(Number(due).toFixed(2)),
      subText: t('due'),
    },
    // {
    //   id: 4,
    //   type: 'secondary',
    //   title: '$ 10 L',
    //   subText: 'Collected',
    // },
  ]
  return (
    <div className={styles.statesCardSection}>
      {statsData.map((stats) => (
        <StatsCard
          key={stats.id}
          title={stats.title}
          subText={stats.subText}
          type={stats.type}
        />
      ))}
    </div>
  )
}
