import {Checkbox, Divider, Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import {useSelector} from 'react-redux'
import {t} from 'i18next'
import styles from './MediumSelection.module.css'
import {getMessagePreview} from '../../utils'
import {ACTIONS, ACTION_TEMPLATES} from '../../Automation.constants'

export default function MediumSelection({inputData, setInputData}) {
  const unusedQuota = useSelector(
    (state) => state.communicationInfo.sms.unusedQuota
  )

  const templateList = useSelector(
    (state) => state.communicationInfo.scheduler.templateList
  )

  const actions_list = new Set(inputData?.actions_list || [])

  const hasNoSmsBalance = !(unusedQuota && unusedQuota > 0)
  const showNoSmsBalanceError =
    hasNoSmsBalance &&
    (actions_list.has(ACTIONS.SEND_SMS_NOTIFICATIONS) ||
      actions_list.has(ACTIONS.SEND_SMS_IF_APP_NOT_INSTALLED))

  const channelOptions = {
    app: {
      label: t('appNotifications'),
      value: ACTIONS.SEND_APP_NOTIFICATIONS,
      templateKey: ACTION_TEMPLATES[ACTIONS.SEND_APP_NOTIFICATIONS],
    },
    sms: {
      label: t('smsCountLeft', {count: unusedQuota}),
      value: ACTIONS.SEND_SMS_NOTIFICATIONS,
      isDisabled: hasNoSmsBalance,
      templateKey: ACTION_TEMPLATES[ACTIONS.SEND_SMS_NOTIFICATIONS],
    },
    smsWarn: {
      value: ACTIONS.SEND_SMS_IF_APP_NOT_INSTALLED,
    },
  }

  const channelOptionsList = Object.values(channelOptions).slice(0, 2)

  const showSendSMSToNonAppUsers =
    actions_list.has(channelOptions.app.value) &&
    !actions_list.has(channelOptions.sms.value) &&
    !!unusedQuota

  const handleOptionSelection = (value, isSelected) => {
    const actions = new Set(inputData.actions_list || [])
    if (isSelected) {
      actions.add(value)

      if (value === ACTIONS.SEND_APP_NOTIFICATIONS) {
        actions.add(ACTIONS.SEND_SMS_IF_APP_NOT_INSTALLED)
      }
    } else {
      actions.delete(value)
    }

    if (
      !actions.has(ACTIONS.SEND_APP_NOTIFICATIONS) ||
      actions.has(ACTIONS.SEND_SMS_NOTIFICATIONS)
    ) {
      actions.delete(channelOptions.smsWarn.value)
    }

    setInputData({...inputData, actions_list: [...actions]})
  }

  return (
    <div className={styles.container}>
      {channelOptionsList.map((option) => (
        <div className={styles.card} key={option.value}>
          <div className={styles.header}>
            <Checkbox
              label={option.label}
              classes={{wrapper: styles.noLeftMargin}}
              handleChange={({value}) =>
                handleOptionSelection(option.value, value)
              }
              isSelected={actions_list.has(option.value)}
              isDisabled={option.isDisabled}
            />
          </div>
          <Divider spacing="16px" />
          <div className={styles.cardBody}>
            <div className={styles.bodyHeading}>{t('messagePreview')}</div>
            <div className={styles.message}>
              {getMessagePreview(inputData, templateList, option.templateKey)}
            </div>
            {option.value === channelOptions.app.value &&
              showSendSMSToNonAppUsers && (
                <div className={styles.notifyContainer}>
                  <Checkbox
                    fieldName={channelOptions.smsWarn.value}
                    isSelected={actions_list.has(channelOptions.smsWarn.value)}
                    handleChange={({value}) =>
                      handleOptionSelection(channelOptions.smsWarn.value, value)
                    }
                    label={t('sendSmsToNonAppUsers')}
                    classes={{
                      wrapper: styles.noLeftMargin,
                      label: styles.notifyCheckboxLabel,
                    }}
                    isDisabled={hasNoSmsBalance}
                  />
                </div>
              )}
          </div>
        </div>
      ))}
      {showNoSmsBalanceError && (
        <div className={styles.alertContainer}>
          <div className={styles.alertTitleContainer}>
            <Icon
              name="caution"
              type={ICON_CONSTANTS.TYPES.ERROR}
              size={ICON_CONSTANTS.SIZES.XX_SMALL}
            />
            <div className={styles.alertTitle}>{t('smsWarningTitle')}</div>
          </div>
          <div className={styles.alertBody}>{t('rechargeSMSPrompt')}</div>
        </div>
      )}
    </div>
  )
}
