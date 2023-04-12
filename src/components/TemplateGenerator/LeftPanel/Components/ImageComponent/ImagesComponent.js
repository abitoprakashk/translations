import {useEffect, useState} from 'react'
import {Alert, ALERT_CONSTANTS} from '@teachmint/krayon'
import ImageList from './ImageList'
import {
  BACKGROUND,
  IMAGE_SIZE_LIMIT,
  NONE,
  WATERMARK,
} from '../../LeftPanel.constants'
import globalActions from '../../../../../redux/actions/global.actions'
import {useDispatch, useSelector} from 'react-redux'
import Loader from '../../../../Common/Loader/Loader'
import HeaderWithAddButton from '../HeaderWithAddButton/HeaderWithAddButton'
import {useTranslation} from 'react-i18next'
import {showErrorToast} from '../../../../../redux/actions/commonAction'
import {uploadFileBySignedUrl} from '../../../../../utils/SignedUrlUpload'
import {TEMPLATE_GENERATOR_EVENTS} from '../../../TemplateGenerator.events'
import styles from './ImagesComponent.module.css'

const ImagesComponent = ({
  type,
  onImageClick = () => {},
  alertContent,
  allowedFormates = ['image/jpeg'],
  label,
  triggerEvent = () => {},
  module,
}) => {
  const [fileSizeError, setFileSizeError] = useState(false)
  const [fileTypeError, setFileTypeError] = useState(false)
  const dispatch = useDispatch()
  const {t} = useTranslation()

  useEffect(() => {
    if (fileSizeError) {
      setFileSizeError(false)
      dispatch(showErrorToast(t('templateGenerator.uploadSizeLimitReached')))
    }
    if (fileTypeError) {
      setFileTypeError(false)
      dispatch(showErrorToast(t('incorrectFileType')))
    }
  }, [fileSizeError, fileTypeError])

  const {
    getImageDirectory,
    getDocumentImageUploadSignedUrl,
    storePublicUrlInDB,
    templateGeneratorImageDelete,
  } = useSelector((store) => store.globalData)
  useEffect(() => {
    getImageDirectoryList()
  }, [])

  const uploadUsignedUrl = ({file, signed_url, public_url}) => {
    uploadFileBySignedUrl(signed_url, file, {
      uploadFinished: () => onUploadSuccess(public_url),
    })
  }

  const getImageDirectoryList = () => {
    dispatch(globalActions.getImageDirectory.request({type, module}))
  }

  const onUploadSuccess = (publicUrl) => {
    triggerEvent(
      TEMPLATE_GENERATOR_EVENTS.TEMPLATE_MAKER_TEMPLATE_IMAGE_UPLOADED_TFI,
      {type}
    )
    dispatch(
      globalActions.storePublicUrlInDB.request(
        {
          url: publicUrl,
          type: type,
          module,
        },
        getImageDirectoryList
      )
    )
  }

  const onFileChange = ({target}) => {
    triggerEvent(
      TEMPLATE_GENERATOR_EVENTS.TEMPLATE_MAKER_TEMPLATE_UPLOAD_IMAGE_CLICKED_TFI,
      {type}
    )
    const {files} = target
    if (!files.length) return
    const file = files[0]
    if (!allowedFormates.includes(file.type)) {
      setFileTypeError(true)
      return
    }
    if (file.size > IMAGE_SIZE_LIMIT) setFileSizeError(true)
    else {
      setFileSizeError(false)
      dispatch(
        globalActions.getDocumentImageUploadSignedUrl.request(
          {
            type: file.type,
            file,
            module,
          },
          uploadUsignedUrl
        )
      )
    }
  }

  const getImageList = () => {
    const list =
      getImageDirectory.data.filter((item) => item.type === type) || []
    if (
      type === BACKGROUND.toLocaleUpperCase() ||
      type === WATERMARK.toLocaleUpperCase()
    )
      list.unshift(NONE)
    return list
  }

  const imageDeleteHandler = (e, id) => {
    e.preventDefault()
    dispatch(
      globalActions?.templateGeneratorImageDelete?.request(
        {id, module},
        getImageDirectoryList
      )
    )
  }

  return (
    <div className={styles.wrapper}>
      <Loader
        show={
          getDocumentImageUploadSignedUrl.isLoading ||
          storePublicUrlInDB.isLoading ||
          templateGeneratorImageDelete.isLoading
        }
      ></Loader>
      {alertContent && (
        <Alert
          type={ALERT_CONSTANTS.TYPE.INFO}
          content={alertContent}
          hideClose
          className={styles.alert}
        />
      )}
      <HeaderWithAddButton
        isFileInput={true}
        action={onFileChange}
        allowedFormates={allowedFormates}
        label={label}
      />

      {getImageDirectory?.data && (
        <div className={styles.imagesContainer}>
          <ImageList
            images={getImageList()}
            onImageClick={onImageClick}
            imageDeleteHandler={imageDeleteHandler}
          />
        </div>
      )}
    </div>
  )
}

export default ImagesComponent
