import {useTranslation} from 'react-i18next'
import styles from './addMachineCard.module.css'
import {PlainCard, Input, INPUT_TYPES} from '@teachmint/krayon'
import {alphaNumericRegex} from '../../../../../../../utils/Validations'

export default function AddMachineCard({
  machineData,
  setMachineData,
  cardError,
  setCardError,
  allRows,
}) {
  const {t} = useTranslation()

  const handleInputChange = ({fieldName, value}) => {
    let newError = {...cardError}
    let newData = {...machineData}

    switch (fieldName) {
      case 'deviceID':
        if (!alphaNumericRegex(value))
          newError.deviceID = t('onlyAlphabetsAreAllowed')
        else newError.deviceID = ''
        if (!value) newError.deviceID = ''
        if (allRows?.length) {
          let row = allRows?.filter(
            (row) => row.device_id === value && row._id !== machineData?._id
          )
          if (row?.length) {
            newError.deviceID = t('biometricDuplicateMachineSerialNumber')
          }
        } else {
          newError.deviceID = ''
        }
        newData.deviceID = value
        break
      case 'companyName':
        if (!alphaNumericRegex(value))
          newError.companyName = t('onlyAlphabetsAreAllowed')
        else newError.companyName = ''

        if (!value) newError.companyName = ''
        newData.companyName = value
        break
      case 'location':
        if (!alphaNumericRegex(value))
          newError.location = t('onlyAlphabetsAreAllowed')
        else newError.location = ''
        if (!value) newError.location = ''
        newData.location = value
        break
      default:
        break
    }
    setMachineData({...newData})
    setCardError({...newError})
  }

  return (
    <PlainCard className={styles.card}>
      <div className={styles.inputForm}>
        <Input
          type={INPUT_TYPES.TEXT}
          title={t('biometricMachineSerialNumber')}
          fieldName="deviceID"
          value={machineData?.deviceID}
          infoType={cardError?.deviceID ? 'error' : ''}
          infoMsg={cardError?.deviceID ? cardError.deviceID : ''}
          showMsg={true}
          onChange={handleInputChange}
          isRequired={true}
          placeholder={t('biometricMachineSerialNumberPlaceHolder')}
          maxLength={50}
        />
        <Input
          type={INPUT_TYPES.TEXT}
          title={t('companyNameModelNumber')}
          fieldName="companyName"
          value={machineData?.companyName}
          infoType={cardError?.companyName ? 'error' : ''}
          infoMsg={cardError?.companyName ? cardError.companyName : ''}
          showMsg={true}
          onChange={handleInputChange}
          placeholder={t('companyNameModelNumberPlaceHolder')}
          maxLength={50}
        />
        <Input
          type={INPUT_TYPES.TEXT}
          title={t('machineLocation')}
          fieldName="location"
          value={machineData?.location}
          infoType={cardError?.location ? 'error' : ''}
          infoMsg={cardError?.location ? cardError.location : ''}
          showMsg={true}
          onChange={handleInputChange}
          placeholder={t('machineLocationPlaceHolder')}
          maxLength={50}
        />
      </div>
    </PlainCard>
  )
}
