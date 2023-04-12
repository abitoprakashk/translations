import {
  Alert,
  ALERT_CONSTANTS,
  Divider,
  Heading,
  Input,
  INPUT_TYPES,
  Modal,
  MODAL_CONSTANTS,
  HEADING_CONSTANTS,
  PlainCard,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import {t} from 'i18next'
import React, {useEffect, useState} from 'react'
import {Trans} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../../../../../redux/actions/global.actions'
import {events} from '../../../../../../../../utils/EventsConstants'
import {VEHICLE_OPTIONS} from '../../../../../VehiclesPage/constants'
import styles from './assignTransportModal.module.css'
import homeLocationImg from './place.svg'

export default function AssignTransportModal({
  showModal,
  setShowModal,
  passengerDetails,
  getTransportData,
}) {
  const [selectedStop, setSelectedStop] = useState(
    passengerDetails?.pickup_point_id
  )
  const [selectedRoute, setSelectedRoute] = useState(passengerDetails?.route_id)
  const [stopsList, setStopsList] = useState([])
  const [routesList, setRoutesList] = useState([])

  const dispatch = useDispatch()
  const transportStops = useSelector(
    (state) => state?.globalData?.transportStops?.data
  )
  const transportRoutes = useSelector(
    (state) => state?.globalData?.transportRoutes?.data
  )

  const instituteActiveStudentList = useSelector(
    (state) => state?.instituteActiveStudentList
  )
  const instituteActiveTeacherList = useSelector(
    (state) => state?.instituteActiveTeacherList
  )
  const eventManager = useSelector((state) => state?.eventManager)

  const userObj =
    instituteActiveStudentList?.find(
      (obj) => obj._id === passengerDetails?.iid
    ) ||
    instituteActiveTeacherList?.find(
      (obj) => obj._id === passengerDetails?.iid
    ) ||
    {}

  // Set Stops Options
  useEffect(() => {
    if (transportStops) {
      const stopsOptions =
        transportStops?.map(({_id, name}) => {
          return {value: _id, label: name}
        }) || []

      setStopsList(stopsOptions)
    }
  }, [transportStops])

  // Set Routes Options
  useEffect(() => {
    if (selectedStop && transportRoutes) {
      const routesOptions =
        transportRoutes
          ?.filter(({pickup_point_details}) => {
            if (
              pickup_point_details?.find(
                ({pickup_point_id}) => pickup_point_id === selectedStop
              )
            )
              return true
            return false
          })
          ?.map(({_id, name}) => {
            return {
              value: _id,
              label: name,
            }
          }) || []

      setRoutesList(routesOptions)
    }
  }, [selectedStop])

  const handleAssignTransport = () => {
    // Close the modal if old mapping selected
    if (
      passengerDetails?.pickup_point_id === selectedStop &&
      ((!passengerDetails?.route_id && !selectedRoute) ||
        passengerDetails?.route_id === selectedRoute)
    ) {
      setShowModal(false)
      return
    }

    dispatch(
      globalActions?.updateUserWiseTransport?.request(
        [
          {
            iid: passengerDetails.iid,
            pickup_point_id: selectedStop,
            route_id: selectedRoute || '',
          },
        ],
        () => {
          setShowModal(false)
          getTransportData()
        }
      )
    )
    eventManager.send_event(events.ASSIGN_TRANSPORT_CONFIRM_CLICKED_TFI, {
      passenger_id: passengerDetails?.iid,
    })
  }

  const getUserAddress = () => {
    const {c_city, c_line_1, c_line_2, c_pin} = userObj
    return (
      <div>
        {c_line_1 && (
          <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>{c_line_1}</Para>
        )}
        {c_line_2 && (
          <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>{c_line_2}</Para>
        )}
        {(c_city || c_pin) && (
          <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
            {`${c_city} ${c_city && c_pin ? '-' : ''} ${c_pin}`}
          </Para>
        )}
        {!c_line_1 && !c_line_2 && !c_city && !c_pin && <Para>{'-'}</Para>}
      </div>
    )
  }

  const getAlertContent = (route_id) => {
    const selectedRouteObj = transportRoutes?.find(
      (obj) => obj._id === route_id
    )
    return (
      <Para
        type={PARA_CONSTANTS.TYPE.INFO}
        weight={PARA_CONSTANTS.WEIGHT.LIGHT}
      >
        <Trans
          i18nKey="passengerAllocatedToVehicle"
          values={{
            passengerName: userObj?.name || '',
            vehicleType: VEHICLE_OPTIONS?.find(
              (item) => item.value === selectedRouteObj?.vehicle_type
            )?.label?.toLocaleLowerCase(),
            vehicleNumber: selectedRouteObj?.vehicle_number,
          }}
        />
      </Para>
    )
  }

  return (
    <Modal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      header={`${t('assignTransportFor')} ${userObj?.name}`}
      classes={{modal: styles.modal}}
      actionButtons={[
        {
          onClick: handleAssignTransport,
          body: t('confirm'),
          isDisabled: !selectedStop,
        },
      ]}
      size={MODAL_CONSTANTS.SIZE.MEDIUM}
    >
      <PlainCard className={styles.addressCard}>
        <PlainCard className={styles.imgCard}>
          <img src={homeLocationImg} />
        </PlainCard>
        <div className={styles.studentAddress}>
          <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
            {t('passengerAddress')}
          </Heading>
          {getUserAddress()}
        </div>
      </PlainCard>
      <Divider spacing="20px" />
      <div className={styles.bottomWrapper}>
        <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
          {t('assignTransport')}
        </Heading>
        <div className={styles.inputsWrapper}>
          <Input
            type={INPUT_TYPES.DROPDOWN}
            title={t('stopDetail')}
            fieldName="stopName"
            options={stopsList || []}
            selectedOptions={selectedStop}
            shouldOptionsOccupySpace={false}
            onChange={({value}) => {
              setSelectedStop(value)
              setSelectedRoute(null)
            }}
            isSearchable={true}
            placeholder={t('selectStop')}
            isDisabled={!stopsList?.length > 0}
            classes={{optionsClass: styles.optionsClass}}
          />
          <Input
            type={INPUT_TYPES.DROPDOWN}
            title={t('routeDetail')}
            fieldName="section"
            options={routesList || []}
            selectedOptions={selectedRoute}
            shouldOptionsOccupySpace={false}
            isSearchable={true}
            onChange={({value}) => setSelectedRoute(value)}
            placeholder={t('selectRoute')}
            isDisabled={!routesList?.length > 0}
            classes={{optionsClass: styles.optionsClass}}
          />
        </div>
        {selectedRoute && (
          <Alert
            type={ALERT_CONSTANTS.TYPE.INFO}
            content={getAlertContent(selectedRoute)}
            hideClose={true}
          />
        )}
      </div>
    </Modal>
  )
}
