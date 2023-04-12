import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {t} from 'i18next'
import {Modal, Para, MODAL_CONSTANTS, Button, Divider} from '@teachmint/krayon'
import styles from './QRCodeModal.module.css'
import {
  useQrCodeUrl,
  useQrCodeImageUrl,
} from '../../../redux/admissionManagement.selectors'
import {saveAs} from 'file-saver'
import LoadingButton from '../../../../../components/Common/LoadingButton/LoadingButton'
import globalActions from '../../../../../redux/actions/global.actions'
import {events} from '../../../../../utils/EventsConstants'

export default function QRCodeModal({showQrModal, setShowQrModal}) {
  const dispatch = useDispatch()
  const getQrCodeUrl = useQrCodeUrl()
  const getQrCodeImageUrl = useQrCodeImageUrl()
  const eventManager = useSelector((state) => state.eventManager)

  const handleDownloadQR = async () => {
    const fileName = 'QR-Code.pdf'
    let blob = await fetch(
      getQrCodeUrl?.data + '?timestamp=' + Date.now()
    ).then((r) => r.blob())
    saveAs(blob, fileName)
  }

  useEffect(() => {
    if (getQrCodeUrl?.data) {
      handleDownloadQR()
      dispatch(globalActions.getQrCode.reset())
    }
  }, [getQrCodeUrl?.data])

  useEffect(() => {
    dispatch(globalActions.getQrCodeImage.request())
  }, [])

  const handleDownload = () => {
    eventManager.send_event(events.ADMISSION_QR_CODE_DOWNLOADED_TFI, {
      screen_name: 'lead_list',
    })
    dispatch(globalActions.getQrCode.request())
  }

  const getModalFooter = () => {
    return (
      <div>
        <Divider spacing="0" />
        <div className={styles.modalFooter}>
          <div className={styles.modalErrorSection}></div>
          {getQrCodeUrl?.isLoading ? (
            <div className={styles.loader}>
              <LoadingButton size="medium" />
            </div>
          ) : (
            <Button
              onClick={handleDownload}
              classes={{button: styles.changeLeadStageButton}}
              prefixIcon="download"
              isDisabled={!getQrCodeImageUrl?.loaded}
            >
              {t('dashboardPageQrCodeDownload')}
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <Modal
      isOpen={showQrModal}
      header={t('dashboardPageQrCode')}
      footer={getModalFooter()}
      onClose={() => setShowQrModal(false)}
      size={MODAL_CONSTANTS.SIZE.SMALL}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      classes={{
        content: styles.content,
        modal: styles.modalSize,
        header: styles.headers,
      }}
    >
      <div>
        <div className={styles.modalContentText}>
          <Para className={styles.paraStyle1}>
            {t('dashboardPageQrCodeText')}
          </Para>
        </div>
        {!getQrCodeImageUrl?.loaded ? (
          <div className={styles.loaderWrapper}>
            <div className="loader"></div>
          </div>
        ) : (
          <div className={styles.qrCodeContainer}>
            <img
              src={getQrCodeImageUrl?.data[1]}
              className={styles.imageStyle}
            />
          </div>
        )}
      </div>
    </Modal>
  )
}
