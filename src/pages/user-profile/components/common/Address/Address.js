import React, {useState} from 'react'
import {Input} from '@teachmint/common'
import styles from './Address.module.css'
import {COUNTRIES} from '../../../constants'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'

const Address = ({
  addressObj = {},
  setAddressObj,
  setShowError,
  isMandatory,
  disableInputs,
}) => {
  const [pincodeErrorMsg, setPincodeErrorMsg] = useState('')
  const [stateErrorMsg, setStateErrorMsg] = useState('')
  const {t} = useTranslation()
  const {address} = useSelector((store) => store.instituteInfo)
  const handlePincodeBlur = (e) => {
    if (
      (e.target.value.length < 3 || e.target.value.length > 12) &&
      e.target.value.length > 0
    ) {
      setPincodeErrorMsg(t('invalidPincode'))
    } else {
      setPincodeErrorMsg('')
    }
  }

  const handleStateBlur = (e) => {
    let val = e.target.value
    if (val.length) {
      let regex = /^[A-Za-z ]+$/g
      let match = regex.test(val)
      if (!match) {
        setStateErrorMsg(t('onlyAlphabetsAreAllowed'))
      } else {
        setStateErrorMsg('')
      }
    }
  }

  return (
    <div>
      <Input
        type="text"
        title={t('addressLine1')}
        fieldName="line1"
        maxLength="100"
        value={addressObj.line1}
        isRequired={isMandatory}
        setShowError={(val) => setShowError(val, 'line1')}
        onChange={(obj) => setAddressObj({...addressObj, line1: obj.value})}
        disabled={disableInputs}
        classes={{title: 'tm-para'}}
      />
      <Input
        type="text"
        title={t('addressLine2')}
        fieldName="line2"
        maxLength="100"
        value={addressObj.line2}
        onChange={(obj) => setAddressObj({...addressObj, line2: obj.value})}
        disabled={disableInputs}
        classes={{title: 'tm-para'}}
      />
      <div className={styles.addressPinWrapper}>
        <Input
          type={isMandatory ? 'readonly' : 'select'}
          title={t('country')}
          fieldName="country"
          value={addressObj?.country || address?.country || COUNTRIES[0]}
          options={COUNTRIES}
          onChange={(obj) => setAddressObj({...addressObj, country: obj.value})}
          disabled={disableInputs}
          classes={{title: 'tm-para'}}
        />
        <Input
          type="number"
          title={t('pincode')}
          fieldName="pin"
          maxLength="12"
          value={addressObj.pin}
          isRequired={isMandatory}
          onChange={(obj) => setAddressObj({...addressObj, pin: obj.value})}
          setShowError={(val) => setShowError(val, 'pin')}
          onBlur={handlePincodeBlur}
          showError={pincodeErrorMsg.length}
          errorMsg={pincodeErrorMsg}
          disabled={disableInputs}
          classes={{title: 'tm-para'}}
        />
        <Input
          type="text"
          title={t('state')}
          fieldName="state"
          maxLength="30"
          value={addressObj.state}
          isRequired={isMandatory}
          onChange={(obj) => setAddressObj({...addressObj, state: obj.value})}
          setShowError={(val) => setShowError(val, 'state')}
          onBlur={handleStateBlur}
          showError={stateErrorMsg.length}
          errorMsg={stateErrorMsg}
          disabled={disableInputs}
          classes={{title: 'tm-para'}}
        />
        <Input
          type="text"
          title={t('cityTown')}
          fieldName="city"
          maxLength="50"
          isRequired={isMandatory}
          setShowError={(val) => setShowError(val, 'city')}
          value={addressObj.city}
          onChange={(obj) => setAddressObj({...addressObj, city: obj.value})}
          disabled={disableInputs}
          classes={{title: 'tm-para'}}
        />
      </div>
    </div>
  )
}

export default Address
