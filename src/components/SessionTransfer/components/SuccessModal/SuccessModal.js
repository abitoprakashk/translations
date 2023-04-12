import {Modal, MODAL_CONSTANTS, Para} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import SuccessSplash from '../../../Common/SuccessSplash/SuccessSplash'
import styles from './SuccessModal.module.css'

const SuccessModal = ({targetSessionName, isFeeStructureImported}) => {
  const {t} = useTranslation()
  return (
    <Modal isOpen size={MODAL_CONSTANTS.SIZE.SMALL}>
      <div className={styles.container}>
        <SuccessSplash width={150} />
        <Para className={styles.successMessage}>
          {isFeeStructureImported
            ? t('importSuccessLabel', {session: targetSessionName})
            : t('importClassSuccessLabel', {session: targetSessionName})}
        </Para>
      </div>
    </Modal>
  )
}

export default SuccessModal
