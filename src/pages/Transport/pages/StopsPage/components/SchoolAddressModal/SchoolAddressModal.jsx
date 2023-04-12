import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {useEffect, useState} from 'react'
import styles from './schoolAddressModal.module.css'
import {
  BUTTON_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
} from '@teachmint/krayon'
import globalActions from '../../../../../../redux/actions/global.actions'
import {events} from '../../../../../../utils/EventsConstants'
import SchoolLocation from '../../../OverviewPage/components/SchoolLocation/SchoolLocation'
import ShowMap from '../../../../utils/components/Gmap/showMap'
import {ADD_STOP_MAP_STYLING} from '../../../../utils/components/Gmap/MapStylingConstansts'
import {createDefaultDraggableMarker} from '../../../../utils/components/Gmap/markers'

export default function SchoolAddressModal({showModal, setShowModal}) {
  if (!showModal) return null

  const [apiPayload, setApiPayload] = useState({})
  const [disableConfirmSchoolButton, setDisableConfirmSchoolButton] =
    useState(true)
  const [mapMarkers, setMapMarkers] = useState([])
  const [mapCenter, setMapCenter] = useState({})
  const [mapSearchValue, setMapSearchValue] = useState('')

  const {t} = useTranslation()
  const dispatch = useDispatch()

  const {globalData, eventManager} = useSelector((state) => state)

  const schoolTransportSettings = globalData?.schoolTransportSettings
  const schoolData = SchoolLocation()

  const putMapMarkers = (data) => {
    let markerData = {
      position: data?.latitude
        ? {lat: data?.latitude, lng: data?.longitude}
        : {lat: 12.919311968882369, lng: 77.66817485683069},
      title: schoolTransportSettings?.data?.school_location_details?.name || '',
      infoContent:
        schoolTransportSettings?.data?.school_location_details?.name || '',
    }
    setMapMarkers([createDefaultDraggableMarker(markerData)])
  }

  useEffect(() => {
    putMapMarkers(schoolTransportSettings?.data?.school_location_details || {})
    setMapCenter(schoolData.schoolCoordinates)
  }, [])

  const handleSearchPlaceSelect = (place) => {
    let tempApiData = {}
    tempApiData.latitude = place[0].geometry.location.lat()
    tempApiData.longitude = place[0].geometry.location.lng()
    tempApiData.address = place[0].formatted_address
    setMapSearchValue(place[0].formatted_address)
    setApiPayload(tempApiData)
    putMapMarkers(tempApiData)
    setMapCenter({lat: tempApiData?.latitude, lng: tempApiData.longitude})
    setDisableConfirmSchoolButton(false)
  }

  const handleMarkerDrag = (place, distance, destinationStopAddress) => {
    let tempApiData = {...apiPayload}
    tempApiData.latitude = place.lat
    tempApiData.longitude = place.lng
    tempApiData.address = destinationStopAddress
    putMapMarkers(tempApiData)
    setMapCenter({lat: tempApiData?.latitude, lng: tempApiData?.longitude})
    setApiPayload(tempApiData)
    setMapSearchValue(destinationStopAddress)
    setDisableConfirmSchoolButton(false)
  }

  const handleSearch = (e) => {
    setMapSearchValue(e.currentTarget.value)
  }

  const handleConfirm = () => {
    dispatch(
      globalActions?.updateSchoolLocation?.request(apiPayload, () => {
        setShowModal(false)
        eventManager.send_event(events.SCHOOL_ADDRESS_ADDED_TFI)
      })
    )
  }

  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false)
      }}
      size={MODAL_CONSTANTS.SIZE.SMALL}
      headerIcon={
        <Icon
          size={ICON_CONSTANTS.SIZES.SMALL}
          name="gpsNotFixed"
          type={ICON_CONSTANTS.TYPES.BASIC}
        />
      }
      classes={{
        content: styles.schoolAddContentWrapper,
        modal: styles.addAddressModal,
      }}
      header={
        schoolTransportSettings?.data?.is_school_address_set
          ? t('editSchoolLocation')
          : t('setSchoolLocation')
      }
      actionButtons={[
        {
          onClick: handleConfirm,
          body: 'Confirm',
          isDisabled: disableConfirmSchoolButton,
          type: BUTTON_CONSTANTS.TYPE.FILLED,
        },
      ]}
    >
      <ShowMap
        handleSearchPlaceSelect={handleSearchPlaceSelect}
        handleSearch={handleSearch}
        handleMarkerDrag={handleMarkerDrag}
        searchValue={mapSearchValue}
        mapCenter={mapCenter}
        markers={mapMarkers}
        searchPlaceHolder={t('addStopMapSearchPlaceholder')}
        mapStyling={ADD_STOP_MAP_STYLING}
        showSearch={true}
        getDistance={true}
      />
    </Modal>
  )
}
