import React from 'react'
import {useSelector} from 'react-redux'
import congratsBGImage from '../../../assets/images/dashboard/congrats-bg.png'
import congratsIcon from '../../../assets/images/icons/congrats-icon.svg'
import {getTeacherInviteMsg} from '../../../utils/Helpers'
import {events} from '../../../utils/EventsConstants'
import {useTranslation} from 'react-i18next'

export default function Congrats({setToastData, handleTeacherInviteShare}) {
  const {t} = useTranslation()
  const {instituteInfo, adminInfo, eventManager} = useSelector((state) => state)

  const handleCopy = () => {
    setToastData({type: true, text: t('successfullyCopied')}, 0)
    navigator &&
      navigator.clipboard.writeText(
        getTeacherInviteMsg(
          adminInfo.name,
          instituteInfo._id,
          instituteInfo.name,
          adminInfo._id,
          instituteInfo.institute_type
        )
      )
    setToastData(null, 4000)
  }

  const trackEvent = (eventName) => {
    eventManager.send_event(eventName, {screen_name: 'EMPTY_DASHBOARD'})
  }

  return (
    <div
      className="w-full flex flex-row flex-wrap px-4 py-3 bg-white bg-repeat lg:items-end lg:justify-between tm-border-radius1 tm-box-shadow1"
      style={{backgroundImage: `url(${congratsBGImage})`}}
    >
      <div className="w-full tm-linear-bg-green p-3 tm-border-radius1 tm-remove-bg lg:w-1/2 lg:p-0">
        <div className="tm-h4 tm-color-green">
          {t('congratulations')}
          <img
            className="inline-block ml-2"
            src={congratsIcon}
            alt="Congratulations"
          />
        </div>
        <div className="tm-para2 mt-2">
          {t('instituteCreatedSuccessfullyMsg')}
        </div>
      </div>
      <div className="w-full flex flex-row justify-between mt-3 lg:m-0 lg:w-2/5">
        <div>
          <div className="tm-para3">{t('instituteID')}</div>
          <div className="tm-h6 mt-px">
            {instituteInfo && instituteInfo._id}
            &nbsp;&nbsp;
            <span
              className="tm-color-blue cursor-pointer"
              onClick={() => {
                trackEvent(events.COPY_INSTITUTE_ID_CLICKED_TFI)
                handleCopy()
              }}
            >
              {t('copy')}
            </span>
          </div>
        </div>
        <div
          className="tm-btn2-blue cursor-pointer"
          onClick={() => {
            trackEvent(events.INVITE_TEACHER_CLICKED_TFI)
            handleTeacherInviteShare()
          }}
        >
          {t('inviteTeacher')}
        </div>
      </div>
    </div>
  )
}
