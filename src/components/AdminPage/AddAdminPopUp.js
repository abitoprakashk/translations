import {useState} from 'react'
import AddAndEditPopUp from '../Common/AddAndEditPopUp/AddAndEditPopUp'
import {validateInputs} from '../../utils/Validations'
import {useSelector, useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {instituteAdminListAction} from '../../redux/actions/instituteInfoActions'
import {
  showErrorOccuredAction,
  showLoadingAction,
} from '../../redux/actions/commonAction'
import {utilsAddAdminsByData, utilsGetAdminsList} from '../../routes/dashboard'

export default function AddAdminPopUp({
  handleClosePopUp,
  setShowAcknowledgementPopup,
  setValidationObject,
}) {
  // YOLO s
  const [adminName, setAdminName] = useState('')
  const [countryCode, setCountryCode] = useState('91')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [errorObject, setErrorObject] = useState({})

  const {instituteInfo} = useSelector((state) => state)

  const dispatch = useDispatch()
  const {t} = useTranslation()

  const adminInputItems = {
    adminName: {
      fieldType: 'text',
      title: t('adminName'),
      value: adminName,
      placeholder: t('adminNamePlaceholder'),
      fieldName: 'adminName',
    },
    phoneNumber: {
      fieldType: 'phone',
      title: t('phoneNumber'),
      value: phoneNumber,
      placeholder: t('phoneNumberPlaceholder'),
      fieldName: 'phoneNumber',
      countryCodeItem: {
        value: countryCode,
        placeholder: '91',
        fieldName: 'countryCode',
      },
    },
    email: {
      fieldType: 'text',
      title: t('email'),
      value: email,
      placeholder: t('adminEmailPlaceholder'),
      fieldName: 'email',
    },
  }

  const getInstituteAdmins = () => {
    utilsGetAdminsList()
      .then(({obj}) => {
        dispatch(instituteAdminListAction(obj?.admin))
      })
      .catch(() => dispatch(showErrorOccuredAction(true)))
  }

  const handleInputChange = (fieldName, value) => {
    switch (fieldName) {
      case 'adminName': {
        if (validateInputs('name', value, false)) setAdminName(value)
        break
      }
      case 'country_code': {
        if (validateInputs(fieldName, value, false)) setCountryCode(value)
        break
      }
      case 'phone_number': {
        if (validateInputs(fieldName, value, false)) setPhoneNumber(value)
        break
      }
      case 'email': {
        if (validateInputs(fieldName, value, false)) setEmail(value)
        break
      }
      default:
        break
    }
  }

  const handleSetError = (fieldName, error) => {
    let obj = {}
    obj[fieldName] = error
    setErrorObject((errorObject) => ({...errorObject, ...obj}))
  }

  const handleFormSubmit = async () => {
    setErrorObject({})
    let flag = true

    // Validate Student Name
    if (
      String(adminName).length <= 0 ||
      !validateInputs('name', adminName, true)
    ) {
      handleSetError('adminName', t('required'))
      flag = false
    }

    // Validate Country Code
    if (
      String(countryCode).length <= 0 ||
      !validateInputs('countryCode', countryCode, true)
    ) {
      handleSetError('phoneNumber', t('required'))
      flag = false
    }

    // Validate Phone Number
    if (
      String(phoneNumber).length <= 0 ||
      !validateInputs('phoneNumber', phoneNumber, true)
    ) {
      handleSetError('phoneNumber', t('required'))
      flag = false
    }

    // Validate Email
    if (!validateInputs('email', email, true)) {
      handleSetError('email', t('enterValidEmail'))
      flag = false
    }

    if (flag && instituteInfo && instituteInfo._id) {
      dispatch(showLoadingAction(true))

      // Send Data to server
      let response = await utilsAddAdminsByData(
        instituteInfo._id,
        adminName,
        countryCode,
        phoneNumber,
        email
      ).catch(() => dispatch(showErrorOccuredAction(true)))

      // Auto Update Admin List
      if (response.status) getInstituteAdmins(instituteInfo._id)
      else dispatch(showLoadingAction(false))

      dispatch(showLoadingAction(false))
      setValidationObject({
        msg: response.msg,
        status: response.status,
        obj: null,
      })
      setShowAcknowledgementPopup(true)
      handleClosePopUp()
    }
  }

  return (
    <AddAndEditPopUp
      title={t('addAdmin')}
      handleClosePopUp={handleClosePopUp}
      popUpImage={null}
      inputFields={adminInputItems}
      handleInputChange={handleInputChange}
      handleSubmit={handleFormSubmit}
      errorObject={errorObject}
    />
  )
}
