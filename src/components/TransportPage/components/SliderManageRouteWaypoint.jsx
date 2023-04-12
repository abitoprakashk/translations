import {Table} from '@teachmint/common'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {showLoadingAction, showToast} from '../../../redux/actions/commonAction'
import {
  utilsGetTransportPickup,
  utilsRouteMultiAssociation,
} from '../../../routes/transport'
import SliderScreen from '../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../Common/SliderScreenHeader/SliderScreenHeader'
import * as TRC from '../../../constants/transport.constants'
import InputField from '../../Common/InputField/InputField'
import TimePickerWrapper from '../../Common/TimePicker/TimePicker'
import {validateInputs} from '../../../utils/Validations'
import ConfirmationPopup from '../../Common/ConfirmationPopup/ConfirmationPopup'
import {DateTime} from 'luxon'
import {events} from '../../../utils/EventsConstants'

export default function SliderManageRouteWaypoint({
  setSliderScreen,
  selectedTransportRoute,
  setSelectedTransportRoute,
  getTrasnportRoutes,
}) {
  const [waypointList, setWaypointList] = useState([])
  const {eventManager} = useSelector((state) => state)
  const [waypointId, setWaypointId] = useState('')
  const [waypointIdErr, setWaypointIdErr] = useState('')
  const [waypointPickupTime, setWaypointPickupTime] = useState('09:00 AM')
  const [waypointDropTime, setWaypointDropTime] = useState('5:00 PM')
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(null)
  const [waypointTimeErr, setWaypointTimeErr] = useState('')

  const dispatch = useDispatch()
  const setToastData = (type, message) => dispatch(showToast({type, message}))

  useEffect(() => {
    getTrasnportRoutesWaypoint()
  }, [])

  const onClose = () => {
    setSelectedTransportRoute(null)
    setSliderScreen(null)
  }

  const getTrasnportRoutesWaypoint = () => {
    if (selectedTransportRoute?._id) {
      dispatch(showLoadingAction(true))
      utilsGetTransportPickup(selectedTransportRoute?._id)
        .then(({obj}) => {
          setWaypointList(obj)
        })
        .catch(() => setToastData('error', 'Unable to get pickup points'))
        .finally(() => dispatch(showLoadingAction(false)))
    }
  }

  const handleInputChange = (fieldName, value) => {
    if (validateInputs(fieldName, value, false)) {
      switch (fieldName) {
        case 'pickup_id':
          setWaypointId(value)
          break
        case 'pickup_time':
          setWaypointPickupTime(value)
          break
        case 'drop_time':
          setWaypointDropTime(value)
          break
        default:
          break
      }
    }
  }

  const getRows = (routesList) =>
    routesList?.map((item) => {
      return {
        id: item?._id,
        name: (
          <div className="tm-color-text-primary tm-para-14">{item?.name}</div>
        ),
        pickup_time: (
          <div className="tm-color-text-primary tm-para-14">
            {item?.pickup_time || '-'}
          </div>
        ),
        drop_time: (
          <div className="tm-color-text-primary tm-para-14">
            {item?.drop_time || '-'}
          </div>
        ),
        settings: (
          <img
            src="https://storage.googleapis.com/tm-assets/icons/colorful/delete-red.svg"
            className="w-4 h-4 cursor-pointer"
            onClick={() =>
              handleChange(TRC.ACT_TRASNPORT_DELETE_WAYPOINT, item)
            }
          />
        ),
      }
    })

  const handleFormSubmit = () => {
    let flag = true

    // Validate Waypoint Name
    if (!waypointId || waypointId === 'Select') {
      setWaypointIdErr('Required')
      flag = false
    } else setWaypointIdErr('')

    // Check if drop time greater than pickup time
    if (
      DateTime.fromFormat(waypointPickupTime, 'h:mm a').toMillis() >=
      DateTime.fromFormat(waypointDropTime, 'h:mm a').toMillis()
    ) {
      flag = false
      setWaypointTimeErr('Drop time should be more than pickup time')
    } else setWaypointTimeErr('')

    if (flag) {
      utilsRouteMultiAssociation([
        {
          pickup_id: waypointId,
          pickup_time: waypointPickupTime,
          drop_time: waypointDropTime,
          route_id: selectedTransportRoute?._id,
        },
      ]).then(() => {
        eventManager.send_event(events.WAY_POINT_ADDED_TFI, {
          pickup_point: waypointId,
          pickup_time: waypointPickupTime,
          drop_time: waypointDropTime,
        })
        dispatch(
          showToast({
            type: 'success',
            message: `Waypoint successfully added`,
          })
        )
        setWaypointId('Select')
        setWaypointPickupTime('09:00 AM')
        setWaypointDropTime('5:00 PM')
      })
      getTrasnportRoutes()
    }
  }

  const handleChange = (action, waypoint = null) => {
    switch (action) {
      case TRC.ACT_TRASNPORT_DELETE_WAYPOINT: {
        setShowConfirmationPopup({
          title: `Are you sure you want to delete "${waypoint?.name}" waypoint?`,
          desc: 'If you delete the waypoint you will loose all the data and you will not be able recover it later.',
          imgSrc:
            'https://storage.googleapis.com/tm-assets/icons/colorful/remove-bg-red.svg',
          primaryBtnText: 'Cancel',
          secondaryBtnText: 'Delete',
          onAction: () => deleteWaypoint(waypoint?._id),
        })
        break
      }
    }
  }

  const deleteWaypoint = (waypointId) => {
    if (waypointId)
      utilsRouteMultiAssociation([
        {
          route_id: selectedTransportRoute?._id,
          pickup_id: waypointId,
          active: false,
        },
      ])
        .then(() => {
          setToastData('success', 'Waypoint successfully deleted')
          setShowConfirmationPopup(null)
          getTrasnportRoutes()
        })
        .catch(() => setToastData('error', 'Unable to delete waypoint'))
        .finally(() => dispatch(showLoadingAction(false)))
  }

  const getDropdownItems = () => {
    const data =
      waypointList?.map(({_id, name}) => {
        return {key: _id, value: name}
      }) || []
    return [{key: 'Select', value: 'Select'}, ...data]
  }

  return (
    <>
      {showConfirmationPopup && (
        <ConfirmationPopup
          onClose={setShowConfirmationPopup}
          onAction={showConfirmationPopup?.onAction}
          icon={showConfirmationPopup?.imgSrc}
          title={showConfirmationPopup?.title}
          desc={showConfirmationPopup?.desc}
          primaryBtnText={showConfirmationPopup?.primaryBtnText}
          secondaryBtnText={showConfirmationPopup?.secondaryBtnText}
          secondaryBtnStyle="tm-btn2-red"
        />
      )}

      <SliderScreen setOpen={onClose}>
        <>
          <SliderScreenHeader
            icon="https://storage.googleapis.com/tm-assets/icons/primary/teacher-primary.svg"
            title="Manage Pickup Point"
          />

          <div className="p-5 lg:p-10 h-4/5 overflow-y-auto">
            <div>
              <div className="tm-h7 mb-4">Pickup Point List</div>
              <Table
                rows={getRows(selectedTransportRoute?.pickup_ids)}
                cols={TRC.TRANSPORT_ROUTE_WAYPOINT_TABLE_HEADERS}
              />
            </div>
            <hr className="my-8" />
            <div>
              <div className="tm-h7 mb-4">Add new pickup point</div>

              <InputField
                fieldType="dropdown"
                title="Select Pickup Point*"
                placeholder=""
                value={waypointId}
                handleChange={handleInputChange}
                fieldName="pickup_id"
                dropdownItems={getDropdownItems()}
                errorText={waypointIdErr}
              />

              <div className="flex">
                <div className="mr-6">
                  <div className="tm-para2 tm-color-text-primary mb-1">
                    Pickup Time*
                  </div>
                  <TimePickerWrapper
                    time={waypointPickupTime}
                    setTime={(a) => handleInputChange('pickup_time', a)}
                    index={1}
                  />
                </div>
                <div className="">
                  <div className="tm-para2 tm-color-text-primary mb-1">
                    Drop Time*
                  </div>
                  <TimePickerWrapper
                    time={waypointDropTime}
                    setTime={(a) => handleInputChange('drop_time', a)}
                    index={1}
                  />
                </div>
              </div>
              <div className="tm-para4 mt-1 h-4 tm-color-red">
                {waypointTimeErr}
              </div>

              <div className="tm-btn2-blue mt-3" onClick={handleFormSubmit}>
                Add Pickup Point
              </div>
            </div>
          </div>
        </>
      </SliderScreen>
    </>
  )
}
