import {Divider, Radio} from '@teachmint/krayon'
import classNames from 'classnames'
import {t} from 'i18next'
import {
  MAX_DAYS_IN_MONTH,
  MAX_DAYS_TO_SEND_REMINDER,
  REPEAT_REMINDER_WINDOW,
  REPEAT_ENDS,
} from '../../../../Automation.constants'
import {isValidFeeTriggerParams} from '../../../../utils'
import NumberDropdown from '../common/NumberDropdown/NumberDropdown'
import SelectedDates from './SelectedDates'
import styles from './FeeTriggerSelection.module.css'

export default function RepeatParameters({
  isRepeatEnabled,
  trigger_params,
  handleTriggerParamsChange,
}) {
  return (
    <TriggerRadioCard
      className={classNames({
        [styles.disabled]: !isRepeatEnabled,
      })}
      label={t('sendMultipleAlertsPerMonth')}
      isSelected={isRepeatEnabled}
      handleChange={() =>
        handleTriggerParamsChange({
          repeat: REPEAT_ENDS.AFTER,
        })
      }
      trigger_params={trigger_params}
    >
      <div>
        <NumberDropdown
          fieldName="create-date-select"
          limit={MAX_DAYS_IN_MONTH}
          placeholder={t('selectDateSmall')}
          selectedOptions={isRepeatEnabled && trigger_params?.due_date}
          onChange={({value}) =>
            handleTriggerParamsChange({
              due_date: value,
              repeat_every: undefined,
              no_of_reminders: undefined,
            })
          }
          showOrdinalIndicator
          isDisabled={!isRepeatEnabled}
          prefixText={t('startOn')}
          suffixText={t('ofEveryMonth')}
        />
        <NumberDropdown
          isDisabled={!isRepeatEnabled || !trigger_params?.due_date}
          fieldName="create-date-select"
          options={getRepeatOptions()}
          placeholder={t('afterNDays')}
          selectedOptions={trigger_params?.repeat_every}
          onChange={({value}) =>
            handleTriggerParamsChange({repeat_every: value})
          }
          selectionPlaceholder={
            trigger_params?.repeat_every ? (
              <span className={styles.para}>
                {t('afterEveryDays', {
                  count: trigger_params.repeat_every - 1,
                })}
              </span>
            ) : null
          }
          prefixText={t('repeat')}
          suffixText={t('and')}
        />
        <NumberDropdown
          fieldName="create-date-select"
          isDisabled={!isRepeatEnabled || !trigger_params?.repeat_every}
          limit={Math.ceil(
            REPEAT_REMINDER_WINDOW / trigger_params.repeat_every
          )}
          placeholder={t('xAlerts')}
          selectedOptions={trigger_params?.no_of_reminders}
          onChange={({value}) =>
            handleTriggerParamsChange({no_of_reminders: value})
          }
          prefixText={t('stopAfterSending')}
          suffixText={!!trigger_params?.no_of_reminders && t('alerts')}
        />
      </div>
    </TriggerRadioCard>
  )
}

export const TriggerRadioCard = ({
  className,
  label,
  isSelected,
  children,
  handleChange,
  trigger_params,
}) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <Radio
        label={label}
        classes={{wrapper: styles.noMargin}}
        isSelected={isSelected}
        handleChange={handleChange}
      />
    </div>
    <Divider spacing="0" />
    <div className={classNames(styles.cardBody, className)}>{children}</div>
    {isSelected && isValidFeeTriggerParams(trigger_params) && (
      <>
        <Divider spacing="0" />
        <div className={styles.cardFooter}>
          <SelectedDates trigger_params={trigger_params} />
        </div>
      </>
    )}
  </div>
)

const getRepeatOptions = () => {
  const options = []

  for (let i = 1; i <= MAX_DAYS_TO_SEND_REMINDER; i++) {
    options.push({
      label: t('afterEveryDays', {count: i - 1}),
      value: i,
    })
  }
  return options
}
