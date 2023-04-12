import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {showLoadingAction, showToast} from '../../../redux/actions/commonAction'
import {utilsCreateTransportPickup} from '../../../routes/transport'
import {events} from '../../../utils/EventsConstants'
import {
  defaultTransportWaypointFieldValues,
  transportWaypointFields,
} from '../../../utils/fieldsData/transportFieldsData'
import {validateInputs} from '../../../utils/Validations'
import InputField from '../../Common/InputField/InputField'
import SliderScreen from '../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../Common/SliderScreenHeader/SliderScreenHeader'

export default function SliderAddTransportWaypoint({
  setSliderScreen,
  getTransportPickup,
}) {
  const [waypointDetails, setWaypointDetails] = useState(
    defaultTransportWaypointFieldValues
  )
  const [errorObject, setErrorObject] = useState({})
  const {eventManager} = useSelector((state) => state)
  const dispatch = useDispatch()

  const handleInputChange = (fieldName, value) => {
    if (validateInputs(fieldName, value, false)) {
      let waypointDetailsTemp = JSON.parse(JSON.stringify(waypointDetails))
      waypointDetailsTemp[fieldName] = value
      setWaypointDetails(waypointDetailsTemp)
    }
  }

  const handleSetError = (fieldName, error) => {
    let obj = {}
    obj[fieldName] = error
    setErrorObject((errorObject) => ({...errorObject, ...obj}))
  }

  const handleFormSubmit = () => {
    setErrorObject({})
    let flag = true

    if (String(waypointDetails.waypoint_name).length <= 0) {
      handleSetError('waypoint_name', 'Required')
      flag = false
    }

    if (flag) {
      eventManager.send_event(events.ADD_PICKEUP_POINT_TFI, {
        distance: waypointDetails?.distance,
        pickup_point_name: waypointDetails?.waypoint_name,
      })
      dispatch(showLoadingAction(true))
      utilsCreateTransportPickup({
        name: waypointDetails?.waypoint_name,
        distance: waypointDetails?.distance,
      })
        .then(() => {
          eventManager.send_event(events.PICKUP_POINT_ADDED_TFI, {
            distance: waypointDetails?.distance,
            pickup_point_name: waypointDetails?.waypoint_name,
          })
          dispatch(
            showToast({
              type: 'success',
              message: `Pickup point successfully added`,
            })
          )
          getTransportPickup()
          setSliderScreen(null)
        })
        .catch(() =>
          dispatch(
            showToast({
              type: 'error',
              message: `Unable to add pickup point`,
            })
          )
        )
        .finally(() => dispatch(showLoadingAction(false)))
    }
  }

  return (
    <SliderScreen setOpen={() => setSliderScreen(null)}>
      <>
        <SliderScreenHeader
          icon="https://storage.googleapis.com/tm-assets/icons/primary/teacher-primary.svg"
          title="Add Pickup Point"
        />

        <div className="p-5 lg:p-10 h-4/5 overflow-y-auto">
          <div className="flex flex-wrap">
            {Object.values(transportWaypointFields).map(
              ({fieldType, title, placeholder, fieldName, dropdownItems}) => (
                <div className="w-full mb-2" key={fieldName}>
                  <InputField
                    fieldType={fieldType}
                    title={title}
                    placeholder={placeholder}
                    value={waypointDetails[fieldName]}
                    handleChange={handleInputChange}
                    fieldName={fieldName}
                    dropdownItems={dropdownItems}
                    errorText={errorObject[fieldName]}
                  />
                </div>
              )
            )}
          </div>

          <div className="tm-btn2-blue mt-3" onClick={handleFormSubmit}>
            Add Pickup Point
          </div>
        </div>
      </>
    </SliderScreen>
  )
}
