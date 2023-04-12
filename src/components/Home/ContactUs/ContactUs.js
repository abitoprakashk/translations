import React from 'react'
import {Trans, useTranslation} from 'react-i18next'
import contactIllustration from '../../../assets/images/dashboard/contact-us-illustration.svg'
import phoneIcon from '../../../assets/images/icons/phone-primary.svg'
import mailIcon from '../../../assets/images/icons/mail-gray.svg'
import {events} from '../../../utils/EventsConstants'
import {useSelector} from 'react-redux'
import {checkSubscriptionType} from '../../../utils/Helpers'

export default function ContactUs() {
  const {eventManager, instituteInfo} = useSelector((state) => state)

  const isPremium = checkSubscriptionType(instituteInfo)
  const {t} = useTranslation()

  const trackEvent = (eventName) => {
    eventManager.send_event(eventName, {screen_name: 'CONTACT_US'})
  }

  const getBtnsCon = () => (
    <div className="mb-2 static lg:grid lg:grid-cols-2 lg:gap-6 mt-8">
      <div className="w-full bg-white tm-border-radius1 tm-box-shadow1 flex items-end p-3 justify-between mb-3 lg:m-0">
        <div className="flex">
          <img className="w-6 h-6 mr-3 mt-1" src={phoneIcon} alt="phone" />
          <div>
            <div className="tm-h5">{t('callUs')}</div>
            <div className="tm-para2 mt-1">
              {isPremium ? '+91-8035073657' : '+91-8035073710'}
            </div>
          </div>
        </div>
        <a
          className="tm-btn2-blue"
          href="tel:08048363988"
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            trackEvent(events.CALL_US_CLICKED_TFI)
          }}
        >
          {t('callUs')}
        </a>
      </div>
      <div className="w-full bg-white tm-border-radius1 tm-box-shadow1 flex items-end p-3 justify-between lg:m-0">
        <div className="flex">
          <img className="w-6 h-6 mr-3 mt-1" src={mailIcon} alt="email" />
          <div>
            <div className="tm-h5">{t('writeToUs')}</div>
            <div className="tm-para2">support@teachmint.com</div>
          </div>
        </div>
        <a
          className="tm-btn2-blue"
          href="mailto:support@teachmint.com"
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            trackEvent(events.SEND_EMAIL_CLICKED_TFI)
          }}
        >
          {t('sendEmail')}
        </a>
      </div>
    </div>
  )

  return (
    <div className="lg:px-6 lg:pb-6 lg:pt-3">
      <div className="tm-contact-page tm-bg-light-green p-4 relative tm-border-radius1 lg:py-8 lg:px-16 lg:pb-0">
        <div className="flex items-center flex-col pt-12 lg:flex-row lg:justify-between lg:p-0">
          <div className="tm-h2 tm-color-green text-center mb-12 hidden lg:block lg:text-left">
            <Trans i18nKey="weAreHereTo">
              We are here to <br />
              help you!
            </Trans>
          </div>
          <img
            className="w-60 lg:-mb-2"
            src={contactIllustration}
            alt="Contact"
          />
          <div className="tm-h2 tm-color-green text-center mt-12 lg:hidden lg:text-left">
            <Trans i18nKey="weAreHereTo">
              We are here to <br />
              help you!
            </Trans>
          </div>
        </div>

        <div className="lg:hidden">{getBtnsCon()}</div>
      </div>

      <div className="hidden lg:block">{getBtnsCon()}</div>
    </div>
  )
}
