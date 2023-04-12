import styles from './transportSetupGuideVideo.module.css'
import {Modal, MODAL_CONSTANTS} from '@teachmint/krayon'
import TransportSetupVideo from '../../../../components/TransportSetupVideo/TransportSetupVideo'

export default function TransportSetupGuideVideoModal({
  showModal,
  setShowModal,
}) {
  if (!showModal) return null

  return (
    <Modal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      size={MODAL_CONSTANTS.SIZE.X_LARGE}
      classes={{content: styles.modalContent, modal: styles.modal}}
    >
      <TransportSetupVideo />
    </Modal>
  )
}
