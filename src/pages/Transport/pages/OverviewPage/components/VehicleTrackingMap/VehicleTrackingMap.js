import React from 'react'
import ShowMap from '../../../../utils/components/Gmap/showMap'
import {useState} from 'react'
import styles from './vehicleTrackingMap.module.css'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../../../redux/actions/global.actions'
import {useEffect} from 'react'
import SchoolLocation from '../SchoolLocation/SchoolLocation'
import {Button, BUTTON_CONSTANTS, ICON_CONSTANTS, Icon} from '@teachmint/krayon'

export default function VehicleTrackingMap({
  selectedVehicle,
  setSelectedVehicle,
}) {
  const [markers, setMarkers] = useState([])
  const [showTrackingMap, setShowTrackingMap] = useState(false)
  const [reCenter, setReCenter] = useState(1)

  const schoolTransportSettings = useSelector(
    (state) => state?.globalData?.schoolTransportSettings
  )
  const schoolData = SchoolLocation()
  const transportLiveTracking = useSelector(
    (state) => state?.globalData?.transportLiveTracking
  )

  const [coordinates, setCoordinates] = useState(schoolData.schoolCoordinates)

  const get12hFrom24h = (hrs) => {
    const newHr = hrs % 12
    if (newHr === 0) return '12'
    if (newHr < 10) {
      return `0${newHr}`
    }
    return `${newHr}`
  }

  const dispatch = useDispatch()

  useEffect(() => {
    //Get First Data
    dispatch(globalActions?.transportLiveTracking?.request())
    //Set polling for getting updates
    const interval = setInterval(() => {
      dispatch(globalActions?.transportLiveTracking?.request())
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedVehicle?.latitude && selectedVehicle?.longitude) {
      setCoordinates({
        lat: selectedVehicle.latitude,
        lng: selectedVehicle.longitude,
      })
      setReCenter((val) => val + 1)
    }
  }, [selectedVehicle])

  useEffect(() => {
    liveTrackingMarkers(transportLiveTracking.data)
  }, [transportLiveTracking.data])

  useEffect(() => {
    if (
      schoolTransportSettings?.data?.school_location_details?.latitude &&
      markers?.length
    ) {
      setShowTrackingMap(true)
    }
  }, [schoolTransportSettings.data, transportLiveTracking.data])

  function liveTrackingMarkers(liveTrackingData) {
    let filterGpsVehicles = liveTrackingData?.filter(
      (vehicleInfo) => vehicleInfo.latitude && vehicleInfo.longitude
    )
    let allMarkers = []
    if (filterGpsVehicles?.length) {
      allMarkers = filterGpsVehicles?.map((vehicleInfo) => {
        let tempDate = new Date(vehicleInfo?.last_received_at * 1000)
        return {
          position: {
            lat: vehicleInfo?.latitude,
            lng: vehicleInfo?.longitude,
          },
          customizations: {
            icon: 'https://storage.googleapis.com/tm-assets/icons/colorful/transport-bus.png',
          },
          infoContent: `<div class=${styles.baseInfoCard}>
      <div class="${styles.flexColumn} ${styles.infoCardHeader}">
        <div class=${styles.flexRow}>
          <h1>${vehicleInfo?.number?.substring(
            0,
            2
          )} ${vehicleInfo?.number?.substring(
            2,
            4
          )} ${vehicleInfo?.number?.substring(
            4,
            6
          )} ${vehicleInfo?.number?.substring(6)}</h1>
        </div>
      </div>
      <div class="${styles.flexRow} ${styles.infoCardRow}">
        <div class=${styles.flexRow}>
        <img src="https://storage.googleapis.com/tm-assets/icons/colorful/key.png"/>
          <span>Ignition Status:</span>
        </div>
        <div class="${styles.badgeLike} ${styles.on}">${
            vehicleInfo?.ignition
          }</div>
      </div>
      <div class="${styles.flexRow} ${styles.infoCardRow}">
        <div class=${styles.flexRow}>
        <img src="https://storage.googleapis.com/tm-assets/icons/colorful/car.png"/>
          <span>Motion Status:</span>
        </div>
        <div class="${styles.badgeLike} ${styles.warning}">${
            vehicleInfo?.speed > 0 ? 'Running' : 'Stopped'
          }</div>
      </div>
      <div class="${styles.flexRow} ${styles.infoCardRow}">
        <div class=${styles.flexRow}>
        <img src="https://storage.googleapis.com/tm-assets/icons/colorful/speed.png"/>
          <span>Current Speed:</span>
        </div>
        <div class=${styles.bold}>${vehicleInfo?.speed} Kmph</div>
      </div>
      <div class="${styles.flexRow} ${styles.infoCardRow}">
        Last Updated ${get12hFrom24h(tempDate.getHours())}:${
            tempDate.getMinutes() < 10
              ? `0${tempDate.getMinutes()}`
              : tempDate.getMinutes()
          } ${tempDate.getHours() / 12 >= 1 ? 'PM' : 'AM'}

      </div>
    </div>`,
        }
      })
    }

    allMarkers.push(schoolData.schoolMarker)

    if (allMarkers.length >= 1) {
      setMarkers(allMarkers)
    }
    return null
  }

  return (
    <div className={styles.map}>
      {showTrackingMap && (
        <>
          <ShowMap
            mapCenter={coordinates}
            markers={markers || []}
            showSearch={false}
            showRouteLinesForMarkers={false}
            zoom={14}
            reCenterLocation={schoolData.schoolCoordinates}
            reCenter={reCenter}
          />
          <div className={styles.recenterWrapper}>
            <Button
              type={BUTTON_CONSTANTS.TYPE.FILLED}
              size={BUTTON_CONSTANTS.SIZE.MEDIUM}
              category={BUTTON_CONSTANTS.CATEGORY.PRIMARY}
              className={styles.recenter}
              onClick={() => {
                setReCenter((val) => val + 1)
                setSelectedVehicle(undefined)
              }}
            >
              <Icon
                name={'homeWork'}
                size={ICON_CONSTANTS.SIZES.X_SMALL}
                type={ICON_CONSTANTS.TYPES.BASIC}
              ></Icon>
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
