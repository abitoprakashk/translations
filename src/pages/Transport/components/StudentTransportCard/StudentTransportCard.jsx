import {Heading, HEADING_CONSTANTS, Para, PlainCard} from '@teachmint/krayon'
import {t} from 'i18next'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {showLoadingAction} from '../../../../redux/actions/commonAction'
import {events} from '../../../../utils/EventsConstants'
import globalActions from '../../../../redux/actions/global.actions'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import SectionOverviewCard from '../../../StudentManagement/components/SectionOverviewCard/SectionOverviewCard'
import {userWiseTransportInfo} from '../../apis/transportUsers.apis'
import AssignTransportModal from '../../pages/OverviewPage/components/UserInfoSection/components/AssignTransportModal/AssignTransportModal'
import styles from './StudentTransportCard.module.css'

export default function StudentTransportCard({currentStudent}) {
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [transportData, setTransportData] = useState(null)

  const dispatch = useDispatch()
  const eventManager = useSelector((state) => state.eventManager)

  useEffect(() => {
    getTransportData()
  }, [currentStudent])

  useEffect(() => {
    dispatch(globalActions?.transportStops?.request())
    dispatch(globalActions?.transportRoutes?.request())
  }, [])

  const getTransportData = () => {
    if (currentStudent?._id) {
      dispatch(showLoadingAction(true))
      userWiseTransportInfo({iid: currentStudent?._id})
        .then(({data}) => setTransportData(data?.obj))
        .catch(() => {})
        .finally(() => dispatch(showLoadingAction(false)))
    }
  }

  const overviewItems = [
    {
      id: 'status',
      label: 'busStatus',
      value: transportData?.live_status || '-',
    },
    {
      id: 'busStop',
      label: 'busStop',
      value: transportData?.pickup_point?.name || '-',
    },
    {
      id: 'routeName',
      label: 'routeName',
      value: transportData?.route?.name || '-',
    },
    {
      id: 'staff',
      label: 'staffName',
      value: transportData?.staff?.[0]?.name || '-',
    },
  ]

  return (
    <SectionOverviewCard
      cardLabel={t('transport')}
      icon="electricCar"
      actionLabel={t('edit')}
      actionHandle={() => {
        eventManager.send_event(events.SIS_EDIT_TRANSPORT_DETAILS_CLICKED_TFI)
        setShowAssignModal(true)
      }}
      actionPermissionId={
        PERMISSION_CONSTANTS.transportPickupPointController_updateRoute_update
      }
      classes={{header: styles.header, iconFrame: styles.iconFrame}}
    >
      <div className={styles.body}>
        {overviewItems?.map(({id, label, value}) => (
          <PlainCard key={id} className={styles.overviewItem}>
            <Heading
              type={id === 'status' ? HEADING_CONSTANTS.TYPE.SUCCESS : ''}
              textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
              className={styles.overviewItemValue}
            >
              {value}
            </Heading>
            <Para>{t(label)}</Para>
          </PlainCard>
        ))}
      </div>

      {showAssignModal && (
        <AssignTransportModal
          showModal={showAssignModal}
          setShowModal={setShowAssignModal}
          passengerDetails={{
            iid: currentStudent?._id,
            pickup_point_id: transportData?.pickup_point?._id,
            route_id: transportData?.route?._id,
          }}
          getTransportData={getTransportData}
          currentPickupPointId={transportData?.pickup_point?._id}
          currentRouteId={transportData?.route?._id}
        />
      )}
    </SectionOverviewCard>
  )
}
