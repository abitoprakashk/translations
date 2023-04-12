import React from 'react'
import {Icon} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import classNames from 'classnames'
import {ICON_SIZES} from '../../../../fees.constants'
import styles from '../../FeeReports.module.css'

const ChequeListBar = ({chequeCount, handleChequeListDownload}) => {
  const {t} = useTranslation()
  return (
    <div className={classNames(styles.instBox)}>
      <Icon
        name="error"
        size={ICON_SIZES.SIZES.XX_SMALL}
        version="outlined"
        type="warning"
      />
      <div>
        {chequeCount}{' '}
        {chequeCount === 1
          ? t('chequesHasCrossDepositDate')
          : t('chequesHaveCrossDepositDate')}
        <span
          className={styles.downloadChequeList}
          onClick={() => handleChequeListDownload()}
        >
          &nbsp;{t('downloadList')}
        </span>
      </div>
    </div>
  )
}

export default ChequeListBar
