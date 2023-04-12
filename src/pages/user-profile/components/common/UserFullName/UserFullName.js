import React, {useState} from 'react'
import {Input} from '@teachmint/common'
import styles from './UserFullName.module.css'
import {useTranslation} from 'react-i18next'

const UserFullName = ({
  nameObj = {},
  setNameObj,
  setShowError,
  disableInputs,
}) => {
  const {t} = useTranslation()
  const [nameErrorMsg, setNameErrorMsg] = useState('')
  const [middleErrorMsg, setMiddleErrorMsg] = useState('')
  const [lastErrorMsg, setLastErrorMsg] = useState('')

  const handleNameBlur = (e, setErrorMsg, key) => {
    let val = e.target.value.toString()
    if (val.length > 0) {
      let regex = /^[A-Za-z ]+$/g
      let match = regex.test(val)
      if (!match) {
        setErrorMsg(t('onlyAlphabetsAreAllowed'))
        // e.target.focus()
      } else {
        setErrorMsg('')
      }
      setNameObj({...nameObj, [key]: nameObj[key].trim()})
    }
  }

  return (
    <div className={styles.name}>
      <Input
        type="text"
        title={t('firstName')}
        fieldName="name"
        value={nameObj.name}
        isRequired={true}
        maxLength="50"
        setShowError={(val) => setShowError(val, 'name')}
        onChange={(obj) => setNameObj({...nameObj, name: obj.value})}
        onBlur={(e) => handleNameBlur(e, setNameErrorMsg, 'name')}
        showError={nameErrorMsg.length}
        errorMsg={nameErrorMsg}
        disabled={disableInputs}
        classes={{title: 'tm-para'}}
      />
      <div className={styles.middleLastName}>
        <Input
          type="text"
          title={t('middleName')}
          fieldName="middleName"
          value={nameObj.middleName}
          maxLength="50"
          onChange={(obj) => setNameObj({...nameObj, middleName: obj.value})}
          setShowError={(val) => setShowError(val, 'middle')}
          onBlur={(e) => handleNameBlur(e, setMiddleErrorMsg, 'middleName')}
          showError={middleErrorMsg.length}
          errorMsg={middleErrorMsg}
          disabled={disableInputs}
          classes={{title: 'tm-para'}}
        />
        <Input
          type="text"
          title={t('lastName')}
          fieldName="lastName"
          value={nameObj.lastName}
          maxLength="50"
          onChange={(obj) => setNameObj({...nameObj, lastName: obj.value})}
          setShowError={(val) => setShowError(val, 'last')}
          onBlur={(e) => handleNameBlur(e, setLastErrorMsg, 'lastName')}
          showError={lastErrorMsg.length}
          errorMsg={lastErrorMsg}
          disabled={disableInputs}
          classes={{title: 'tm-para'}}
        />
      </div>
    </div>
  )
}

export default UserFullName
