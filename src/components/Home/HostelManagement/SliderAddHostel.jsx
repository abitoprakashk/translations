import {useState} from 'react'
import {useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {StickyFooter} from '@teachmint/common'
import {
  utilsGetHostelList,
  utilsAddHostelByData,
} from '../../../routes/dashboard'
import {hostelListAction} from '../../../redux/actions/hostelInfoActions'
import {
  showErrorOccuredAction,
  showLoadingAction,
  showToast,
} from '../../../redux/actions/commonAction'
import {validateInputs} from '../../../utils/Validations'
import InputField from '../../Common/InputField/InputField'
import {useSelector} from 'react-redux'
import {events} from '../../../utils/EventsConstants'

export function SliderAddHostel({setSliderScreen}) {
  const [hostelName, setHostelName] = useState('')
  const [address, setAddress] = useState()
  const [rooms, setRooms] = useState('')
  const [hostelType, setHostelType] = useState('')
  const [errorObject, setErrorObject] = useState({})
  const {eventManager} = useSelector((state) => state)
  const typeOptions = [
    {key: '', value: 'Select'},
    {key: 'Boys', value: 'Boys'},
    {key: 'Girls', value: 'Girls'},
  ]
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const close = () => setSliderScreen(null)

  const hostelInputItems = {
    hostelName: {
      fieldType: 'text',
      title: t('hostelName'),
      value: hostelName,
      placeholder: t('hostelNamePlaceholder'),
      fieldName: 'hostelName',
    },
    address: {
      fieldType: 'text',
      title: t('addressAll'),
      value: address,
      placeholder: t('addressPlaceholder'),
      fieldName: 'address',
    },
    rooms: {
      fieldType: 'text',
      title: t('rooms'),
      value: rooms,
      placeholder: t('roomsPlaceholder'),
      fieldName: 'rooms',
    },
    hostelType: {
      fieldType: 'dropdown',
      title: t('selectHostelType'),
      dropdownItems: typeOptions,
      value: hostelType,
      fieldName: 'hostelType',
    },
  }

  const hostelInputItemsList = [
    hostelInputItems.hostelName,
    hostelInputItems.address,
    hostelInputItems.rooms,
    hostelInputItems.hostelType,
  ]
  const getInstituteHostels = () => {
    utilsGetHostelList()
      .then(({data}) => dispatch(hostelListAction(data)))
      .catch(() => dispatch(showErrorOccuredAction(true)))
  }

  const handleInputChange = (fieldName, value) => {
    switch (fieldName) {
      case 'hostelName': {
        if (validateInputs('address', value, false)) {
          setHostelName(value)
        }
        break
      }
      case 'address': {
        if (validateInputs('address', value, false)) {
          setAddress(value)
        }
        break
      }
      case 'rooms': {
        if (validateInputs('rooms', value, false)) {
          setRooms(value)
        }
        break
      }
      case 'hostelType': {
        if (validateInputs('gender', value, false)) {
          setHostelType(value)
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

    // Validate Hostel Name
    if (
      String(hostelName).length <= 0 ||
      !validateInputs('hostelName', hostelName, true)
    ) {
      handleSetError('hostelName', t('required'))
      flag = false
    }

    // Validate Address
    if (
      String(address).length <= 0 ||
      !validateInputs('address', address, true)
    ) {
      handleSetError('address', t('incorrect'))
      flag = false
    }

    // Validate Hostel Type
    if (
      String(hostelType).length <= 0 ||
      !validateInputs('hostelType', hostelType, true)
    ) {
      handleSetError('hostelType', t('required'))
      flag = false
    }
    if (rooms == 0) {
      handleSetError('rooms', t('required'))
      flag = false
    }

    if (flag && hostelName && address) {
      dispatch(showLoadingAction(true))
      eventManager.send_event(events.ADD_HOSTEL_CLICKED_TFI, {
        no_of_rooms: rooms,
        hostel_type: hostelType ? hostelType.toLowerCase() : undefined,
      })

      // Send Data to server
      let response = await utilsAddHostelByData(
        hostelName,
        address,
        rooms,
        hostelType
      ).catch(() => dispatch(showErrorOccuredAction(true)))

      // Auto Update Admin List
      if (response.status) getInstituteHostels()
      else dispatch(showLoadingAction(false))

      dispatch(showLoadingAction(false))
      if (response.status === true) {
        eventManager.send_event(events.HOSTEL_CREATED_TFI, {
          no_of_rooms: rooms,
          hostel_type: hostelType ? hostelType.toLowerCase() : undefined,
        })
        dispatch(
          showToast({
            type: 'success',
            message: t('hostelAddedSuccessfully'),
          })
        )
        close()
      } else {
        dispatch(
          showToast({
            type: 'error',
            message: t('hostelCannotBeAdded'),
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
          {hostelInputItemsList.map(
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
                  value={hostelInputItems[fieldName].value}
                  handleChange={handleInputChange}
                  fieldName={fieldName}
                  dropdownItems={dropdownItems}
                  errorText={errorObject[fieldName]}
                  eventName={event}
                />
              </div>
            )
          )}
        </div>
        <StickyFooter forSlider>
          <button className="tm-btn2-blue" onClick={handleFormSubmit}>
            {t('addHostelLabel')}
          </button>
        </StickyFooter>
      </div>
    </div>
  )
}
