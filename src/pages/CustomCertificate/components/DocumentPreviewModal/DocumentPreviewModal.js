import React from 'react'
import {Modal, MODAL_CONSTANTS} from '@teachmint/krayon'
import PDFViewer from '../../../../components/Common/PdfViewer/PdfViewer'
import styles from './DocumentPreviewModal.module.css'

const DocumentPreviewModal = ({
  url,
  isOpen,
  header,
  onClose,
  actionButtons,
  allowZoom,
  ...props
}) => {
  return (
    <Modal
      size={MODAL_CONSTANTS.SIZE.AUTO}
      isOpen={isOpen}
      header={header}
      onClose={onClose}
      actionButtons={actionButtons || []}
      {...props}
    >
      <div className={styles.modalBody}>
        <PDFViewer
          file={url}
          classes={{wrapper: styles.pdfWrapper, page: styles.pdfPage}}
          scale={1}
          allowZoom={allowZoom}
        />
      </div>
    </Modal>
  )
}

export default DocumentPreviewModal
