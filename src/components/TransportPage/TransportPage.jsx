import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import * as TRC from '../../constants/transport.constants'
import {events} from '../../utils/EventsConstants'
import LinearTabOptions from '../Common/LinearTabOptions/LinearTabOptions'
import StaffPage from '../StaffPage/StaffPage'
import TransportRoutePage from './components/TransportRoutePage'
import TransportVehiclePage from './components/TransportVehiclePage'
import TransportWaypointPage from './components/TransportWaypointPage'
import {t} from 'i18next'

export default function TransportPage() {
  const [selectedTab, setSelectedTab] = useState(TRC.TRANSPORT_TABS[0].id)
  const {eventManager} = useSelector((state) => state)

  const handleChange = (id) => {
    if (id === TRC.TRANSPORT_TABS[0].id) {
      eventManager.send_event(events.PICKUP_POINTS_CLICKED_TFI)
    } else if (id === TRC.TRANSPORT_TABS[1].id) {
      eventManager.send_event(events.VEHICLES_CLICKED_TFI)
    } else if (id === TRC.TRANSPORT_TABS[2].id) {
      eventManager.send_event(events.STAFF_CLICKED_TFI)
    } else {
      eventManager.send_event(events.ROUTES_CLICKED_TFI)
    }
    setSelectedTab(id)
  }

  const getTab = (id) => {
    switch (id) {
      case TRC.TRANSPORT_TABS[0].id:
        return <TransportWaypointPage />
      case TRC.TRANSPORT_TABS[3].id:
        return <TransportRoutePage />
      case TRC.TRANSPORT_TABS[1].id:
        return <TransportVehiclePage />
      case TRC.TRANSPORT_TABS[2].id:
        return <StaffPage />
      default:
        break
    }
  }

  return (
    <div className="p-5">
      <div className="tm-hdg tm-hdg-24 mb-2">{t('transport')}</div>

      <div className="mb-4">
        <LinearTabOptions
          options={TRC.TRANSPORT_TABS}
          selected={selectedTab}
          handleChange={(id) => handleChange(id)}
        />
      </div>

      {getTab(selectedTab)}
    </div>
  )
}
