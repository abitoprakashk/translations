import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import OnboardingSteps from '../../Dashboard/OnboardingSteps/OnboardingSteps'
import Benefits from '../../Dashboard/Benefits/Benefits'
import Pricing from '../../Dashboard/Pricing/Pricing'
import Congrats from '../../Dashboard/Congrats/Congrats'
import ConfirmationPopup from '../../Common/ConfirmationPopup/ConfirmationPopup'
import {getScreenWidth, getTeacherInviteMsg} from '../../../utils/Helpers'
import inviteTeacherIcon from '../../../assets/images/icons/popup/invite-teacher.png'
import {events} from '../../../utils/EventsConstants'
const {t} = useTranslation()

export default function EmptyDashboard({setToastData}) {
  const [showInviteRequestPopup, setShowInviteRequestPopup] = useState(false)
  const {instituteInfo, adminInfo, eventManager} = useSelector((state) => state)

  const handleTeacherInviteShare = () => {
    if (navigator && navigator.share && getScreenWidth() < 1024)
      navigator.share({
        text: getTeacherInviteMsg(
          adminInfo.name,
          instituteInfo._id,
          instituteInfo.name,
          adminInfo._id,
          instituteInfo.institute_type
        ),
      })
    else setShowInviteRequestPopup(true)
  }

  const handleCopy = () => {
    eventManager.send_event(events.INSTITUTE_LINK_COPIED)
    setShowInviteRequestPopup(false)
    setToastData({type: true, text: t('successfullyCopied')}, 0)
    navigator.clipboard.writeText(
      getTeacherInviteMsg(
        adminInfo.name,
        instituteInfo._id,
        instituteInfo.name,
        instituteInfo.institute_type
      )
    )
    setToastData(null, 4000)
  }

  return (
    <div>
      {showInviteRequestPopup ? (
        <ConfirmationPopup
          onClose={setShowInviteRequestPopup}
          onAction={handleCopy}
          icon={inviteTeacherIcon}
          title="Invite Teachers"
          desc={getTeacherInviteMsg(
            adminInfo && adminInfo.name,
            instituteInfo && instituteInfo._id,
            instituteInfo && instituteInfo.name,
            adminInfo && adminInfo._id,
            instituteInfo && instituteInfo.institute_type
          )}
          primaryBtnText={t('cancel')}
          secondaryBtnText={t('copyLink')}
        />
      ) : null}

      <Congrats
        setToastData={setToastData}
        handleTeacherInviteShare={handleTeacherInviteShare}
      />
      <OnboardingSteps instituteId={instituteInfo && instituteInfo._id} />
      <Benefits handleTeacherInviteShare={handleTeacherInviteShare} />
      <Pricing screenName="EMPTY_DASHBOARD" />
    </div>
  )
}
