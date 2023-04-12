import React, {useEffect, useState} from 'react'
import classNames from 'classnames'
import styles from '../Post.module.css'
import {useDispatch, useSelector} from 'react-redux'
import {setPostReceiversList} from '../../../redux/actions/commonActions'
import ReceiversList from './ReceiversList/ReceiversList'
import {events} from '../../../../../utils/EventsConstants'
import Loader from '../../../../../components/Common/Loader/Loader'
import {getPostTypeInText} from '../../../commonFunctions'
import {useTranslation} from 'react-i18next'
import {announcementType, RECEIVER_LIST_TABS} from '../../../constants'
import {Icon} from '@teachmint/common'
import {useHistory, useLocation} from 'react-router-dom'

export default function SeenRespondedComp({post}) {
  const [showSliderScreen, setShowSliderScreen] = useState(null)
  const [tabId, setTabId] = useState(RECEIVER_LIST_TABS.READ)
  const eventManager = useSelector((state) => state.eventManager)
  const {userSegmentLoader} = useSelector(
    (state) => state.communicationInfo.common
  )
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const location = useLocation()
  const history = useHistory()
  let respondedLabel = t('read'),
    respondedCount = post.total_views,
    notRespondedLabel = t('unread'),
    notRespondedCount = post.downloaded_users_count - post.total_views,
    smsCountLabel = t('smsNotified'),
    smsCountMwebLabel = t('smsSent'),
    smsCount = post.sms_sent_count

  const onClick = (tabId) => {
    setTabId(tabId)
    setShowSliderScreen(true)
    dispatch(setPostReceiversList(post._id))
    eventManager.send_event(events.COMM_READ_SPLIT_OPENED, {
      post_id: post._id,
      post_type: getPostTypeInText(post.announcement_type),
      read_count: respondedCount,
      unread_count: notRespondedCount,
      sms_count: smsCount,
    })
  }
  const sumOfPollCountObject = (obj) => {
    return Object.keys(obj).reduce(
      (sum, key) => sum + parseFloat(obj[key] || 0),
      0
    )
  }

  const calculateTotalResponded = () => {
    if (post.poll_count) {
      return sumOfPollCountObject(post.poll_count)
    } else {
      return 0
    }
  }

  const calculateYetToRespond = () => {
    if (post.poll_count) {
      let totalResponded = sumOfPollCountObject(post.poll_count)
      return post.downloaded_users_count - totalResponded
    } else {
      return post.downloaded_users_count
    }
  }
  switch (post.announcement_type) {
    case announcementType.POLL:
      respondedCount = post.poll_count ? calculateTotalResponded() : 0
      notRespondedCount = calculateYetToRespond()
      break
  }

  const clearQueryParams = ({urlPostId}) => {
    const queryParams = new URLSearchParams(location.search)
    if (urlPostId && !showSliderScreen && userSegmentLoader) {
      queryParams.delete('selectedOption')
      queryParams.delete('_id')
      history.replace({
        search: queryParams.toString(),
      })
    }
  }

  useEffect(() => {
    const urlSelectedOption = new URLSearchParams(location.search).get(
      'selectedOption'
    )
    const urlPostId = new URLSearchParams(location.search).get('_id')
    if (urlPostId || urlSelectedOption) {
      setTabId(urlSelectedOption)
      setShowSliderScreen(true)
      dispatch(setPostReceiversList(urlPostId))
      setTimeout(() => {
        clearQueryParams({urlPostId})
      }, 3000)
    }
  }, [])

  return (
    <>
      <div
        className={styles.outsideContainer}
        onClick={() => onClick(RECEIVER_LIST_TABS.UNREAD)}
      >
        <div className={classNames('flex', styles.alignCenter)}>
          <div className={styles.postResponsesContainer}>
            <div
              className={styles.postResponses}
              onClick={(e) => {
                onClick(RECEIVER_LIST_TABS.UNREAD)
                e.stopPropagation()
              }}
            >
              <span className={classNames(styles.postResponseLabel)}>
                {notRespondedLabel}:
              </span>
              <span className={styles.postNotRespondedVal}>
                {notRespondedCount}
              </span>
              <div className={styles.forwardIconContainer}>
                <Icon
                  name="forwardArrow"
                  size="xxs"
                  color="secondary"
                  className={styles.forwardIcon}
                />
              </div>
            </div>
            <div
              className={styles.postResponses}
              onClick={(e) => {
                onClick(RECEIVER_LIST_TABS.READ)
                e.stopPropagation()
              }}
            >
              <span className={classNames(styles.postResponseLabel)}>
                {respondedLabel}:
              </span>
              <span className={classNames(styles.postRespondedValue)}>
                {respondedCount}
              </span>
              <div className={styles.forwardIconContainer}></div>
            </div>
            <div
              className={styles.postResponses}
              onClick={(e) => {
                onClick(RECEIVER_LIST_TABS.SMS)
                e.stopPropagation()
              }}
            >
              <span className={styles.postResponseLabel}>
                <span className={styles.smsCountLabelMweb}>
                  {smsCountMwebLabel}:
                </span>
                <span className={styles.smsCountLabel}>{smsCountLabel}:</span>
              </span>
              <span className={styles.postSmsCount}>{smsCount}</span>
              <div className={styles.forwardIconContainer}>
                <Icon
                  name="forwardArrow"
                  size="xxs"
                  color="secondary"
                  className={styles.forwardIcon}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.forwardMwebIcon}>
          <Icon
            name="forwardArrow"
            size="xxs"
            color="secondary"
            className={styles.forwardIcon}
          />
        </div>
      </div>
      {showSliderScreen ? (
        userSegmentLoader ? (
          <Loader show={userSegmentLoader} />
        ) : (
          <ReceiversList
            setSliderOpen={setShowSliderScreen}
            tabId={tabId}
            post={post}
          />
        )
      ) : null}
    </>
  )
}
