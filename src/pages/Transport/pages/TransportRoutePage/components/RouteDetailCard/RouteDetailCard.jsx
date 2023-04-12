import {useState} from 'react'
import {Trans, useTranslation} from 'react-i18next'
import styles from './RouteDetailCard.module.css'
import {
  Button,
  BUTTON_CONSTANTS,
  Heading,
  HEADING_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  KebabMenu,
  Para,
  PARA_CONSTANTS,
  PlainCard,
  Popup,
  Tooltip,
  TOOLTIP_CONSTANTS,
} from '@teachmint/krayon'
import RouteStopInfo from '../../../../components/RouteStopInfo/RouteStopInfo'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../../../redux/actions/global.actions'
import RouteFormModal from '../RouteFormModal/RouteFormModal'
import {convertTime24to12} from '../../../../../../utils/Helpers'
import {events} from '../../../../../../utils/EventsConstants'
import Permission from '../../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'

export default function RouteDetailCard({
  data,
  handlePassengersClick,
  handleViewScheduleClick,
}) {
  const [showEditRouteModal, setShowEditRouteModal] = useState(false)
  const [showDeletePopup, setShowDeletePopup] = useState(false)

  const transportSettings = useSelector(
    (state) => state?.globalData?.schoolTransportSettings?.data
  )
  const {eventManager} = useSelector((state) => state)

  const dispatch = useDispatch()

  const {t} = useTranslation()

  const getRouteStopDetails = () => {
    const stops = {}

    data?.pickup_point_details?.forEach((obj) => {
      stops[obj.pickup_point_id] = {
        isEdit: true,
        stop: obj.pickup_point_id,
        passengers: obj.passenger_ids,
        pickupTime: convertTime24to12(obj.pickup_time),
        dropTime: convertTime24to12(obj.drop_time),
      }
    })
    return stops
  }

  const routeEditData = {
    routeDetails: {
      name: data?.name,
      pickupTime: convertTime24to12(data?.pickup_end_time),
      dropTime: convertTime24to12(data?.drop_start_time),
      vehicle: data?.vehicle_id,
      staff: data?.staff_id_list,
      _id: data?._id,
    },
    ...getRouteStopDetails(),
  }

  const stopDetails = data?.pickup_point_details?.sort((a, b) =>
    a.pickup_time > b.pickup_time ? 1 : b.pickup_time > a.pickup_time ? -1 : 0
  )

  const firstStopDetails = {
    name: stopDetails[0]?.pickup_point_name,
    pickUpTime: convertTime24to12(stopDetails[0]?.pickup_time),
    dropTime: convertTime24to12(stopDetails[0]?.drop_time),
  }

  const lastStopDetails = {
    name: transportSettings?.school_location_details?.name,
    pickUpTime: convertTime24to12(data?.pickup_end_time),
    dropTime: convertTime24to12(data?.drop_start_time),
  }

  const getPassengersCount = () => {
    let count = 0
    data?.pickup_point_details?.forEach((obj) => {
      count = count + (obj?.passenger_ids?.length || 0)
    })
    return count
  }

  // Handle edit
  const handleEdit = () => {
    setShowEditRouteModal(true)
    eventManager.send_event(events.ROUTE_KMENU_OPTIONS_CLICKED_TFI, {
      action: 'edit',
    })
  }

  // Handle delete
  const handleDelete = () => {
    setShowDeletePopup(true)
    eventManager.send_event(events.ROUTE_KMENU_OPTIONS_CLICKED_TFI, {
      action: 'delete',
    })
  }

  const kebabMenuOptions = [
    {
      content: (
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.transportRouteController_updateRoute_update
          }
        >
          <div className={styles.menuItem} onClick={() => handleEdit()}>
            <Icon
              size={ICON_CONSTANTS.SIZES.X_SMALL}
              name="edit1"
              version={ICON_CONSTANTS.VERSION.OUTLINED}
            />
            {t('edit')}
          </div>
        </Permission>
      ),
      handleClick: () => {},
    },
    {
      content: (
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.transportPickupPointController_deleteRoute_delete
          }
        >
          <div className={styles.menuItem} onClick={() => handleDelete()}>
            <Icon
              size={ICON_CONSTANTS.SIZES.X_SMALL}
              name="delete1"
              type={ICON_CONSTANTS.TYPES.ERROR}
              version={ICON_CONSTANTS.VERSION.OUTLINED}
            />
            {t('delete')}
          </div>
        </Permission>
      ),
      handleClick: () => {},
    },
  ]

  // Return delete popup component and related functions
  const DeletePopup = () => {
    const dispatchDelete = () => {
      const successAction = () => {
        eventManager.send_event(events.ROUTE_DELETED_TFI)
        setShowDeletePopup(false)
      }
      const payload = {
        routes_list: [data._id],
      }
      dispatch(
        globalActions?.deleteTransportRoutes?.request(payload, successAction)
      )
    }

    return (
      <Popup
        isOpen={true}
        onClose={() => setShowDeletePopup(false)}
        headerIcon={<Icon name="delete1" size={ICON_CONSTANTS.SIZES.SMALL} />}
        header={`${t('deleteThisRoute')}?`}
        actionButtons={[
          {
            id: 'cancel-btn',
            onClick: () => setShowDeletePopup(false),
            body: t('cancel'),
            type: BUTTON_CONSTANTS.TYPE.OUTLINE,
            classes: {button: styles.cancelButton},
          },
          {
            id: 'activate-btn',
            onClick: dispatchDelete,
            body: t('delete'),
            category: BUTTON_CONSTANTS.CATEGORY.DESTRUCTIVE,
          },
        ]}
      >
        <Para
          type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
          className={styles.deletePopupDescription}
        >
          <Trans
            i18nKey="deleteRoutePopupDesc"
            values={{routeName: data.name}}
          />
        </Para>
      </Popup>
    )
  }
  return (
    <PlainCard className={styles.card}>
      <div className={styles.header}>
        <div>
          <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.SMALL}>
            {data.name}
          </Heading>

          <Button
            type={BUTTON_CONSTANTS.TYPE.TEXT}
            width={BUTTON_CONSTANTS.WIDTH.FIT}
            classes={{
              button: styles.passengersCountButton,
              label: styles.passengersCountLabel,
            }}
            onClick={() => handlePassengersClick(data)}
          >
            {`${getPassengersCount()} ${t('passengers')}`}
          </Button>
        </div>
        <KebabMenu
          options={kebabMenuOptions}
          isVertical={true}
          classes={{
            iconFrame: styles.kebabMenuIconFrame,
          }}
        />
      </div>

      <PlainCard className={styles.subCard}>
        <RouteStopInfo
          firstStop={firstStopDetails}
          lastStop={lastStopDetails}
          stopsNum={stopDetails.length}
        />
        <Button
          type={BUTTON_CONSTANTS.TYPE.TEXT}
          width={BUTTON_CONSTANTS.WIDTH.FULL}
          classes={{button: styles.scheduleButton}}
          onClick={() => {
            handleViewScheduleClick(data)
            eventManager.send_event(events.VIEW_PICKUP_AND_DROP_SCHEDULE_TFI, {
              screen_name: 'routes_tab',
            })
          }}
        >
          {t('viewPickupandDropSchedule')}
        </Button>
      </PlainCard>

      <div className={styles.footer}>
        <div>
          <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
            {t('assignedVehicles')}
          </Para>
          <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
            {data.vehicle_number}
          </Para>
        </div>
        <div>
          <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
            {t('assignedStaff')}
          </Para>
          <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
            {data?.staff_details?.[0]?.name || '-'}
            {data?.staff_details?.length > 1 && (
              <>
                {', '}
                <Para
                  type={PARA_CONSTANTS.TYPE.PRIMARY}
                  data-tip
                  data-for={`extraInfo${data?._id}`}
                  className={styles.staffDetailShowMorePara}
                >
                  {` +${data?.staff_details?.length - 1} ${t('more')}`}
                  <Tooltip
                    toolTipId={`extraInfo${data?._id}`}
                    place={TOOLTIP_CONSTANTS.TOOLTIP_POSITIONS.BOTTOM}
                    classNames={{toolTipBody: styles.staffDetailsTooltipBody}}
                    toolTipBody={data?.staff_details
                      ?.map(
                        ({name, phone_number}) => `${name} (${phone_number})`
                      )
                      .join(', ')}
                  ></Tooltip>
                </Para>
              </>
            )}
          </Para>
        </div>
      </div>
      <RouteFormModal
        showModal={showEditRouteModal}
        setShowModal={setShowEditRouteModal}
        isEdit={true}
        editData={routeEditData}
      />
      {showDeletePopup && <DeletePopup />}
    </PlainCard>
  )
}
