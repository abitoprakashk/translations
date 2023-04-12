import styles from './schoolLocation.module.css'
import {useSelector} from 'react-redux'
import {useEffect, useState} from 'react'

export default function SchoolLocation() {
  const schoolTransportSettings = useSelector(
    (state) => state?.globalData?.schoolTransportSettings
  )

  const [schoolCoordinates, setSchoolCoordinates] = useState({
    lat: schoolTransportSettings?.data?.school_location_details?.latitude,
    lng: schoolTransportSettings?.data?.school_location_details?.longitude,
  })

  useEffect(() => {
    if (schoolTransportSettings?.data?.school_location_details?.latitude) {
      setSchoolCoordinates({
        lat: schoolTransportSettings?.data?.school_location_details?.latitude,
        lng: schoolTransportSettings?.data?.school_location_details?.longitude,
      })
    }
  }, [schoolTransportSettings.data])

  const schoolMarker = {
    position: schoolCoordinates,
    customizations: {
      icon: 'https://storage.googleapis.com/tm-assets/icons/colorful/transport-institute.svg',
      title: schoolTransportSettings?.data?.school_location_details?.name,
    },
    infoContent: `<div class="${styles.infoCardRow}">
      <h1>${schoolTransportSettings?.data?.school_location_details?.name}</h1>
    </div>`,
  }

  return {schoolCoordinates, schoolMarker}
}
