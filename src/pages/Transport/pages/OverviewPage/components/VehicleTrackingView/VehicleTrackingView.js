import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import styles from './vehicleTrackingView.module.css'
import {PlainCard, SearchBar} from '@teachmint/krayon'
import VehicleTrackingCard from '../VehicleTrackingCard/VehicleTrackingCard'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../../../redux/actions/global.actions'
import VehicleTrackingMap from '../VehicleTrackingMap/VehicleTrackingMap'

export default function VehicleTrackingView() {
  const [filteredVehicles, setFilteredVehicles] = useState()
  const [searchText, setSearchText] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState(null)

  const {t} = useTranslation()
  const dispatch = useDispatch()
  const vehicleData = useSelector(
    (state) => state?.globalData?.transportLiveTracking?.data
  )
  const schoolTransportSettings = useSelector(
    (state) => state?.globalData?.schoolTransportSettings?.data
  )

  useEffect(() => {
    dispatch(globalActions?.transportLiveTracking?.request())
  }, [])

  useEffect(
    () => setFilteredVehicles(getFilteredData(vehicleData, searchText)),
    [vehicleData]
  )

  const getFilteredData = (data, value) => {
    if (value) {
      value = value.toLowerCase().trim()
      let filteredDataList = data?.filter(
        (item) =>
          item?.vehicle_name?.toLowerCase()?.includes(value) ||
          item?.number?.toLowerCase()?.includes(value) ||
          item?.vehicle_type?.toLowerCase()?.includes(value)
      )
      return filteredDataList
    }
    return data
  }

  return (
    <div className={styles.wrapper}>
      {schoolTransportSettings?.is_gps_enabled &&
      schoolTransportSettings?.school_location_details ? (
        <PlainCard className={styles.card}>
          <div className={styles.listWrapper}>
            <SearchBar
              value={searchText}
              placeholder={t('searchForVehicles')}
              handleChange={({value}) => {
                setSearchText(value)
                setFilteredVehicles(getFilteredData(vehicleData, value))
              }}
            />
            <div className={styles.vehiclesWrapper}>
              {filteredVehicles?.map((data, index) => (
                <VehicleTrackingCard
                  key={index}
                  data={data}
                  setSelectedVehicle={setSelectedVehicle}
                />
              ))}
            </div>
          </div>
          <div className={styles.overviewMap}>
            {schoolTransportSettings?.school_location_details && (
              <VehicleTrackingMap
                selectedVehicle={selectedVehicle}
                setSelectedVehicle={setSelectedVehicle}
              />
            )}
          </div>
        </PlainCard>
      ) : null}
    </div>
  )
}
