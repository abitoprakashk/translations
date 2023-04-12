import {Counter} from '../Counter/Counter'
import styles from './RechargeComp.module.css'
import {Button, Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import {useEffect, useState} from 'react'
import {getSmsUnusedQuotaRequest} from '../../../../redux/actions/smsActions'
import {
  showSuccessToast,
  showErrorToast,
} from '../../../../../../redux/actions/commonAction'
import {
  getSmsOrder,
  verifySmsOrder,
  createSmsOrder,
  setRechargeOpen,
} from '../../../../redux/actions/smsActions'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {Trans} from 'react-i18next'
import {REACT_APP_RAZORPAY_KEY} from '../../../../../../constants'
import {events} from '../../../../../../utils/EventsConstants'
export const RechargeComp = () => {
  const [blocks, setBlocks] = useState(200)
  const {smsOrder, blockPrice} = useSelector(
    (state) => state.communicationInfo.sms
  )
  const eventManager = useSelector((state) => state.eventManager)
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const handleSmsBlocks = (blocks) => {
    setBlocks(blocks)
  }
  const onPaymentSuccess = () => {
    dispatch(getSmsUnusedQuotaRequest())
    dispatch(showSuccessToast(t('paymentSuccess')))
    dispatch(createSmsOrder({}))
    dispatch(setRechargeOpen(false))
  }
  const onPaymentFailure = () => {
    dispatch(showErrorToast(t('paymentFailed')))
    dispatch(createSmsOrder({}))
  }

  const options = {
    key: REACT_APP_RAZORPAY_KEY,
    currency: 'INR',
    name: 'Teachmint',
    order_id: smsOrder?.order_id,
    amount: smsOrder?.amount,
    handler: (data) => {
      dispatch(
        verifySmsOrder({
          payload: {
            ...data,
            transaction_id: smsOrder?.id,
          },
          onSuccess: onPaymentSuccess,
          onFailure: onPaymentFailure,
        })
      )
    },
  }
  const rzp = new window.Razorpay(options)

  const handlePay = () => {
    eventManager.send_event(events.COMMS_SMS_PAY_BUTTON_CLICKED_TFI, {
      number_of_sms_blocks: blocks,
    })
    dispatch(getSmsOrder({number_of_sms_blocks: blocks}))
  }
  useEffect(() => {
    if (smsOrder?.order_id && smsOrder?.amount) {
      rzp.open()
    }
  }, [smsOrder])
  useEffect(() => {
    return () => {
      dispatch(createSmsOrder({}))
      dispatch(setRechargeOpen(false))
    }
  }, [])
  const buttonText = (
    <div className={styles.button}>
      <div>{t('pay')}</div>
      <Icon
        name="rupeeSymbol1"
        type={ICON_CONSTANTS.TYPES.INVERTED}
        size={ICON_CONSTANTS.SIZES.XXXX_SMALL}
      />
      <div>{blocks * blockPrice}</div>
    </div>
  )
  return (
    <div className={styles.outerWrapper}>
      <div className={styles.leftHalf}>
        <div className={styles.mainHeading}>{t('rechargeWithSms')}</div>
        <div className={styles.desc}>
          <Trans i18nKey={'smsRate'} values={{rate: blockPrice / 10}} />
        </div>
        <Counter handleChange={handleSmsBlocks} />
      </div>
      <div className={styles.rightHalf}>
        <div className={styles.amountText}>
          <Trans i18nKey={'rechargeFor'} values={{count: blocks * 1000}} />
        </div>
        <Button
          isDisabled={blocks < 1}
          children={buttonText}
          width="full"
          onClick={handlePay}
        />
      </div>
    </div>
  )
}
