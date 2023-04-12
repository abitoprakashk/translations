import {Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import classNames from 'classnames'
import {Trans, useTranslation} from 'react-i18next'
import {announcementType} from '../../../constants'
import styles from './ReceiversInfo.module.css'

export default function ReceiversInfo({post}) {
  const {t} = useTranslation()

  if (post.announcement_type === announcementType.SMS) {
    return (
      <div className={styles.smsInfoContainer}>
        <div className={styles.balanceInfo}>
          <Icon
            name="user"
            version={ICON_CONSTANTS.VERSION.OUTLINED}
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
          />
          <span className={styles.smsUserCount}>
            {`${post.total_user} ${t('users')}`}
          </span>
          {!!post.segments?.length && (
            <span
              className={classNames(
                styles.postFooterUserSegmentInfo,
                styles.smsUserSegment
              )}
            >
              <Trans i18nKey={'userSegmentToString'}>
                {`(${post.segments
                  .slice(0, 2)
                  .toString()
                  .replaceAll(',', ' & ')})`}
              </Trans>
            </span>
          )}
        </div>
        <div className={classNames(styles.balanceInfo, styles.balanceCount)}>
          <Icon
            name="message"
            className={styles.smsBalanceIcon}
            version={ICON_CONSTANTS.VERSION.OUTLINED}
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
          />
          <span
            className={classNames(
              styles.postFooterUserSegmentInfo,
              styles.smsUserSegment
            )}
          >
            {t('balanceConsumed')}
          </span>
          <span className={classNames(styles.smsUserCount)}>
            {`${post.sms_sent_count} ${t('sms')}`}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.postFooterUserSegment}>
      {t('receivers')}
      <>
        <div className={styles.dotSec}>
          <span>{'\u2022'}</span>
        </div>
        <span className={styles.postFooterCalendarIcon}>
          <Icon
            name="user"
            version={ICON_CONSTANTS.VERSION.OUTLINED}
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
          />
        </span>
        {!!post.segments?.length && (
          <span className={styles.postFooterUserSegmentInfo}>
            <Trans i18nKey={'userSegmentToString'}>
              {post.segments.toString().replaceAll(',', ', ').toLowerCase()}
            </Trans>
          </span>
        )}
      </>
    </div>
  )
}
