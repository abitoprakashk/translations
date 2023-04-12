import {useTranslation} from 'react-i18next'
import styles from './vehicleCard.module.css'
import {
  Icon,
  ICON_CONSTANTS,
  PlainCard,
  Badges,
  Input,
  INPUT_TYPES,
  IconFrame,
  ICON_FRAME_CONSTANTS,
  Divider,
  Button,
  BUTTON_CONSTANTS,
} from '@teachmint/krayon'
import {
  alphaNumericRegex,
  numericRegex,
} from '../../../../../../utils/Validations'
import {VEHICLE_OPTIONS} from '../../constants'

export default function VehicleCard({
  isEdit,
  id,
  index,
  cardError,
  vehicleData,
  removable,
  onRemoveVehicle,
  onVehicleChange,
  onVehicleDocumentsClick,
}) {
  const {t} = useTranslation()

  const handleInputChange = ({fieldName, value}) => {
    let hasError = null

    switch (fieldName) {
      case 'number':
        if (!alphaNumericRegex(value))
          hasError = t('onlyAlphabetsNumbersAllowed')
        if (!value) hasError = ''
        break
      case 'type':
        if (!value) hasError = ''
        break
      case 'capacity':
        if (
          !numericRegex(value) ||
          parseInt(value) < 1 ||
          parseInt(value) > 100
        )
          return
        if (!value) hasError = ''
        break
      case 'name':
        if (!alphaNumericRegex(value))
          hasError = t('onlyAlphabetsNumbersAllowed')
        break
      case 'imei':
        if (!numericRegex(value)) return
        if (value.length > 50) return
        break
      default:
        break
    }

    // Update vehicle data
    let newData = {...vehicleData, [fieldName]: value}
    /*Update cardError object*/
    let newError = {...cardError, [fieldName]: hasError}

    onVehicleChange(newData, newError, id, fieldName)
  }

  return (
    <PlainCard className={styles.card}>
      {!isEdit && (
        <div className={styles.cardHeaderWrapper}>
          <Badges
            label={`${t('vehicle')} ${index}`}
            showIcon={false}
            className={styles.vehicleBadge}
          />
          {removable && (
            <div onClick={() => onRemoveVehicle(id)}>
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
      <div className={styles.form}>
        <Input
          type={INPUT_TYPES.TEXT}
          title={t('vehicleNumber')}
          fieldName="number"
          value={vehicleData?.number}
          infoType={cardError?.number ? 'error' : ''}
          infoMsg={cardError?.number ? cardError.number : ''}
          showMsg={true}
          onChange={handleInputChange}
          isRequired={true}
          placeholder={t('vehicleNumberPlaceHolder')}
          maxLength="15"
        />
        <Input
          type={INPUT_TYPES.DROPDOWN}
          isRequired={true}
          title={t('vehicleType')}
          fieldName="type"
          options={VEHICLE_OPTIONS}
          selectedOptions={vehicleData?.type}
          onChange={handleInputChange}
          placeholder={t('select')}
        />
        <Input
          type={INPUT_TYPES.TEXT}
          title={t('vehicleCapacity')}
          fieldName="capacity"
          value={vehicleData?.capacity}
          showMsg={true}
          onChange={handleInputChange}
          isRequired={true}
          placeholder={t('vehicleCapacityPlaceHolder')}
        />
        <Input
          type={INPUT_TYPES.TEXT}
          title={t('vehicleName')}
          fieldName="name"
          infoType={cardError?.name ? 'error' : ''}
          infoMsg={cardError?.name ? cardError.name : ''}
          showMsg={cardError?.name ? true : false}
          value={vehicleData?.name}
          onChange={handleInputChange}
          placeholder={t('vehicleNamePlaceHolder')}
          maxLength={50}
        />
        <Input
          type={INPUT_TYPES.TEXT}
          title={`${t('imeiNumber')} (${t('ifGpsIntegrated')})`}
          fieldName="imei"
          infoType={cardError?.imei ? 'error' : ''}
          infoMsg={
            cardError?.imei
              ? cardError.imei
              : vehicleData?.imei
              ? ''
              : t('imeiHelperMsg')
          }
          showMsg={true}
          value={vehicleData?.imei}
          onChange={handleInputChange}
          placeholder={t('enterImei')}
        />
      </div>
      <Divider spacing="12px" />
      <Button
        type={BUTTON_CONSTANTS.TYPE.TEXT}
        onClick={() => onVehicleDocumentsClick(id)}
        classes={{button: styles.vehicleDocumentsButton}}
      >{`${t('view')}/${t('upload')} ${t('documents')}`}</Button>
    </PlainCard>
  )
}
