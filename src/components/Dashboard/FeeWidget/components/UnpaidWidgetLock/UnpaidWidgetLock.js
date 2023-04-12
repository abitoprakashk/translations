import {BUTTON_CONSTANTS, EmptyState, Para} from '@teachmint/krayon'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {useHistory} from 'react-router-dom'
import {PRICING} from '../../../../../utils/SidebarItems'
import styles from './UnpaidWidgetLock.module.css'

function UnpaidWidgetLock() {
  const {t} = useTranslation()
  const history = useHistory()
  return (
    <EmptyState
      iconName="lock"
      content={<Para>{t('upgradeToView')}</Para>}
      button={{
        size: BUTTON_CONSTANTS.SIZE.SMALL,
        type: BUTTON_CONSTANTS.TYPE.TEXT,
        version: BUTTON_CONSTANTS.ICON_VERSION.FILLED,
        children: t('viewPlans'),
        onClick: () => {
          history.push(PRICING)
        },
      }}
      classes={{
        wrapper: styles.unpaidWidgetLockContainer,
        iconFrame: styles.iconFrame,
      }}
    />
  )
}

export default UnpaidWidgetLock
