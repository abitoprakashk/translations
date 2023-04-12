import {BUTTON_CONSTANTS, EmptyState, Para} from '@teachmint/krayon'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'
import {FEE_WIDGET_EVENTS} from '../../events'
import styles from './NoFeeStructure.module.css'

function NoFeeStructure() {
  const {t} = useTranslation()
  const history = useHistory()
  const eventManager = useSelector((state) => state.eventManager)

  return (
    <EmptyState
      iconName="cash"
      content={<Para>{t('noFeeStructureCreated')}</Para>}
      button={{
        size: BUTTON_CONSTANTS.SIZE.SMALL,
        type: BUTTON_CONSTANTS.TYPE.TEXT,
        version: BUTTON_CONSTANTS.ICON_VERSION.FILLED,
        children: t('createNow'),
        onClick: () => {
          history.push(`/institute/dashboard/fee-config/structure?createFee=1`)
          eventManager.send_event(
            FEE_WIDGET_EVENTS.DASHBOARD_FEES_REPORTS_CREATE_FEE_TFI
          )
        },
      }}
      classes={{
        iconFrame: styles.iconFrame,
        wrapper: styles.wrapper,
      }}
    />
  )
}

export default NoFeeStructure
