import React, {useEffect, useState} from 'react'
import UploadFile from './components/UploadFile'
import attachPinBlueIcon from '../../../../assets/images/icons/attach-pin-blue.svg'
import styles from './AddAttachment.module.css'
import {useSelector, useDispatch} from 'react-redux'
import {events} from '../../../../utils/EventsConstants'
import classNames from 'classnames'
import {
  setAttachmentFileAction,
  setAttachmentUrls,
  setRequestSize,
} from './../../redux/actions/commonActions'
import {attachButtonClickedTfi, getPostTypeInText} from '../../commonFunctions'
import {useTranslation} from 'react-i18next'
import ResumableUpload from '../../../../utils/SignedUrlUpload'
import {getSignedUrl} from '../../apiService'
import {Trans} from 'react-i18next'
import {v4 as uuidv4} from 'uuid'
import {MAX_REQUEST_SIZE, allowedFileTypes} from '../../constants'
const AddAttachment = () => {
  const {t} = useTranslation()
  const fileIsTooBig = t('fileIsTooBig')
  const attachIcon = t('attachIcon')
  const ATTACH = t('ATTACH')
  const {eventManager} = useSelector((state) => state)
  const {voice} = useSelector((state) => state.communicationInfo.common)
  const [error, setError] = useState(null)
  const {file, announcement_type, attachment_urls, request_file_size} =
    useSelector((state) => state.communicationInfo?.common)
  const attachmentFileInfo = (
    <Trans
      i18nKey="attachmentFileInfo"
      values={{count: file.length, size: MAX_REQUEST_SIZE / 1000000}}
    />
  )
  const attachmentFileInfoMweb = (
    <Trans i18nKey="attachmentFileInfoMweb" values={{count: file.length}} />
  )
  const dispatch = useDispatch()
  const handleSendSuccessFailEvent = (
    attFileType = '',
    attFileSize = 0,
    errorIs = null
  ) => {
    if (errorIs) {
      eventManager.send_event(events.POST_ATTACHMENT_ERROR_TFI, {
        error: errorIs,
        attachment_type: attFileType,
        attachment_size: attFileSize,
        post_type: getPostTypeInText(announcement_type),
      })
    } else {
      eventManager.send_event(events.POST_ATTACHED_TFI, {
        attachment_type: attFileType,
        attachment_size: attFileSize,
        post_type: getPostTypeInText(announcement_type),
      })
    }
  }

  const fileUploader = async (file, type, mime) => {
    const urls = await getSignedUrl(type, file.name, mime)
    const uploader = new ResumableUpload({
      url: urls.signed_url,
      attachment: file,
      isChunkedUpload: true,
      onChunkUploadError: () => {},
      uploadFinished: () => {},
    })
    uploader.startUpload()
    return urls.permanent_url
  }

  const handleAttachment = (e) => {
    let addedFile = e.target.files
    let files = Object.values(addedFile)
    let urlArr = [...attachment_urls]
    let idArr = [...file]
    let currentSize = request_file_size
    files.map(async (data) => {
      currentSize = currentSize + data.size
      if (currentSize < MAX_REQUEST_SIZE) {
        let type = data.type.split('/')
        let mime = data.type
        const size = `${(data.size / 1000000).toFixed(2)}MB`
        const uniqueId = uuidv4()
        const fileUrl = await fileUploader(data, type[1], mime)
        urlArr = [...urlArr, fileUrl]
        idArr = [{id: uniqueId, data: data, url: fileUrl}, ...idArr]
        dispatch(setRequestSize(currentSize))
        dispatch(setAttachmentUrls(urlArr))
        dispatch(setAttachmentFileAction(idArr))

        setError(null)
        handleSendSuccessFailEvent(type[1], size)
      } else {
        currentSize = currentSize - data.size
        setError(fileIsTooBig)
      }
    })
  }

  const handleRemoveFile = (id) => {
    let urls = [],
      tempArr = []
    file.map((ele) => {
      if (ele.id !== id) {
        urls.push(ele.url)
        tempArr.push(ele)
      } else {
        if (ele.data) {
          dispatch(setRequestSize(request_file_size - ele.data.size))
        }
      }
    })
    dispatch(setAttachmentFileAction(tempArr))
    dispatch(setAttachmentUrls(urls))
    eventManager.send_event(events.POST_ATTACHMENT_DELETED_TFI, {
      post_type: getPostTypeInText(announcement_type),
    })
  }

  const handleOnAttachClick = () => {
    attachButtonClickedTfi({
      eventManager,
      events,
      post_type: getPostTypeInText(announcement_type),
    })
  }
  useEffect(() => {
    if (voice?.size > MAX_REQUEST_SIZE) {
      setError('Voice Note ' + fileIsTooBig)
    } else {
      setError(null)
    }
  }, [voice])
  const renderUploadPreview = () => {
    if (file.length) {
      return file.map((ele) => {
        return (
          <UploadFile
            key={ele.id}
            fileId={ele.id}
            fileInfo={ele.data || null}
            removeFile={handleRemoveFile}
            fileMimeType={ele.data?.type || null}
            attachmentUrl={ele.url}
          />
        )
      })
    }
  }
  return (
    <div className={styles.messageMediaAndCountSec}>
      <div className={styles.messageMediaBtnAndCountSec}>
        <div
          className={classNames(
            styles.messageMediaBtnAndInfoSec,
            styles.content
          )}
        >
          <label
            className={classNames(styles.messageMediaBtn, styles.break, {
              [styles.disableAttachment]: false,
            })}
            htmlFor="upload-photo"
          >
            <img src={attachPinBlueIcon} alt={attachIcon} />
            {ATTACH}
          </label>

          <input
            type="file"
            id="upload-photo"
            accept={allowedFileTypes}
            multiple
            className={styles.uploadButton}
            onChange={handleAttachment}
            onClick={handleOnAttachClick}
          />
          {file.length ? (
            <>
              <span
                className={classNames(
                  styles.messageMediaInfo,
                  'ml-4',
                  'lg:ml-1'
                )}
              >
                {attachmentFileInfo}
              </span>
              <span
                className={classNames(
                  styles.messageMediaInfo,
                  styles.messageMediaInfoMweb,
                  'ml-4',
                  'lg:ml-1'
                )}
              >
                {attachmentFileInfoMweb}
              </span>
            </>
          ) : null}
        </div>
      </div>
      {error && <div className={styles.errorText}>{error}</div>}
      <div className={styles.uploadFileContainer}>{renderUploadPreview()}</div>
    </div>
  )
}

export default AddAttachment