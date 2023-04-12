import React, {useEffect, useState} from 'react'
import {Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import {useDispatch, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import {fetchPostsDataRequestAction} from '../../../pages/communication/redux/actions/postsActions'
import {SliderActionTypes} from '../../../pages/communication/redux/actionTypes'
import {showFeatureLockAction} from '../../../redux/actions/commonAction'
import {checkSubscriptionType, getDateAndTime} from '../../../utils/Helpers'
import styles from './Communication.module.css'
import {
  ANNOUNCEMENT,
  COMMON_ICONS,
  COMMUNICATION_NOT_CREATED,
  SMS,
  ANNOUNCEMENT_TYPE,
} from './constants'
import WidgetShimmer from '../WidgetShimmer/WidgetShimmer'
import classNames from 'classnames'
import {events} from '../../../utils/EventsConstants'
import {useTranslation} from 'react-i18next'
import ErrorStateWidgetBody from './Components/ErrorStateWidgetBody'
import PremiumLock from './Components/PremiumLock'
import globalActions from '../../../redux/actions/global.actions'

const CommunicationWidget = () => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {instituteInfo, globalData} = useSelector((state) => state)
  const eventManager = useSelector((state) => state.eventManager)
  const {isLoading, data, error, loaded} = useSelector(
    () => globalData?.getLatestWidgetAnnouncement
  )

  const [lastAnnouncement, setLastAnnouncement] = useState(data)

  const isPremium = checkSubscriptionType(instituteInfo)
  const getWidget = () => {
    if (!isPremium) {
      return (
        <div className={classNames(styles.communicationWidgetContainer)}>
          <div
            className={classNames(
              styles.communicationWidgetHeader,
              styles.communicationWidgetHeaderErrorBorder
            )}
          >
            <div className={styles.communicationWidgetHeaderIconContainer}>
              <div
                className={
                  lastAnnouncement?.type === ANNOUNCEMENT_TYPE.SMS
                    ? styles.communicationWidgetHeaderIconSMS
                    : styles.communicationWidgetHeaderIconAnnouncement
                }
              >
                <Icon
                  size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                  type={ICON_CONSTANTS.TYPES.INVERTED}
                  name={
                    lastAnnouncement?.type === ANNOUNCEMENT_TYPE.SMS
                      ? SMS.HEADER_ICON
                      : ANNOUNCEMENT.HEADER_ICON
                  }
                />
              </div>
              <div
                className={styles.communicationWidgetHeaderIconContainerText}
              >
                {t('lastAnnouncement')}
              </div>
            </div>
          </div>
          <div className={styles.communicationWidgetContainerError}>
            <PremiumLock />
          </div>
        </div>
      )
    }
    if (error && loaded) {
      return (
        <div className={classNames(styles.communicationWidgetContainer)}>
          <div
            className={classNames(
              styles.communicationWidgetHeader,
              styles.communicationWidgetHeaderErrorBorder
            )}
          >
            <div className={styles.communicationWidgetHeaderIconContainer}>
              <div
                className={
                  lastAnnouncement?.type === ANNOUNCEMENT_TYPE.SMS
                    ? styles.communicationWidgetHeaderIconSMS
                    : styles.communicationWidgetHeaderIconAnnouncement
                }
              >
                <Icon
                  size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                  type={ICON_CONSTANTS.TYPES.INVERTED}
                  name={
                    lastAnnouncement?.type === ANNOUNCEMENT_TYPE.SMS
                      ? SMS.HEADER_ICON
                      : ANNOUNCEMENT.HEADER_ICON
                  }
                />
              </div>
              <div
                className={styles.communicationWidgetHeaderIconContainerText}
              >
                {t('lastAnnouncement')}
              </div>
            </div>
          </div>
          <div className={styles.communicationWidgetContainerError}>
            <ErrorStateWidgetBody
              onRetry={() => {
                isPremium && dispatch(fetchPostsDataRequestAction())
              }}
            />
          </div>
        </div>
      )
    }
    if (isLoading) {
      return (
        <div className={styles.communicationWidgetContainer}>
          <div className={styles.communicationWidgetHeader}>
            <div className={styles.communicationWidgetHeaderIconContainer}>
              <div
                className={
                  lastAnnouncement?.type === ANNOUNCEMENT_TYPE.SMS
                    ? styles.communicationWidgetHeaderIconSMS
                    : styles.communicationWidgetHeaderIconAnnouncement
                }
              >
                <Icon
                  size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                  type={ICON_CONSTANTS.TYPES.INVERTED}
                  name={
                    lastAnnouncement?.type === ANNOUNCEMENT_TYPE.SMS
                      ? SMS.HEADER_ICON
                      : ANNOUNCEMENT.HEADER_ICON
                  }
                />
              </div>
              <div
                className={styles.communicationWidgetHeaderIconContainerText}
              >
                {t('lastAnnouncement')}
              </div>
            </div>
          </div>
          <div className={styles.communicationWidgetBody}>
            <WidgetShimmer />
          </div>
          <div className={styles.communicationWidgetFooter}>
            <div className={styles.communicationWidgetBodyItem}>
              <WidgetShimmer />
            </div>
            <div className={styles.communicationWidgetBodyItem}>
              <WidgetShimmer />
            </div>
          </div>
        </div>
      )
    } else if (
      !isLoading &&
      (lastAnnouncement?.type === ANNOUNCEMENT_TYPE.ANNOUNCEMENT ||
        lastAnnouncement?.type === ANNOUNCEMENT_TYPE.SMS)
    ) {
      return (
        <div className={styles.communicationWidgetContainer}>
          <div className={styles.communicationWidgetHeader}>
            <div className={styles.communicationWidgetHeaderIconContainer}>
              <div
                className={
                  lastAnnouncement?.type === ANNOUNCEMENT_TYPE.SMS
                    ? styles.communicationWidgetHeaderIconSMS
                    : styles.communicationWidgetHeaderIconAnnouncement
                }
              >
                <Icon
                  size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                  type={ICON_CONSTANTS.TYPES.INVERTED}
                  name={
                    lastAnnouncement?.type === ANNOUNCEMENT_TYPE.SMS
                      ? SMS.HEADER_ICON
                      : ANNOUNCEMENT.HEADER_ICON
                  }
                />
              </div>
              <div
                className={styles.communicationWidgetHeaderIconContainerText}
              >
                {lastAnnouncement?.type === ANNOUNCEMENT_TYPE.SMS
                  ? t('lastSms')
                  : lastAnnouncement?.type === ANNOUNCEMENT_TYPE.ANNOUNCEMENT
                  ? t('lastAnnouncement')
                  : null}
              </div>
            </div>

            <Link
              to={
                lastAnnouncement?.type === ANNOUNCEMENT_TYPE.SMS
                  ? SMS.FOOTER_RECIPIENT_REDIRECT_LINK
                  : ANNOUNCEMENT.FOOTER_NOTIFY_REDIRECT_LINK
              }
              className={styles.communicationWidgetHeaderCTA}
              onClick={() =>
                eventManager.send_event(
                  events.LAST_ANNOUNCEMENT_VIEW_CLICKED_TFI,
                  {
                    screen_name: 'dashboard',
                    announcement_type:
                      lastAnnouncement?.type === ANNOUNCEMENT_TYPE.SMS
                        ? 'sms'
                        : 'announcement',
                  }
                )
              }
            >
              {lastAnnouncement?.type === ANNOUNCEMENT_TYPE.SMS
                ? t(SMS.HEADER_CTA_TEXT)
                : t(ANNOUNCEMENT.HEADER_CTA_TEXT)}
            </Link>
          </div>
          <div className={styles.communicationWidgetBodyAnnouncement}>
            <div className={styles.communicationWidgetBodyAnnouncementTitle}>
              {lastAnnouncement?.title}
            </div>
            <div className={styles.communicationWidgetBodyAnnouncementMessage}>
              {lastAnnouncement?.body}
            </div>
            <div className={styles.communicationWidgetBodyAnnouncementTime}>
              {`${t('postedOn')}: ${getDateAndTime(
                lastAnnouncement?.timestamp
              )}`}
            </div>
          </div>
          <div className={styles.communicationWidgetFooterAnnouncement}>
            <Link
              className={styles.communicationWidgetFooterAnnouncementItem}
              to={
                lastAnnouncement?.type === ANNOUNCEMENT_TYPE.ANNOUNCEMENT
                  ? `${
                      ANNOUNCEMENT.FOOTER_SEEN_REDIRECT_LINK
                    }?selectedOption=${'read'}&_id=${lastAnnouncement?._id}`
                  : '#'
              }
              onClick={() =>
                eventManager.send_event(
                  events.ANNOUNCEMENT_STATUS_CARD_CLICKED_TFI,
                  {
                    announcement_card_type:
                      lastAnnouncement?.type === ANNOUNCEMENT_TYPE.SMS
                        ? 'recipient'
                        : 'seen',
                  }
                )
              }
            >
              <div
                className={classNames(
                  styles.communicationWidgetFooterAnnouncementItemCountContainer,
                  lastAnnouncement?.type === ANNOUNCEMENT_TYPE.ANNOUNCEMENT &&
                    styles.cursorPointer
                )}
              >
                <div
                  className={
                    styles.communicationWidgetFooterAnnouncementItemCount
                  }
                >
                  {lastAnnouncement?.type === ANNOUNCEMENT_TYPE.SMS
                    ? lastAnnouncement?.sms_sent
                    : lastAnnouncement?.type === ANNOUNCEMENT_TYPE.ANNOUNCEMENT
                    ? lastAnnouncement?.seen
                    : null}
                </div>
                {lastAnnouncement?.type === ANNOUNCEMENT_TYPE.ANNOUNCEMENT && (
                  <Icon
                    size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                    name={COMMON_ICONS.FORWARD_ARROW}
                  />
                )}
              </div>
              <div
                className={styles.communicationWidgetFooterAnnouncementItemText}
              >
                {lastAnnouncement?.type === ANNOUNCEMENT_TYPE.SMS
                  ? t('recipients')
                  : lastAnnouncement?.type === ANNOUNCEMENT_TYPE.ANNOUNCEMENT
                  ? t('seen')
                  : null}
              </div>
            </Link>
            <Link
              className={classNames(
                styles.communicationWidgetFooterAnnouncementItem,
                lastAnnouncement?.type === ANNOUNCEMENT_TYPE.ANNOUNCEMENT &&
                  styles.cursorPointer
              )}
              to={
                lastAnnouncement?.type === ANNOUNCEMENT_TYPE.ANNOUNCEMENT
                  ? `${
                      ANNOUNCEMENT.FOOTER_SEEN_REDIRECT_LINK
                    }?selectedOption=${'unread'}&_id=${lastAnnouncement?._id}`
                  : '#'
              }
              onClick={() =>
                eventManager.send_event(
                  events.ANNOUNCEMENT_STATUS_CARD_CLICKED_TFI,
                  {
                    announcement_card_type:
                      lastAnnouncement?.type === ANNOUNCEMENT_TYPE.SMS
                        ? 'sms balance left'
                        : 'not seen yet',
                  }
                )
              }
            >
              <div
                className={
                  styles.communicationWidgetFooterAnnouncementItemCount
                }
              >
                <div
                  className={
                    styles.communicationWidgetFooterAnnouncementItemCount
                  }
                >
                  {lastAnnouncement?.type === ANNOUNCEMENT_TYPE.SMS
                    ? lastAnnouncement?.sms_left
                    : lastAnnouncement?.type === ANNOUNCEMENT_TYPE.ANNOUNCEMENT
                    ? lastAnnouncement?.not_seen
                    : null}
                </div>
                {lastAnnouncement?.type === ANNOUNCEMENT_TYPE.ANNOUNCEMENT && (
                  <Icon
                    size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                    name={COMMON_ICONS.FORWARD_ARROW}
                  />
                )}
              </div>
              <div
                className={styles.communicationWidgetFooterAnnouncementItemText}
              >
                {lastAnnouncement?.type === ANNOUNCEMENT_TYPE.SMS
                  ? t('smsBalanceLeft')
                  : lastAnnouncement?.type === ANNOUNCEMENT_TYPE.ANNOUNCEMENT
                  ? t('notYetSeen')
                  : null}
              </div>
            </Link>
            {lastAnnouncement?.type === ANNOUNCEMENT_TYPE.ANNOUNCEMENT &&
              lastAnnouncement?.sms_sent > 0 && (
                <Link
                  className={classNames(
                    styles.communicationWidgetFooterAnnouncementItem,
                    styles.cursorPointer
                  )}
                  to={`${
                    ANNOUNCEMENT.FOOTER_NOTIFY_REDIRECT_LINK
                  }?selectedOption=${'sms'}&_id=${lastAnnouncement?._id}`}
                  onClick={() =>
                    eventManager.send_event(
                      events.ANNOUNCEMENT_STATUS_CARD_CLICKED_TFI,
                      {
                        announcement_card_type: 'notified via sms',
                      }
                    )
                  }
                >
                  <div
                    className={
                      styles.communicationWidgetFooterAnnouncementItemCountContainer
                    }
                  >
                    <div
                      className={
                        styles.communicationWidgetFooterAnnouncementItemCount
                      }
                    >
                      {lastAnnouncement?.sms_sent}
                    </div>
                    <Icon
                      size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                      name={COMMON_ICONS.FORWARD_ARROW}
                    />
                  </div>
                  <div
                    className={
                      styles.communicationWidgetFooterAnnouncementItemText
                    }
                  >
                    {t('smsNotified')}
                  </div>
                </Link>
              )}
          </div>
        </div>
      )
    } else if (!isLoading && lastAnnouncement?.type === undefined) {
      return (
        <div className={styles.communicationWidgetContainer}>
          <div className={styles.communicationWidgetHeaderEmpty}>
            <div
              className={
                lastAnnouncement?.type === ANNOUNCEMENT_TYPE.SMS
                  ? styles.communicationWidgetHeaderIconSMS
                  : styles.communicationWidgetHeaderIconAnnouncement
              }
            >
              <Icon
                size={ICON_CONSTANTS.SIZES.XX_SMALL}
                type={ICON_CONSTANTS.TYPES.INVERTED}
                name={ANNOUNCEMENT.HEADER_ICON}
              />
            </div>
            {COMMUNICATION_NOT_CREATED.HEADER_TITLE}
          </div>
          <div className={styles.communicationWidgetBodyEmpty}>
            <div className={styles.communicationWidgetBodyEmptyIcon}>
              <Icon
                size={ICON_CONSTANTS.SIZES.MEDIUM}
                name={COMMUNICATION_NOT_CREATED.BODY_ICON}
                type={ICON_CONSTANTS.TYPES.SECONDARY}
              />
            </div>
            <div className={styles.communicationWidgetBodyEmptyDescription}>
              {COMMUNICATION_NOT_CREATED.BODY_DESCRIPTION_TEXT}
            </div>
            {COMMUNICATION_NOT_CREATED.BODY_CTA_TEXT_PERMISSIONS && (
              <Link
                to={COMMUNICATION_NOT_CREATED.BODY_CTA_REDIRECT_LINK}
                onClick={() => {
                  dispatch({type: SliderActionTypes.SET_SLIDER, payload: true})
                  eventManager.send_event(
                    events.CREATE_NEW_POST_POPUP_CLICKED_TFI,
                    {
                      screen_name: 'dashboard',
                    }
                  )
                }}
                className={styles.communicationWidgetBodyEmptyCTA}
              >
                {COMMUNICATION_NOT_CREATED.BODY_CTA_TEXT}
              </Link>
            )}
          </div>
        </div>
      )
    }
  }

  useEffect(() => {
    if (isPremium) {
      dispatch(globalActions?.getLatestWidgetAnnouncement?.request())
    }
  }, [])

  useEffect(() => {
    if (isPremium) {
      setLastAnnouncement(globalData?.getLatestWidgetAnnouncement?.data)
      dispatch(fetchPostsDataRequestAction())
      eventManager.send_event(events.DASHBOARD_WIDGETS_LOADED, {
        widget_type: 'communication',
        widget_value: {
          last_sms_receipts: lastAnnouncement?.seen || 0,
          sms_left: lastAnnouncement?.sms_left || 0,
        },
      })
    }
  }, [isLoading])

  return (
    <div
      onClick={() => {
        if (!isPremium) dispatch(showFeatureLockAction(true))
      }}
    >
      {getWidget()}
    </div>
  )
}

export default CommunicationWidget
