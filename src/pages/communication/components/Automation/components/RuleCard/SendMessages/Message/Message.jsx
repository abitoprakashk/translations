import {
  Badges,
  BADGES_CONSTANTS,
  Divider,
  Icon,
  ICON_CONSTANTS,
} from '@teachmint/krayon'
import classNames from 'classnames'
import moment from 'moment'
import {useTranslation} from 'react-i18next'
import {
  announcementType,
  COMMUNICATION_TYPE,
  RECEIVER_LIST_TABS,
} from '../../../../../../constants'
import ReceiversInfo from '../../../../../common/ReceiversInfo/ReceiversInfo'
import PostAttachedFile from '../../../../../Posts/components/PostAttachedFile'
import {getIdLabel} from '../../../../utils'
import styles from './Message.module.css'

const ICONS = {
  [announcementType.ANNOUNCEMENT]: 'alert1',
  [announcementType.SMS]: 'chat1',
}

export default function Message({post, onSelect}) {
  const {t} = useTranslation()
  return (
    <div className={styles.outerBox}>
      <div className={styles.msgContainer}>
        <div className={styles.msgTitle}>
          <Icon
            name={ICONS[post.announcement_type]}
            size={ICON_CONSTANTS.SIZES.X_SMALL}
            className={styles.msgTitleIcon}
          />
          <span className="capitalize">
            {COMMUNICATION_TYPE[post.announcement_type]}
          </span>
          <Badges
            label={t('automated')}
            type={BADGES_CONSTANTS.TYPE.SUCCESS}
            inverted
            iconName="autoRenew"
            size={BADGES_CONSTANTS.SIZE.SMALL}
            className={styles.automatedBadge}
          />
        </div>
        <div className={styles.postTitle}>
          <span>{post.title}</span>
        </div>
        <div className={styles.message}>{post.message}</div>
        {!!post.attachment_urls?.length && <PostAttachedFile post={post} />}
        <div className={styles.creationInfo}>
          {post.creator_name && (
            <span>{t('postCreatedBy', {name: post.creator_name})}</span>
          )}
          <div className={styles.creationDate}>
            <CreatedDate createdOn={post.c} />
          </div>
          <div>
            <span>{t('ruleId')}</span>
            <span>{getIdLabel(post.rule_id)}</span>
          </div>
        </div>
        <Divider spacing="16px" />
        <ReceiversInfo post={post} />
        {post.announcement_type !== announcementType.SMS && (
          <div className={styles.postStats}>
            <CountButton
              label={t('unread')}
              count={post.downloaded_users_count - post.total_views}
              onClick={
                onSelect ? () => onSelect(RECEIVER_LIST_TABS.UNREAD) : null
              }
            />
            <CountButton
              label={t('read')}
              count={post.total_views}
              onClick={
                onSelect ? () => onSelect(RECEIVER_LIST_TABS.READ) : null
              }
            />
          </div>
        )}
      </div>
    </div>
  )
}

const CountButton = ({label, count, onClick}) => (
  <div
    className={classNames(styles.countBtn, {
      [styles.cursorPointer]: onClick,
    })}
    onClick={onClick}
  >
    <span>{label}: </span>
    <span className={styles.count}>{count}</span>
    <Icon
      name="arrowForwardIos"
      version={ICON_CONSTANTS.VERSION.FILLED}
      size={ICON_CONSTANTS.SIZES.XXXX_SMALL}
      type={ICON_CONSTANTS.TYPES.SECONDARY}
    />
  </div>
)

const CreatedDate = ({createdOn}) => {
  const formatDate = (date) => moment(date * 1000).format(`DD MMM[,] YY`)
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
      <span>{createdOn ? formatDate(createdOn) : null}</span>
    </>
  )
}
