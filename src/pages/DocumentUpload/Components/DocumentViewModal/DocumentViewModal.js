import {
  Modal,
  MODAL_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  BUTTON_CONSTANTS,
} from '@teachmint/krayon'
import {saveAs} from 'file-saver'
import {useSelector} from 'react-redux'
import PDFViewer from '../../../../components/Common/PdfViewer/PdfViewer'
import {events} from '../../../../utils/EventsConstants'
import styles from './DocumentViewModal.module.css'

const DocumentViewModal = ({
  isOpen,
  docUrl,
  title,
  onClose,
  isImage,
  personaMember,
  field,
  extension,
}) => {
  const {eventManager} = useSelector((state) => state)
  const handleDownload = async () => {
    eventManager.send_event(events.PROFILE_DOCUMENT_DOWNLOAD_CLICKED_TFI, {
      user_screen: personaMember?.type === 2 ? 'teacher' : 'student',
      document_type: field?.label,
      screen: 'document_preview',
    })
    const fileName = `${personaMember.name}_${personaMember.last_name}_${field.key_id}.${extension}`
    let blob = await fetch(docUrl).then((r) => r.blob())
    saveAs(blob, fileName)
  }

  const DownloadButton = () => {
    return (
      <div className={styles.downloadButton}>
        <Icon
          name="download"
          size={ICON_CONSTANTS.SIZES.XX_SMALL}
          version={ICON_CONSTANTS.VERSION.OUTLINED}
          type={ICON_CONSTANTS.TYPES.PRIMARY}
        />
        Download
      </div>
    )
  }

  return (
    <Modal
      header={title}
      isOpen={isOpen}
      onClose={onClose}
      shouldCloseOnOverlayClick={false}
      size={MODAL_CONSTANTS.SIZE.MEDIUM}
      classes={{modal: styles.modal, content: styles.modalContent}}
      actionButtons={[
        {
          body: <DownloadButton />,
          type: BUTTON_CONSTANTS.TYPE.OUTLINE,
          onClick: handleDownload,
        },
      ]}
    >
      {isImage ? (
        <img
          className={styles.imgDesign}
          src={docUrl}
          alt={'Image not found'}
        />
      ) : (
        <PDFViewer file={docUrl} scale={1} />
      )}
    </Modal>
  )
}

export {DocumentViewModal}
