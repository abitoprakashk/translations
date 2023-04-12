import {useTranslation} from 'react-i18next'
import styles from './idProofModal.module.css'
import PDFViewer from '../../../../../../components/Common/PdfViewer/PdfViewer'
import {
  BUTTON_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
} from '@teachmint/krayon'
import {handleFileDownload} from '../../../../../../utils/Helpers'

export default function IdProoModal({isOpen, fileUrl, onClose}) {
  const {t} = useTranslation()

  const handleDownload = () => {
    handleFileDownload(fileUrl)
  }

  const DownloadButton = () => {
    return (
      <div className={styles.downloadButton}>
        <Icon
          name={'download'}
          size={ICON_CONSTANTS.SIZES.XX_SMALL}
          version={ICON_CONSTANTS.VERSION.OUTLINED}
          type={ICON_CONSTANTS.TYPES.PRIMARY}
        />
        {t('download')}
      </div>
    )
  }

  return (
    <Modal
      header={t('idProof')}
      isOpen={isOpen}
      classes={{modal: styles.modal, content: styles.modalContent}}
      size={MODAL_CONSTANTS.SIZE.X_LARGE}
      actionButtons={[
        {
          onClick: handleDownload,
          body: <DownloadButton />,
          type: BUTTON_CONSTANTS.TYPE.OUTLINE,
        },
      ]}
      onClose={onClose}
    >
      <div>
        {fileUrl?.split('.').pop() === 'pdf' ? (
          <PDFViewer file={fileUrl} scale={0.7} />
        ) : (
          <img src={fileUrl} alt={'Image not found'}></img>
        )}
      </div>
    </Modal>
  )
}
