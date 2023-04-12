import {t} from 'i18next'
import {saveAs} from 'file-saver'
import {useSelector} from 'react-redux'
import {
  Modal,
  Heading,
  Icon,
  ICON_CONSTANTS,
  HEADING_CONSTANTS,
  Divider,
  MODAL_CONSTANTS,
  Button,
  BUTTON_CONSTANTS,
} from '@teachmint/krayon'
import styles from './PreviewStaticImage.module.css'
import admit_card_front from '../../../assets/admit_card_front.svg'
import admit_card_back from '../../../assets/admit_card_back.svg'
import PDFViewer from '../../../../../components/Common/PdfViewer/PdfViewer'
import {events} from '../../../../../utils/EventsConstants'
import {pdfPrint} from '../../../../../utils/Helpers'

export default function PreviewStaticImage({
  showPreview,
  setShowPreview,
  data,
  screenName,
  sectionId,
}) {
  const {eventManager} = useSelector((state) => state)

  const getModalHeader = () => {
    return (
      <div>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}>
              {t('previewAdmitCard')}
            </Heading>
          </div>
          <div className={styles.modalIcons}>
            <Icon
              name="close"
              onClick={() => setShowPreview(!showPreview)}
              size={ICON_CONSTANTS.SIZES.XX_SMALL}
              className={styles.modalClickable}
            />
          </div>
        </div>
        <Divider spacing="0" />
      </div>
    )
  }

  const handleDownload = async () => {
    eventManager.send_event(events.ADMIT_CARD_STUDENT_DOWNLOAD_CLICKED_TFI, {
      sections_id: sectionId,
      student_id: data._id,
    })
    const fileName = 'admit-card'
    let blob = await fetch(data.url).then((r) => r.blob())
    saveAs(blob, fileName)
  }

  const getModalFooter = () => {
    return (
      <div className={styles.modalFooter}>
        <Divider spacing="0" />
        <div className={styles.footerButton}>
          <Button
            children={t('admitCardPrint')}
            prefixIcon="print"
            type={BUTTON_CONSTANTS.TYPE.OUTLINE}
            onClick={() => {
              eventManager.send_event(
                events.ADMIT_CARD_STUDENT_DOWNLOAD_CLICKED_TFI,
                {
                  sections_id: sectionId,
                  student_id: data._id,
                }
              )
              pdfPrint(data.url)
            }}
          />
          <Button
            children={t('admitCardDownload')}
            prefixIcon="download"
            type={BUTTON_CONSTANTS.TYPE.OUTLINE}
            onClick={() => handleDownload()}
          />
        </div>
      </div>
    )
  }

  return (
    <Modal
      isOpen={showPreview}
      header={getModalHeader()}
      footer={screenName === 'studentList' ? getModalFooter() : false}
      classes={{modal: styles.modal}}
      size={MODAL_CONSTANTS.SIZE.SMALL}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      onClose={() => setShowPreview(!showPreview)}
    >
      {screenName === 'studentList' ? (
        <div className={styles.pdfViewer}>
          <PDFViewer
            file={data.url}
            scale={1.6}
            classes={{page: styles.viewer}}
          />
        </div>
      ) : (
        <div className={styles.imageWrapper}>
          <img src={admit_card_front} className={styles.imgfront} />
          <img src={admit_card_back} className={styles.imgfront} />
        </div>
      )}
    </Modal>
  )
}
