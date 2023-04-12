import {useTranslation} from 'react-i18next'
import styles from './routeDetails.module.css'
import {
  PlainCard,
  Input,
  INPUT_TYPES,
  Alert,
  ALERT_CONSTANTS,
} from '@teachmint/krayon'
import {alphaNumericRegex} from '../../../../../../utils/Validations'
import TimePickerInput from '../../../../components/TimePickerInput'
import MultiSectionDropdown from '../../../../../../components/Common/MultiSectionDropdown/MultiSectionDropdown'

export default function RouteDetails({
  id,
  error,
  data,
  onDataChange,
  onErrorChange,
  staffOptions,
  vehicleOptions,
}) {
  if (!data) return null
  const {t} = useTranslation()

  const handleInputChange = ({fieldName, value}) => {
    let hasError = null

    switch (fieldName) {
      case 'name':
        if (!alphaNumericRegex(value))
          hasError = t('onlyAlphabetsNumbersAllowed')
        if (!value) hasError = ''
        break
      case 'vehicle':
        if (!value) hasError = ''
        break
      default:
        break
    }

    // Update route data
    let newData = {...data, [fieldName]: value}
    onDataChange(newData, id)

    //  Update error object
    let newError = {...(error || {})}
    if (hasError !== null) newError[fieldName] = hasError
    else delete newError[fieldName]

    onErrorChange(newError, id)
  }

  return (
    <PlainCard className={styles.card}>
      <div className={styles.alertWrapper}>
        <Alert
          type={ALERT_CONSTANTS.TYPE.INFO}
          content={t('createRouteAlertContent')}
          hideClose={true}
        />
      </div>
      <div className={styles.form}>
        <Input
          type={INPUT_TYPES.TEXT}
          title={t('routeName')}
          fieldName="name"
          value={data?.name}
          infoType={error?.name ? 'error' : ''}
          infoMsg={error?.name ? error.name : ''}
          showMsg={true}
          onChange={handleInputChange}
          isRequired={true}
          placeholder={t('routeNamePlaceHolder')}
          maxLength="50"
        />
        <Input
          type={INPUT_TYPES.DROPDOWN}
          isRequired={true}
          title={t('assignVehicle')}
          fieldName="vehicle"
          options={vehicleOptions || []}
          selectedOptions={data?.vehicle}
          shouldOptionsOccupySpace={false}
          onChange={handleInputChange}
          placeholder={t('select')}
          classes={{
            wrapperClass: styles.wrapperClass,
            dropdownClass: styles.dropdownClass,
            optionsClass: styles.optionsClass,
          }}
          isDisabled={!vehicleOptions?.length > 0}
        />
        <MultiSectionDropdown
          options={staffOptions || []}
          fieldName={'staff'}
          onChange={handleInputChange}
          selectedOptions={data?.staff || []}
          isMultiSelect={true}
          title={t('assignStaff')}
          isDisabled={!staffOptions?.length > 0}
          isSearchable={true}
          shouldOptionsOccupySpace={false}
          classes={{
            wrapperClass: styles.wrapperClass,
            dropdownClass: styles.dropdownClass,
            optionsClass: styles.optionsClass,
          }}
        />
        <TimePickerInput
          title={t('pickupJourneyEndTime')}
          fieldName="pickupTime"
          onChange={handleInputChange}
          isRequired={true}
          placeholder={t('setTime')}
          initialTime={data?.pickupTime}
          hr={data?.pickupTime?.slice(0, 2)}
          mi={data?.pickupTime?.slice(3, 5)}
          typeFormat={data?.pickupTime?.slice(6, 8)}
          className={styles.timePickerInput}
        />
        <TimePickerInput
          title={t('dropJourneyStartTime')}
          fieldName="dropTime"
          onChange={handleInputChange}
          isRequired={true}
          placeholder={t('setTime')}
          initialTime={data?.dropTime}
          hr={data?.dropTime?.slice(0, 2)}
          mi={data?.dropTime?.slice(3, 5)}
          typeFormat={data?.dropTime?.slice(6, 8)}
          className={styles.timePickerInput}
        />
      </div>
    </PlainCard>
  )
}
