import classNames from 'classnames'
import React, {useEffect, useState} from 'react'
import styles from '../Post.module.css'
import {Trans, useTranslation} from 'react-i18next'
import SendReminders from './SendReminders'
import {Button, Tooltip, Divider} from '@teachmint/krayon'
import SeenResponedComp from './SeenRespondedComp'
import {getDaysLeft} from '../../../commonFunctions'
import Permission from '../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'
import {announcementType} from '../../../constants'
import ReceiversInfo from '../../common/ReceiversInfo/ReceiversInfo'
export default function PostFooterSection({
  post,
  eventManager,
  events,
  COMMUNICATION_TYPE,
}) {
  const {t} = useTranslation()
  const [showReminder, setShowReminder] = useState(false)
  const [updateFlag, setUpdateFlag] = useState(true)

  const isPostExpired = () => {
    if (post.disabled) {
      return true
    }
    return (
      post.announcement_type !== 0 &&
      getDaysLeft(post.c, post.duration, t('expired')) === t('expired')
    )
  }
  const handleSendReminderClick = () => {
    eventManager.send_event(events.POST_SEND_REMINDER_INITIATED, {
      post_type: COMMUNICATION_TYPE[post.announcement_type],
      post_title: post.announcement_type === 0 ? post.title : post.message,
    })
    setShowReminder(!showReminder)
  }

  const getReminderText = () => {
    if (!updateFlag) {
      if (post.reminder_count) {
        let beforeTime = new Date(post.display_time * 1000).toLocaleTimeString(
          'en-US',
          {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'IST',
            hour12: true,
          }
        )
        return (
          <Trans
            i18nKey="reminderCount"
            values={{count: post.reminder_count, time: beforeTime}}
            components={{
              span: <span style={{color: 'var(--tm-color-text-secondary)'}} />,
            }}
          />
        )
      } else {
        return null
      }
    }
  }
  const getToolTipBody = () => {
    if (post.disabled) {
      return t('postRemoved')
    }
    if (post.reminder_count) {
      let afterTime = new Date(
        post.display_time * 1000 + post.reminder_time_delta
      ).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'IST',
        hour12: true,
      })
      return (
        <Trans i18nKey="reminderTryAgain">
          Reminder sent, try again after {`${afterTime}`} IST
        </Trans>
      )
    }
    let duration = post.reminder_time_delta / 1000

    let numhours = Math.floor(((duration % 31536000) % 86400) / 3600)
    let numminutes = Math.floor((((duration % 31536000) % 86400) % 3600) / 60)

    let durationString = `${numhours || ''}${' '} ${
      numhours ? 'hours' : ''
    }${' '} ${numminutes || ''} ${' '} ${numminutes ? 'minutes' : ''}`
    return <Trans i18nKey="reminderToolTip" values={{time: durationString}} />
  }
  useEffect(() => {
    setUpdateFlag(
      new Date().getTime() - post.display_time * 1000 < post.reminder_time_delta
    )
  }, [post.reminder_count])

  return (
    <div
      className={classNames(
        styles.postFooterCreateSec,
        styles.postFooterSection
      )}
    >
      <Divider spacing="0px" classes={{wrapper: styles.footerDivider}} />
      <div className={styles.userSegmentReadCountContainer}>
        <ReceiversInfo post={post} />
      </div>
      {!post.draft && post.announcement_type !== announcementType.SMS && (
        <div className={styles.postFooterButtonSec}>
          <SeenResponedComp post={post} />
          <div className={styles.reminderArea}>
            <div
              className={classNames(styles.reminderText, {
                [styles.redText]: updateFlag,
              })}
            >
              {getReminderText()}
            </div>
            {!isPostExpired() ? (
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.announcementsController_sendReminder_create
                }
              >
                <Button
                  onClick={handleSendReminderClick}
                  classes={{button: styles.reminderBtn}}
                  prefixIcon="alert"
                  prefixIconVersion="outlined"
                  suffixIcon="downArrow"
                  type="text"
                  children={t('sendReminder')}
                  isDisabled={updateFlag}
                  data-tip
                  data-for={post._id}
                />
              </Permission>
            ) : null}
            {updateFlag && (
              <Tooltip
                toolTipId={post._id}
                toolTipBody={getToolTipBody()}
                place="top"
                classNames={{toolTipBody: styles.toolTipBody}}
              />
            )}
            {showReminder && (
              <SendReminders post={post} setReminderOpen={setShowReminder} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
