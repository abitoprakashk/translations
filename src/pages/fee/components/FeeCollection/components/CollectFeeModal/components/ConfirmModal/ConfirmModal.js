import styles from './ConfirmModal.module.css'
import DeleteRecieptsModalStyles from '../../../../../../../../components/Common/DeleteRecieptsModal/DeleteRecieptsModal.module.css'
import {
  Popup,
  Icon,
  ICON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import {events} from '../../../../../../../../utils/EventsConstants'
import {
  collectFeeOptionsEvents,
  collectFeeOptionsIds,
} from '../../../../../../fees.constants'
import {useTranslation} from 'react-i18next'
import classNames from 'classnames'

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  studentDetails,
  totalAmountValue,
  paymentMethod,
  selectedRecordType,
  sendClickEvent,
  paymentMode,
  buttonLoader,
}) {
  const {t} = useTranslation()
  return (
    <Popup
      actionButtons={[
        {
          body: t('cancel'),
          id: 'cancel-btn',
          onClick: () => {
            onClose(false)
            sendClickEvent(events.PAYMENT_CONFIRMATION_POPUP_CLICKED_TFI, {
              amount: totalAmountValue,
              payment_method: paymentMethod,
              action: 'decline',
              record_by:
                selectedRecordType === collectFeeOptionsIds.BY_FEE_STRUCTURE
                  ? collectFeeOptionsEvents.BY_FEE_STRUCTURE
                  : collectFeeOptionsEvents.BY_LUMPSUM_AMOUNT,
            })
          },
          type: 'outline',
          isDisabled: buttonLoader,
        },
        {
          body: (
            <div className={DeleteRecieptsModalStyles.buttonLoadingSection}>
              {buttonLoader && (
                <div
                  className={classNames(
                    'loading',
                    DeleteRecieptsModalStyles.buttonLoading
                  )}
                ></div>
              )}
              {t('collect')}
            </div>
          ),
          category: 'primary',
          id: 'activate-btn',
          onClick: () => {
            onConfirm()
            sendClickEvent(events.PAYMENT_CONFIRMATION_POPUP_CLICKED_TFI, {
              amount: totalAmountValue,
              payment_method: paymentMethod,
              action: 'confirm',
              record_by:
                selectedRecordType === collectFeeOptionsIds.BY_FEE_STRUCTURE
                  ? collectFeeOptionsEvents.BY_FEE_STRUCTURE
                  : collectFeeOptionsEvents.BY_LUMPSUM_AMOUNT,
            })
          },
          isDisabled: buttonLoader,
        },
      ]}
      header={`Collect via ${paymentMode} from ${studentDetails.name || '--'}`}
      headerIcon={
        <Icon
          name="checkCircle"
          size={ICON_CONSTANTS.SIZES.X_SMALL}
          type={ICON_CONSTANTS.TYPES.BASIC}
          className={styles.popupHeaderIcon}
        />
      }
      isOpen={isOpen}
      onClose={() => onClose(false)}
    >
      <>
        <br />
        <Para
          textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
          type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
        >
          {t('paymentConfirmModal', {paymentMode: paymentMode})}
          <br />
          {t('paymentConfirmModalSubText')}
        </Para>
      </>
    </Popup>
  )
}
