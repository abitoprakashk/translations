import ConfirmationPopup from '../ConfirmationPopup/ConfirmationPopup'
import {useTranslation} from 'react-i18next'
import {Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import styles from './DeleteConfirmationModal.module.css'

export default function DeleteConfirmationModal({
  setShowConfirmPopUp,
  onRemove,
  title,
  desc,
}) {
  const {t} = useTranslation()
  const removeIcon = (
    <div className={styles.removeModalIconWrapper}>
      <Icon
        name="invisible"
        type={ICON_CONSTANTS.TYPES.ERROR}
        size={ICON_CONSTANTS.SIZES.X_LARGE}
      />
    </div>
  )
  return (
    <ConfirmationPopup
      onClose={(state) => setShowConfirmPopUp(state)}
      onAction={onRemove}
      title={title}
      desc={desc}
      primaryBtnText={t('Cancel')}
      secondaryBtnText={t('removePostBtn')}
      secondaryBtnStyle="tm-btn2-red"
      icon={removeIcon}
    />
  )
}
