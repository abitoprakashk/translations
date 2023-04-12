import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import styles from './staffCard.module.css'
import {
  Icon,
  ICON_CONSTANTS,
  PlainCard,
  Badges,
  Input,
  INPUT_TYPES,
  Checkbox,
  CHECKBOX_CONSTANTS,
  IconFrame,
  ICON_FRAME_CONSTANTS,
  BADGES_CONSTANTS,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import {MAX_STAFF_DOCUMENT_SIZE, STAFF_OPTIONS} from '../../constants'

export default function StaffCard({
  index,
  id,
  isEdit,
  staffData,
  cardError,
  onStaffChange,
  removable,
  onRemoveStaff,
}) {
  const {t} = useTranslation()

  const transportStaffData = useSelector(
    (state) => state?.globalData?.transportStaff?.data
  )

  const isPhoneNumAlreadyExists = (countryCode, phoneNum) => {
    const phoneNumWithCountryCode = countryCode + '-' + phoneNum
    const existingStaff = transportStaffData?.find(
      (item) => item?.phone_number === phoneNumWithCountryCode
    )
    if (existingStaff && existingStaff?._id !== id) return true
    return false
  }

  const handleInputChange = ({fieldName, value, isValid}) => {
    let hasError = null
    let newError = {...cardError}
    let newData = {...staffData}

    switch (fieldName) {
      case 'name':
        if (!value) hasError = ''
        break
      case 'role':
        if (!value) hasError = ''
        break
      case 'contact':
        if (isValid === false) hasError = ''
        else if (isPhoneNumAlreadyExists(staffData.countryCode, value))
          hasError = t('uniqueTransportStaffPhoneNumberError')
        break
      case 'countryCode':
        newData['contact'] = ''
        newError['contact'] = ''
        break
      case 'idProof':
        if (value?.size > MAX_STAFF_DOCUMENT_SIZE)
          hasError = t('maxFileSize4Mb')
        break
      default:
        break
    }

    // Update staff data
    newData[fieldName] = value
    // Update cardError object
    newError[fieldName] = hasError

    onStaffChange(newData, newError, id, fieldName)
  }

  const countryCodeObj = {
    countryCode: staffData.countryCode,
    onCountryChange: (val) =>
      handleInputChange({fieldName: 'countryCode', value: val}),
    isDisabled: false,
  }

  const idProofFileNameForEditCase =
    isEdit && staffData?.idProof && typeof staffData?.idProof === 'string'
      ? staffData?.idProof?.split('/').pop()
      : ''

  return (
    <PlainCard className={styles.card}>
      {!isEdit && (
        <div className={styles.cardHeaderWrapper}>
          <Badges
            label={`${t('staff')} ${index}`}
            size={BADGES_CONSTANTS.SIZE.LARGE}
            showIcon={false}
            className={styles.staffBadge}
          />
          {removable && (
            <div onClick={() => onRemoveStaff(id)}>
              <IconFrame
                size={ICON_FRAME_CONSTANTS.SIZES.MEDIUM}
                type={ICON_FRAME_CONSTANTS.TYPES.PRIMARY}
                className={styles.deleteIconFrame}
              >
                <Icon
                  size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                  name="delete1"
                  type={ICON_CONSTANTS.TYPES.BASIC}
                />
              </IconFrame>
            </div>
          )}
        </div>
      )}
      <div className={styles.inputForm}>
        <Input
          type={INPUT_TYPES.TEXT}
          title={t('staffName')}
          fieldName="name"
          value={staffData.name}
          infoType={cardError?.name ? 'error' : ''}
          infoMsg={cardError?.name ? cardError.name : ''}
          showMsg={true}
          onChange={handleInputChange}
          isRequired={true}
          placeholder={t('enterStaffName')}
          maxLength={50}
        />
        <Input
          type={INPUT_TYPES.DROPDOWN}
          isRequired={true}
          title={t('staffRole')}
          fieldName="role"
          options={STAFF_OPTIONS}
          selectedOptions={staffData?.role}
          onChange={handleInputChange}
          placeholder={t('select')}
        />
        <Input
          type={INPUT_TYPES.PHONE_NUMBER}
          title={t('staffContact')}
          fieldName="contact"
          infoType={cardError?.contact ? 'error' : ''}
          infoMsg={cardError?.contact ? cardError.contact : ''}
          showMsg={true}
          value={staffData.contact}
          onChange={handleInputChange}
          countryCodeObj={countryCodeObj}
          isRequired={true}
          placeholder={t('enterPhoneNumber')}
        />
        <Input
          type={INPUT_TYPES.FILE}
          title={t('staffFileLabel')}
          id={`${index}-staffFileInput`}
          infoType={cardError?.idProof ? 'error' : ''}
          infoMsg={
            cardError?.idProof ? cardError.idProof : t('staffFileHelperText')
          }
          showMsg={true}
          fieldName="idProof"
          fileName={idProofFileNameForEditCase}
          value={staffData.idProof}
          onChange={handleInputChange}
          acceptableTypes={'.jpeg, .jpg, .pdf, .png'}
          placeholder={t('staffFilePlaceholder')}
        />
        <Checkbox
          size={CHECKBOX_CONSTANTS.SIZE.SMALL}
          fieldName="isCheckboxSelected"
          isSelected={staffData.isCheckboxSelected}
          handleChange={handleInputChange}
          classes={{wrapper: styles.checkboxWrapper}}
        >
          <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
            {t('staffCardCheckBoxLabel')}
          </Para>
        </Checkbox>
      </div>
    </PlainCard>
  )
}
