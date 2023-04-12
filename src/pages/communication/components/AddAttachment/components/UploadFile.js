import React, {useEffect, useState} from 'react'
import styles from '../AddAttachment.module.css'
import alertCircleRedIcon from '../../../../../assets/images/icons/alert-circle-red.svg'
import videoBlueIcon from '../../../../../assets/images/icons/video-icon-blue.svg'
import musicRedIcon from '../../../../../assets/images/icons/music-icon-red.svg'
import redPdfIcon from '../../../../../assets/images/icons/red-pdf.svg'
import {useTranslation} from 'react-i18next'
import {useRef} from 'react'
import imageGreenIcon from '../../../../../assets/images/icons/image-green.svg'
import classNames from 'classnames'
import {Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import {getExtensionFromUrl} from '../../../commonFunctions'
export default function UploadFile({
  fileId,
  fileInfo,
  removeFile,
  errorMsg,
  attachmentUrl,
}) {
  const {t} = useTranslation()
  const clickOnATTACHToRetry = t('clickOnATTACHToRetry')
  const uploadFailed = t('uploadFailed')
  const uploadFileFailIcon = t('uploadFileFailIcon')
  const [info, setInfo] = useState()
  const [showImagePreview, setShowImagePreview] = useState(false)
  const imagePreviewRef = useRef(null)
  const fileIconRef = useRef()
  const [imagePreviewSrc, setImagePreviewSrc] = useState(null)
  const [imagePreviewRedirectUrl, setImagePreviewRedirectUrl] = useState(null)
  const allowedType = ['png', 'jpg', 'jpeg']

  useEffect(() => {
    if (!attachmentUrl && !fileInfo) {
      setInfo(null)
    } else if (fileInfo) {
      let type = fileInfo.type.split('/').slice(-1)[0]
      let temp = {file: fileInfo, type, name: fileInfo.name}
      setInfo(temp)
    } else {
      setInfo({
        name: `${attachmentUrl.split('/')[4]}.${
          attachmentUrl.split('.').slice(-1)[0]
        }`,
        type: attachmentUrl.split('.').slice(-1)[0],
      })
    }
  }, [fileInfo, attachmentUrl])

  useEffect(() => {
    if (info) {
      const fileType = allowedType.includes(info.type)
      if (fileType && 'file' in info) {
        let reader = new FileReader()
        reader.onload = () => {
          setImagePreviewSrc(reader.result)
          setImagePreviewRedirectUrl(URL.createObjectURL(info.file))
          if (imagePreviewRef.current) {
            imagePreviewRef.current.scrollIntoView()
          }
        }
        reader.readAsDataURL(info.file)
      } else {
        if (attachmentUrl) {
          fetch(attachmentUrl).then((image) => {
            image.blob().then((imgBlob) => {
              let reader = new FileReader()
              reader.onload = () => {
                setImagePreviewSrc(reader.result)
                if (imagePreviewRef.current) {
                  imagePreviewRef.current.scrollIntoView()
                }
              }
              reader.readAsDataURL(imgBlob)
            })
          })
        }
      }
    }
  }, [info])

  useEffect(() => {
    if (fileIconRef.current) {
      fileIconRef.current.scrollIntoView()
    }
  }, [fileIconRef.current])

  const UploadFailed = ({errorMsg}) => {
    return (
      <div
        className={classNames(styles.uploadFileSection, styles.uploadFileError)}
      >
        <div className={styles.uploadFileIconAndTextForFail}>
          <img src={alertCircleRedIcon} alt={uploadFileFailIcon} />
          <span className={styles.uploadFileErrMsgHeding}>{uploadFailed}</span>
        </div>
        <div>
          <div className={styles.uploadFileErrMsg}>
            {errorMsg}
            <span className={styles.retry}>{clickOnATTACHToRetry}</span>
          </div>
        </div>
      </div>
    )
  }

  const fileIcon = () => {
    let fileType = getExtensionFromUrl(attachmentUrl)
    switch (fileType) {
      case 'mp4':
        return videoBlueIcon
      case 'mpeg':
      case 'mp3':
        return musicRedIcon
      case 'pdf':
        return redPdfIcon
      default:
        return imageGreenIcon
    }
  }
  const handleDeleteFile = () => {
    setShowImagePreview(false)
    setImagePreviewRedirectUrl(null)
    setInfo(null)
    removeFile(fileId)
  }
  const FileUploaded = ({fileInfo}) => {
    const fileType = allowedType.includes(fileInfo.type)
    return (
      <div
        className={classNames(
          styles.uploadFileSection,
          styles.uploadFileNormal
        )}
      >
        <div className={styles.uploadFileImageSection}>
          {fileType && (
            <a
              href={attachmentUrl || imagePreviewRedirectUrl}
              target="_blank"
              rel="noreferrer"
            >
              <img
                ref={imagePreviewRef}
                src={imagePreviewSrc}
                alt={''}
                className={styles.imagePreview}
              />
            </a>
          )}
          {!fileType && <img ref={fileIconRef} src={fileIcon()} alt="" />}
        </div>
        <div className={styles.uploadedFileInfoSec}>
          <a
            href={attachmentUrl || imagePreviewRedirectUrl}
            target="_blank"
            rel="noreferrer"
          >
            <span
              className={classNames(styles.uploadedFileName, styles.ellipsis)}
            >
              {fileInfo.name}
            </span>
          </a>
          <div className={styles.uploadedFileInfo}>
            {fileInfo.type}
            {fileInfo.size
              ? ` ${
                  Math.round((fileInfo.size / 1000000 + Number.EPSILON) * 100) /
                  100
                } MB`
              : null}
          </div>
          {fileType && !showImagePreview && (
            <div className={styles.previewText}>
              <a
                href={attachmentUrl || imagePreviewRedirectUrl}
                target="_blank"
                rel="noreferrer"
              >
                <span>{t('tapPreview')}</span>
              </a>
            </div>
          )}
        </div>
        <div className={styles.uploadFileCloseBtn} onClick={handleDeleteFile}>
          <Icon
            name="delete"
            version={ICON_CONSTANTS.VERSION.OUTLINED}
            type={ICON_CONSTANTS.TYPES.ERROR}
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
          />
        </div>
      </div>
    )
  }

  return (
    <>
      {errorMsg ? (
        <UploadFailed errorMsg={errorMsg} />
      ) : (
        info && <FileUploaded fileInfo={info} />
      )}
    </>
  )
}
