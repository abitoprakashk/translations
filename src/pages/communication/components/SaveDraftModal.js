import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import ConfirmationPopup from '../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import {announcementType} from '../constants'
import {events} from '../../../utils/EventsConstants'
import {getPostTypeInText} from '../commonFunctions'
import {
  updateCommunicationAction,
  createNewCommunicationAction,
} from '../redux/actions/commonActions'
import {Trans, useTranslation} from 'react-i18next'

const SaveDraftModal = (props) => {
  const {t} = useTranslation()

  const {
    setShowConfirmPopup,
    handleDeclineAnnouncementPost,
    announcement_type,
  } = props
  const {
    communicationInfo,
    currentAdminInfo,
    instituteActiveAcademicSessionId,
    eventManager,
  } = useSelector((state) => state)
  const {announcement, feedback, poll, common, saveDraft} = communicationInfo
  const editPost = useSelector(
    (state) => state.communicationInfo.common.editPost
  )
  const dispatch = useDispatch()

  const onSubmit = () => {
    let obj = {...common, draft: true}
    if (common.announcement_type === announcementType.ANNOUNCEMENT) {
      obj = {...announcement, ...obj}
    } else if (common.announcement_type === announcementType.FEEDBACK) {
      obj = {...feedback, ...obj}
    } else if (common.announcement_type === announcementType.POLL) {
      obj = {...poll, ...obj}
    }
    if (!obj.node_ids.length) {
      obj.node_ids = [instituteActiveAcademicSessionId]
    }
    if (obj._id) {
      dispatch(updateCommunicationAction(obj))
    } else {
      obj.creator_id = currentAdminInfo.imember_id
      dispatch(createNewCommunicationAction(obj))
    }
    setShowConfirmPopup(false)
    const isDraft = true
    handleDeclineAnnouncementPost(isDraft)
  }

  const handleOnActionClick = () => {
    eventManager.send_event(events.EXIT_POST_POPUP_CLICKED_TFI, {
      action_type: 'continue',
      post_type: getPostTypeInText(announcement_type),
      template_type: communicationInfo.comm_templates.currentTemplate,
    })
    setShowConfirmPopup(false)
  }

  let communicationType =
    common.announcement_type === announcementType.ANNOUNCEMENT
      ? t('announcement')
      : common.announcement_type === announcementType.FEEDBACK
      ? t('feedback')
      : common.announcement_type === announcementType.POLL
      ? t('poll')
      : t('SMS')

  return (
    <ConfirmationPopup
      onClose={
        (!saveDraft.saveDraft && !common._id) || editPost
          ? handleDeclineAnnouncementPost
          : onSubmit
      }
      onAction={handleOnActionClick}
      icon={
        'https://storage.googleapis.com/tm-assets/icons/colorful/remove-bg-red.svg'
      }
      title={
        <Trans i18nKey="closeConfirmationPopupTitle">
          Exit without creating {communicationType}?
        </Trans>
      }
      desc={t('closeConfirmationPopupDesc')}
      primaryBtnText={
        (!saveDraft.saveDraft && !common._id) || editPost
          ? t('exit')
          : t('saveAsDraft')
      }
      secondaryBtnText={t('continueEditing')}
    />
  )
}

export default SaveDraftModal
