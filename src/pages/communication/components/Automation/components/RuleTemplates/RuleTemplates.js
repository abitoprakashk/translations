import {
  Icon,
  ICON_CONSTANTS,
  IconFrame,
  ICON_FRAME_CONSTANTS,
  isMobile as isMobileDevice,
} from '@teachmint/krayon'
import {useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import Loader from '../../../../../../components/Common/Loader/Loader'
import Permission from '../../../../../../components/Common/Permission/Permission'
import {showErrorToast} from '../../../../../../redux/actions/commonAction'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'
import {getTemplatesList} from '../../../../redux/actions/schedulerActions'
import {
  SCHEDULER_TEMPLATE_TYPES,
  TEMPLATE_ICONS,
} from '../../Automation.constants'
import useActiveSessionRangeSelector from '../../hooks/useActiveSessionRangeSelector'
import styles from './RuleTemplates.module.css'

export const TEMPLATE_ICON_CLASSES = {
  [SCHEDULER_TEMPLATE_TYPES.BIRTHDAY]: styles.wishIconFrame,
  [SCHEDULER_TEMPLATE_TYPES.ATTENDANCE]: styles.attendanceIconFrame,
  [SCHEDULER_TEMPLATE_TYPES.FEE_REMINDER]: styles.feeReminderIconFrame,
  [SCHEDULER_TEMPLATE_TYPES.HOLIDAY]: styles.holidayIconFrame,
}

export default function RuleTemplates({setChosenTemplate}) {
  const isMobile = isMobileDevice()
  const {t} = useTranslation()
  const dispatch = useDispatch()

  const {sessionEndDatePassed} = useActiveSessionRangeSelector()
  const {loadingInfo, templateList} = useSelector(
    (state) => state.communicationInfo.scheduler
  )

  useEffect(() => {
    dispatch(getTemplatesList())
  }, [])

  return isMobile ? null : (
    <div className={styles.templateList}>
      <div className={styles.listHeading}>
        <span>{t('createRule')}</span>
        <span className={styles.listSubtext}>{t('createRuleSubText')}</span>
      </div>
      <Permission
        permissionId={
          PERMISSION_CONSTANTS.triggerController_update__rule_update
        }
      >
        <TemplateList
          templates={templateList}
          loading={loadingInfo.templates}
          setChosenTemplate={setChosenTemplate}
          sessionEndDatePassed={sessionEndDatePassed}
        />
      </Permission>
    </div>
  )
}

const TemplateList = ({
  templates,
  loading,
  setChosenTemplate,
  sessionEndDatePassed,
}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const eventManager = useSelector((state) => state.eventManager)

  const handleCreateRule = (item) => {
    if (sessionEndDatePassed) {
      dispatch(showErrorToast(t('ruleCreationBlocked')))
    } else {
      setChosenTemplate(item)
    }
    eventManager.send_event(event.COMMS_RULES_CREATED_NEW_TFI, {
      type: item.name,
    })
  }

  if (loading) {
    return <Loader show />
  }

  return templates.map((item) => (
    <div key={item._id} className={styles.templateListItem}>
      <IconFrame
        size={ICON_FRAME_CONSTANTS.SIZES.X_LARGE}
        className={TEMPLATE_ICON_CLASSES[item._id]}
      >
        <Icon
          name={TEMPLATE_ICONS[item._id] || 'notifications'}
          type={ICON_CONSTANTS.TYPES.INVERTED}
          size={ICON_CONSTANTS.SIZES.XX_SMALL}
        />
      </IconFrame>
      <div className={styles.itemListInfoSec}>
        <span className={styles.itemLabel}>{item.name}</span>
        <span>{t('numRulesSet', {count: item.rules_count})}</span>
      </div>
      <div className={styles.createBtn} onClick={() => handleCreateRule(item)}>
        {t('createNew')}
      </div>
    </div>
  ))
}
