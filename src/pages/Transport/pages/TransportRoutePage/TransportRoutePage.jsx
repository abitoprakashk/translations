import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import styles from './TransportRoutePage.module.css'
import RouteFormModal from './components/RouteFormModal/RouteFormModal'
import {Button, EmptyState, SearchBar, Para} from '@teachmint/krayon'
import RouteDetailCard from './components/RouteDetailCard/RouteDetailCard'
import UsersListModal from './components/UsersListModal/UsersListModal'
import RouteScheduleModal from './components/RouteScheduleModal/RouteScheduleModal'
import {events} from '../../../../utils/EventsConstants'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'

export default function TransportRoutePage() {
  const [filteredData, setFilteredData] = useState([])
  const [searchText, setSearchText] = useState('')
  const [showAddRouteModal, setShowAddRouteModal] = useState(false)
  const [showPassengersListModal, setShowPassengersListModal] = useState(false)
  const [showRouteScheduleModal, setShowRouteScheduleModal] = useState(false)
  const [selectedRouteData, setSeletectRouteData] = useState(null)

  const {t} = useTranslation()

  // Get Data from Redux
  const transportRoutes = useSelector(
    (state) => state?.globalData?.transportRoutes?.data
  )
  const {eventManager} = useSelector((state) => state)

  // Filter data based on new redux data
  useEffect(() => {
    getFilteredData(searchText)
  }, [transportRoutes])

  // Filter data based on search text
  const getFilteredData = (value) => {
    let filteredDataList = transportRoutes || []

    if (value) {
      value = value.toLowerCase()
      filteredDataList = filteredDataList?.filter(
        (item) =>
          item?.name?.toLowerCase()?.includes(value) ||
          item?.vehicle_number?.toLowerCase()?.includes(value)
      )
    }
    setFilteredData(filteredDataList)
  }

  const handleViewScheduleClick = (data) => {
    setShowRouteScheduleModal(true)
    setSeletectRouteData(data)
  }

  const handlePassengersClick = (data) => {
    setShowPassengersListModal(true)
    setSeletectRouteData(data)
  }

  const getSelectedRoutePassengersIds = () => {
    let passengers = []
    selectedRouteData?.pickup_point_details?.forEach((item) => {
      passengers = [...passengers, ...(item.passenger_ids || [])]
    })
    return passengers
  }

  const onPassengersModalClose = () => {
    setSeletectRouteData(null)
    setShowPassengersListModal(false)
  }

  const onRouteScheduleModalClose = () => {
    setSeletectRouteData(null)
    setShowRouteScheduleModal(false)
  }

  const onPassengersDownloadClick = () => {
    eventManager.send_event(events.DOWNLOAD_PASSENGERS_CLICKED_TFI, {
      screen_name: 'passengers_route',
    })
  }

  return (
    <div className={styles.wrapper}>
      {transportRoutes?.length > 0 ? (
        <>
          <div className={styles.header}>
            <SearchBar
              value={searchText}
              placeholder={t('routePageSearchPlaceholder')}
              handleChange={({value}) => {
                setSearchText(value)
                getFilteredData(value)
              }}
              classes={{wrapper: styles.searchBar}}
            />
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.transportRouteController_updateRoute_update
              }
            >
              <Button
                onClick={() => {
                  eventManager.send_event(events.ADD_ROUTE_CLICKED_TFI, {
                    screen_name: 'routes_tab',
                  })
                  setShowAddRouteModal(true)
                }}
              >
                {t('createRoute')}
              </Button>
            </Permission>
          </div>

          {filteredData?.length > 0 ? (
            <div className={styles.listWrapper}>
              {filteredData.map((obj) => (
                <RouteDetailCard
                  key={obj._id}
                  data={obj}
                  handlePassengersClick={handlePassengersClick}
                  handleViewScheduleClick={handleViewScheduleClick}
                />
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
          iconName="swapCalls"
          content={
            <Para>
              {t('emptyRouteListDesc')}
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.transportRouteController_updateRoute_update
                }
              >
                <Button
                  onClick={() => {
                    eventManager.send_event(events.ADD_ROUTE_CLICKED_TFI, {
                      screen_name: 'routes_tab',
                    })
                    setShowAddRouteModal(true)
                  }}
                  classes={{button: styles.buttonWrapper}}
                >
                  {t('createRoute')}
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

      <RouteFormModal
        showModal={showAddRouteModal}
        setShowModal={setShowAddRouteModal}
      />

      <UsersListModal
        showModal={showPassengersListModal}
        onModalClose={onPassengersModalClose}
        title={`Passengers in ${selectedRouteData?.name} Route`}
        userIdsList={getSelectedRoutePassengersIds()}
        onDownloadClick={onPassengersDownloadClick}
      />

      <RouteScheduleModal
        showModal={showRouteScheduleModal}
        onModalClose={onRouteScheduleModalClose}
        title={t('pickupAndDropSchedule')}
        stopDetails={selectedRouteData?.pickup_point_details}
      />
    </div>
  )
}
