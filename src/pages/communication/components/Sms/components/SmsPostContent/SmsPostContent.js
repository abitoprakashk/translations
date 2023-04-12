import {Badges, BADGES_CONSTANTS} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import styles from '../../../Posts/Post.module.css'

export const SmsPostContent = ({post}) => {
  const {t} = useTranslation()

  return (
    <div>
      <div className={styles.postAnnouncementTitle}>
        {post.title}
        {post.automated && (
          <Badges
            label={t('automated')}
            type={BADGES_CONSTANTS.TYPE.SUCCESS}
            inverted
            iconName="autoRenew"
            size={BADGES_CONSTANTS.SIZE.SMALL}
            className={styles.automatedBadge}
          />
        )}
      </div>
      <div className={styles.postAnnouncementMessage}>{post.message}</div>
    </div>
  )
}
