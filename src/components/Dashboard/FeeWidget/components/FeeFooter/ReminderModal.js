import {
  Icon,
  IconFrame,
  ICON_CONSTANTS,
  ICON_FRAME_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import classNames from 'classnames'
import React from 'react'
import {Trans, useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'
import {useCheckPermission} from '../../../../../utils/Permssions'
import styles from './FeeFooter.module.css'

function ReminderModal({isOpen, onClose, onSendReminder}) {
  const {data} = useSelector((state) => state.globalData.feeWidget)
  const instituteInfo = useSelector((state) => state.instituteInfo)
  const permissionAllowed = useCheckPermission(
    PERMISSION_CONSTANTS.feeModuleController_sendFeeReminder_create
  )
  // eslint-disable-next-line no-unused-vars
  const feesReminderLoading = useSelector(
    (state) => state.feeCollection.feesReminderLoading
  )
  const {t} = useTranslation()

  return (
    <Modal
      isOpen={isOpen}
      classes={{modal: styles.modal, footer: styles.footer}}
      actionButtons={[
        {
          prefixIcon: 'notificationsActive',
          body: t('sendReminder'),
          onClick: onSendReminder,
          isDisabled: !permissionAllowed,
        },
      ]}
      header={
        <div
          className={classNames(
            'mt-6 mr-6 cursor-pointer flex',
            styles.selfEnd
          )}
        >
          <div onClick={onClose}>
            <Icon name="close" size={ICON_CONSTANTS.SIZES.X_SMALL} />
          </div>
        </div>
      }
      onClose={onClose}
      size={MODAL_CONSTANTS.SIZE.SMALL}
    >
      <div className={classNames('flex flex-col items-center text-center')}>
        <IconFrame type={ICON_FRAME_CONSTANTS.TYPES.PRIMARY}>
          <Icon
            name="notificationsActive"
            type={ICON_CONSTANTS.TYPES.SUCCESS}
          />
        </IconFrame>
        <div>
          <Para
            type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
            textSize={PARA_CONSTANTS.TEXT_SIZE.X_LARGE}
            className={classNames('mt-5', styles.semibold)}
          >
            {t('sendReminderPopupTitle')}
          </Para>
          <Para
            // textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
            className={classNames('mt-2')}
          >
            <Trans i18nKey={'sendReminderPopupSubtitle'}>
              Reminder will be sent to
              <Para
                // textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                className={classNames('inline')}
                type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
              >{`${data?.pending?.length}`}</Para>
              students and parents, who have due fee amount, via SMS and app
              notification
            </Trans>
          </Para>
          <Para className={classNames('mt-5')}>{t('messageLabel')}</Para>
          <Para
            className={styles.templateWrapper}
            textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
            type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
          >
            {t('sendReminderPopupBodyText', {currency: instituteInfo.currency})}
          </Para>
        </div>
      </div>
    </Modal>
  )
}

export default ReminderModal
