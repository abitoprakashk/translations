import classNames from 'classnames'
import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {
  Divider,
  Icon,
  IconFrame,
  ICON_CONSTANTS,
  ICON_FRAME_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  PlainCard,
} from '@teachmint/krayon'
import PDFViewer from '../../../../../../components/Common/PdfViewer/PdfViewer'
import DocumentForm from './DocumentForm'
import styles from './vehicleDocumentsForm.module.css'

const DocumentCard = ({src}) => {
  if (!src) return
  const isUrl = typeof src === 'string'
  let isPdf = isUrl
    ? src?.split('.')?.pop() === 'pdf'
    : src.type === 'application/pdf'

  return (
    <div className={styles.documentContainer}>
      {isPdf ? (
        <PDFViewer file={src} scale={0.3} classes={{page: styles.pdfDesign}} />
      ) : (
        <img src={isUrl ? src : URL.createObjectURL(src)} />
      )}
    </div>
  )
}

export default function VehicleDocumentsForm({documents, onDocumentsChange}) {
  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState(null)
  const {t} = useTranslation()

  const onDocumentAdd = (newDocument) => {
    setSelectedDocumentIndex(documents.length)
    onDocumentsChange([...documents, newDocument])
  }
  const onDocumentEdit = (editedDocument, index) => {
    let newDocuments = [...documents]
    newDocuments[index] = editedDocument
    setSelectedDocumentIndex(index)
    onDocumentsChange(newDocuments)
  }

  const onDocumentDelete = (index) => {
    let newDocuments = [...documents]
    newDocuments.splice(index, 1)
    setSelectedDocumentIndex(null)
    onDocumentsChange(newDocuments)
  }

  return (
    <div className={styles.formWrapper}>
      <div className={styles.documentsViewWrapper}>
        {documents?.length > 0 ? (
          <div className={styles.cardsWrapper}>
            <PlainCard
              className={classNames(styles.documentCard, {
                [styles.selectedCardBorder]: selectedDocumentIndex === null,
              })}
              onClick={() => setSelectedDocumentIndex(null)}
            >
              <Icon
                type={ICON_CONSTANTS.TYPES.PRIMARY}
                size={ICON_CONSTANTS.SIZES.LARGE}
                name={'add'}
              />
              <Para weight={PARA_CONSTANTS.WEIGHT.MEDIUM}>{t('addNew')}</Para>
            </PlainCard>
            {documents?.map((document, index) => (
              <PlainCard
                key={index}
                className={classNames(styles.documentCard, {
                  [styles.selectedCardBorder]: selectedDocumentIndex === index,
                })}
                onClick={() => setSelectedDocumentIndex(index)}
              >
                <DocumentCard src={document?.blob || document?.public_url} />
              </PlainCard>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <IconFrame
              type={ICON_FRAME_CONSTANTS.TYPES.PRIMARY}
              size={ICON_FRAME_CONSTANTS.SIZES.XXX_LARGE}
            >
              <Icon
                type={ICON_CONSTANTS.TYPES.SECONDARY}
                size={ICON_CONSTANTS.SIZES.SMALL}
                name={'file'}
              />
            </IconFrame>
            <Para>{t('noDocumentsUploadedYet')}</Para>
          </div>
        )}
      </div>
      <Divider isVertical spacing="16px" />
      <div className={styles.documentInputFormWrapper}>
        <DocumentForm
          onDocumentAdd={onDocumentAdd}
          onDocumentEdit={onDocumentEdit}
          onDocumentDelete={onDocumentDelete}
          document={documents[selectedDocumentIndex]}
          index={selectedDocumentIndex}
        />
      </div>
    </div>
  )
}
