import {
  Icon,
  Input,
  INPUT_TYPES,
  Modal,
  MODAL_CONSTANTS,
  PlainCard,
} from '@teachmint/krayon'
import {t} from 'i18next'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {INSTITUTE_MEMBER_TYPE} from '../../../../constants/institute.constants'
import {
  showErrorOccuredAction,
  showLoadingAction,
} from '../../../../redux/actions/commonAction'
import globalActions from '../../../../redux/actions/global.actions'
import {
  instituteStudentListAction,
  studentListLoadingAction,
} from '../../../../redux/actions/instituteInfoActions'
import {utilsGetUsersList} from '../../../../routes/dashboard'
import styles from './AssignTransportModal.module.css'

export default function AssignTransportModal({
  showModal,
  setShowModal,
  studentId,
  transportData,
  getTransportData,
  currentPickupPointId,
  currentRouteId,
}) {
  const [selectedStop, setSelectedStop] = useState(null)
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [stopsList, setStopsList] = useState([])
  const [routesList, setRoutesList] = useState([])

  const dispatch = useDispatch()
  const transportStops = useSelector(
    (state) => state?.globalData?.transportStops?.data
  )
  const transportRoutes = useSelector(
    (state) => state?.globalData?.transportRoutes?.data
  )

  useEffect(() => {
    dispatch(globalActions?.transportStops?.request())
    dispatch(globalActions?.transportRoutes?.request())
  }, [])

  useEffect(() => {
    if (currentPickupPointId) setSelectedStop(currentPickupPointId)
    if (currentRouteId) setSelectedRoute(currentRouteId)
  }, [currentPickupPointId, currentRouteId])

  // Set Stops Options
  useEffect(() => {
    if (transportStops) {
      const stopsOptions =
        transportStops?.map(({_id, name}) => {
          return {value: _id, label: name}
        }) || []

      setStopsList(stopsOptions)
      if (!stopsOptions?.find(({value}) => value === currentPickupPointId))
        setSelectedStop(null)
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
            return {value: _id, label: name}
          }) || []

      setRoutesList(routesOptions)

      if (!routesOptions?.find(({value}) => value === currentRouteId))
        setSelectedRoute(null)
    }
  }, [selectedStop])

  const getStudentList = () => {
    dispatch(showLoadingAction(true))
    utilsGetUsersList({type: [INSTITUTE_MEMBER_TYPE.STUDENT]})
      .then(({status, obj}) => {
        dispatch(studentListLoadingAction(false))
        if (status) dispatch(instituteStudentListAction(obj))
      })
      .catch(() => dispatch(showErrorOccuredAction(true)))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const handleAssignTransport = () => {
    // Close the modal if old mapping selected
    if (
      transportData?.pickup_point?._id === selectedStop &&
      transportData?.route?._id === selectedRoute
    )
      setShowModal(false)

    dispatch(
      globalActions?.updateUserWiseTransport?.request(
        [
          {
            iid: studentId,
            pickup_point_id: selectedStop,
            route_id: selectedRoute,
          },
        ],
        () => {
          getTransportData()
          getStudentList()
          setShowModal(false)
        }
      )
    )
  }

  return (
    <Modal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      header={t('assignTransport')}
      headerIcon={<Icon name="bus1" />}
      classes={{modal: styles.modal}}
      actionButtons={[
        {
          onClick: handleAssignTransport,
          body: t('save'),
          isDisabled:
            !selectedStop ||
            !selectedRoute ||
            (currentPickupPointId === selectedStop &&
              currentRouteId === selectedRoute),
        },
      ]}
      size={MODAL_CONSTANTS.SIZE.SMALL}
    >
      <PlainCard className={styles.inputCard}>
        <Input
          type={INPUT_TYPES.DROPDOWN}
          isRequired={true}
          title={t('stopDetail')}
          fieldName="stopName"
          options={stopsList || []}
          selectedOptions={selectedStop}
          shouldOptionsOccupySpace={false}
          onChange={({value}) => setSelectedStop(value)}
          placeholder={t('selectStop')}
          isDisabled={!stopsList?.length > 0}
          classes={{optionsClass: styles.optionsClass}}
        />

        <Input
          type={INPUT_TYPES.DROPDOWN}
          isRequired={true}
          title={t('routeDetail')}
          fieldName="section"
          options={routesList || []}
          selectedOptions={selectedRoute}
          shouldOptionsOccupySpace={false}
          onChange={({value}) => setSelectedRoute(value)}
          placeholder={t('selectRoute')}
          isDisabled={!routesList?.length > 0}
          classes={{
            optionsClass: styles.optionsClass,
            dropdownClass:
              routesList?.length > 0 ? '' : styles.dropdownClassDisabled,
          }}
        />
      </PlainCard>
    </Modal>
  )
}
