import styles from '../Post.module.css'
import {Icon} from '@teachmint/krayon'
import {useSelector, useDispatch} from 'react-redux'
import {events} from '../../../../../utils/EventsConstants'
import {getPostTypeInText} from '../../../commonFunctions'
import classNames from 'classnames'
import {useRef} from 'react'
import {useOutsideClickHandler} from '@teachmint/common'
import {sendReminder} from '../../../redux/actions/commonActions'

export default function SendReminders({post, setReminderOpen}) {
  const eventManager = useSelector((state) => state.eventManager)
  const postType = getPostTypeInText(post.announcement_type)
  const reminderRef = useRef(null)
  const dispatch = useDispatch()
  const SEND_REMINDER_ITEMS = [
    {
      label: 'All Receivers',
      value: 'all',
      icon: <Icon name="people" size="xx_s" />,
      onClick: () => {
        eventManager.send_event(events.POST_SEND_REMINDER_ALL_RECEPIENTS, {
          post_type: postType,
          post_id: post._id,
          reminder_count: post.reminder_count,
        })
        setReminderOpen(false)
        dispatch(
          sendReminder({reminder_target: 'all', announcement_id: post._id})
        )
      },
    },
    {
      label: 'Pending Receivers',
      value: 'pending',
      icon: <Icon name="clock" version="outlined" size="xx_s" />,
      onClick: () => {
        eventManager.send_event(events.POST_SEND_REMINDER_PENDING_RECEPIENTS, {
          post_type: postType,
          post_id: post._id,
          reminder_count: post.reminder_count,
        })
        setReminderOpen(false)
        dispatch(
          sendReminder({reminder_target: 'pending', announcement_id: post._id})
        )
      },
    },
  ]
  useOutsideClickHandler(reminderRef, () => setReminderOpen(false))
  return (
    <div ref={reminderRef} className={classNames(styles.reminderContainer)}>
      {SEND_REMINDER_ITEMS.map((item) => {
        return (
          <div
            key={item.value}
            onClick={item?.onClick}
            className={styles.moreActionItem}
          >
            {item.icon} &nbsp;
            {item.label}
          </div>
        )
      })}
    </div>
  )
}
