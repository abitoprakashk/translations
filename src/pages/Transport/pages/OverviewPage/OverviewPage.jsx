import React from 'react'
import VehicleTrackingView from './components/VehicleTrackingView/VehicleTrackingView'
import StatsSection from './components/StatsSection/StatsSection'
import {useSelector} from 'react-redux'
import UserInfoSection from './components/UserInfoSection/UserInfoSection'
import SosSection from './components/SosSection/SosSection'
import {Divider, EmptyState} from '@teachmint/krayon'
import {t} from 'i18next'
import styles from './OverviewPage.module.css'
import RequestLiveTrackingCard from './components/RequestLiveTrackingCard/RequestLiveTrackingCard'
import history from '../../../../history'
import {TRANSPORT_TABLIST} from '../LandingPage/RouteMapping'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'

export default function OverviewPage() {
  const transportAggregates = useSelector(
    (state) => state?.globalData?.transportAggregates
  )
  const schoolTransportSettings = useSelector(
    (state) => state?.globalData?.schoolTransportSettings?.data
  )

  const settingsData = useSelector(
    (state) => state?.globalData?.schoolTransportSettings?.data
  )

  const isDataAvalible =
    transportAggregates?.data?.total_pickup_points ||
    transportAggregates?.data?.total_vehicles ||
    transportAggregates?.data?.total_staff ||
    transportAggregates?.data?.total_routes

  return (
    <div>
      {isDataAvalible ? (
        <>
          <SosSection />
          {schoolTransportSettings &&
            !schoolTransportSettings?.is_gps_enabled &&
            settingsData &&
            !settingsData?.requested_gps && <RequestLiveTrackingCard />}
          <StatsSection />
          <VehicleTrackingView />
          <Divider />
          <UserInfoSection />
        </>
      ) : (
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.transportPickupPointController_updateRoute_update
          }
        >
          <EmptyState
            iconName="viewQuilt"
            content={t('emptyTransportOverviewDesc')}
            classes={{
              wrapper: styles.emptyStateWrapper,
              iconFrame: styles.emptyStateIconFrame,
            }}
            button={{
              children: t('addStop'),
              onClick: () => {
                history.push(TRANSPORT_TABLIST.stops.route)
              },
            }}
          />
        </Permission>
      )}
    </div>
  )
}
