import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {events} from '../../../../../utils/EventsConstants'
import {Input, Button, Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import {Tooltip} from '@teachmint/common'
import styles from './DigitalSignature.module.css'
import ImgCropper from '../../../../../components/Common/ImgCropper/ImgCropper'
import {
  digitalSignatureUpdate,
  removeExistingSignatureImage,
} from '../../../redux/feeSettingsActions'
// import {feeSettingsUpdate} from '../../../redux/feeCollectionActions'
import {useFeeSettings} from '../../../redux/feeCollectionSelectors'
import {useTranslation} from 'react-i18next'
import classNames from 'classnames'

const DigitalSignature = ({listDetail = {}}) => {
  const {t} = useTranslation()
  const eventManager = useSelector((state) => state.eventManager)
  const dispatch = useDispatch()
  const {digitalSignatureLoading} = useFeeSettings()
  const digital_signature_settings = listDetail['settings']['digital_signature']
  const [preview, updatePreview] = useState('')
  const [name, setName] = useState(digital_signature_settings['authority_name'])
  const [designation, setDesignation] = useState(
    digital_signature_settings['authority_designation']
  )
  let primarykey = listDetail.primarykey
  let subKey = listDetail.subKey
  let signature_url = digital_signature_settings['signature_url']
  const saveDigitalSignatureDetails = () => {
    let newobj = {
      _id: 'digital_signature',
      signature_base64: preview,
      authority_name: name,
      authority_designation: designation,
      status: true,
    }
    let detailListData = {
      [primarykey]: {
        [subKey]: [newobj],
      },
    }
    eventManager.send_event(events.FEE_RECEIPT_SIGN_SAVE_DETAILS_CLICKED_TFI, {
      authority_name: name,
      authority_designation: designation,
    })
    dispatch(digitalSignatureUpdate(detailListData))
  }

  const removeSignatureImage = () => {
    let newobj = {
      _id: 'digital_signature',
      signature_base64: '',
      status: true,
    }
    let detailListData = {
      [primarykey]: {
        [subKey]: [newobj],
      },
    }
    eventManager.send_event(events.FEE_RECEIPT_SIGN_DELETE_CLICKED_TFI, {})
    dispatch(removeExistingSignatureImage(detailListData))
  }

  const handleChange = () => {
    eventManager.send_event(events.FEE_RECEIPT_SIGN_ADD_FILE_CLICKED_TFI, {})
  }

  return (
    <>
      <div
        className={classNames(
          styles.signatureContainer,
          digitalSignatureLoading ? styles.loadingOverlay : ''
        )}
      >
        <div className={styles.settingsContainer}>
          <ImgCropper
            scale={1}
            rotate={0}
            title={t('digitalSignatureFileUploadTitle')}
            placeholder={t('digitalSignatureFileUploadPlaceholder')}
            helperText={t('digitalSignatureFileUploadHelper')}
            fieldName={'signature'}
            classes={{
              imgCropperContainer: styles.imgCropperContainer,
            }}
            updatePreview={updatePreview}
            showPreview={false}
            uploadButtonTitle={t('digitalSignatureFileUploadButtonText')}
            handleChange={handleChange}
          />
          {!preview && signature_url && (
            <div className={styles.signatureImageWrapper}>
              <a
                data-tip
                data-for="remove_signature_image"
                className={styles.close}
              >
                <Icon
                  name="delete1"
                  size={ICON_CONSTANTS.SIZES.XX_SMALL}
                  type={ICON_CONSTANTS.TYPES.ERROR}
                  className={styles.removeSignatureImage}
                  onClick={() => removeSignatureImage()}
                />
              </a>
              <Tooltip toolTipId="remove_signature_image">
                <span className={styles.removeSignatureTooltipText}>
                  {t('digitalSignatureRemoveImageTooltip')}
                </span>
              </Tooltip>
              <img
                src={digital_signature_settings['signature_url']}
                className={styles.currentImage}
              />
            </div>
          )}
          <div className={styles.additionalSettings}>
            <Input
              type="text"
              title={t('digitalSignatureAuthorityNameTitle')}
              value={name}
              onChange={(obj) => {
                setName(obj.value)
              }}
              maxLength={24}
              fieldName="name"
            />
            <Input
              type="text"
              title={t('digitalSignatureAuthorityDesignationTitle')}
              value={designation}
              onChange={(obj) => {
                setDesignation(obj.value)
              }}
              maxLength={24}
              fieldName="designation"
            />
            <Button
              type="secondary"
              onClick={() => saveDigitalSignatureDetails()}
              classes={{button: styles.saveDetailsButton}}
            >
              {t('digitalSignatureUpdateButtonText')}
            </Button>
          </div>
        </div>
        <div className={styles.previewContainer}>
          <div className={styles.previewSubContainer}>
            <div className={styles.previewHeading}>
              <span className={styles.previewTitle}>
                {t('digitalSignaturePreviewTitle')}
              </span>
            </div>
            <hr />
            <div className={styles.preview}>
              {
                <img
                  src={preview || digital_signature_settings['signature_url']}
                  className={styles.previewImage}
                />
              }
              <hr className={styles.signatureHorizontalLine} />
              {name && <span>{name}</span>}
              {designation && <span>({designation})</span>}
              {!name && !designation && <span>(Signature & Stamp)</span>}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DigitalSignature
