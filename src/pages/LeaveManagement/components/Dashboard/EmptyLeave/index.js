import classNames from 'classnames'
import React from 'react'

import {ReactComponent as NoLeaves} from '../../assets/noLeaves.svg'
import {ReactComponent as NoLeavesMobile} from '../../assets/leavemanagement_empty.svg'
import {RequestLeaveButton} from '../../LeaveButtons'

import styles from './styles.module.scss'
import {IS_MOBILE} from '../../../../../constants'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import {LEAVE_BASE_TYPE} from '../../../LeaveManagement.constant'

const EmptyLeave = () => {
  const {t} = useTranslation()
  const {
    [LEAVE_BASE_TYPE.CASUAL]: casualLimit,
    [LEAVE_BASE_TYPE.SICK]: sickLimit,
  } = useSelector(
    (state) =>
      state.leaveManagement.yearlyLeavesOfInstitute?.data?.balance || {}
  )

  return (
    <div
      className={classNames(styles.wrapper, styles.flex, styles.alignCenter)}
    >
      {IS_MOBILE ? (
        <NoLeavesMobile className={styles.banner} height={190} />
      ) : (
        <NoLeaves className={styles.banner} />
      )}
      <h4 className={styles.heading}>{t('noLeaveRequest')}</h4>
      <p className={styles.subHeading}>{t('addedLeaveWillAppearHere')}</p>

      <div className={styles.leaveLimit}>
        <div className={styles.infoTitle}>{t('leaveLimit')}</div>
        <div className={classNames(styles.flex, styles.infoDetailWrapper)}>
          <span className={styles.infoDetail}>
            <span>{sickLimit}</span>
            <br />
            {t('sickLeave')}
          </span>
          <div className={styles.divider} />
          <span className={styles.infoDetail}>
            <span>{casualLimit}</span>
            <br />
            {t('casualLeave')}
          </span>
        </div>
      </div>
      <RequestLeaveButton size="big" className={styles.requestLeaveBtn} />
    </div>
  )
}

export default EmptyLeave
