import {Divider, Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import {t} from 'i18next'
import {FeeTriggerSelection} from './components/FeeTriggerSelection/FeeTriggerSelection'
import AttendanceTrigger from './components/AttendanceTriggerSelection/AttendanceTriggerSelection'
import NumberDropdown from './components/common/NumberDropdown/NumberDropdown'
import {
  MAX_DAYS_BEFORE_HOLIDAY_REMINDER,
  SCHEDULER_TEMPLATE_TYPES,
} from '../../Automation.constants'
import {getDaysBeforeHolidayLabel} from '../../utils'
import styles from './TriggerSelection.module.css'

export default function TriggerSelection({inputData, setInputData}) {
  const templateId = inputData.template_id || inputData._id

  switch (templateId) {
    case SCHEDULER_TEMPLATE_TYPES.FEE_REMINDER:
      return (
        <FeeTriggerSelection ruleInfo={inputData} setRuleInfo={setInputData} />
      )
    case SCHEDULER_TEMPLATE_TYPES.ATTENDANCE:
      return (
        <AttendanceTrigger ruleInfo={inputData} setRuleInfo={setInputData} />
      )
    case SCHEDULER_TEMPLATE_TYPES.HOLIDAY:
      return <HolidayTrigger ruleInfo={inputData} setRuleInfo={setInputData} />
    case SCHEDULER_TEMPLATE_TYPES.BIRTHDAY:
      return <BirthdayTrigger />
    default:
      null
  }
}

const BirthdayTrigger = () => (
  <div className={styles.container}>
    <Icon
      name="error"
      size={ICON_CONSTANTS.SIZES.XX_SMALL}
      version={ICON_CONSTANTS.VERSION.OUTLINED}
    />
    <span className={styles.birthdayMsg}>{t('birthdayGreetingsInfo')}</span>
  </div>
)

const HolidayTrigger = ({ruleInfo, setRuleInfo}) => {
  const {trigger_params = {}} = ruleInfo

  const handleParamsChange = (daysBeforeHoliday) => {
    setRuleInfo((prev) => ({
      ...prev,
      trigger_params: {
        ...(prev.trigger_params || {}),
        days_before_holiday: daysBeforeHoliday,
      },
    }))
  }

  return (
    <div className={styles.holidayTriggerContainer}>
      <div className={styles.holidayTrigger}>
        <NumberDropdown
          limit={MAX_DAYS_BEFORE_HOLIDAY_REMINDER}
          className={styles.numDropdown}
          prefixText={t('sendMessage')}
          suffixText={t('theHoliday')}
          selectedOptions={trigger_params?.days_before_holiday}
          onChange={({value}) => handleParamsChange(value)}
          includeZero
          placeholder={t('nDaysBefore')}
          selectionPlaceholder={getDaysBeforeHolidayLabel(
            trigger_params?.days_before_holiday
          )}
        />
      </div>
      <Divider spacing="0" />
      <div className={styles.holidayTriggerInfo}>
        <Icon
          name="error"
          size={ICON_CONSTANTS.SIZES.XX_SMALL}
          version={ICON_CONSTANTS.VERSION.OUTLINED}
          type={ICON_CONSTANTS.TYPES.SECONDARY}
        />
        <span>{t('holidayNoticeInfo')}</span>
      </div>
    </div>
  )
}
