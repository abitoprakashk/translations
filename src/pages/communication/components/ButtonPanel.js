import classNames from 'classnames'
import React from 'react'
import {Button, StickyFooter} from '@teachmint/common'
import {useSelector} from 'react-redux'
import {events} from '../../../utils/EventsConstants'
import styles from '../Communication.module.css'
import {announcementType} from '../constants'
import {getPostTypeInText} from '../commonFunctions'
import {useTranslation} from 'react-i18next'

const ButtonPanel = ({
  isNext,
  nextStep,
  postAnnouncement,
  isDisable,
  handlePreviousButtonClick,
  showPrevious,
  screenName,
}) => {
  const {t} = useTranslation()

  const {eventManager} = useSelector((state) => state)
  const announcement_type = useSelector(
    (state) => state.communicationInfo.common.announcement_type
  )
  const {communicationInfo} = useSelector((state) => state)
  const {
    popup: {popupInfo},
  } = useSelector((state) => state)

  const getPostTitle = () => {
    let post_title = communicationInfo.announcement.title
    if (announcement_type === announcementType.FEEDBACK) {
      post_title = communicationInfo.feedback.message
    } else if (announcement_type === announcementType.POLL) {
      post_title = communicationInfo.poll.message
    }
    return post_title
  }

  const handleSubmitClick = () => {
    if (isNext) {
      nextStep()
      return
    }

    if (announcement_type === announcementType.FEEDBACK) {
      eventManager.send_event(events.ANONYMOUS_RESPONSE_CONFIRMATION_TFI, {
        post_type: getPostTypeInText(announcement_type),
        anonymous: communicationInfo.common.is_anonymous,
      })
    } else if (announcement_type === announcementType.POLL) {
      eventManager.send_event(events.POLL_RESULTS_VISIBILITY_CONFIRMATION_TFI, {
        post_type: getPostTypeInText(announcement_type),
        visible_to_respondent: communicationInfo.poll.is_poll_public,
      })
    }

    eventManager.send_event(events.NEW_POST_CONFIRMATION_POPUP_SHOWN_TFI, {
      post_type: getPostTypeInText(announcement_type),
      post_title: getPostTitle(),
      screen_name: screenName || 'communication',
      selected: communicationInfo.common.total_no_of_users,
      user_segments: communicationInfo.common.user_filter_tags.length
        ? communicationInfo.common.user_filter_tags.map((tag) => tag.name)
        : communicationInfo.common.segments,
      nudge_type: communicationInfo.common.selectAll
        ? popupInfo?.popup_type
        : null,
      user_ids: communicationInfo.common.selected_users,
      template_type: communicationInfo.comm_templates.currentTemplate,
    })

    postAnnouncement()
  }

  return (
    <StickyFooter forSlider>
      <div className={classNames(styles.buttonPanel)}>
        {showPrevious && (
          <Button type="border" onClick={handlePreviousButtonClick}>
            {t('previous')}
          </Button>
        )}

        <Button disabled={isDisable} onClick={handleSubmitClick}>
          {isNext ? t('next') : t('post')}
        </Button>
      </div>
    </StickyFooter>
  )
}

export default ButtonPanel
