import {useTranslation} from 'react-i18next'
import styles from './editUsersCard.module.css'
import {PlainCard, Input, INPUT_TYPES} from '@teachmint/krayon'
import {alphaNumericRegex} from '../../../../../../../utils/Validations'

export default function EditUserCard({
  userData,
  cardError,
  setUserData,
  setCardError,
  allRows,
}) {
  const {t} = useTranslation()

  const handleInputChange = ({fieldName, value}) => {
    let newError = {...cardError}
    let newData = {...userData}

    switch (fieldName) {
      case 'userID':
        if (!alphaNumericRegex(value))
          newError.user_id = t('onlyAlphabetsNumbersAllowed')
        else newError.user_id = ''
        if (allRows?.length) {
          let row = allRows?.filter(
            (row) =>
              row.user_id === value && row.imember_id !== userData?.imember_id
          )
          if (row?.length) {
            newError.user_id = t('biometricDuplicateUserID')
          }
        } else {
          newError.user_id = ''
        }
        if (!value) newError.user_id = ''
        newData.user_id = value
        break
      default:
        break
    }

    setUserData({...newData})
    setCardError({...newError})
  }

  return (
    <PlainCard className={styles.card}>
      <div className={styles.inputForm}>
        <Input
          type={INPUT_TYPES.TEXT}
          title={t('userID')}
          fieldName="userID"
          value={userData?.user_id}
          infoType={cardError?.user_id ? 'error' : ''}
          infoMsg={cardError?.user_id ? cardError.user_id : ''}
          showMsg={true}
          onChange={handleInputChange}
          isRequired={false}
          placeholder={t('biometricUsersEditUserIDPlaceHolder')}
          maxLength={50}
        />
      </div>
    </PlainCard>
  )
}
