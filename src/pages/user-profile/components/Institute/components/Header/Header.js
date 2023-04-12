import React, {useState} from 'react'
import {Icon} from '@teachmint/common'
import styles from './Header.module.css'
import {useDispatch, useSelector} from 'react-redux'
import {events} from './../../../../../../utils/EventsConstants'

import {uploadLogoAction} from '../../../../redux/actions/instituteActions'
import {imageCompressor} from '../../../../../../utils/fileUtils'
import Permission from '../../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'
import {t} from 'i18next'

const Header = ({
  logo,
  descriptionObj,
  setLogo,
  defaultPic,
  isInstitute,
  screenName,
  disableUpload,
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const {eventManager} = useSelector((state) => state)
  let dispatch = useDispatch()

  const addEvents = (type, data) => {
    switch (type) {
      case 'onUpload':
        if (logo) {
          let event = isInstitute
            ? events.REMOVE_OR_REPLACE_INSTITUTE_LOGO_CLICKED_TFI
            : events.REMOVE_OR_REPLACE_USER_PHOTO_CLICKED_TFI
          eventManager.send_event(event, {
            screen_name: isInstitute ? 'institute_profile' : screenName,
          })
        } else {
          let event = isInstitute
            ? events.UPLOAD_INSTITUTE_LOGO_CLICKED_TFI
            : events.UPLOAD_USER_PHOTO_CLICKED_TFI
          eventManager.send_event(event, {
            screen_name: screenName,
            file_size: data.fileSize,
            file_format: data.fileFormat,
          })
        }
        break
      case 'onError': {
        let event = isInstitute
          ? events.INSTITUTE_LOGO_UPLOAD_ERROR_TFI
          : events.USER_PHOTO_UPLOAD_ERROR_TFI
        eventManager.send_event(event, {
          screen_name: isInstitute ? 'institute_profile' : screenName,
          file_size: data.fileSize,
          file_format: data.fileFormat,
        })
        break
      }
      case 'uploaded': {
        let event = isInstitute
          ? events.INSTITUTE_LOGO_UPLOADED_TFI
          : events.USER_PHOTO_UPLOADED_TFI
        eventManager.send_event(event, {
          screen_name: screenName,
          file_size: data.fileSize,
          file_format: data.fileFormat,
        })
        break
      }
      case 'onRemove': {
        let event = isInstitute
          ? events.INSTITUTE_LOGO_REMOVED_TFI
          : events.USER_PHOTO_REMOVED_TFI
        eventManager.send_event(event, {
          screen_name: screenName,
        })
        break
      }
    }
  }

  const handleLogoChange = (e) => {
    let addedFile = e.target.files[0]
    if (!addedFile) return
    addEvents('onUpload', {
      fileSize: addedFile.size,
      fileFormat: addedFile.type,
    })
    let type = addedFile.type.split('/')
    const allowedType = ['png', 'jpg', 'jpeg']
    const allowedMime = ['image']
    if (!allowedMime.includes(type[0]) || !allowedType.includes(type[1])) {
      setError('Incorrect file type')
      addEvents('onError', {
        fileSize: addedFile.size,
        fileFormat: addedFile.type,
      })
      return
    }
    if (addedFile.size >= 10000000) {
      setError('File is too big')
      addEvents('onError', {
        fileSize: addedFile.size,
        fileFormat: addedFile.type,
      })
      return
    }
    setError(null)
    if (isInstitute) {
      imageCompressor({image: addedFile}, (compressedFile) => {
        dispatch(
          uploadLogoAction(
            {
              logo: compressedFile,
              id: descriptionObj.id,
              imember_id: descriptionObj.imember_id,
            },
            isInstitute
          )
        )
      })
    }
    addEvents('uploaded', {
      fileSize: addedFile.size,
      fileFormat: addedFile.type,
    })
    setLogo(addedFile)
    setIsUploading(false)
  }

  const handleRemovePic = () => {
    setLogo('0')
    if (isInstitute) {
      dispatch(
        uploadLogoAction({
          logo: null,
          id: descriptionObj.id,
          imember_id: descriptionObj.imember_id,
        })
      )
    }
    addEvents('onRemove')
  }

  return (
    <div className={styles.wrapper}>
      {isUploading ? (
        <div className={styles.uploadingProgress}>
          <Icon name="upload" size="xl" color="secondary" type="outlined" />
          <div className={styles.uploadText}>Uploading your file....</div>
          <div className={styles.totalProgress} />
          <div className={styles.progressBar} style={{width: '30%'}} />
        </div>
      ) : logo || defaultPic ? (
        <img className={styles.logo} src={logo || defaultPic} />
      ) : (
        <Icon
          name={isInstitute ? 'institute' : 'user'}
          color="secondary"
          className={styles.iconLogo}
          size="4xl"
        />
      )}

      <div className={styles.description}>
        <div className={styles.title}>{descriptionObj.title}</div>
        <div className={styles.subTitle}>{descriptionObj.subTitle}</div>
        <div className={styles.logoActionWrapper}>
          {disableUpload !== true && logo && (
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.instituteController_uploadLogo_update
              }
            >
              <span className={styles.remove} onClick={handleRemovePic}>
                {t('remove')}
              </span>
            </Permission>
          )}
          {disableUpload !== true && (
            <>
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.instituteController_uploadLogo_update
                }
              >
                <label className={styles.upload} htmlFor="upload-dp">
                  {logo ? t('replace') : t('upload')}
                </label>
              </Permission>
              <input
                className={styles.inputFile}
                type="file"
                id="upload-dp"
                onChange={handleLogoChange}
              />
            </>
          )}
        </div>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    </div>
  )
}

export default Header
