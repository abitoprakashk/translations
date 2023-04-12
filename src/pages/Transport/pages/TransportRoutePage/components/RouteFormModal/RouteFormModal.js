import {Trans, useTranslation} from 'react-i18next'
import {useEffect, useState} from 'react'
import {v4 as uuidv4} from 'uuid'
import styles from './routeFormModal.module.css'
import {
  Modal,
  Button,
  Icon,
  ICON_CONSTANTS,
  MODAL_CONSTANTS,
  BUTTON_CONSTANTS,
  Divider,
  Heading,
  HEADING_CONSTANTS,
  Alert,
  ALERT_CONSTANTS,
  Para,
} from '@teachmint/krayon'
import RouteStopCard from '../RouteStopCard/RouteStopCard'
import RouteDetails from '../RouteDetails/RouteDetails'
import {
  NEW_ROUTE_DETAILS_DATA,
  NEW_ROUTE_DETAILS_ERROR,
  NEW_ROUTE_STOP_DATA,
  NEW_ROUTE_STOP_ERROR,
} from '../../constants'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../../../redux/actions/global.actions'
import {convertTime12to24} from '../../../../../../utils/Helpers'
import RouteFormMap from '../RouteFormMap/RouteFormMap'
import {STAFF_OPTIONS} from '../../../StaffPage/constants'
import {events} from '../../../../../../utils/EventsConstants'
import {alphaNumericRegex} from '../../../../../../utils/Validations'
import MultipleRouteAdditionForm from '../MultipleRouteAdditionForm/MultipleRouteAdditionForm'

export default function RouteFormModal({
  showModal,
  setShowModal,
  isEdit,
  editData,
  isOnboarding,
}) {
  if (!showModal) return null

  const [routeData, setRouteData] = useState({})
  const [errorObj, setErrorObj] = useState({})
  const [alertContent, setAlertContent] = useState('')
  const [showMultipleRouteAdditionForm, setShowMultipleRouteAdditionForm] =
    useState(false)
  // state for storing all added stops to show in MultipleRouteAdditionForm
  const [allAddedRoutes, setAllAddedRoutes] = useState([])

  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {eventManager} = useSelector((state) => state)

  // Get Data from redux
  const staffData = useSelector(
    (state) => state?.globalData?.transportStaff?.data
  )
  const vehiclesData = useSelector(
    (state) => state?.globalData?.transportVehicles?.data
  )
  const stopsData = useSelector(
    (state) => state?.globalData?.transportStops?.data
  )
  const allRoutesData = useSelector(
    (state) => state?.globalData?.transportRoutes?.data
  )
  const studentsData = useSelector((state) => state?.instituteActiveStudentList)
  const teachersData = useSelector((state) => state?.instituteActiveTeacherList)

  const getStaffOptions = () => {
    let driverOptions = []
    let attendantOptions = []
    let busInchargeOptions = []

    staffData?.forEach((obj) => {
      let option = {label: obj.name, value: obj._id}
      switch (obj?.staff_type) {
        case STAFF_OPTIONS[0].value:
          driverOptions.push(option)
          break
        case STAFF_OPTIONS[1].value:
          attendantOptions.push(option)
          break
        default:
          busInchargeOptions.push(option)
      }
    })

    let options = []

    if (driverOptions?.length > 0)
      options.push({heading: t('driver'), options: driverOptions})
    if (attendantOptions?.length > 0)
      options.push({heading: t('attendant'), options: attendantOptions})
    if (busInchargeOptions?.length > 0)
      options.push({heading: t('busIncharge'), options: busInchargeOptions})

    return options
  }

  const getFrozenStopOptions = () => {
    let selectedStops = []
    for (const key in routeData) {
      if (routeData[key]?.stop) selectedStops.push(routeData[key].stop)
    }
    return selectedStops
  }

  const getVehicleOptions = () => {
    return vehiclesData
      ?.filter((obj) => !obj.route_details?.name)
      ?.map((obj) => ({label: obj.number, value: obj._id}))
  }

  const getStopOptions = () =>
    stopsData?.map((obj) => ({
      label: obj.name,
      value: obj._id,
    })) || []

  const getPassengerOptions = (stopId) => {
    if (!stopId) return []
    const stop = stopsData?.find((obj) => obj._id === stopId)
    let teacherOptions = []
    let studentOptions = []
    let passengersInDiffRoute = new Set()

    allRoutesData
      ?.filter((route) => route._id !== routeData?.routeDetails?._id)
      .forEach((route) => {
        route?.pickup_point_details?.forEach((pickUpPoint) => {
          pickUpPoint?.passenger_ids?.forEach((id) =>
            passengersInDiffRoute.add(id)
          )
        })
      })

    stop?.passenger_ids?.forEach((id) => {
      if (passengersInDiffRoute.has(id)) return
      const student = studentsData?.find((obj) => obj._id === id)
      const teacher = teachersData?.find((obj) => obj._id === id)
      if (student) {
        studentOptions.push({label: student.name, value: id})
      } else if (teacher) {
        teacherOptions.push({label: teacher.name, value: id})
      }
    })

    let options = []
    if (studentOptions?.length > 0)
      options.push({heading: t('students'), options: studentOptions})
    if (teacherOptions?.length > 0)
      options.push({heading: t('teachers'), options: teacherOptions})

    return options
  }

  useEffect(() => {
    setInitialDataAndError()
  }, [])

  const setInitialDataAndError = () => {
    // If in edit mode then there are no errors by default
    if (isEdit) {
      checkForEditDataAndError(editData)
      return
    }
    const key = uuidv4()
    const initialData = {
      routeDetails: {...NEW_ROUTE_DETAILS_DATA},
      [key]: {...NEW_ROUTE_STOP_DATA},
    }
    const initialError = {
      routeDetails: {...NEW_ROUTE_DETAILS_ERROR},
      [key]: {...NEW_ROUTE_STOP_ERROR},
    }
    setRouteData(initialData)
    setErrorObj(initialError)
    setAlertContent('')
  }

  const checkForEditDataAndError = (editData) => {
    let errorObj = {}
    let routeDetailsError = {}
    let {name, vehicle, dropTime, pickupTime} = editData?.routeDetails

    // Check for route details validation
    if (!name || !alphaNumericRegex(name))
      routeDetailsError.name = t('onlyAlphabetsNumbersAllowed')
    if (!vehicle) routeDetailsError.vehicle = ''
    if (!dropTime) routeDetailsError.dropTime = ''
    if (!pickupTime) routeDetailsError.pickupTime = ''

    // Check for added stop; if not add one
    if (Object.keys(editData)?.length === 1) {
      const key = uuidv4()
      errorObj[key] = {...NEW_ROUTE_STOP_ERROR}
      editData[key] = {...NEW_ROUTE_STOP_DATA}
    }

    // Add route details error if any to error obj
    if (Object.keys(routeDetailsError)?.length > 0)
      errorObj = {...errorObj, routeDetails: routeDetailsError}

    setErrorObj(errorObj)
    setRouteData(editData)
  }

  const getNewRouteStop = () => {
    let key = uuidv4()
    setErrorObj({...errorObj, [key]: {...NEW_ROUTE_STOP_ERROR}})
    return {[key]: {...NEW_ROUTE_STOP_DATA}}
  }

  // handle routestop card remove
  const onRemoveRouteStop = (id) => {
    let newRouteData = {...routeData}
    delete newRouteData[id]
    let newError = {...errorObj}
    delete newError[id]
    setErrorObj(newError)
    setRouteData(newRouteData)
  }

  const onErrorChange = (error, id) => {
    let newErrors = {...errorObj}
    if (Object.keys(error).length > 0) {
      newErrors = {...newErrors, [id]: error}
    } else {
      delete newErrors[id]
    }
    setErrorObj(newErrors)
  }

  const onDataChange = (data, id) => {
    let newRouteData = {...routeData}
    newRouteData[id] = data
    setRouteData(newRouteData)
  }

  const handleAddRoute = () => {
    setRouteData({...routeData, ...getNewRouteStop()})
    eventManager.send_event(events.ADD_ROUTE_STOP_CLICKED_TFI)
  }

  const getPayload = () => {
    const routeDetails = routeData.routeDetails

    let routeObj = {
      name: routeDetails.name,
      vehicle_id: routeDetails.vehicle,
      staff_id_list: routeDetails.staff || [],
      pickup_end_time: convertTime12to24(routeDetails.pickupTime),
      drop_start_time: convertTime12to24(routeDetails.dropTime),
    }

    let stopsList = []
    for (const key in routeData) {
      if (key === 'routeDetails') continue
      let currentStop = routeData[key]

      stopsList.push({
        pickup_point_id: currentStop.stop,
        pickup_time: convertTime12to24(currentStop.pickupTime),
        drop_time: convertTime12to24(currentStop.dropTime),
        passenger_ids: currentStop.passengers || [],
      })
    }
    if (isEdit) routeObj._id = routeDetails._id
    routeObj['pickup_point_details'] = stopsList
    return {routes_list: [routeObj]}
  }

  const getNStopsAndPassengers = () => {
    let nStops = 0
    let nPassengers = 0
    Object.values(routeData)?.forEach((item) => {
      if (item?.stop) nStops = nStops + 1
      if (item?.passengers) nPassengers = nPassengers + item.passengers?.length
    })
    return [nStops, nPassengers]
  }

  const onConfirm = () => {
    eventManager.send_event(events.ADD_ROUTE_POPUP_CLICKED_TFI, {
      screen_name: 'routes_tab',
      action: 'confirm',
    })

    const payload = getPayload()

    // Check timing validations
    let isValid = false
    let pickupEndTime = payload?.routes_list?.[0]?.pickup_end_time
    let dropStartTime = payload?.routes_list?.[0]?.drop_start_time
    let stops = payload?.routes_list?.[0].pickup_point_details

    for (let i = 0; i < stops.length; i++) {
      const {pickup_time, drop_time, pickup_point_id} = stops[i]
      let stopName =
        stopsData?.find(({_id}) => _id === pickup_point_id)?.name || t('stop')

      // Check for pickup time
      if (pickup_time >= pickupEndTime) {
        setAlertContent(
          <Trans i18nKey="pickupTimeOverlappingError" values={{stopName}} />
        )
        isValid = true
        break
      }

      // Check for drop time
      if (dropStartTime >= drop_time) {
        setAlertContent(
          <Trans i18nKey="dropTimeOverlappingError" values={{stopName}} />
        )
        isValid = true
        break
      }

      // Check for overlapping time
      let overlappingStops = stops?.filter(
        (item) =>
          item.pickup_point_id !== pickup_point_id &&
          (pickup_time === item.pickup_time || drop_time === item.drop_time)
      )
      if (overlappingStops?.length > 0) {
        let secondStop =
          stopsData?.find(
            ({_id}) => _id === overlappingStops?.[0]?.pickup_point_id
          )?.name || 'stop'
        isValid = true
        setAlertContent(
          <Trans
            i18nKey="timingOverlappingError"
            values={{firstStop: stopName, secondStop}}
          />
        )
        break
      }
    }

    if (!isValid) {
      const successAction = () => {
        if (isEdit) eventManager.send_event(events.ROUTE_EDITED_TFI)
        else eventManager.send_event(events.ROUTE_ADDED_TFI)
        if (isOnboarding) {
          const [nStops, nPassengers] = getNStopsAndPassengers()
          setAllAddedRoutes([
            ...allAddedRoutes,
            {
              ...routeData?.routeDetails,
              nStops: nStops,
              nPassengers: nPassengers,
            },
          ])
          setInitialDataAndError()
          setShowMultipleRouteAdditionForm(true)
        } else onModalClose()
      }

      dispatch(
        globalActions?.updateTransportRoutes?.request(payload, successAction)
      )
    }
  }

  const onModalClose = () => {
    setShowModal(false)
    setInitialDataAndError()
  }

  const RouteSeatingFractionInfo = () => {
    let selectedVehicle = vehiclesData?.find(
      (vehicle) => vehicle?._id === routeData?.routeDetails?.vehicle
    )
    const [nStops, nPassengers] = getNStopsAndPassengers()

    return (
      <>
        {selectedVehicle && (
          <div className={styles.routeSeatingFractionInfoWrapper}>
            <Icon
              name="info"
              type={ICON_CONSTANTS.TYPES.PRIMARY}
              size={ICON_CONSTANTS.SIZES.XX_SMALL}
            />
            <Para>
              <Trans
                i18nKey="routeSeatingFractionMsg"
                values={{
                  seatingFraction: `${nPassengers}/${
                    selectedVehicle?.seating_capacity || 0
                  }`,
                  nStops: nStops,
                }}
              />
            </Para>
          </div>
        )}
      </>
    )
  }

  const NRoutesCreatedFooterElement = () => {
    return (
      <div className={styles.routeSeatingFractionInfoWrapper}>
        <Icon
          name="checkCircle1"
          version={ICON_CONSTANTS.VERSION.FILLED}
          type={ICON_CONSTANTS.TYPES.SUCCESS}
          size={ICON_CONSTANTS.SIZES.XX_SMALL}
        />
        <Para>
          <Trans
            i18nKey="nRoutesCreatedSuccessfully"
            values={{nRoutes: allAddedRoutes.length}}
          />
        </Para>
      </div>
    )
  }

  return (
    <Modal
      header={isEdit ? t('editRoute') : t('createRoute')}
      footerLeftElement={
        showMultipleRouteAdditionForm ? (
          <NRoutesCreatedFooterElement />
        ) : (
          <RouteSeatingFractionInfo />
        )
      }
      headerIcon={
        <Icon
          size={ICON_CONSTANTS.SIZES.SMALL}
          name="swapCalls"
          type={ICON_CONSTANTS.TYPES.BASIC}
        />
      }
      isOpen={showModal}
      onClose={() => {
        eventManager.send_event(events.ADD_ROUTE_POPUP_CLICKED_TFI, {
          screen_name: 'routes_tab',
          action: 'close',
        })
        setShowModal(false)
      }}
      classes={{content: styles.modalContent}}
      actionButtons={
        showMultipleRouteAdditionForm
          ? [{onClick: onModalClose, body: t('done')}]
          : [
              {
                onClick: onConfirm,
                body: t('confirm'),
                isDisabled: Object.keys(errorObj).length > 0,
              },
            ]
      }
      size={MODAL_CONSTANTS.SIZE.X_LARGE}
      shouldCloseOnOverlayClick={false}
    >
      {showMultipleRouteAdditionForm ? (
        <MultipleRouteAdditionForm
          setShowMultipleRouteAdditionForm={setShowMultipleRouteAdditionForm}
          addedRoutes={allAddedRoutes}
        />
      ) : (
        <div className={styles.wrapper}>
          <div className={styles.formWrapper}>
            <RouteDetails
              isEdit={isEdit}
              id={'routeDetails'}
              data={routeData['routeDetails']}
              error={errorObj['routeDetails']}
              staffOptions={getStaffOptions()}
              vehicleOptions={getVehicleOptions()}
              onDataChange={onDataChange}
              onErrorChange={onErrorChange}
            />
            <Divider spacing="20px" />
            <div className={styles.routeStops}>
              <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
                {t('addStops')}
              </Heading>
              <div className={styles.routeStopCardsWrapper}>
                {Object.keys(routeData)
                  ?.filter((key) => key !== 'routeDetails')
                  .map((id, index) => (
                    <RouteStopCard
                      key={id}
                      id={id}
                      index={index + 1}
                      data={routeData[id]}
                      error={errorObj[id]}
                      stopOptions={getStopOptions()}
                      frozenStopOptions={getFrozenStopOptions()}
                      passengerOptions={getPassengerOptions(
                        routeData[id]?.stop
                      )}
                      onDataChange={onDataChange}
                      onErrorChange={onErrorChange}
                      onRemove={onRemoveRouteStop}
                      removable={Object.keys(routeData).length > 2}
                    />
                  ))}
              </div>
              <Button
                onClick={handleAddRoute}
                type={BUTTON_CONSTANTS.TYPE.TEXT}
                classes={{button: styles.addStopsButton}}
              >
                {`+ ${t('addMoreStops')}`}
              </Button>
              {alertContent && (
                <Alert
                  type={ALERT_CONSTANTS.TYPE.ERROR}
                  content={alertContent}
                  hideClose={true}
                  className={styles.alertWrapper}
                />
              )}
            </div>
          </div>
          <div className={styles.map}>
            <RouteFormMap routeStopList={routeData} isEdit={isEdit} />
          </div>
        </div>
      )}
    </Modal>
  )
}
