import {ErrorOverlay} from '@teachmint/common'
import {Button} from '@teachmint/krayon'
import classNames from 'classnames'
import React from 'react'
import {useTranslation} from 'react-i18next'
import styles from './RetryOverlay.module.css'

function RetryOverlay({onretry}) {
  const {t} = useTranslation()
  return (
    <ErrorOverlay>
      <div className={classNames(styles.alignCenter, styles.column)}>
        <div>{t('somethingWentWrong')}</div>
        <Button className={styles.retry} onClick={onretry} type="secondary">
          {t('retry')}
        </Button>
      </div>
    </ErrorOverlay>
  )
}

export default RetryOverlay
