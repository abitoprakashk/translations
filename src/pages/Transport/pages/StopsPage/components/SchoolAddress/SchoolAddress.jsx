import {
  Icon,
  IconFrame,
  ICON_CONSTANTS,
  KebabMenu,
  PlainCard,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import React from 'react'
import {useTranslation} from 'react-i18next'
import styles from './SchoolAddress.module.css'
import placeholderImage from '../../../../assets/images/address-empty-state.png'
import {useSelector} from 'react-redux'
import {useState} from 'react'
import ShowMap from '../../../../utils/components/Gmap/showMap'
import SchoolLocation from '../../../OverviewPage/components/SchoolLocation/SchoolLocation'
import {events} from '../../../../../../utils/EventsConstants'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'
import Permission from '../../../../../../components/Common/Permission/Permission'
import {checkPermission} from '../../../../../../utils/Permssions'
import SchoolAddressModal from '../SchoolAddressModal/SchoolAddressModal'
import {SCHOOL_ADDRESS_MAP_STYLING} from '../../../../utils/components/Gmap/MapStylingConstansts'

export default function SchoolAddress() {
  const {t} = useTranslation()
  const {globalData, eventManager} = useSelector((state) => state)
  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false)

  const [mapZoom, setMapZoom] = useState(12)
  const schoolTransportSettings = globalData?.schoolTransportSettings
  const schoolData = SchoolLocation()

  const userRolePermission = useSelector(
    (state) => state.globalData?.userRolePermission
  )

  const getMarkersForStops = () => {
    let markers =
      globalData?.transportStops?.data?.map((stop) => {
        if (stop?.distance > 20) {
          setMapZoom(11)
        }
        if (stop?.distance > 40) {
          setMapZoom(10)
        }
        return {
          position: {lat: stop.latitude, lng: stop.longitude},
          customizations: {
            icon: 'https://storage.googleapis.com/tm-assets/icons/colorful/transport-stops.svg',
            title: `${stop.name} | ${stop.distance} km`,
          },
          infoContent: 'HIDE_INFO_CONTENT',
        }
      }) || []

    markers.push(schoolData?.schoolMarker)
    return markers
  }

  const EmptyState = () => (
    <PlainCard
      className={styles.emptyCard}
      style={{backgroundImage: `url(${placeholderImage})`}}
    >
      <IconFrame
        className={styles.iconFrame}
        onClick={() => {
          setShowAddSchoolModal(true)
          eventManager.send_event(events.SETUP_SCHOOL_ADDRESS_CLICKED_TFI, {
            edit: 'no',
          })
        }}
      >
        <Icon type={ICON_CONSTANTS.TYPES.INVERTED} name="institute" />
      </IconFrame>
      <Permission
        permissionId={
          PERMISSION_CONSTANTS.transportSettingsController_updateSchoolAddress_update
        }
      >
        <Para
          type={PARA_CONSTANTS.TYPE.PRIMARY}
          onClick={() => {
            setShowAddSchoolModal(true)
            eventManager.send_event(events.SETUP_SCHOOL_ADDRESS_CLICKED_TFI, {
              edit: 'no',
            })
          }}
          className={styles.addAddressActionButton}
        >
          {t('addSchoolAddress')}
        </Para>
      </Permission>
    </PlainCard>
  )

  const AddedState = () => (
    <PlainCard className={styles.addedAddressCard}>
      <ShowMap
        showSearch={false}
        markers={getMarkersForStops()}
        zoom={mapZoom}
        mapCenter={schoolData.schoolCoordinates}
        showRouteLinesForMarkers={false}
        mapStyling={SCHOOL_ADDRESS_MAP_STYLING}
      />
      {checkPermission(
        userRolePermission,
        PERMISSION_CONSTANTS.transportSettingsController_updateSchoolAddress_update
      ) && (
        <KebabMenu
          options={[
            {
              content: (
                <div
                  className={styles.menuItem}
                  onClick={() => {
                    setShowAddSchoolModal(true)
                    eventManager.send_event(
                      events.SETUP_SCHOOL_ADDRESS_CLICKED_TFI,
                      {
                        edit: 'yes',
                      }
                    )
                  }}
                >
                  <Icon
                    size={ICON_CONSTANTS.SIZES.X_SMALL}
                    name="edit1"
                    version={ICON_CONSTANTS.VERSION.OUTLINED}
                  />
                  {t('edit')}
                </div>
              ),
              handleClick: () => {},
            },
          ]}
          isVertical={true}
          classes={{
            iconFrame: styles.kebabMenuIconFrame,
            wrapper: styles.kebabMenuWrapper,
            content: styles.contentWrapper,
          }}
        />
      )}
    </PlainCard>
  )

  return (
    <div>
      {schoolTransportSettings?.data?.is_school_address_set &&
      !showAddSchoolModal ? (
        <AddedState />
      ) : (
        <EmptyState />
      )}

      <SchoolAddressModal
        showModal={showAddSchoolModal}
        setShowModal={setShowAddSchoolModal}
      />
    </div>
  )
}
