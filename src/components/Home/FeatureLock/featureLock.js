import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {showFeatureLockAction} from '../../../redux/actions/commonAction'
import lockedIcon from '../../../assets/images/icons/popup/locked-red.svg'
import history from '../../../history'
import {events} from '../../../utils/EventsConstants'
import AcknowledgementPopup from '../../Common/AcknowledgementPopup/AcknowledgementPopup'
import {PRICING} from '../../../utils/SidebarItems'
import {isAndroidWebview, isIOSWebview} from '@teachmint/krayon'

export default function FeatureLock() {
  const {eventManager} = useSelector((state) => state)

  const dispatch = useDispatch()
  const {t} = useTranslation()
  const setShowFeatureLockAction = (flag) =>
    dispatch(showFeatureLockAction(flag))

  const isWebview = () => !!(isAndroidWebview() || isIOSWebview())

  const trackEvent = (eventName) => {
    eventManager.send_event(eventName, {screen_name: 'LOCKED_FEATURE'})
  }

  return (
    <>
      <AcknowledgementPopup
        onClose={setShowFeatureLockAction}
        onAction={() => {
          if (isWebview()) setShowFeatureLockAction(false)
          else {
            trackEvent(events.VIEW_YOUR_PLANS_CLICKED_TFI)
            history.push(PRICING)
          }
        }}
        icon={lockedIcon}
        title={t('featureLocked')}
        desc={isWebview() ? '' : t('featureLockedDesc')}
        primaryBtnText={isWebview() ? t('close') : t('viewPlans')}
      />
    </>
  )
}
