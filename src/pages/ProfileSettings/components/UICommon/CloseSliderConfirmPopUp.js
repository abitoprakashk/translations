import {Icon} from '@teachmint/common'
import {t} from 'i18next'
import ConfirmationPopup from '../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import styles from './closeSliderConfirmPopUp.module.css'

export default function CloseSliderConfirmPopup({
  onClose,
  onAction,
  confirmationTitle,
  confirmationDesc,
}) {
  const closeConfirmObject = {
    onClose: onClose,
    onAction: onAction,
    icon: <Icon name="error" size="4xl" color="warning" type="filled" />,
    title: confirmationTitle,
    desc: confirmationDesc,
    primaryBtnText: t('previousDuesBtnTextContinueEditing'),
    secondaryBtnText: t('previousDuesBtnTextYesExit'),
    closeOnBackgroundClick: false,
  }
  return (
    <div className={styles.closeConfirmPopupWrapper}>
      <ConfirmationPopup {...closeConfirmObject} />
    </div>
  )
}
