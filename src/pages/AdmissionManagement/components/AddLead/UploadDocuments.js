import {useMemo, useState} from 'react'
import {useDispatch} from 'react-redux'
import {t} from 'i18next'
import styles from './UploadDocuments.module.css'
import {
  Icon,
  IconFrame,
  ICON_CONSTANTS,
  ICON_FRAME_CONSTANTS,
  Input,
  INPUT_TYPES,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import {ErrorBoundary} from '@teachmint/common'
import {useAdmissionCrmSettings} from '../../redux/admissionManagement.selectors'
import {imgFormats, IMIS_SETTING_TYPES} from '../../utils/constants'
import globalActions from '../../../../redux/actions/global.actions'
import {openLinkInNewTab} from '../../utils/helpers'

const UploadDocuments = ({formValues, setFormValues, requiredFields}) => {
  const dispatch = useDispatch()
  const admissionCrmSettings = useAdmissionCrmSettings()
  const [formErrors, setFormErrors] = useState({})
  const {categorizedFields: admissionFormFields, documentFormFields} =
    admissionCrmSettings.data

  const filePermissibleValues = useMemo(() => {
    let permissibleValues = {}
    Object.values(admissionFormFields)
      ?.filter((field) => field.setting_type === IMIS_SETTING_TYPES.DOCUMENT)
      ?.forEach((documents) => {
        documents.fields.forEach((field) => {
          permissibleValues[field.key_id] = field.permissible_values
        })
      })
    return permissibleValues
  }, [])

  const openImageNewTab = (type, url) => {
    if (imgFormats[type]) {
      let img = '<img src="' + url + '" height=500>'
      let popup = window.open()
      popup.document.write(img)
    } else {
      openLinkInNewTab(url)
    }
  }

  const resetFileState = (fieldName) => {
    setFormValues({...formValues, [fieldName]: ''})
    setFormErrors({...formErrors, [fieldName]: ''})
  }

  const handleFileupload = (value, keyId) => {
    if (value) {
      const fileType = value.type.substring(value.type.indexOf('/') + 1)
      if (value.size > 5000000) {
        setFormErrors({
          ...formErrors,
          [keyId]: t('uploadDocumentsMaxFileSizeError'),
        })
      } else if (!filePermissibleValues[keyId].includes(fileType)) {
        setFormErrors({
          ...formErrors,
          [keyId]: t('uploadDocumentsSupportedFileFormats', {
            fileFormats: filePermissibleValues[keyId].join(', '),
          }),
        })
      } else {
        dispatch(
          globalActions.admissionFormDocument.request(
            {keyId, file: value},
            (permanentUrl) =>
              setFormValues({...formValues, [keyId]: permanentUrl})
          )
        )
      }
    } else {
      resetFileState(keyId)
    }
  }

  return (
    <ErrorBoundary>
      {requiredFields.length === 0 ? (
        <div className={styles.noFieldFound}>
          <div className={styles.noDocuments}>
            <div className={styles.iconWrapper}>
              <IconFrame
                type={ICON_FRAME_CONSTANTS.TYPES.PRIMARY}
                size={ICON_FRAME_CONSTANTS.SIZES.XXX_LARGE}
                className={styles.iconFrame}
              >
                <Icon
                  type={ICON_CONSTANTS.TYPES.SECONDARY}
                  size={ICON_CONSTANTS.SIZES.SMALL}
                  name="document"
                />
              </IconFrame>
            </div>
          </div>
          <Para>{t('uploadNoDumentRequired')}</Para>
        </div>
      ) : (
        <div>
          <div className={styles.mainContainer}>
            {Object.values(admissionFormFields)
              ?.filter(
                (field) => field.setting_type === IMIS_SETTING_TYPES.DOCUMENT
              )
              ?.map((documents) => {
                return documents.fields.map((doc) => {
                  return (
                    <>
                      {!formValues[doc.key_id] ? (
                        documentFormFields?.profile_fields?.[doc.key_id]
                          ?.enabled && (
                          <div className={styles.WraperStyle}>
                            <Input
                              title={doc.label}
                              fieldName={doc.key_id}
                              type={INPUT_TYPES.FILE}
                              placeholder={t('uploadDocumentPlaceHolder', {
                                acceptableTypes: doc?.permissible_values
                                  ?.map((type) => `.${type}`)
                                  ?.join(', '),
                              })}
                              isRequired={
                                documentFormFields?.profile_fields?.[doc.key_id]
                                  ?.required
                              }
                              classes={{
                                wrapper: styles.fileWrapper,
                                fileName: styles.fileName,
                              }}
                              onChange={(e) =>
                                handleFileupload(e.value, doc.key_id)
                              }
                              showMsg={true}
                              infoType={formErrors[doc.key_id] ? 'error' : ''}
                              infoMsg={
                                formErrors[doc.key_id]
                                  ? formErrors[doc.key_id]
                                  : t('uploadDocumentsFileFormatAllowed', {
                                      permissibleTypes: doc?.permissible_values
                                        ?.map((type) => `.${type}`)
                                        .join(', '),
                                    })
                              }
                              acceptableTypes={doc?.permissible_values
                                ?.map((type) => `.${type}`)
                                .join(',')}
                            />
                          </div>
                        )
                      ) : (
                        <div>
                          <Para
                            className={styles.label}
                            type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}
                            textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
                          >
                            {doc.label}
                          </Para>
                          <div className={styles.savedDocument}>
                            <Para
                              type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                              textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                            >
                              {doc.label}
                            </Para>
                            <span className={styles.flex}>
                              <span
                                onClick={() => {
                                  openImageNewTab(
                                    formValues[doc.key_id]
                                      .split('.')
                                      .slice(-1)
                                      .pop(),
                                    formValues[doc.key_id]
                                  )
                                }}
                              >
                                <Icon
                                  name="eye1"
                                  className={styles.icon}
                                  type={ICON_CONSTANTS.TYPES.PRIMARY}
                                  size={ICON_CONSTANTS.SIZES.X_SMALL}
                                  version={ICON_CONSTANTS.VERSION.FILLED}
                                />
                              </span>
                              <span onClick={() => resetFileState(doc.key_id)}>
                                <Icon
                                  name="delete1"
                                  className={styles.icon}
                                  type={ICON_CONSTANTS.TYPES.ERROR}
                                  size={ICON_CONSTANTS.SIZES.XX_SMALL}
                                  version={ICON_CONSTANTS.VERSION.FILLED}
                                />
                              </span>
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )
                })
              })}
          </div>
        </div>
      )}
    </ErrorBoundary>
  )
}

export default UploadDocuments
