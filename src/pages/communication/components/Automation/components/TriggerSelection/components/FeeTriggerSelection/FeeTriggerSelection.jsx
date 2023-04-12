import classNames from 'classnames'
import {t} from 'i18next'
import {useEffect} from 'react'
import RepeatParameters, {TriggerRadioCard} from './RepeatParameters'
import NumberDropdown from '../common/NumberDropdown/NumberDropdown'
import {MAX_DAYS_IN_MONTH, REPEAT_ENDS} from '../../../../Automation.constants'
import styles from './FeeTriggerSelection.module.css'

export function FeeTriggerSelection({ruleInfo, setRuleInfo}) {
  const {trigger_params = {}} = ruleInfo

  const handleTriggerParamsChange = (updated) => {
    setRuleInfo((prev) => ({
      ...prev,
      trigger_params: {
        ...(prev.trigger_params || {}),
        ...updated,
      },
    }))
  }

  const onNoRepeatSelect = () => {
    setRuleInfo((prev) => ({
      ...prev,
      trigger_params: {
        repeat: REPEAT_ENDS.NO_REPEAT,
        due_date: prev.trigger_params?.due_date,
      },
    }))
  }

  useEffect(() => {
    // Select no repeat by default
    if (!trigger_params.repeat) {
      handleTriggerParamsChange({repeat: REPEAT_ENDS.NO_REPEAT})
    }
  }, [])

  const isNoRepeat = trigger_params.repeat === REPEAT_ENDS.NO_REPEAT

  return (
    <div className={styles.feeTriggerContainer}>
      <div className={styles.triggerItems}>
        <TriggerRadioCard
          className={classNames({
            [styles.disabled]: !isNoRepeat,
          })}
          label={t('sendOncePerMonth')}
          isSelected={isNoRepeat}
          handleChange={onNoRepeatSelect}
          trigger_params={trigger_params}
        >
          <div className={styles.numSelectDropdown}>
            <NumberDropdown
              fieldName="create-date-select"
              limit={MAX_DAYS_IN_MONTH}
              placeholder={t('selectDateSmall')}
              selectedOptions={isNoRepeat && trigger_params?.due_date}
              onChange={({value}) =>
                handleTriggerParamsChange({due_date: value})
              }
              showOrdinalIndicator
              isDisabled={!isNoRepeat}
              prefixText={t('on')}
              suffixText={t('ofEveryMonth')}
            />
          </div>
        </TriggerRadioCard>
        <RepeatParameters
          isRepeatEnabled={!isNoRepeat}
          trigger_params={trigger_params}
          handleTriggerParamsChange={handleTriggerParamsChange}
        />
      </div>
    </div>
  )
}
