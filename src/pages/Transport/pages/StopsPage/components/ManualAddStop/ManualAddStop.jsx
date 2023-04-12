import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {
  alphaNumericRegex,
  floatingRegex,
} from '../../../../../../utils/Validations'
import {
  Input,
  INPUT_TYPES,
  BUTTON_CONSTANTS,
  Button,
  Icon,
  ICON_CONSTANTS,
  Tooltip,
  Alert,
  ALERT_CONSTANTS,
  TOOLTIP_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  RequiredSymbol,
} from '@teachmint/krayon'
import ShowMap from '../../../../utils/components/Gmap/showMap'
import styles from './ManualAddStop.module.css'
import SchoolLocation from '../../../OverviewPage/components/SchoolLocation/SchoolLocation'
import {ADD_STOP_MAP_STYLING} from '../../../../utils/components/Gmap/MapStylingConstansts'
import {createDefaultDraggableMarker} from '../../../../utils/components/Gmap/markers'
import {LATITUDE_DELTA_FOR_ADD_STOP} from '../../constants'

export default function ManualAddStop({stopData, setStopData}) {
  const {t} = useTranslation()
  const schoolLocationData = SchoolLocation()
  const [reCenter, setReCenter] = useState(1)
  const [mapCenter, setMapCenter] = useState({})
  const [mapMarkers, setMapMarkers] = useState([])
  const [mapSearchValue, setMapSearchValue] = useState(stopData?.address || '')

  const getLocationNearbySchool = () => {
    let {lat, lng} = schoolLocationData.schoolCoordinates
    const latitudeDelta = LATITUDE_DELTA_FOR_ADD_STOP
    if (lat > latitudeDelta - 90) {
      lat = lat - latitudeDelta
    } else {
      lat = lat + latitudeDelta
    }
    return {lat, lng}
  }

  const putMapMarkers = (data) => {
    let markers = []
    markers.push(schoolLocationData?.schoolMarker)
    let stopMarkerData = {
      position: data?.latitude
        ? {lat: data?.latitude, lng: data?.longitude}
        : getLocationNearbySchool(),
      title: data.name,
      infoContent: data?.name ? `${data.name} | ${data.distance}km` : '',
    }
    markers.push(createDefaultDraggableMarker(stopMarkerData))
    setMapMarkers(markers)
  }

  useEffect(() => {
    if (stopData?._id) sessionStorage.setItem('stopId', stopData._id)
    sessionStorage.setItem('stopName', stopData.name)
    putMapMarkers(stopData)
    setMapCenter(
      stopData?.latitude
        ? {lat: stopData?.latitude, lng: stopData.longitude}
        : schoolLocationData.schoolCoordinates
    )
  }, [])

  const updateStopData = (fieldName, value) => {
    let stopDataTemp = {...stopData}
    stopDataTemp[fieldName] = value
    setStopData(stopDataTemp)
  }

  function handleSearchPlaceSelect(place, distance) {
    let tempStopData = {}
    tempStopData.name =
      sessionStorage.getItem('stopName') ||
      place[0].name
        .split('')
        .filter((val) => alphaNumericRegex(val))
        .join('')
    tempStopData.name =
      tempStopData.name.length > 50
        ? tempStopData.name.slice(0, 49)
        : tempStopData.name
    tempStopData.latitude = place[0].geometry.location.lat()
    tempStopData.longitude = place[0].geometry.location.lng()
    if (distance) {
      tempStopData.distance = distance.value / 1000
    }
    tempStopData.address = place[0].formatted_address
    setMapSearchValue(place[0].formatted_address)
    setStopData(tempStopData)
    putMapMarkers(tempStopData)
    setMapCenter({lat: tempStopData?.latitude, lng: tempStopData.longitude})
  }

  function handleMarkerDrag(place, distance, destinationStopAddress) {
    let tempStopData = {}
    tempStopData.name =
      sessionStorage.getItem('stopName') ||
      destinationStopAddress
        .split('')
        .filter((val) => alphaNumericRegex(val))
        .join('')
        .slice(0, 50)
    tempStopData.address = destinationStopAddress

    tempStopData.latitude = place.lat
    tempStopData.longitude = place.lng
    if (distance && distance.value) {
      tempStopData.distance = distance.value / 1000
    }
    setStopData(tempStopData)
    putMapMarkers(tempStopData)
    setMapSearchValue(destinationStopAddress)
    setMapCenter({lat: tempStopData?.latitude, lng: tempStopData.longitude})
  }

  const handleInputChange = ({fieldName, value}) => {
    switch (fieldName) {
      case 'name':
        if (!alphaNumericRegex(value)) return

        sessionStorage.setItem('stopName', value)
        break
      case 'distance':
        if (!floatingRegex(value)) return

        break
      default:
        break
    }

    updateStopData(fieldName, value)
  }

  const handleSearch = (e) => {
    setMapSearchValue(e.currentTarget.value)
  }

  const distanceInputTitle = (
    <div className={styles.distanceInputTitle}>
      <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>{t('distance')}</Para>
      <RequiredSymbol />
      <span
        data-tip
        data-for="extraInfo"
        className={styles.distanceTitleIconWrapper}
      >
        <Icon
          name="info"
          version={ICON_CONSTANTS.VERSION.OUTLINED}
          type={ICON_CONSTANTS.TYPES.SECONDARY}
          size={ICON_CONSTANTS.SIZES.XXX_SMALL}
        />
      </span>
      <Tooltip
        toolTipId="extraInfo"
        place={TOOLTIP_CONSTANTS.TOOLTIP_POSITIONS.LEFT}
        toolTipBody={t('distanceFromSchool')}
        classNames={{toolTipBody: styles.routeTooltipBody}}
      ></Tooltip>
    </div>
  )

  return (
    <div className={styles.mapWrapper}>
      <div>
        <div
          data-tip
          data-for="add-stop-info"
          className={styles.routeHeaderIconWrapper}
        >
          <Alert
            type={ALERT_CONSTANTS.TYPE.INFO}
            content={t('addStopAlertContent')}
            hideClose={true}
          />
        </div>
        <Tooltip
          toolTipId="add-stop-info"
          place={TOOLTIP_CONSTANTS.TOOLTIP_POSITIONS.BOTTOM}
          toolTipBody={t('addStopAlertTooltipContent')}
          classNames={{toolTipBody: styles.routeTooltipBody}}
        ></Tooltip>
      </div>
      <div className={styles.map}>
        {
          <>
            <Button
              type={BUTTON_CONSTANTS.TYPE.FILLED}
              size={BUTTON_CONSTANTS.SIZE.MEDIUM}
              category={BUTTON_CONSTANTS.CATEGORY.PRIMARY}
              className={styles.recenter}
              onClick={() => {
                setReCenter((val) => val + 1)
                setMapCenter(schoolLocationData.schoolCoordinates)
              }}
            >
              <Icon
                name={'homeWork'}
                size={ICON_CONSTANTS.SIZES.X_SMALL}
                type={ICON_CONSTANTS.TYPES.BASIC}
              ></Icon>
            </Button>

            <ShowMap
              handleSearchPlaceSelect={handleSearchPlaceSelect}
              handleSearch={handleSearch}
              searchValue={mapSearchValue}
              getDistance={true}
              extraDataForSearch={stopData}
              handleMarkerDrag={handleMarkerDrag}
              origin={schoolLocationData.schoolCoordinates}
              showRouteLinesForMarkers={false}
              markers={mapMarkers}
              mapCenter={mapCenter}
              reCenterLocation={schoolLocationData.schoolCoordinates}
              reCenter={reCenter}
              mapStyling={ADD_STOP_MAP_STYLING}
              searchPlaceHolder={t('addStopMapSearchPlaceholder')}
            />
          </>
        }
      </div>
      <div className={styles.inputWrapper}>
        <Input
          type={INPUT_TYPES.TEXT}
          title={t('stopName')}
          fieldName="name"
          value={stopData?.name}
          onChange={handleInputChange}
          isRequired={true}
          placeholder={t('stopNamePlaceHolder')}
          showMsg={true}
          maxLength={50}
        />
        <Input
          type={INPUT_TYPES.TEXT}
          title={distanceInputTitle}
          fieldName="distance"
          value={stopData?.distance}
          onChange={handleInputChange}
          placeholder={t('distancePlaceHolder')}
          suffix={t('km')}
          showMsg={stopData?.distance ? false : true}
          classes={{wrapper: styles.distanceInput}}
        />
      </div>
    </div>
  )
}
