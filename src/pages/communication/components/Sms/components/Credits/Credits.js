import {useDispatch, useSelector} from 'react-redux'
import styles from './Credits.module.css'
import {
  IconFrame,
  ICON_FRAME_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
} from '@teachmint/krayon'
import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {RechargeComp} from '../RechargeComp/RechargeComp'
import {Divider} from '@teachmint/krayon'
import {setRechargeOpen} from '../../../../redux/actions/smsActions'
import {events} from '../../../../../../utils/EventsConstants'
import classNames from 'classnames'
export const Credits = ({
  isExternalRechargeOpen = false,
  showText = true,
  classes,
}) => {
  const {unusedQuota} = useSelector((state) => state.communicationInfo.sms)
  const {selected_users} = useSelector(
    (state) => state.communicationInfo.common
  )
  const isRechargeOpen = useSelector(
    (state) => state.communicationInfo.sms.isRechargeOpen
  )
  const eventManager = useSelector((state) => state.eventManager)
  const [error, setError] = useState(null)
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const closeRechargeText = () => {
    return (
      <div className={styles.closeIconContainer}>
        <div>{t('close')}</div>
        <Icon
          name="chevronUp"
          type={ICON_CONSTANTS.TYPES.PRIMARY}
          size={ICON_CONSTANTS.SIZES.XX_SMALL}
        />
      </div>
    )
  }
  const onRechargeClick = () => {
    eventManager.send_event(
      !isRechargeOpen
        ? events.COMMS_SMS_RECHARGE_BALANCE_CLICKED_TFI
        : events.COMMS_SMS_RECHARGE_BALANCE_CLOSED_TFI
    )
    dispatch(setRechargeOpen(!isRechargeOpen))
  }
  useEffect(() => {
    if (selected_users.length > unusedQuota) {
      setError(t('smsBalanceLow'))
    } else {
      setError(null)
    }
  }, [selected_users, unusedQuota])
  return (
    <div className={styles.outerContainer}>
      <div className={classNames(styles.container, classes?.icon)}>
        <div className={classNames(styles.iconContainer)}>
          <IconFrame
            type={ICON_FRAME_CONSTANTS.TYPES.PRIMARY}
            size={ICON_FRAME_CONSTANTS.SIZES.XXX_LARGE}
            children={
              <Icon
                name="walletBalance"
                type={ICON_CONSTANTS.TYPES.BASIC}
                size={ICON_CONSTANTS.SIZES.XX_SMALL}
                className={styles.walletIcon}
              />
            }
          />
        </div>
        <div className={styles.balanceContainer}>
          <div className={styles.creditCount}>
            <div>{unusedQuota}</div>
            <div className={styles.smsLeftLabel}>{t('smsLeft')}</div>
          </div>
        </div>
        {showText ? (
          <div className={styles.rechargeCtaContainer}>
            <div className={styles.launchOffer} onClick={onRechargeClick}>
              {isRechargeOpen ? closeRechargeText() : t('rechargeBalance')}
            </div>
            {!isRechargeOpen && (
              <div className={styles.rechargeLink}>{t('moreSms')}</div>
            )}
          </div>
        ) : null}
      </div>
      {showText && <Divider spacing="0px" />}
      {error && (
        <div className={styles.errorState}>
          <Icon
            name="error"
            type={ICON_CONSTANTS.TYPES.ERROR}
            version={ICON_CONSTANTS.VERSION.OUTLINED}
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
          />
          <span className={styles.errorStateText}>{error}</span>
        </div>
      )}
      {isRechargeOpen || isExternalRechargeOpen ? (
        <div>
          <RechargeComp />
        </div>
      ) : null}
    </div>
  )
}
