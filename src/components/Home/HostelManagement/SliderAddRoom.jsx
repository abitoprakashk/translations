import {useState} from 'react'
import {useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {utilsGetRoomList, utilsAddRoomByData} from '../../../routes/dashboard'
import {hostelRoomsListAction} from '../../../redux/actions/hostelInfoActions'
import {
  showErrorOccuredAction,
  showLoadingAction,
  showToast,
} from '../../../redux/actions/commonAction'
import {validateInputs} from '../../../utils/Validations'
import InputField from '../../Common/InputField/InputField'
import {useHistory} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {events} from '../../../utils/EventsConstants'

export function SliderAddRoom({setSliderScreen}) {
  const [roomName, setRoomName] = useState('')
  const {eventManager} = useSelector((state) => state)
  const [block, setBlock] = useState()
  const [floor, setFloor] = useState('')
  const [occupancy, setOccupancy] = useState()
  const [errorObject, setErrorObject] = useState({})
  const {location} = useHistory()
  const hostelId = location.state._id

  const dispatch = useDispatch()
  const {t} = useTranslation()
  const close = () => setSliderScreen(null)

  const hostelInputItems = {
    roomName: {
      fieldType: 'text',
      title: t('roomName'),
      value: roomName,
      placeholder: t('roomNamePlaceholder'),
      fieldName: 'roomName',
    },
    block: {
      fieldType: 'text',
      title: t('block'),
      value: block,
      placeholder: t('blockPlaceholder'),
      fieldName: 'block',
    },
    floor: {
      fieldType: 'text',
      title: t('floorNo'),
      value: floor,
      placeholder: t('floorPlaceholder'),
      fieldName: 'floor',
    },
    occupancy: {
      fieldType: 'text',
      title: t('occupancy'),
      value: occupancy,
      placeholder: t('occupancyPlaceholder'),
      fieldName: 'occupancy',
    },
  }

  const hostelInputItemsList = [
    hostelInputItems.roomName,
    hostelInputItems.block,
    hostelInputItems.floor,
    hostelInputItems.occupancy,
  ]
  const getHostelRooms = (hostelId) => {
    utilsGetRoomList(hostelId)
      .then(({data}) => dispatch(hostelRoomsListAction(data)))
      .catch(() => dispatch(showErrorOccuredAction(true)))
  }

  const handleInputChange = (fieldName, value) => {
    switch (fieldName) {
      case 'roomName': {
        if (validateInputs('address', value, false)) {
          setRoomName(value)
        }
        break
      }
      case 'block': {
        if (validateInputs('address', value, false)) {
          setBlock(value)
        }
        break
      }
      case 'floor': {
        if (validateInputs('rooms', value, false)) {
          setFloor(value)
        }
        break
      }
      case 'occupancy': {
        if (validateInputs('rooms', value, false)) {
          setOccupancy(value)
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
      String(roomName).length <= 0 ||
      !validateInputs('hostelName', roomName, true)
    ) {
      handleSetError('hostelName', t('required'))
      flag = false
    }

    if (occupancy == 0 || occupancy == '') {
      handleSetError('occupancy', t('required'))
      flag = false
    }

    if (flag && roomName && occupancy) {
      dispatch(showLoadingAction(true))
      eventManager.send_event(events.ADD_ROOM_CLICKED_TFI, {
        occupancy: occupancy,
      })

      // Send Data to server
      let response = await utilsAddRoomByData(
        hostelId,
        roomName,
        block,
        floor,
        occupancy
      ).catch(() => dispatch(showErrorOccuredAction(true)))

      // Auto Update Admin List
      if (response.status) getHostelRooms(hostelId)
      else dispatch(showLoadingAction(false))

      dispatch(showLoadingAction(false))
      if (response.status === true) {
        dispatch(
          showToast({
            type: 'success',
            message: t('roomAddedSuccessfully'),
          })
        )
        close()
      } else {
        dispatch(
          showToast({
            type: 'error',
            message: t('roomCannotBeAdded'),
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
        <div className="tm-btn2-blue mt-6" onClick={handleFormSubmit}>
          {t('addRoom')}
        </div>
      </div>
    </div>
  )
}
