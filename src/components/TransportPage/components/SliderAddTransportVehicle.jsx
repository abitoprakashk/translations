import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {showLoadingAction, showToast} from '../../../redux/actions/commonAction'
import {utilsCreateTransportVehicle} from '../../../routes/transport'
import {events} from '../../../utils/EventsConstants'
import {
  defaultTransportVehicleFieldValues,
  transportVehicleFields,
} from '../../../utils/fieldsData/transportFieldsData'
import {validateInputs} from '../../../utils/Validations'
import InputField from '../../Common/InputField/InputField'
import SliderScreen from '../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../Common/SliderScreenHeader/SliderScreenHeader'

export default function SliderAddTransportVehicle({
  setSliderScreen,
  getTrasnportVehicles,
}) {
  const [vehicleDetails, setVehicleDetails] = useState(
    defaultTransportVehicleFieldValues
  )
  const [errorObject, setErrorObject] = useState({})
  const {eventManager} = useSelector((state) => state)

  const dispatch = useDispatch()

  const handleInputChange = (fieldName, value) => {
    if (validateInputs(fieldName, value, false)) {
      let teacherDetailsTemp = JSON.parse(JSON.stringify(vehicleDetails))
      teacherDetailsTemp[fieldName] = value
      setVehicleDetails(teacherDetailsTemp)
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

    if (String(vehicleDetails.vehicle_name).length <= 0) {
      handleSetError('vehicle_name', 'Required')
      flag = false
    }

    if (String(vehicleDetails.number).length <= 0) {
      handleSetError('number', 'Required')
      flag = false
    }

    eventManager.send_event(events.VEHICLE_ADD_CLICKED_TFI, {
      vehicle_name: vehicleDetails?.vehicle_name,
      vehicle_number: vehicleDetails?.number,
      vehicle_type: vehicleDetails?.vehicle_type,
    })

    if (flag) {
      dispatch(showLoadingAction(true))
      utilsCreateTransportVehicle(vehicleDetails)
        .then(() => {
          eventManager.send_event(events.VEHICLE_ADDED_TFI, {
            vehicle_name: vehicleDetails?.vehicle_name,
            vehicle_number: vehicleDetails?.number,
            vehicle_type: vehicleDetails?.vehicle_type,
          })
          dispatch(
            showToast({
              type: 'success',
              message: `Vehicle successfully added`,
            })
          )
          getTrasnportVehicles()
          setSliderScreen(null)
        })
        .catch(() =>
          dispatch(
            showToast({
              type: 'error',
              message: `Unable to successfully vehicle`,
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
          title="Add Vehicle"
        />

        <div className="p-5 lg:p-10 h-4/5 overflow-y-auto">
          <div className="flex flex-wrap">
            {Object.values(transportVehicleFields).map(
              ({fieldType, title, placeholder, fieldName, dropdownItems}) => (
                <div className="w-full mb-2" key={fieldName}>
                  <InputField
                    fieldType={fieldType}
                    title={title}
                    placeholder={placeholder}
                    value={vehicleDetails[fieldName]}
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
            Add Vehicle
          </div>
        </div>
      </>
    </SliderScreen>
  )
}
