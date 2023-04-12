import React from 'react'
import styles from './StatsContainer.module.css'
import {useTranslation} from 'react-i18next'
import {getAmountFixDecimalWithCurrency} from '../../../../../../../../../utils/Helpers'
import {useSelector} from 'react-redux'
import {DateTime} from 'luxon'
import {Divider} from '@teachmint/krayon'

export default function StatsContainer({previousSessionDue}) {
  const {t} = useTranslation()
  const {instituteInfo, instituteAcademicSessionInfo} = useSelector(
    (state) => state
  )
  const DividerComponent = () => {
    return <Divider isVertical length="40px" spacing="0px" thickness="1px" />
  }

  const sessionName = instituteAcademicSessionInfo.find(
    (session) => session._id == previousSessionDue?.prev_due_session_id
  )?.name

  const StatInfo = ({title, description}) => {
    return (
      <div className={styles.stats}>
        <span className={styles.statTitle}>{title}</span>
        <span className={styles.statDescription}>{description}</span>
      </div>
    )
  }
  return (
    <div className={styles.statsContainer}>
      <StatInfo
        title={t('statsInfoTypeTitle')}
        description={t('statsInfoTypeDescription')}
      />
      <DividerComponent />
      <StatInfo
        title={t('statsInfoImportTitle')}
        description={sessionName || t('statsInfoImportDescription')}
      />
      <DividerComponent />
      <StatInfo
        title={t('statsInfoTotalStudentsTitle')}
        description={previousSessionDue?.students.length}
      />
      <DividerComponent />
      <StatInfo
        title={t('statsInfoReceiptSeriesTitle')}
        description={
          previousSessionDue?.receipt_prefix +
          '-' +
          previousSessionDue?.series_starting_number
        }
      />
      <DividerComponent />
      <StatInfo
        title={t('statsInfoDueDataTitle')}
        description={
          previousSessionDue?.schedule_timestamps[0]
            ? DateTime.fromSeconds(
                previousSessionDue?.schedule_timestamps[0]
              ).toLocaleString(DateTime.DATE_FULL)
            : t('NA')
        }
      />
      <DividerComponent />
      <StatInfo
        title={t('statsInfoTotalAmountTitle')}
        description={getAmountFixDecimalWithCurrency(
          previousSessionDue?.payable_amount || 0,
          instituteInfo.currency
        )}
      />
      <DividerComponent />
      <StatInfo
        title={t('statsInfoImportedOn')}
        description={DateTime.fromSeconds(previousSessionDue?.c).toLocaleString(
          DateTime.DATE_FULL
        )}
      />
    </div>
  )
}
