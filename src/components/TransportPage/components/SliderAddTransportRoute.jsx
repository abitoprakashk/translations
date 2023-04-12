import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {showLoadingAction, showToast} from '../../../redux/actions/commonAction'
import {utilsGetStaff} from '../../../routes/staff'
import {
  utilsCreateTransportRoutes,
  utilsGetTransportVehicle,
  utilsRouteMultiAssociation,
} from '../../../routes/transport'
import {events} from '../../../utils/EventsConstants'
import {
  defaultTransportRoutesFieldValues,
  transportRoutesFields,
} from '../../../utils/fieldsData/transportFieldsData'
import {validateInputs} from '../../../utils/Validations'
import InputField from '../../Common/InputField/InputField'
import SliderScreen from '../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../Common/SliderScreenHeader/SliderScreenHeader'

export default function SliderAddTransportRoute({
  setSliderScreen,
  getTrasnportRoutes,
}) {
  const [routeDetails, setTeacherDetails] = useState(
    defaultTransportRoutesFieldValues
  )
  const [errorObject, setErrorObject] = useState({})
  const {eventManager} = useSelector((state) => state)
  const [staffList, setStaffList] = useState([])
  const [vehicleList, setVehicleList] = useState([])
  const [selectedVechile, setSelectedVechile] = useState('Select')

  const dispatch = useDispatch()
  const setToastData = (type, message) => dispatch(showToast({type, message}))

  useEffect(() => {
    getStaffList()
    getTrasnportVehicles()
  }, [])

  const getStaffList = () => {
    dispatch(showLoadingAction(true))
    utilsGetStaff()
      .then(({obj}) => {
        setStaffList(
          obj
            ?.filter(
              ({staff_type}) =>
                staff_type === 'Driver' || staff_type === 'Conductor'
            )
            ?.map(({_id, name, phone_number, staff_type}) => {
              return {
                key: _id,
                value: `${name} - ${staff_type} (${phone_number})`,
                selected: false,
              }
            })
        )
      })
      .catch(() => setToastData('error', 'Unable to get staff'))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const getTrasnportVehicles = () => {
    dispatch(showLoadingAction(true))
    utilsGetTransportVehicle()
      .then(({obj}) => {
        setVehicleList([
          {key: 'Select', value: 'Select'},
          ...obj?.map(({_id, vehicle_name, number}) => {
            return {key: _id, value: `${vehicle_name} (${number})`}
          }),
        ])
      })
      .catch(() => setToastData('error', 'Unable to get vehicle list'))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const handleInputChange = (fieldName, value) => {
    switch (fieldName) {
      case 'addStaff':
        setStaffList(value)
        break
      default:
        if (validateInputs(fieldName, value, false)) {
          let teacherDetailsTemp = JSON.parse(JSON.stringify(routeDetails))
          teacherDetailsTemp[fieldName] = value
          setTeacherDetails(teacherDetailsTemp)
        }
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

    // Validate
    if (String(routeDetails.route_name).length <= 0) {
      handleSetError('route_name', 'Required')
      flag = false
    }

    if (flag) {
      let selectedStaff = []
      staffList?.map(({selected, key}) => {
        if (selected) {
          selectedStaff.push(key)
        }
      })
      eventManager.send_event(events.ROUTE_ADD_TFI, {
        route_name: routeDetails?.route_name,
        assign_vehicle: selectedVechile === 'Select' ? '' : selectedVechile,
        assign_staff: selectedStaff,
      })
      dispatch(showLoadingAction(true))
      const routeResponse = await utilsCreateTransportRoutes({
        name: routeDetails?.route_name,
      })
        .catch(() =>
          dispatch(
            showToast({type: 'error', message: `Unable to delete route`})
          )
        )
        .finally(() => dispatch(showLoadingAction(false)))

      if (routeResponse?.status) {
        const association = []

        // Add staff members if any
        staffList?.map(({selected, key}) => {
          if (selected)
            association.push({iid: key, route_id: routeResponse?.obj})
        })

        // Add vehicle if selected
        if (selectedVechile && selectedVechile !== 'Select')
          association.push({
            vehicle_id: selectedVechile,
            route_id: routeResponse?.obj,
          })

        utilsRouteMultiAssociation(association).then(() => {
          eventManager.send_event(events.ROUTE_ADDED_TFI, {
            route_name: routeDetails?.route_name,
            assign_vehicle: selectedVechile === 'Select' ? '' : selectedVechile,
            assign_staff: selectedStaff,
          })
          dispatch(
            showToast({
              type: 'success',
              message: `Route successfully added`,
            })
          )
          getTrasnportRoutes()
          setSliderScreen(null)
        })
      }
    }
  }

  return (
    <SliderScreen setOpen={() => setSliderScreen(null)}>
      <>
        <SliderScreenHeader
          icon="https://storage.googleapis.com/tm-assets/icons/primary/teacher-primary.svg"
          title="Add Route"
        />

        <div className="p-5 lg:p-10 h-4/5 overflow-y-auto">
          <div className="flex flex-wrap">
            {Object.values(transportRoutesFields).map(
              ({fieldType, title, placeholder, fieldName, dropdownItems}) => (
                <div className="w-full mb-2" key={fieldName}>
                  <InputField
                    fieldType={fieldType}
                    title={title}
                    placeholder={placeholder}
                    value={routeDetails[fieldName]}
                    handleChange={handleInputChange}
                    fieldName={fieldName}
                    dropdownItems={dropdownItems}
                    errorText={errorObject?.[fieldName]}
                  />
                </div>
              )
            )}
          </div>

          <div className="mt-4">
            <InputField
              fieldType="multipleSelectionDropdown"
              title="Assign Staff"
              value={staffList}
              handleChange={handleInputChange}
              fieldName="addStaff"
            />
          </div>

          <div className="mt-4">
            <InputField
              fieldType="dropdown"
              title="Assign Vehicle"
              placeholder=""
              value={selectedVechile}
              handleChange={(_, value) => setSelectedVechile(value)}
              fieldName="vehicle"
              dropdownItems={vehicleList}
            />
          </div>

          <div className="tm-btn2-blue mt-3" onClick={handleFormSubmit}>
            Add Route
          </div>
        </div>
      </>
    </SliderScreen>
  )
}
