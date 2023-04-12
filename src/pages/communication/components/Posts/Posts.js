import React, {useRef} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useState} from 'react'
import styles from './Post.module.css'
import classNames from 'classnames'
import {events} from '../../../../utils/EventsConstants'
import FeedbackPostContent from '../Feedback/components/FeedbackPostContent'
import PollPostContent from '../Poll/components/PollPostContent'
import {
  setIsDeletePostModalOpenAction,
  setPostTitleForDeleteAction,
  setPostToDeleteInfoAction,
} from '../../redux/actions/postsActions'
import {announcementType, COMMUNICATION_TYPE} from './../../constants'
import PostFooterSection from './components/PostFooterSection'
import AnnouncementPostContent from '../Announcement/components/AnnouncementPostContent'
import {checkSubscriptionType} from '../../../../utils/Helpers'
import {showFeatureLockAction} from '../../../../redux/actions/commonAction'
import {Trans, useTranslation} from 'react-i18next'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import MoreActions from './components/MoreActions'
import {getPostTypeInText} from '../../commonFunctions'
import {useOutsideClickHandler} from '@teachmint/common'
import {Badges, BADGES_CONSTANTS, Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import moment from 'moment'
import {getDaysLeft} from '../../commonFunctions'
import {SmsPostContent} from '../Sms/components/SmsPostContent/SmsPostContent'
export default function Posts({
  post,
  editIt,
  setIsFeedbackSilderOpen,
  handleTabClick,
  showHeading = true,
}) {
  const {t} = useTranslation()
  const tDuration = t('duration')
  const tDay = t('day')
  const tDays = t('days')
  const announcement_type = useSelector(
    (state) => state.communicationInfo.common.announcement_type
  )
  const {eventManager, instituteInfo} = useSelector((state) => state)
  const dispatch = useDispatch()
  const isPremium = checkSubscriptionType(instituteInfo)
  const [showMoreActions, setShowMoreActions] = useState(false)
  const moreActionsWrapperRef = useRef(null)

  const ContentContainerSection = ({label, badges, className}) => {
    return (
      <span
        className={classNames(
          'flex',
          styles.postContentContainerSec,
          className
        )}
      >
        <span className={styles.postContentContainerLabel}>{label} :</span>
        {typeof badges === 'object' ? (
          badges.map((badge) => {
            return (
              <span key={badge} className={styles.postContentContainerBadge}>
                {badge}
              </span>
            )
          })
        ) : (
          <span className={styles.postContentContainerBadge}>
            {badges} {label === tDuration && badges > 1 ? tDays : tDay}
          </span>
        )}
      </span>
    )
  }

  const handleDeleteDraft = (post) => {
    if (isPremium || post.announcement_type === announcementType.ANNOUNCEMENT) {
      let postTitle
      if (post.announcement_type === announcementType.ANNOUNCEMENT) {
        postTitle = post.title
      } else {
        postTitle = post.message
      }
      dispatch(setIsDeletePostModalOpenAction(true))
      dispatch(setPostTitleForDeleteAction(postTitle))
      dispatch(setPostToDeleteInfoAction(post))
      handleTabClick('All')
    } else {
      dispatch(showFeatureLockAction(true))
    }
  }
  const renderBadge = (post) => {
    let iconName,
      type,
      label = ''
    if (post.disabled) {
      iconName = 'invisible'
      type = BADGES_CONSTANTS.TYPE.ERROR
      label = 'Removed'
    } else if (post.edited) {
      iconName = 'edit2'
      type = BADGES_CONSTANTS.TYPE.BASIC
      label = 'Edited'
    } else if (post.draft) {
      iconName = 'bookmark'
      type = BADGES_CONSTANTS.TYPE.WARNING
      label = 'In Draft'
    }
    if (label) {
      return (
        <Badges
          label={label || null}
          type={type}
          iconName={iconName}
          size={BADGES_CONSTANTS.SIZE.SMALL}
        />
      )
    } else return null
  }
  const handleEditClick = () => {
    if (isPremium || post.announcement_type === announcementType.ANNOUNCEMENT) {
      eventManager.send_event(events.EDIT_DRAFT_CLICKED_TFI, {
        post_type: COMMUNICATION_TYPE[post.announcement_type],
        post_title: post.announcement_type === 0 ? post.title : post.message,
      })
      editIt(post)
    } else {
      dispatch(showFeatureLockAction(true))
    }
  }
  const CreatedDate = () => {
    const getDate = () => {
      if (post.c) {
        let date = moment(post.c * 1000).format(`DD MMM[,] YY[']`)
        return date
      } else {
        return 0
      }
    }

    return (
      <>
        <span className={styles.postFooterCalendarIcon}>
          <Icon
            name="calendar"
            version={ICON_CONSTANTS.VERSION.OUTLINED}
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
            type={ICON_CONSTANTS.TYPES.SECONDARY}
          />
        </span>
        <span>{getDate()}</span>
      </>
    )
  }
  useOutsideClickHandler(moreActionsWrapperRef, () => {
    setShowMoreActions(false)
  })
  return (
    <div className={styles.postCardSec}>
      <div className={styles.postCard}>
        <div className={styles.postHeadingSection}>
          {showHeading && (
            <div className={styles.postHeadingSec}>
              <div className={styles.postHeadingIconImgSec}>
                {post.announcement_type === announcementType.ANNOUNCEMENT && (
                  <Icon name="alert1" size={ICON_CONSTANTS.SIZES.X_SMALL} />
                )}
                {post.announcement_type === announcementType.FEEDBACK && (
                  <Icon name="wysiwyg" size={ICON_CONSTANTS.SIZES.X_SMALL} />
                )}
                {post.announcement_type === announcementType.POLL && (
                  <Icon name="poll" size={ICON_CONSTANTS.SIZES.X_SMALL} />
                )}
                {post.announcement_type === announcementType.SMS && (
                  <Icon name="chat1" size={ICON_CONSTANTS.SIZES.X_SMALL} />
                )}
              </div>
              <div className={styles.postHeading}>
                <div className="capitalize">
                  <Trans i18nKey={'communicationType'}>
                    {COMMUNICATION_TYPE[post.announcement_type]}
                  </Trans>
                </div>

                <div className={styles.badge}>{renderBadge(post)}</div>
              </div>
            </div>
          )}
          {post.draft && (
            <div className={styles.draftActionBtn}>
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.communicationController_announcement_create
                }
              >
                <button
                  className={styles.editDraftBtn}
                  onClick={() => handleEditClick()}
                >
                  <Icon
                    name="edit2"
                    size={ICON_CONSTANTS.SIZES.XX_SMALL}
                    type={ICON_CONSTANTS.TYPES.PRIMARY}
                    version={ICON_CONSTANTS.VERSION.FILLED}
                  />
                  <span className={styles.editDraftLabel}>
                    {t('editDraft')}
                  </span>
                </button>
              </Permission>
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.communicationController_announcementRemove_delete
                }
              >
                <button
                  onClick={() => handleDeleteDraft(post)}
                  className={styles.deleteDraftBtn}
                >
                  <Icon
                    name="delete1"
                    size={ICON_CONSTANTS.SIZES.XX_SMALL}
                    version={ICON_CONSTANTS.VERSION.FILLED}
                    type={ICON_CONSTANTS.TYPES.ERROR}
                  />
                </button>
              </Permission>
            </div>
          )}
          {!post.draft &&
            !post.disabled &&
            post.announcement_type !== announcementType.SMS && (
              <div ref={moreActionsWrapperRef} className={styles.moreActions}>
                <Icon
                  name="ellipsisVertical"
                  size={ICON_CONSTANTS.SIZES.X_SMALL}
                  type={ICON_CONSTANTS.TYPES.SECONDARY}
                  onClick={() => {
                    eventManager.send_event(events.COMM_POST_MANAGE_CLICKED, {
                      post_type: getPostTypeInText(announcement_type),
                      post_id: post._id,
                    })
                    setShowMoreActions((prev) => !prev)
                  }}
                />
                <MoreActions
                  showMoreActions={showMoreActions}
                  post={post}
                  editPost={editIt}
                  setShowMoreActions={setShowMoreActions}
                />
              </div>
            )}
        </div>
        <div
          className={classNames(styles.postContentSec, {
            [styles.removed]: post.disabled,
          })}
        >
          {post.announcement_type === announcementType.ANNOUNCEMENT && (
            <AnnouncementPostContent post={post} />
          )}

          {post.announcement_type === announcementType.FEEDBACK && (
            <FeedbackPostContent
              post={post}
              setIsFeedbackSilderOpen={setIsFeedbackSilderOpen}
            />
          )}

          {post.announcement_type === announcementType.POLL && (
            <PollPostContent post={post} />
          )}
          {post.announcement_type === announcementType.SMS && (
            <SmsPostContent post={post} />
          )}
          <div
            className={classNames(styles.postCreationInfo, {
              ['flex']: post.draft,
            })}
          >
            <span className="mr-2">{t('createdBy')}:</span>{' '}
            <span className="capitalize">{post?.creator_name}</span>
            <div className={styles.postFooterDate}>
              <div className={styles.dotSec}>
                <span>{'\u2022'}</span>
              </div>
              <CreatedDate />
            </div>
            {!post.draft && post.duration !== 0 && (
              <div className={styles.postFooterDuration}>
                <>
                  <div className={styles.dotSec}>
                    <span>{'\u2022'}</span>
                  </div>
                  <span className={styles.postFooterCalendarIcon}>
                    <Icon
                      name="clock"
                      version={ICON_CONSTANTS.VERSION.OUTLINED}
                      size={ICON_CONSTANTS.SIZES.XX_SMALL}
                      type={ICON_CONSTANTS.TYPES.SECONDARY}
                    />
                  </span>
                  <span className="capitalize">
                    {post.c
                      ? getDaysLeft(post.c, post.duration, t('expired'))
                      : 0}
                  </span>
                </>
              </div>
            )}
          </div>
        </div>
        {post.draft && (
          <div className={classNames(styles.postContentContainerInfo)}>
            {post.announcement_type !== announcementType.ANNOUNCEMENT &&
              !!post.duration && (
                <>
                  {/* <DotIconComp className="mr-2 hidden md:block" /> */}
                  <div className={styles.dotSec}>
                    <span>{'\u2022'}</span>
                  </div>
                  <ContentContainerSection
                    label={tDuration}
                    badges={post.duration}
                    className={styles.postContentContainerInfoDuration}
                  />
                </>
              )}
          </div>
        )}
        <PostFooterSection
          post={post}
          eventManager={eventManager}
          events={events}
          COMMUNICATION_TYPE={COMMUNICATION_TYPE}
          editIt={handleEditClick}
        />
      </div>
    </div>
  )
}
