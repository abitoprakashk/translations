import React from 'react'
import ShowMap from '../../../../utils/components/Gmap/showMap'
import {useState} from 'react'
import styles from './routeFormMap.module.css'
import {useSelector} from 'react-redux'
import {useEffect} from 'react'
import SchoolLocation from '../../../OverviewPage/components/SchoolLocation/SchoolLocation'
import {
  Button,
  TabGroup,
  BUTTON_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
} from '@teachmint/krayon'
import {convertTime12to24} from '../../../../../../utils/Helpers'
import {t} from 'i18next'
export default function RouteFormMap({routeStopList, isEdit}) {
  const [markers, setMarkers] = useState([])
  const [selectedTab, setSelectedTab] = useState(1)
  const stopsData = useSelector(
    (state) => state?.globalData?.transportStops?.data
  )
  const [mapZoom, setMapZoom] = useState(12)

  const schoolLocationData = SchoolLocation()
  const [reCenter, setReCenter] = useState(1)
  useEffect(() => {
    routeStopsMarkers()
  }, [routeStopList])

  const sortByTime = (stops, type) => {
    stops?.forEach((stop) => {
      if (stop?.pickupTime && stop?.dropTime)
        stop.time =
          type === 'pickup'
            ? convertTime12to24(stop?.pickupTime)
            : convertTime12to24(stop?.dropTime)
    })
    stops?.sort((a, b) => (a.time > b.time ? 1 : b.time > a.time ? -1 : 0))
    return stops
  }

  function routeStopsMarkers(type = 'pickup') {
    let allMarkers = []
    let routeStops = Object.keys(routeStopList)?.map((routeStop) => {
      return routeStop !== 'routeDetails'
        ? routeStopList[routeStop]?.stop
        : 'routeDetails'
    })

    let filterStopsWithLatLng = stopsData?.filter((stop) => {
      return stop?.latitude && stop?.longitude && routeStops.includes(stop._id)
    })
    if (type !== 'pickup') {
      allMarkers.push(schoolLocationData.schoolMarker)
    }
    if (filterStopsWithLatLng?.length) {
      const tempAllMarkers = filterStopsWithLatLng?.map((stop) => {
        if (stop?.distance > 10) {
          setMapZoom(10)
        }
        if (stop?.distance > 20) {
          setMapZoom(9)
        }
        if (stop?.distance > 40) {
          setMapZoom(8)
        }
        return {
          position: {
            lat: stop?.latitude,
            lng: stop?.longitude,
          },
          customizations: {
            icon: 'https://storage.googleapis.com/tm-assets/icons/colorful/transport-stops.png',
          },
          infoContent: `<div class="${styles.badgeLike} ${styles.stopInfo}">${
            stop.name
          } ${
            type === 'pickup'
              ? routeStopList[stop?._id]?.pickupTime
                ? `| ${routeStopList[stop?._id]?.pickupTime}`
                : ''
              : routeStopList[stop?._id]?.dropTime
              ? `| ${routeStopList[stop?._id]?.dropTime}`
              : ''
          }  </div>`,
          pickupTime: routeStopList[stop?._id]?.pickupTime,
          dropTime: routeStopList[stop?._id]?.dropTime,
        }
      })
      allMarkers = [...allMarkers, ...tempAllMarkers]
    }
    if (isEdit) {
      allMarkers = sortByTime(allMarkers, type) || []
    }
    if (type === 'pickup') {
      allMarkers.push(schoolLocationData.schoolMarker)
    }

    if (allMarkers.length >= 1) {
      setMarkers(allMarkers)
    }

    return
  }

  return (
    <div className={styles.map}>
      <div className={styles.tabGroupWrapper}>
        <div className={styles.tabGroup}>
          <TabGroup
            tabOptions={[
              {id: 1, label: t('pickupWay')},
              {id: 2, label: t('dropWay')},
            ]}
            selectedTab={selectedTab}
            showMoreTab={false}
            onTabClick={(tab) => {
              setSelectedTab(tab.id)
              routeStopsMarkers(tab.id === 1 ? 'pickup' : 'drop')
            }}
            // moredivClass={styles.tabGroup}
          />
        </div>
      </div>
      <div className={styles.recenterWrapper}>
        <Button
          type={BUTTON_CONSTANTS.TYPE.FILLED}
          size={BUTTON_CONSTANTS.SIZE.MEDIUM}
          category={BUTTON_CONSTANTS.CATEGORY.PRIMARY}
          className={styles.recenter}
          onClick={() => setReCenter((val) => val + 1)}
        >
          <Icon
            name={'gpsNotFixed'}
            size={ICON_CONSTANTS.SIZES.X_SMALL}
            type={ICON_CONSTANTS.TYPES.BASIC}
          ></Icon>
        </Button>
      </div>
      <ShowMap
        mapCenter={schoolLocationData.schoolCoordinates}
        markers={markers || []}
        showSearch={false}
        showRouteLinesForMarkers={true}
        zoom={mapZoom}
        reCenterLocation={schoolLocationData.schoolCoordinates}
        reCenter={reCenter}
      />
    </div>
  )
}
