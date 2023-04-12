import {
  Heading,
  HEADING_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
} from '@teachmint/krayon'
import PDFViewer from '../../../../components/Common/PdfViewer/PdfViewer'
import {handleFileDownload} from '../../../../utils/Helpers'
import styles from './previewDocumentModal.module.css'

export default function PreviewDocumentModal({src, showModal, setShowModal}) {
  if (!showModal || !src) return null

  const closeModal = () => {
    setShowModal(false)
  }

  const isUrl = typeof src === 'string'
  let isPdf = isUrl
    ? src?.split('.')?.pop() === 'pdf'
    : src.type === 'application/pdf'

  let documentName = isUrl ? src?.split('/')?.pop() : src?.name

  return (
    <div className={styles.modal}>
      <div className={styles.header}>
        <Heading
          type={HEADING_CONSTANTS.TYPE.TEXT_PRIMARY}
          textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}
          className={styles.heading}
        >
          {documentName}
        </Heading>
        <div className={styles.headerRight}>
          <Icon
            name="download"
            type={ICON_CONSTANTS.TYPES.INVERTED}
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
            onClick={() => handleFileDownload(src)}
            className={styles.cursorPointer}
          />
          <Icon
            name="close"
            type={ICON_CONSTANTS.TYPES.INVERTED}
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
            onClick={closeModal}
            className={styles.cursorPointer}
          />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.documentWrapper}>
          {isPdf ? (
            <PDFViewer scale={1.2} file={src} />
          ) : (
            <img
              src={isUrl ? src : URL.createObjectURL(src)}
              className={styles.img}
            />
          )}
        </div>
      </div>
    </div>
  )
}
