import {BUTTON_CONSTANTS, EmptyState} from '@teachmint/krayon'
import React from 'react'
import {useTranslation} from 'react-i18next'
import styles from './ErrorStateWidget.module.css'

function ErrorStateWidget({onRetry}) {
  const {t} = useTranslation()
  return (
    <EmptyState
      iconName="error"
      content={t('unableToLoadData')}
      button={{
        size: BUTTON_CONSTANTS.SIZE.SMALL,
        version: BUTTON_CONSTANTS.ICON_VERSION.FILLED,
        children: t('tryAgain'),
        type: BUTTON_CONSTANTS.TYPE.TEXT,
        prefixIcon: 'refresh',
        onClick: onRetry,
      }}
      classes={{iconFrame: styles.iconFrame, wrapper: styles.wrapper}}
    />
  )
}

export default ErrorStateWidget
