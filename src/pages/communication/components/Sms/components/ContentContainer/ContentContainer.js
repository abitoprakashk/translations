import {TemplateList} from '../TemplateList/TemplateList'
import UserSegment from '../../../UserSegment/UserSegment'
import {ReviewMessage} from '../ReviewMessage/ReviewMessage'
import styles from './ContentContainer.module.css'
import parentStyles from '../../Sms.module.css'
import {useTranslation} from 'react-i18next'
import {Tooltip} from '@teachmint/krayon'
import {Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import classNames from 'classnames'
import {useSelector} from 'react-redux'
export const ContentContainer = ({
  step,
  onTemplateClick,
  varData,
  setVarData,
}) => {
  const {t} = useTranslation()
  const isRechargeOpen = useSelector(
    (state) => state.communicationInfo.sms.isRechargeOpen
  )
  let content = '',
    title = ''
  switch (step) {
    case t('selectTemplate'):
      title = (
        <div className={styles.templateSelectionTitle}>
          <div>{t('templateListTitle')}</div>
          <div
            data-tip
            data-for={'templateListTitle'}
            className={styles.infoIcon}
          >
            <Icon
              name="info"
              version={ICON_CONSTANTS.VERSION.OUTLINED}
              size={ICON_CONSTANTS.SIZES.XX_SMALL}
            />
          </div>
          <Tooltip
            toolTipId={'templateListTitle'}
            toolTipBody={t('smsTrai')}
            classNames={{toolTipBody: styles.toolTipBody}}
          />
        </div>
      )
      content = <TemplateList onTemplateClick={onTemplateClick} />
      break
    case t('reviewMessage'):
      title = t('reviewMessage')
      content = <ReviewMessage data={varData} setData={setVarData} />
      break
    case t('selectUserSegment'):
      title = t('selectUserSegment')
      content = <UserSegment />
      break
    default:
      return null
  }
  return (
    <div
      className={classNames(styles.contentSection, {
        [parentStyles.blurryBg]: isRechargeOpen,
      })}
    >
      <div className={styles.contentAreaTitle}>
        <span>{title}</span>
      </div>
      <div className={styles.contentAreaBody}>{content}</div>
    </div>
  )
}
