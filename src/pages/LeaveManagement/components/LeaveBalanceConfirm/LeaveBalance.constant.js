import {t} from 'i18next'
import styles from './LeaveBalanceConfirm.module.css'
export const LEAVEBALANCE_DEFAULT = [
  {
    title: t('sickLeave'),
    key: 'SICK',
    subtext: (
      <span className={styles.subtext}>
        {t('annualQuota')}
        <span className={styles.dot}></span>
        {t('paid')}
      </span>
    ),
    value: '',
  },
  {
    title: t('casualLeave'),
    key: 'CASUAL',
    subtext: (
      <span className={styles.subtext}>
        {t('annualQuota')}
        <span className={styles.dot}></span>
        {t('paid')}
      </span>
    ),
    value: '',
  },
]
