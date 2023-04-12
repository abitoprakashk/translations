import {Trans} from 'react-i18next'
import {useSelector} from 'react-redux'
import StatsCard from '../../../../../../components/Common/StatsCard/StatsCard'
import {events} from '../../../../../../utils/EventsConstants'
import {TRANSPORT_TABLIST} from '../../../LandingPage/RouteMapping'
import styles from './StatsSection.module.css'

export default function StatsSection() {
  const aggregatesData = useSelector(
    (state) => state?.globalData?.transportAggregates?.data
  )
  const {eventManager} = useSelector((state) => state)

  const onCardsClick = {
    stops: () => {
      eventManager.send_event(events.STOPS_TAB_CLICKED_TFI, {
        ingress: 'cards',
      })
    },
    vehicles: () => {
      eventManager.send_event(events.VEHICLES_TAB_CLICKED_TFI, {
        ingress: 'cards',
      })
    },
    staff: () => {
      eventManager.send_event(events.TRANSPORT_STAFF_TAB_CLICKED_TFI, {
        ingress: 'cards',
      })
    },
    routes: () => {
      eventManager.send_event(events.ROUTES_TAB_CLICKED_TFI, {
        ingress: 'cards',
      })
    },
  }

  const cardData = [
    {
      title: TRANSPORT_TABLIST.stops.label,
      value: aggregatesData?.total_pickup_points || 0,
      iconName: 'pinDropLocation',
      classes: {iconFrame: styles.stopsIconFrame},
      link: TRANSPORT_TABLIST.stops.route,
      subTitleIcon:
        aggregatesData?.unassigned_pickup_points > 0 ? 'requestPage' : null,
      subTitleText:
        aggregatesData?.unassigned_pickup_points > 0 ? (
          <Trans
            i18nKey="unassignedStopsText"
            values={{value: aggregatesData?.unassigned_pickup_points}}
          />
        ) : null,
      handleClick: onCardsClick[TRANSPORT_TABLIST.stops.route],
    },
    {
      title: TRANSPORT_TABLIST.vehicles.label,
      value: aggregatesData?.total_vehicles || 0,
      iconName: 'bus1',
      classes: {iconFrame: styles.vehiclesIconFrame},
      link: TRANSPORT_TABLIST.vehicles.route,
      handleClick: onCardsClick[TRANSPORT_TABLIST.vehicles.route],
    },
    {
      title: TRANSPORT_TABLIST.staff.label,
      value: aggregatesData?.total_staff || 0,
      iconName: 'people',
      classes: {iconFrame: styles.staffIconFrame},
      link: TRANSPORT_TABLIST.staff.route,
      handleClick: onCardsClick[TRANSPORT_TABLIST.staff.route],
    },
    {
      title: TRANSPORT_TABLIST.transportRoute.label,
      value: aggregatesData?.total_routes || 0,
      iconName: 'swapCalls',
      classes: {iconFrame: styles.routesIconFrame},
      link: TRANSPORT_TABLIST.transportRoute.route,
      handleClick: onCardsClick[TRANSPORT_TABLIST.transportRoute.route],
    },
  ]

  return (
    <div className={styles.wrapper}>
      {cardData?.map(
        (
          {
            title,
            value,
            iconName,
            classes,
            link,
            subTitleIcon,
            subTitleText,
            handleClick,
          },
          index
        ) => (
          <StatsCard
            key={index}
            title={title}
            value={value}
            iconName={iconName}
            classes={classes}
            link={link}
            subTitleIcon={subTitleIcon}
            subTitleText={subTitleText}
            handleClick={handleClick}
          />
        )
      )}
    </div>
  )
}
