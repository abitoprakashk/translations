import {
  BUTTON_CONSTANTS,
  Heading,
  HEADING_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  Modal,
} from '@teachmint/krayon'
import Loader from '../../../../../components/Common/Loader/Loader'
import {t} from 'i18next'
import {useDispatch, useSelector} from 'react-redux'
import {showSuccessToast} from '../../../../../redux/actions/commonAction'
import styles from './QRCodeModal.module.css'
import TeachmintLogo from '../../../../../assets/images/common/teachmint-logo.svg'
import globalActions from '../../../../../redux/actions/global.actions'
import {saveAs} from 'file-saver'
import {useEffect, useRef} from 'react'
import classNames from 'classnames'
import {DateTime} from 'luxon'
import {getQRCodeUrl} from '../../utils/shift.utils'

export default function QRCodeModal({isOpen, onClose}) {
  const dispatch = useDispatch()
  const isQrCodeDownloading = useSelector(
    (state) => state.globalData?.qrCodeFile?.isLoading
  )
  const instituteInfo = useSelector((state) => state.instituteInfo)
  const sessionId = useSelector(
    (state) => state.instituteActiveAcademicSessionId
  )
  const shiftQRCode = useSelector(
    (state) => state.globalData?.shiftQRCode?.data
  )
  const qrCodeRef = useRef(null)
  const onDownloadQRCode = () => {
    const url = getQRCodeUrl(instituteInfo?._id, sessionId)
    dispatch(
      globalActions?.downloadQRCode?.request(
        {
          data: url,
          size: 5,
          timestamp: DateTime.now().toSeconds(), //to avoid caching from GCP
        },
        async (fileUrl) => {
          let blob = await fetch(fileUrl).then((r) => r.blob())
          const filename = `${instituteInfo?.name}-qr-code.pdf`
          saveAs(blob, filename)
          dispatch(showSuccessToast(t('QRCodeDownloadedSuccessfully')))
          onClose()
        }
      )
    )
  }

  useEffect(() => {
    if (shiftQRCode) {
      const url = URL.createObjectURL(shiftQRCode)
      qrCodeRef.current.src = url
    }
  }, [shiftQRCode])

  return (
    <>
      <Loader show={isQrCodeDownloading} />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        actionButtons={[
          {
            id: 'downloadQRCode',
            onClick: onDownloadQRCode,
            body: t('downloadQR'),
            type: BUTTON_CONSTANTS.TYPE.FILLED,
            prefixIcon: 'download',
            category: BUTTON_CONSTANTS.CATEGORY.PRIMARY,
          },
        ]}
        header={t('downloadQRCode')}
        classes={{
          content: classNames(
            styles.content,
            'krayon-show-scrollbar-small krayon-show-scrollbar'
          ),
        }}
        shouldCloseOnOverlayClick={false}
      >
        <div className={styles.wrapper}>
          {instituteInfo?.ins_logo && (
            <img
              alt="ins-logo"
              src={instituteInfo?.ins_logo}
              className={styles.insLogo}
            />
          )}
          <Heading
            textSize={HEADING_CONSTANTS.TEXT_SIZE.LARGE}
            weight={HEADING_CONSTANTS.WEIGHT.BOLD}
          >
            {instituteInfo?.name}
          </Heading>
          <div className={styles.qrCodeContainer}>
            <img alt="qr-code" ref={qrCodeRef} />
          </div>
          <Para>{t('shiftScanQRCode')}</Para>
          <Heading
            textSize={HEADING_CONSTANTS.TEXT_SIZE.SMALL}
            weight={HEADING_CONSTANTS.WEIGHT.BOLD}
            className={styles.heading}
          >
            {t('qrCodeMarkAttendance')}
          </Heading>
          <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
            {t('geofenceAttendancePoweredBy')}
          </Para>
          <img
            alt="teachmint-logo"
            src={TeachmintLogo}
            className={styles.teachmintLogo}
          />
        </div>
      </Modal>
    </>
  )
}
