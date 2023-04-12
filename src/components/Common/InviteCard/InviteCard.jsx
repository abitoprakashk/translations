import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Trans, useTranslation} from 'react-i18next'
import {showToast} from '../../../redux/actions/commonAction'
import {getTeacherInviteMsg} from '../../../utils/Helpers'

export default function InviteCard({title}) {
  const dispatch = useDispatch()
  const {instituteInfo, adminInfo} = useSelector((state) => state)
  const {t} = useTranslation()

  const handleCopy = () => {
    navigator?.clipboard?.writeText(
      getTeacherInviteMsg(
        adminInfo.name,
        instituteInfo._id,
        instituteInfo.name,
        adminInfo._id,
        instituteInfo.institute_type
      )
    ) &&
      dispatch(
        showToast({
          type: 'success',
          message: t('successfullyCopiedToClipboard'),
        })
      )
  }

  return (
    <div className="w-full rounded-xl tm-bgcr-gy-3 p-5 break-words">
      <div className="flex justify-between">
        <div>
          <div className="tm-hdg tm-hdg-16">{title}</div>
          <div className="tm-para tm-para-14 mt-1">
            <Trans i18nKey="inviteCardInstituteId">
              Institute ID: {instituteInfo?._id}
            </Trans>
          </div>
        </div>
        <img
          src="https://storage.googleapis.com/tm-assets/icons/blue/copy-blue.svg"
          alt=""
          className="w-4 h-4 cursor-pointer"
          onClick={handleCopy}
        />
      </div>
    </div>
  )
}
