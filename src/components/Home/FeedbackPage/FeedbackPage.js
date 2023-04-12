import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {
  showErrorOccuredAction,
  showLoadingAction,
} from '../../../redux/actions/commonAction'
import {utilsCreateFeedback} from '../../../routes/dashboard'
import popupIcon from '../../../assets/images/icons/tick-bg-green.svg'
import {DASHBOARD} from '../../../utils/SidebarItems'
import AcknowledgementPopup from '../../Common/AcknowledgementPopup/AcknowledgementPopup'
import history from '../../../history'
import {events} from '../../../utils/EventsConstants'
import {useLocation} from 'react-router-dom'

export default function FeedbackPage() {
  const [feedbackTxt, setFeedbackTxt] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const {eventManager} = useSelector((state) => state)
  const {query} = useLocation()
  const prevLocation = query?.split('/')

  const setShowPopupWrapper = () => {
    setShowPopup(false)
    history.push(DASHBOARD)
  }

  const sendFeedback = (feedbackTxt) => {
    if (feedbackTxt && feedbackTxt.trim().length > 0) {
      dispatch(showLoadingAction(true))
      utilsCreateFeedback(feedbackTxt, 'institute', prevLocation?.at(-1))
        .then(() => {
          setFeedbackTxt('')
          setShowPopup(true)
        })
        .catch(() => dispatch(showErrorOccuredAction(true)))
        .finally(() => dispatch(showLoadingAction(false)))
    }
  }
  return (
    <div className="px-4 py-4 lg:px-6 lg:pb-6 lg:pt-3">
      {showPopup ? (
        <AcknowledgementPopup
          onClose={setShowPopup}
          onAction={setShowPopupWrapper}
          icon={popupIcon}
          title={t('feedbackReceived')}
          desc={t('feedbackReceivedDesc')}
          primaryBtnText={t('goToDashboard')}
        />
      ) : null}

      <div className="bg-white p-3 tm-border-radius1 tm-box-shadow1 lg:p-4">
        <div className="tm-h5">{t('yourFeedbackValuable')}</div>

        <textarea
          rows="10"
          maxLength="500"
          className="mt-3 w-full outline-none tm-border1 tm-border-radius1 px-3 py-3 tm-h6"
          onChange={(e) => {
            setFeedbackTxt(String(e.target.value).trimLeft())
          }}
          placeholder={t('writeYourFeedbackHere')}
          value={feedbackTxt}
          autoFocus
        />
      </div>

      <div
        className={`tm-btn1 mt-8 lg:w-60 lg:float-right lg:mt-4 ${
          !feedbackTxt
            ? 'tm-bg-dark-gray tm-color-text-secondary-imp'
            : 'tm-bg-blue'
        }`}
        onClick={() => {
          eventManager.send_event(events.FEEDBACK_SUBMITTED_TFI)
          sendFeedback(feedbackTxt)
        }}
      >
        {t('submit')}
      </div>
    </div>
  )
}
