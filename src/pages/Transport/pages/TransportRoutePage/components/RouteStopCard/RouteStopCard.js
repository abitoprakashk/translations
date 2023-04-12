import {useTranslation} from 'react-i18next'
import {useEffect} from 'react'
import styles from './routeStopCard.module.css'
import {
  Icon,
  ICON_CONSTANTS,
  PlainCard,
  Badges,
  Input,
  INPUT_TYPES,
  IconFrame,
  ICON_FRAME_CONSTANTS,
} from '@teachmint/krayon'
import TimePickerInput from '../../../../components/TimePickerInput'
import MultiSectionDropdown from '../../../../../../components/Common/MultiSectionDropdown/MultiSectionDropdown'

export default function RouteStopCard({
  id,
  index,
  data,
  error,
  removable,
  onRemove,
  onDataChange,
  onErrorChange,
  stopOptions,
  passengerOptions,
  frozenStopOptions,
}) {
  if (!data) return null

  const {t} = useTranslation()

  const handleInputChange = ({fieldName, value}) => {
    let hasError = null
    let newData = {...data, [fieldName]: value}

    switch (fieldName) {
      case 'stop':
        if (!value) hasError = ''
        else {
          //set selected passengers to an empty list whenever a new stop is selected
          newData['passengers'] = []
        }
        break
      case 'pickupTime':
        break
      case 'dropTime':
        break
      case 'passengers':
        if (!value) hasError = ''
        break
      default:
        break
    }

    // Update route data
    onDataChange(newData, id, fieldName)

    //  Update error object
    let newError = {...(error || {})}
    if (hasError !== null) newError[fieldName] = hasError
    else delete newError[fieldName]
    onErrorChange(newError, id, fieldName)
  }

  // selecting all passengers in a stop by default if no passengers are selected
  useEffect(() => {
    if (data?.isEdit) return
    const selectedPassengers = []
    passengerOptions?.forEach((section) => {
      section?.options?.forEach((option) => {
        selectedPassengers.push(option?.value)
      })
    })
    if (selectedPassengers !== []) {
      handleInputChange({fieldName: 'passengers', value: selectedPassengers})
    }
  }, [data?.stop])

  return (
    <PlainCard className={styles.card}>
      <div className={styles.cardHeaderWrapper}>
        <Badges
          label={`${t('stop')} ${index}`}
          showIcon={false}
          className={styles.stopBadge}
        />
        {removable && (
          <div onClick={() => onRemove(id)}>
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
      <div className={styles.form}>
        <Input
          type={INPUT_TYPES.DROPDOWN}
          isRequired={true}
          title={t('selectStop')}
          fieldName="stop"
          options={stopOptions}
          frozenOptions={frozenStopOptions || []}
          selectedOptions={data?.stop}
          onChange={handleInputChange}
          placeholder={t('select')}
          shouldOptionsOccupySpace={false}
          isSearchable={true}
          classes={{
            wrapperClass: styles.wrapperClass,
            dropdownClass: styles.dropdownClass,
            optionsClass: styles.optionsClass,
          }}
          isDisabled={!stopOptions?.length > 0}
        />
        <TimePickerInput
          title={t('pickupTime')}
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
          title={t('dropTime')}
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
        <MultiSectionDropdown
          options={passengerOptions}
          fieldName={'passengers'}
          onChange={handleInputChange}
          selectedOptions={data?.passengers || []}
          isMultiSelect={true}
          isSearchable={true}
          shouldOptionsOccupySpace={false}
          title={t('selectPassengers')}
          isDisabled={data?.stop && passengerOptions?.length > 0 ? false : true}
          classes={{
            wrapperClass: styles.wrapperClass,
            dropdownClass: styles.dropdownClass,
            optionsClass: styles.optionsClass,
          }}
          infoMsg={
            data?.stop
              ? passengerOptions?.length > 0
                ? ''
                : t('routeAdditionEmptyPassengerHelperText')
              : t('routeAdditionEmptyStopHelperText')
          }
        />
      </div>
    </PlainCard>
  )
}
