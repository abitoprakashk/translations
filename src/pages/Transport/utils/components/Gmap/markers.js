/* eslint-disable */
import classNames from 'classnames'
import {t} from 'i18next'
import styles from './markers.module.css'

//Add a new marker with infoWindow and return them
export function addMarker(
  map,
  position,
  customizations,
  infoContent = null,
  handleMarkerDrag = () => {},
  getDistance,
  origin
) {
  let markerCustomizations = !customizations ? {} : customizations
  const marker = new google.maps.Marker({
    position,
    map,
    ...markerCustomizations,
  })

  let infoWindow = null

  if (infoContent != 'HIDE_INFO_CONTENT') {
    if (position === {lat: 22.2115829, lng: 77.4311017}) return
    infoWindow = new google.maps.InfoWindow()
    infoWindow.setContent(infoContent || '')

    marker.addListener('click', (e) => {
      infoWindow.open({
        anchor: marker,
        map,
        e: e,
      })
    })
  }

  const getNewDistance = (origin, destination) => {
    let distance = null
    if (getDistance) {
      const service = new google.maps.DistanceMatrixService()

      const request = {
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      }

      service.getDistanceMatrix(request).then((response) => {
        distance = response?.rows[0]?.elements[0]?.distance || null
        let destinationStopAddress = response?.destinationAddresses[0] || ''
        handleMarkerDrag(destination, distance, destinationStopAddress)
        if (response?.rows[0]?.elements[0]?.status !== 'OK') {
          alert(t('mapNoRoadBtwnOriginAndDestinationAlert'))
        }
      })
    }
  }

  const onMarkerDragEnd = (e) => {
    let destination = {lat: e.latLng.lat(), lng: e.latLng.lng()}
    if (getDistance) getNewDistance(origin, destination)
    else {
      handleMarkerDrag({lat: e.latLng.lat(), lng: e.latLng.lng()}, e)
    }
  }

  marker.addListener('dragend', onMarkerDragEnd)

  return [marker, infoWindow]
}

// Sets the map on all markers in the array.
function setMapOnAllMarkers(map, markers) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map)
  }
}

// Deletes all markers in the array.
export function clearMarkers(markers) {
  if (!markers || !markers?.length) return
  setMapOnAllMarkers(null, markers)
}

export function createDefaultDraggableMarker(data, classes = {}) {
  return {
    position: data.position,
    customizations: {
      title: `${data.title}`,
      draggable: true,
    },
    infoContent: `<div class="${classNames(styles.infoContent, {
      [classes.infoContent]: classes?.infoContent,
    })}">${data.infoContent}</div>`,
  }
}
