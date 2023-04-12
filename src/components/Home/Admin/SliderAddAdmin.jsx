import {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {
  utilsGetAdminsList,
  utilsAddAdminsByData,
} from '../../../routes/dashboard'
import {instituteAdminListAction} from '../../../redux/actions/instituteInfoActions'
import {
  showErrorOccuredAction,
  showLoadingAction,
  showToast,
} from '../../../redux/actions/commonAction'
import {validateInputs} from '../../../utils/Validations'
import InputField from '../../Common/InputField/InputField'
import {events} from '../../../utils/EventsConstants'
import {ROLE_ID} from '../../../constants/permission.constants'

export function SliderAddAdmin({setSliderScreen}) {
  const [adminName, setAdminName] = useState('')
  const [countryCode, setCountryCode] = useState('91')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [roles, setRoles] = useState('')
  const [errorObject, setErrorObject] = useState({})
  const {instituteInfo, rolesList, currentAdminInfo, eventManager} =
    useSelector((state) => state)

  const dispatch = useDispatch()
  const {t} = useTranslation()
  const roleNames = [{key: '', value: 'Select'}]
  rolesList?.sort(function (a, b) {
    var textA = a.name.length
    var textB = b.name.length
    return textA < textB ? -1 : textA > textB ? 1 : 0
  })
  rolesList &&
    rolesList.forEach((item) => {
      if (currentAdminInfo?.role_ids?.includes(ROLE_ID.SUPER_ADMIN))
        roleNames.push({key: item._id, value: item.name})
      if (currentAdminInfo?.role_ids?.includes(ROLE_ID.ADMIN))
        if (item._id !== ROLE_ID.SUPER_ADMIN && item._id !== ROLE_ID.ADMIN)
          roleNames.push({key: item._id, value: item.name})
    })

  const close = () => setSliderScreen(null)

  const adminInputItems = {
    adminName: {
      fieldType: 'text',
      title: t('adName'),
      value: adminName,
      placeholder: t('adNamePlaceholder'),
      fieldName: 'adminName',
      event: events.USER_NAME_FILLED_TFI,
    },
    phoneNumber: {
      fieldType: 'phone',
      title: t('mobileNumberAll'),
      value: phoneNumber,
      placeholder: t('mobileNumberPlaceholder'),
      fieldName: 'phoneNumber',
      countryCodeItem: {
        value: countryCode,
        placeholder: '91',
        fieldName: 'countryCode',
      },
    },
    roles: {
      fieldType: 'dropdown',
      title: t('userRoles'),
      value: roles,
      dropdownItems: roleNames,
      placeholder: t('role'),
      fieldName: 'roles',
    },
  }

  const adminInputItemsList = [
    adminInputItems.adminName,
    adminInputItems.phoneNumber,
    adminInputItems.roles,
  ]
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
        if (validateInputs('name', value, false)) {
          setAdminName(value)
        }
        break
      }
      case 'countryCode': {
        if (validateInputs('country_code', value, false)) {
          setCountryCode(value)
        }
        break
      }
      case 'phoneNumber': {
        if (validateInputs('phone_number', value, false)) {
          if (value.length === 1 || value.length === 10) {
            eventManager.send_event(events.USER_MOBILE_NUMBER_FILLED_TFI, {
              digits: value.length,
            })
          }
          setPhoneNumber(value)
        }
        break
      }
      case 'roles': {
        if (validateInputs('roles', value, false) && value.length > 1) {
          let tempRolesArray = []
          tempRolesArray.push(value)
          setRoles(tempRolesArray)
          eventManager.send_event(events.USER_ROLE_SELECTED_TFI, {
            insti_id: instituteInfo?._id,
            insti_type: instituteInfo?.institute_type,
            role: value,
          })
        }
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
    eventManager.send_event(events.ADD_USER_CLICKED_TFI, {
      insti_id: instituteInfo?._id,
      insti_type: instituteInfo?.institute_type,
      role: roles,
    })

    // Validate User Name
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
    } else if (String(phoneNumber).length !== 10) {
      handleSetError('phoneNumber', t('enterDigitPhoneNumber'))
      flag = false
    }

    if (roles.length === 0) {
      handleSetError('roles', t('required'))
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
        roles
      ).catch(() => dispatch(showErrorOccuredAction(true)))

      // Auto Update Admin List
      if (response.status) getInstituteAdmins(instituteInfo._id)
      else dispatch(showLoadingAction(false))

      dispatch(showLoadingAction(false))
      if (response.status === true) {
        eventManager.send_event(events.USER_ADDED_TFI, {
          insti_id: instituteInfo?._id,
          insti_type: instituteInfo?.institute_type,
          role: roles,
        })
        dispatch(
          showToast({
            type: 'success',
            message: t('userAddedSuccessfully'),
          })
        )
        close()
      } else {
        dispatch(
          showToast({
            type: 'error',
            message: t('userCannotBeAdded'),
          })
        )
        close()
      }
      setSliderScreen(false)
    }
  }
  return (
    <div>
      <div className="">
        <div className="flex flex-wrap mt-6">
          {adminInputItemsList.map(
            ({
              fieldType,
              title,
              placeholder,
              fieldName,
              dropdownItems,
              event,
            }) => (
              <div className="w-full mb-2" key={fieldName}>
                <InputField
                  fieldType={fieldType}
                  title={title}
                  placeholder={placeholder}
                  value={adminInputItems[fieldName].value}
                  handleChange={handleInputChange}
                  fieldName={fieldName}
                  dropdownItems={dropdownItems}
                  countryCodeItem={
                    fieldName === 'phoneNumber'
                      ? {
                          ...adminInputItems.phoneNumber.countryCodeItem,
                          value: '91',
                        }
                      : null
                  }
                  errorText={errorObject[fieldName]}
                  eventName={event}
                />
              </div>
            )
          )}
        </div>
        <div className="tm-btn2-blue mt-6" onClick={handleFormSubmit}>
          {t('addUser')}
        </div>
      </div>
    </div>
  )
}
