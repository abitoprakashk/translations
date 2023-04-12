import fourteenDaysGiftIcon from '../../../assets/images/icons/14-days-gift.svg'
import moment from 'moment'
import AcknowledgementPopup from '../../Common/AcknowledgementPopup/AcknowledgementPopup'
import {showFreeTrialCongratsAction} from '../../../redux/actions/commonAction'
import {useDispatch} from 'react-redux'
import {useEffect} from 'react'

const FreeTrialCongratsPopup = () => {
  const dispatch = useDispatch()
  const setShowFreeTrialCongratsAction = (flag) =>
    dispatch(showFreeTrialCongratsAction(flag))

  useEffect(() => {
    return () => {
      dispatch(showFreeTrialCongratsAction(false))
    }
  }, [])

  return (
    <AcknowledgementPopup
      onClose={setShowFreeTrialCongratsAction}
      onAction={() => setShowFreeTrialCongratsAction(false)}
      icon={fourteenDaysGiftIcon}
      title="14 Days trial activated"
      desc={`Your 14 days free trial for Advanced plan is activated. Trial expires on ${moment(
        Date.now() + 12096e5
      ).format('DD-MM-YYYY')}`}
      primaryBtnText="Start Using"
    />
  )
}

export default FreeTrialCongratsPopup
