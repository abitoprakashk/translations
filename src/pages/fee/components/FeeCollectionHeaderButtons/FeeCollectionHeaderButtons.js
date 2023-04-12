import React from 'react'
import styles from './FeeCollectionHeaderButtons.module.css'
import {useTranslation} from 'react-i18next'
import {SEND_REMINDER_TOOLTIP_BACKGROUND} from '../../fees.constants'
import {Button, Icon, Tooltip} from '@teachmint/common'
import classNames from 'classnames'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'

const FeeCollectionHeaderButtons = ({
  handleSendReminderButtonClick,
  handleDownloadCSVClick,
}) => {
  const {t} = useTranslation()
  return (
    <div className={styles.header}>
      {handleSendReminderButtonClick !== undefined && (
        <div className={styles.headerButtons}>
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.feeModuleController_sendFeeReminder_create
            }
          >
            <Button
              type="primary"
              size="medium"
              className={styles.headerButton}
              onClick={handleSendReminderButtonClick}
            >
              <div className={styles.sendReminderButton}>
                <Icon
                  name="alert"
                  type="outlined"
                  size="xxs"
                  color="inverted"
                />
                {t('sendReminder')}
              </div>
            </Button>
          </Permission>
          <a
            data-tip
            data-for="send_reminder_tooltip"
            className={styles.sendReminderIconWrapper}
          >
            <Icon name="info" type="outlined" size="xs" color="secondary" />
          </a>
          <Tooltip
            toolTipId="send_reminder_tooltip"
            backgroundColor={SEND_REMINDER_TOOLTIP_BACKGROUND}
            className={classNames(
              styles.reminderTooltip,
              styles.reminderTooltipHigherSpecificity
            )}
          >
            <span className={styles.reminderTooltipText}>
              {t('sendReminderTooltip')}
            </span>
          </Tooltip>
        </div>
      )}
      {handleDownloadCSVClick !== undefined && (
        <div>
          <Button
            type="border"
            size="medium"
            className={styles.headerButton}
            onClick={handleDownloadCSVClick}
          >
            {t('downloadReport')}
          </Button>
        </div>
      )}
    </div>
  )
}

export default FeeCollectionHeaderButtons
