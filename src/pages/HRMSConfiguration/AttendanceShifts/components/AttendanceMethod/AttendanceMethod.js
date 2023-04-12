import {useSelector} from 'react-redux'
import {t} from 'i18next'
import produce from 'immer'
import {useMemo, useState} from 'react'
import styles from './AttendanceMethod.module.css'
import {debounce} from '../../../../../utils/Helpers'
import classNames from 'classnames'
import {
  Button,
  BUTTON_CONSTANTS,
  Heading,
  HEADING_CONSTANTS,
  IconFrame,
  Icon,
  ICON_CONSTANTS,
  PARA_CONSTANTS,
  Para,
  Badges,
  BADGES_CONSTANTS,
  Divider,
  Alert,
  ALERT_CONSTANTS,
  RangeSlider,
  PlainCard,
  Tooltip,
  TOOLTIP_CONSTANTS,
} from '@teachmint/krayon'
import ShowMap from '../../../../Transport/utils/components/Gmap/showMap'
import {
  ATTENDANCE_METHOD,
  defaultLocation,
  minimumGeoFenceRadius,
} from '../../constants/shift.constants'
import CustomTooltip from '../CustomTooltip/CustomTooltip'
import {ADD_STOP_MAP_STYLING} from '../../../../Transport/utils/components/Gmap/MapStylingConstansts'

const ATTENDANCE_METHOD_OPTIONS = {
  [ATTENDANCE_METHOD.GEOFENCE]: {
    id: ATTENDANCE_METHOD.GEOFENCE,
    label: t('geofenceAttendance'),
    badge: t('recommendedAttendanceMethod'),
    styleClass: 'geofence',
    tooltip: (
      <CustomTooltip
        type={ATTENDANCE_METHOD.GEOFENCE}
        header={t('geofenceTooltipInfoHeader')}
        text={t('geofenceTooltipInfoText')}
        subHeader={t('geofencePros')}
        subTextList={[t('geofencePro1'), t('geofencePro2'), t('geofencePro3')]}
      />
    ),
    icon: 'gpsNotFixed',
    isDisabled: false,
  },
  [ATTENDANCE_METHOD.BIOMETRIC]: {
    id: ATTENDANCE_METHOD.BIOMETRIC,
    label: t('biometricAttendance'),
    styleClass: 'biometric',
    tooltip: (
      <CustomTooltip
        type={ATTENDANCE_METHOD.BIOMETRIC}
        header={t('biometricTooltipInfoHeader')}
        text={t('biometricTooltipInfoText')}
      />
    ),
    icon: 'fingerprint',
    isDisabled: false,
  },
}

export default function AttendanceMethod({shiftInfo, setShiftInfo}) {
  const instituteInfo = useSelector((state) => state.instituteInfo)
  const [selectedMethod, setSelectedMethod] = useState(
    shiftInfo?.setting?.attendance_method
  )
  const biometricMachineList = useSelector(
    (state) => state.globalData.fetchBiometricMachinesList?.data
  )
  const [reCenter, setRecenter] = useState(1)
  const [mapSearchText, setMapSearchText] = useState(
    shiftInfo?.setting?.location?.address || ''
  )

  const getCoordinates = () => {
    return {
      lat: shiftInfo?.setting?.location?.latitude || 12.919311968882369,
      lng: shiftInfo?.setting?.location?.longitude || 77.66817485683069,
    }
  }

  const onSelectRange = ({selectedMax}) => {
    const updatedShift = produce(shiftInfo, (draftState) => {
      draftState.setting.location.geofence_radius = selectedMax
    })
    setShiftInfo(updatedShift)
  }

  const debouncedSelectRange = debounce(onSelectRange, 200)

  const handleSearchPlaceSelect = (place) => {
    handleLocationChange(
      place[0].geometry.location.lat(),
      place[0].geometry.location.lng(),
      place[0].formatted_address
    )
  }

  const handleSearch = (e) => {
    setMapSearchText(e.currentTarget.value)
  }

  const handleMarkerDrag = (place, distance, address) => {
    handleLocationChange(place.lat, place.lng, address)
  }

  const handleLocationChange = (latitude, longitude, address) => {
    setMapSearchText(address)
    const updatedShift = produce(shiftInfo, (draftState) => {
      draftState.setting.location.latitude = latitude
      draftState.setting.location.longitude = longitude
      draftState.setting.location.address = address
    })
    setShiftInfo(updatedShift)
  }

  const handleChangeAttendanceMethod = (id) => {
    if (!ATTENDANCE_METHOD_OPTIONS[ATTENDANCE_METHOD[id]].isDisabled) {
      const updatedShift = produce(shiftInfo, (draftState) => {
        draftState.setting.attendance_method = id
        if (id === ATTENDANCE_METHOD.BIOMETRIC) {
          draftState.setting.location = null
        } else {
          setMapSearchText(defaultLocation.address)
          draftState.setting.location = defaultLocation
        }
      })
      setShiftInfo(updatedShift)
      setSelectedMethod(id)
    }
  }

  const getMarkers = () => {
    let markers = shiftInfo?.setting?.location?.latitude
      ? [
          {
            position: getCoordinates(),
            customizations: {
              title: `${instituteInfo?.name}`,
              draggable: true,
            },
            infoContent: 'HIDE_INFO_CONTENT',
          },
        ]
      : []
    return markers
  }

  const markers = useMemo(() => {
    return getMarkers()
  }, [
    shiftInfo?.setting?.location?.latitude,
    shiftInfo?.setting?.location?.longitude,
  ])

  const getShapes = () => {
    let shapes = shiftInfo?.setting?.location?.latitude
      ? [
          {
            type: 'circle',
            radius: shiftInfo?.setting?.location?.geofence_radius,
            center: {
              lat: shiftInfo?.setting?.location?.latitude,
              lng: shiftInfo?.setting?.location?.longitude,
            },
          },
        ]
      : []
    return shapes
  }

  const shapes = useMemo(() => {
    return getShapes()
  }, [
    shiftInfo?.setting?.location?.geofence_radius,
    shiftInfo?.setting?.location?.latitude,
    shiftInfo?.setting?.location?.longitude,
  ])

  return (
    <div className={styles.attendanceMethodWrapper}>
      <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.SMALL}>
        {t('chooseAnAttendanceMethod')}
      </Heading>
      <div className={styles.optionsWrapper}>
        {Object.values(ATTENDANCE_METHOD_OPTIONS).map((option) => {
          return (
            <div
              key={option.id}
              className={classNames(
                styles.attendanceOption,
                selectedMethod === option.id ? styles.optionSelected : '',
                option.isDisabled ? styles.isDisabled : ''
              )}
              onClick={() => handleChangeAttendanceMethod(option.id)}
            >
              <IconFrame
                className={classNames(
                  styles.iconFrameWrapper,
                  styles[option.styleClass]
                )}
              >
                <Icon
                  name={option.icon}
                  type={ICON_CONSTANTS.TYPES.INVERTED}
                  size={ICON_CONSTANTS.SIZES.X_SMALL}
                />
              </IconFrame>
              <div>
                <div className={styles.tooltipWrapper}>
                  <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
                    {option.label}
                  </Para>
                  {option?.tooltip && (
                    <span
                      data-tip
                      data-for={option.id}
                      className={styles.tooltipIcon}
                    >
                      <Icon
                        name="info"
                        size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                        type={ICON_CONSTANTS.TYPES.SECONDARY}
                        version={ICON_CONSTANTS.VERSION.OUTLINED}
                      />
                      <Tooltip
                        toolTipId={option.id}
                        toolTipBody={option?.tooltip}
                        place={TOOLTIP_CONSTANTS.TOOLTIP_POSITIONS.BOTTOM}
                        effect={TOOLTIP_CONSTANTS.TOOLTIP_EFFECTS.SOLID}
                      />
                    </span>
                  )}
                </div>
                {option.badge && (
                  <Badges
                    label={option.badge}
                    showIcon={false}
                    type={BADGES_CONSTANTS.TYPE.PRIMARY}
                    size={BADGES_CONSTANTS.SIZE.SMALL}
                    className={styles.badge}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
      <Divider spacing={0} />
      {selectedMethod === ATTENDANCE_METHOD.BIOMETRIC ? (
        biometricMachineList.length === 0 ? (
          <Alert
            content={t('biometricDeviceSetupAlert')}
            type={ALERT_CONSTANTS.TYPE.INFO}
            hideClose
            className={styles.biometricAlert}
          />
        ) : null
      ) : !ATTENDANCE_METHOD_OPTIONS[selectedMethod].isDisabled ? (
        <div>
          <PlainCard className={styles.gMapWrapper}>
            <div className={styles.recenterWrapper}>
              <Button
                type={BUTTON_CONSTANTS.TYPE.FILLED}
                size={BUTTON_CONSTANTS.SIZE.MEDIUM}
                category={BUTTON_CONSTANTS.CATEGORY.PRIMARY}
                className={styles.recenter}
                onClick={() => setRecenter((val) => val + 1)}
              >
                <Icon
                  name={'gpsNotFixed'}
                  size={ICON_CONSTANTS.SIZES.X_SMALL}
                  type={ICON_CONSTANTS.TYPES.SECONDARY}
                ></Icon>
              </Button>
            </div>
            <ShowMap
              handleSearch={handleSearch}
              handleSearchPlaceSelect={handleSearchPlaceSelect}
              handleMarkerDrag={handleMarkerDrag}
              origin={getCoordinates()}
              mapCenter={getCoordinates()}
              markers={markers}
              searchPlaceHolder={t('searchSchoolLocationPalceholder')}
              getDistance={true}
              searchValue={mapSearchText}
              reCenterLocation={getCoordinates()}
              reCenter={reCenter}
              shapes={shapes}
              mapStyling={ADD_STOP_MAP_STYLING}
            />
          </PlainCard>
          <RangeSlider
            min={minimumGeoFenceRadius}
            preSelectedMin={minimumGeoFenceRadius}
            preSelectedMax={shiftInfo?.setting?.location?.geofence_radius}
            max={1000}
            label={t('radiusInMeters')}
            onChange={debouncedSelectRange}
            classes={{
              label: styles.radiusLabel,
            }}
          />
        </div>
      ) : null}
    </div>
  )
}
