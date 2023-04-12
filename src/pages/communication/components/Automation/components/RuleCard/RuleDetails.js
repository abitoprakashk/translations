import {Divider} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import {SEND_OPTIONS_LABELS} from '../../Automation.constants'
import {formatDateFromUnixSeconds, getIdLabel, listToString} from '../../utils'
import WhenToSendSummary from '../common/WhenToSendSummary/WhenToSendSummary'
import styles from './RuleCard.module.css'

export default function RuleDetails({rule, showDetails, groupNames}) {
  const {t} = useTranslation()

  return !showDetails ? null : (
    <div className={styles.expandedView}>
      <Divider spacing="0" />
      <div className={styles.extraInfoContainer}>
        <div className={styles.extraInfoSec}>
          <span className={styles.extraInfoLabel}>{t('whomToSend')}</span>
          <div>{groupNames}</div>
          <Divider isVertical={true} />
        </div>
        <Divider isVertical spacing="0" />
        <div className={styles.extraInfoSec}>
          <span className={styles.extraInfoLabel}>{t('howToSend')}</span>
          <span>{listToString(rule.actions_list, SEND_OPTIONS_LABELS)}</span>
          <Divider isVertical={true} />
        </div>
        <Divider isVertical spacing="0" />
        <div className={styles.extraInfoSec}>
          <span className={styles.extraInfoLabel}>{t('whenToSend')}</span>
          <WhenToSendSummary inputData={rule} showTitle={false} />
        </div>
      </div>
      <Divider spacing="0" />
      <div className={styles.footerSec}>
        <div className={styles.footerInfo}>
          <div className={styles.footerSecDetails}>
            <span className={styles.footerSecLabels}>
              {t('createdOnLabel')}
            </span>
            <span>{formatDateFromUnixSeconds(rule.created_date)}</span>
          </div>
          <div className={styles.footerSecDetails}>
            <span className={styles.footerSecLabels}>{t('ruleId')}</span>
            <span>{getIdLabel(rule.rule_id || rule._id)}</span>
          </div>
        </div>
        {rule.creator_name && (
          <div className={styles.footerSecDetails}>
            <span className={styles.footerSecLabels}>{t('byLabel')}</span>
            <span>{rule.creator_name}</span>
          </div>
        )}
      </div>
    </div>
  )
}
