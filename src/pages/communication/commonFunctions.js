import {announcementType, POST_TYPE} from './constants'
import {DateTime, Interval} from 'luxon'
import {Trans} from 'react-i18next'

export const getPostTypeInText = (announcement_type) => {
  let post_type = POST_TYPE.announcement
  if (announcement_type === announcementType.FEEDBACK) {
    post_type = POST_TYPE.feedback
  } else if (announcement_type === announcementType.POLL) {
    post_type = POST_TYPE.poll
  } else if (announcement_type === announcementType.SMS) {
    post_type = POST_TYPE.sms
  }
  return post_type
}

export const postDurationSelectedTfi = ({eventManager, events, post_type}) => {
  eventManager.send_event(events.POST_DURATION_SELECTED_TFI, {
    post_type,
  })
}

export const postChannelSelectedTfi = ({
  eventManager,
  events,
  channels,
  post_type,
}) => {
  eventManager.send_event(events.POST_CHANNEL_SELECTED_TFI, {
    channels,
    post_type,
  })
}

export const attachButtonClickedTfi = ({eventManager, events, post_type}) => {
  eventManager.send_event(events.ATTACH_BUTTON_CLICKED_TFI, {
    post_type,
  })
}

export const userSegmentSelectedTfi = ({eventManager, events, payload}) => {
  eventManager.send_event(events.USER_SEGMENT_SELECTED_TFI, {
    ...payload,
  })
}

export const getDaysLeft = (c, days, onExpiredText) => {
  let i = Interval.fromDateTimes(DateTime.fromSeconds(+c), DateTime.now())
  let diff = Math.floor(i.length('days'))
  let left = days - diff
  if (left > 1)
    return <Trans i18nKey={'expiresInDays'}>Expires in {`${left}`} days</Trans>
  if (left === 1) {
    let hours = Math.ceil(i.length('hours'))
    hours = 24 - (hours % 24)
    return (
      <Trans i18nKey={'expiresInHours'}>Expires in {`${hours}`} hours</Trans>
    )
  }
  return onExpiredText
}

export const getSharePostMessageText = (post) => {
  const msg = {text: ''}
  switch (post.announcement_type) {
    case announcementType.ANNOUNCEMENT:
      msg.text = (
        <Trans i18nKey="announcementMessage">
          You have received an important announcement regarding {post.title}
          from your school principal. Check the announcement on the Teachmint
          app -{' '}
        </Trans>
      )
      break
    case announcementType.POLL:
      msg.text = (
        <Trans i18nKey="pollMessage">
          Your school principal is interested in your opinion . Provide your
          answer on the Teachmint app -{' '}
        </Trans>
      )
      break
    case announcementType.FEEDBACK:
      msg.text = (
        <Trans i18nKey="feedbackMessage">
          Your school principal has requested for feedback. Provide your
          feedback on the Teachmint app -{' '}
        </Trans>
      )
      break
  }
  const urlText = msg.text?.props.children.join(' ')
  return urlText
}

export const shareOnWhatsAppApi = ({text, url, phoneNumber}) => {
  window.open(
    `https://api.whatsapp.com/send?${
      phoneNumber ? `phone=[${phoneNumber}]` : ''
    }&text=${text.concat(url)}`,
    '_blank'
  )
}

export const getExtensionFromUrl = (url) => {
  return url.split(/[#?]/)[0].split('.').pop().trim()
}

export const getTimeFilterCheck = (item, time, range) => {
  if (time !== 'custom') {
    const date = DateTime.now().startOf('day').minus({day: time})['ts']
    return item.c * 1000 >= date
  } else {
    const fromDate = DateTime.fromJSDate(new Date(range.from)).startOf('day')[
      'ts'
    ]
    const toDate = DateTime.fromJSDate(new Date(range.to)).endOf('day')['ts']
    return toDate >= item.c * 1000 && item.c * 1000 >= fromDate
  }
}
