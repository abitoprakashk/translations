/* eslint-disable */
import React from 'react'
import CreateMap from './createMap'
import {Wrapper, Status} from '@googlemaps/react-wrapper'
import PropTypes from 'prop-types'
import {t} from 'i18next'
const apiKey = 'AIzaSyCFLBuTarZlu74F7TI6PFUl_QW06aH69eA'

export default function ShowMap({
  markers,
  showSearch,
  getDistance,
  mapCenter,
  zoom,
  showRouteLinesForMarkers,
  customRouteLines,
  handleSearchPlaceSelect,
  handleSearch,
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
  const render = (status) => {
    return <h1>{status}</h1>
  }

  return (
    <>
      <div style={{height: '100%', width: '100%'}}>
        <Wrapper libraries={['places']} apiKey={apiKey} render={render}>
          <CreateMap
            id="map"
            apiKey={apiKey}
            mapCenter={
              mapCenter.lat && mapCenter.lng
                ? mapCenter
                : {lat: 12.919311968882369, lng: 77.66817485683069}
            }
            zoom={zoom}
            markers={markers}
            showSearch={showSearch}
            getDistance={getDistance}
            showRouteLinesForMarkers={showRouteLinesForMarkers}
            customRouteLines={customRouteLines}
            handleSearchPlaceSelect={handleSearchPlaceSelect}
            handleSearch={handleSearch}
            searchPlaceHolder={searchPlaceHolder}
            searchValue={searchValue}
            handleMarkerDrag={handleMarkerDrag}
            origin={origin}
            reCenter={reCenter}
            reCenterLocation={reCenterLocation}
            gestureHandling={gestureHandling}
            mapStyling={mapStyling}
            shapes={shapes}
          ></CreateMap>
        </Wrapper>
      </div>
    </>
  )
}

ShowMap.defaultProps = {
  showSearch: true,
  zoom: 15,
  showRouteLinesForMarkers: true,
  customRouteLines: null,
  handleSearch: () => {},
  origin: {lat: 12.919311968882369, lng: 77.66817485683069},
  searchPlaceHolder: t('searchYourLocation'),
}

ShowMap.propTypes = {
  showSearch: PropTypes.bool,
  mapCenter: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  zoom: PropTypes.number,
  showRouteLinesForMarkers: PropTypes.bool,
  customRouteLines: PropTypes.oneOf([
    null,
    PropTypes.shape({
      places: PropTypes.arrayOf(
        PropTypes.shape({lat: PropTypes.string, lng: PropTypes.string})
      ),
      customLine: PropTypes.shape({
        path: PropTypes.string,
        strokeOpacity: PropTypes.number,
        scale: PropTypes.number,
      }),
      lineColor: PropTypes.string,
    }),
  ]),
  origin: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  shapes: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['circle']),
      center: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
      }),
    })
  ),
}
