import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import styles from './VehiclesPage.module.css'
import VehicleFormModal from './components/VehicleFormModal/VehicleFormModal'
import {Button, EmptyState, SearchBar, Para} from '@teachmint/krayon'
import VehicleDetailCard from './components/VehicleDetailCard/VehicleDetailCard'
import {events} from '../../../../utils/EventsConstants'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'

export default function VehiclesPage() {
  const [filteredData, setFilteredData] = useState([])
  const [searchText, setSearchText] = useState('')
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false)

  const {t} = useTranslation()

  const transportVehicles = useSelector(
    (state) => state?.globalData?.transportVehicles?.data
  )
  const {eventManager} = useSelector((state) => state)

  // Filter data based on new redux data
  useEffect(() => {
    getFilteredData(searchText)
  }, [transportVehicles])

  // Filter data based on search text
  const getFilteredData = (value) => {
    let filteredDataList = transportVehicles || []

    if (value) {
      value = value.toLowerCase().trim()
      filteredDataList = filteredDataList?.filter(
        (item) =>
          item?.vehicle_name?.toLowerCase()?.includes(value) ||
          item?.number?.toLowerCase()?.includes(value) ||
          item?.vehicle_type?.toLowerCase()?.includes(value) ||
          item?.route_details?.name?.toLowerCase()?.includes(value)
      )
    }
    setFilteredData(filteredDataList)
  }

  return (
    <div className={styles.wrapper}>
      {transportVehicles?.length > 0 ? (
        <>
          <div className={styles.header}>
            <SearchBar
              value={searchText}
              placeholder={t('vehiclePageSearchPlaceholder')}
              handleChange={({value}) => {
                setSearchText(value)
                getFilteredData(value)
              }}
              classes={{wrapper: styles.searchBar}}
            />
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.transportVehicleController_updateRoute_update
              }
            >
              <Button
                onClick={() => {
                  eventManager.send_event(events.ADD_VEHICLE_CLICKED_TFI, {
                    screen_name: 'vehicles_tab',
                  })
                  setShowAddVehicleModal(true)
                }}
              >
                {t('addVehicle')}
              </Button>
            </Permission>
          </div>

          {filteredData?.length > 0 ? (
            <div className={styles.listWrapper}>
              {filteredData.map((obj) => (
                <VehicleDetailCard key={obj._id} data={obj} />
              ))}
            </div>
          ) : (
            <EmptyState
              iconName="search"
              content={t('noSearchResultFound')}
              classes={{
                wrapper: styles.emptyStateWrapper,
                iconFrame: styles.emptyStateIconFrame,
              }}
              button={null}
            />
          )}
        </>
      ) : (
        <EmptyState
          iconName="bus1"
          content={
            <Para>
              {t('emptyVehicleListDesc')}
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.transportVehicleController_updateRoute_update
                }
              >
                <Button
                  onClick={() => {
                    eventManager.send_event(events.ADD_VEHICLE_CLICKED_TFI, {
                      screen_name: 'vehicles_tab',
                    })
                    setShowAddVehicleModal(true)
                  }}
                  classes={{button: styles.buttonWrapper}}
                >
                  {t('addVehicle')}
                </Button>
              </Permission>
            </Para>
          }
          button={null}
          classes={{
            wrapper: styles.emptyStateWrapper,
            iconFrame: styles.emptyStateIconFrame,
          }}
        />
      )}

      {showAddVehicleModal && (
        <VehicleFormModal
          showModal={showAddVehicleModal}
          setShowModal={setShowAddVehicleModal}
        />
      )}
    </div>
  )
}
