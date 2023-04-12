import {useSelector} from 'react-redux'
import {useState} from 'react'
import {t} from 'i18next'
import classNames from 'classnames'
import {saveAs} from 'file-saver'
import printJS from 'print-js'
import {
  Modal,
  Para,
  PlainCard,
  EmptyState,
  BUTTON_CONSTANTS,
  Heading,
  HEADING_CONSTANTS,
} from '@teachmint/krayon'
import {events} from '../../../../../../utils/EventsConstants'
import styles from './ViewDocuments.module.css'
import PDFViewer from '../../../../../../components/Common/PdfViewer/PdfViewer'
import {showErrorToast} from '../../../../../../redux/actions/commonAction'
import {IMIS_SETTING_TYPES} from '../../../../utils/constants'
import {useAdmissionCrmSettings} from '../../../../redux/admissionManagement.selectors'

const DOCUMENT_TYPES = {
  PDF: 'pdf',
  JPEG: 'jpeg',
  JPG: 'jpg',
  PNG: 'png',
}

const IMAGE_TYPE_DOCUMENTS = [
  DOCUMENT_TYPES.JPEG,
  DOCUMENT_TYPES.JPG,
  DOCUMENT_TYPES.PNG,
]

export default function ViewDocuments({leadData, setShowDocument}) {
  const [selectedDocument, setSelectedDocument] = useState(0)
  const admissionFormFields = useAdmissionCrmSettings()
  const eventManager = useSelector((state) => state.eventManager)
  const {documentFormFields, categorizedFields} = admissionFormFields?.data

  const enabledDocuments = Object.values(documentFormFields.profile_fields)
    .filter((field) => field.enabled)
    .map((field) => field.imis_key_id)

  let imisFields = []
  Object.values(categorizedFields)
    .filter((category) => category.setting_type === IMIS_SETTING_TYPES.DOCUMENT)
    .forEach((category) => {
      category.fields.forEach((field) => {
        if (
          Object.keys(leadData?.profile_data)?.includes(field?.key_id) ||
          enabledDocuments.includes(field?.key_id)
        ) {
          imisFields.push(field)
        }
      })
    })

  const currentDocument = imisFields[selectedDocument]
  const documentURL = leadData.profile_data?.[currentDocument.key_id]

  const handlePrint = () => {
    eventManager.send_event(
      events.ADMISSION_UPLOADED_DOCUMENT_PRINT_CLICKED_TFI,
      {document_type: {id: currentDocument._id, key_id: currentDocument.key_id}}
    )
    if (!documentURL) return
    const extension = documentURL.split('.').pop()
    let fileType
    if (extension === DOCUMENT_TYPES.PDF) fileType = 'pdf'
    else if (IMAGE_TYPE_DOCUMENTS.includes(extension)) fileType = 'image'
    else return
    printJS({
      type: fileType,
      documentTitle: '',
      printable: documentURL,
      targetStyles: ['*'],
      onError: () => {
        showErrorToast(t('somethingWentWrongPleaseCheckYourNetwork'))
      },
    })
  }

  const handleDownload = async () => {
    eventManager.send_event(
      events.ADMISSION_UPLOADED_DOCUMENT_DOWNLOAD_CLICKED_TFI,
      {document_type: {id: currentDocument._id, key_id: currentDocument.key_id}}
    )
    const fileName = documentURL.split('/').pop()
    let blob = await fetch(documentURL).then((r) => r.blob())
    saveAs(blob, fileName)
  }

  const getCarouselContent = () => {
    if (typeof documentURL != 'string' || documentURL === '') {
      return (
        <div className={styles.stateContainer}>
          <EmptyState
            iconName="management"
            content={t('fileNotUploadedViewDocuments')}
            button={false}
          />
        </div>
      )
    } else if (documentURL?.split('.').pop() === 'pdf') {
      return (
        <div
          className={classNames(
            styles.pdfViewer,
            'show-scrollbar',
            'show-scrollbar-small'
          )}
        >
          <PDFViewer file={documentURL} scale={0.8} />
        </div>
      )
    } else {
      return <img src={documentURL} className={styles.Image} />
    }
  }

  return (
    <Modal
      isOpen
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      header={t('documentsLeadProfile')}
      onClose={() => setShowDocument(false)}
      classes={{modal: styles.modalSize}}
      actionButtons={[
        {
          onClick: () => handleDownload(),
          body: t('downloadReceiptLeadProfile'),
          type: BUTTON_CONSTANTS.TYPE.OUTLINE,
          prefixIcon: 'download',
          isDisabled: !leadData.profile_data?.[currentDocument.key_id]
            ? true
            : false,
        },
        {
          onClick: () => handlePrint(),
          body: t('printReceiptLeadProfile'),
          type: BUTTON_CONSTANTS.TYPE.OUTLINE,
          prefixIcon: 'print',
          isDisabled: !leadData.profile_data?.[currentDocument.key_id]
            ? true
            : false,
        },
      ]}
    >
      <div className={styles.documentWrapper}>
        <PlainCard className={styles.outerCard}>
          <div
            className={classNames(
              styles.cardWrapper,
              'show-scrollbar',
              'show-scrollbar-small'
            )}
          >
            {imisFields?.map((field, index) => (
              <PlainCard
                key={index}
                className={
                  selectedDocument === index
                    ? styles.activeCard
                    : styles.inactiveCard
                }
                onClick={() => {
                  eventManager.send_event(
                    events.ADMISSION_LEAD_PROFILE_DOCUMENT_VIEWED_TFI,
                    {
                      document_id: currentDocument._id,
                      document_name: currentDocument.key_id,
                    }
                  )
                  setSelectedDocument(index)
                }}
              >
                {field.label}
              </PlainCard>
            ))}
          </div>
        </PlainCard>
        <div className={styles.documentOuter}>
          <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}>
            {currentDocument.label}
          </Heading>
          <div className={styles.documentName}>
            {documentURL && <Para>{documentURL.split('/').pop()}</Para>}
          </div>
          <div className={styles.documentContainer}>{getCarouselContent()}</div>
        </div>
      </div>
    </Modal>
  )
}
