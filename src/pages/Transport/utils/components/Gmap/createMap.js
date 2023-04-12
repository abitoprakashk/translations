/* eslint-disable */
import {useEffect, useRef, useState} from 'react'
import {addMarker, clearMarkers} from './markers'
import {routeLines} from './routeLines'
import CustomSearchBox from './customSearchBoxes/customSearchBox'
import {DEFAULT_MAP_STYLING} from './MapStylingConstansts'
import {addShapes, clearShapes} from './shapes'
import styles from './createMap.module.css'
import {t} from 'i18next'

function CreateMap({
  mapCenter,
  zoom,
  markers,
  showSearch,
  getDistance,
  showRouteLinesForMarkers,
  customRouteLines,
  handleSearch,
  handleSearchPlaceSelect,
  searchPlaceHolder,
  searchValue,
  handleMarkerDrag,
  origin,
  reCenter,
  reCenterLocation,
  gestureHandling,
  mapStyling,
  shapes,
}) {
  const ref = useRef(null)
  const inputRef = useRef(null)
  const markersRef = useRef([])
  const [gMap, setGoogleMap] = useState()
  const [center, setCenter] = useState(mapCenter)
  const [routePaths, setRoutePaths] = useState([])
  let routeLineHandler = routeLines(gMap)

  useEffect(() => {
    if (gMap) {
      gMap.setCenter(reCenterLocation)
      setCenter(reCenterLocation)
      handleInfoWindowsOnMarkerCentered(reCenterLocation)
    }
  }, [reCenter])

  useEffect(() => {
    if (gMap) {
      gMap.setZoom(zoom)
    }
  }, [zoom])

  useEffect(() => {
    if (gMap) {
      gMap.setCenter(mapCenter)
      setCenter(mapCenter)
      handleInfoWindowsOnMarkerCentered(mapCenter)
    }
  }, [mapCenter])

  const closeAllInfoWindows = () => {
    markersRef.current?.forEach((markerArr) => {
      markerArr[2] && markerArr[2].close()
    })
  }

  const handleInfoWindowsOnMarkerCentered = (center) => {
    markersRef.current?.forEach((markerArr) => {
      let markerPosition = markerArr[0]?.position
      if (
        markerPosition?.lat === center?.lat &&
        markerPosition?.lng === center?.lng
      ) {
        closeAllInfoWindows()
        let infoWindow = markerArr[2]
        infoWindow && infoWindow.open({anchor: markerArr[1], map: gMap})
      }
    })
  }

  const updateMarkersAndRoutePaths = () => {
    let addedMarkers = []
    let rtl = showRouteLinesForMarkers ? [] : null
    if (gMap && markers.length) {
      markers.forEach((marker) => {
        let [gmapMarker, markerInfoWindow] = addMarker(
          gMap,
          marker.position,
          marker.customizations,
          marker.infoContent,
          handleMarkerDrag,
          getDistance,
          origin
        )
        addedMarkers.push([marker, gmapMarker, markerInfoWindow])
        showRouteLinesForMarkers ? rtl.push(marker.position) : null
      })
      // storing markers data in ref because we don't need re-render on it's change
      markersRef.current = addedMarkers
    }
    if (showRouteLinesForMarkers && rtl?.length > 1) {
      routeLineHandler.clearRouteLines(routePaths)
      let tempLines = routeLineHandler.createRouteLines(rtl, customRouteLines)
      setRoutePaths(tempLines)
    }
    return
  }

  useEffect(() => {
    clearMarkers(markersRef.current?.map((arr) => arr[1]))
    updateMarkersAndRoutePaths()
  }, [markers])

  const updateShapes = () => {
    clearShapes()
    shapes.forEach((shape) => {
      addShapes(gMap, shape)
    })
  }

  useEffect(() => {
    if (gMap && shapes) {
      updateShapes()
    }
  }, [gMap, shapes])

  function createMapSearch(googleMap) {
    const searchBox = new google.maps.places.SearchBox(inputRef.current)

    google.maps.event.addDomListener(inputRef.current, 'keydown', (e) => {
      if (e.keyCode === 13) {
        e.stopImmediatePropagation()
        e.preventDefault()
        return
      }
    })

    googleMap.controls[google.maps.ControlPosition.TOP_LEFT].push(
      inputRef.current
    )

    googleMap.addListener('bounds_changed', () => {
      searchBox.setBounds(googleMap.getBounds())
    })

    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces()

      if (places.length == 0) {
        return
      }

      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds()

      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          window.alert(t('mapPlaceNoGeometryAlert'))
          return
        }

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport)
        } else {
          bounds.extend(place.geometry.location)
        }
      })
      if (getDistance) {
        const service = new google.maps.DistanceMatrixService()
        const destination = {
          lat: places[0].geometry.location.lat(),
          lng: places[0].geometry.location.lng(),
        }

        const request = {
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false,
        }
        let distance = null
        service.getDistanceMatrix(request).then((response) => {
          if (response.rows[0].elements[0].status === 'OK') {
            distance = response.rows[0].elements[0].distance
            handleSearchPlaceSelect(places, distance)
          } else {
            handleSearchPlaceSelect(places, null)
            alert(t('mapNoRoadBtwnOriginAndDestinationAlert'))
          }
        })
      } else {
        handleSearchPlaceSelect(places, null)
      }

      googleMap.fitBounds(bounds)
    })
  }

  useEffect(() => {
    if (ref.current && !gMap) {
      var googleMap = new window.google.maps.Map(ref.current, {
        center: center,
        zoom: zoom,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: mapStyling ? mapStyling : DEFAULT_MAP_STYLING,
        gestureHandling: gestureHandling || 'cooperative',
      })
      setGoogleMap(googleMap)
      return
    }

    if (gMap && showSearch) {
      createMapSearch(gMap)
    }
    updateMarkersAndRoutePaths()
    setGoogleMap(gMap)
  }, [ref, gMap])

  // Add marker
  useEffect(() => {
    if (gMap) {
      gMap.setOptions({center: center, zoom: zoom})
      gMap.addListener('click', (e) => {
        closeAllInfoWindows()
      })
    }
  }, [gMap])

  return (
    <>
      {showSearch && (
        <CustomSearchBox
          forwardRef={inputRef}
          placeholder={searchPlaceHolder}
          value={searchValue}
          handleChange={handleSearch}
        />
      )}
      <div
        ref={ref}
        style={{width: '100%', height: '100%'}}
        className={styles.gMapWrapper}
      />
    </>
  )
}

export default CreateMap
