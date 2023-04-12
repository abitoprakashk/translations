import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import classNames from 'classnames'
import styles from './VehicleDetailCard.module.css'
import {
  AvatarGroup,
  Badges,
  BADGES_CONSTANTS,
  Button,
  BUTTON_CONSTANTS,
  EmptyState,
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
import globalActions from '../../../../../../redux/actions/global.actions'
import VehicleFormModal from '../VehicleFormModal/VehicleFormModal'
import {VEHICLE_OPTIONS} from '../../constants'
import {showErrorToast} from '../../../../../../redux/actions/commonAction'
import {events} from '../../../../../../utils/EventsConstants'
import {convertTime24to12} from '../../../../../../utils/Helpers'
import Permission from '../../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'
import SimpleSlider from './SimpleSlider/SimpleSlider'
import VehicleDocumentsModal from '../VehicleDocumentsModal/VehicleDocumentsModal'

export default function VehicleDetailCard({data}) {
  const [showEditVehicleModal, setShowEditVehicleModal] = useState(false)
  const [showVehicleDocumentsModal, setShowVehicleDocumentsModal] =
    useState(false)
  const [showDeletePopup, setShowDeletePopup] = useState(false)

  const dispatch = useDispatch()
  const {eventManager} = useSelector((state) => state)
  const transportSettings = useSelector(
    (state) => state?.globalData?.schoolTransportSettings?.data
  )

  const {t} = useTranslation()

  const vehicleEditData = {
    [data._id]: {
      number: data?.number,
      type: data?.vehicle_type,
      capacity: data?.seating_capacity,
      name: data?.vehicle_name,
      imei: data?.gps_imei,
      documents: data?.documents || [],
    },
  }

  // Handle edit
  const handleEdit = () => {
    setShowEditVehicleModal(true)
    eventManager.send_event(events.VEHICLE_KMENU_OPTIONS_CLICKED_TFI, {
      action: 'edit',
    })
  }

  // Handle delete
  const handleDelete = () => {
    setShowDeletePopup(true)
    eventManager.send_event(events.VEHICLE_KMENU_OPTIONS_CLICKED_TFI, {
      action: 'delete',
    })
  }

  // Kebab menu component
  const kebabMenuOptions = [
    {
      content: (
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.transportVehicleController_updateRoute_update
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
            PERMISSION_CONSTANTS.transportVehicleController_deleteRoute_delete
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

  const RouteInfoCard = ({routeData}) => {
    const stopDetails = routeData?.pickup_point_details
    const staffDetails = routeData?.staff_details

    const firstStopDetails = {
      name: stopDetails[0]?.pickup_point_name,
      pickUpTime: convertTime24to12(stopDetails[0]?.pickup_time),
      dropTime: convertTime24to12(stopDetails[0]?.drop_time),
    }
    const lastStopDetails = {
      name: transportSettings?.school_location_details?.name,
      pickUpTime: convertTime24to12(routeData?.pickup_end_time),
      dropTime: convertTime24to12(routeData?.drop_start_time),
    }
    return (
      <PlainCard className={styles.routeCard}>
        <div className={styles.routeDetail}>
          <Badges
            type={BADGES_CONSTANTS.TYPE.PRIMARY}
            showIcon={false}
            label={routeData?.name}
            size={BADGES_CONSTANTS.SIZE.SMALL}
            className={styles.routeNameBadge}
          />
          <RouteStopInfo
            firstStop={firstStopDetails}
            lastStop={lastStopDetails}
            stopsNum={stopDetails.length}
          />
        </div>
        <div className={styles.staffDetail}>
          <AvatarGroup
            data={staffDetails?.map((item) => ({
              id: item._id,
              name: item.name,
            }))}
          />
          <div>
            <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
              {t('staffContact')}
            </Para>
            <Para>
              {staffDetails?.[0]?.name || t('noStaffAssignedToRoute')}
              {staffDetails?.length > 1 && (
                <>
                  {', '}
                  <Para
                    type={PARA_CONSTANTS.TYPE.PRIMARY}
                    data-tip
                    data-for={`extraInfo${data?._id}`}
                    className={styles.staffDetailShowMorePara}
                  >
                    {` +${staffDetails?.length - 1} ${t('more')}`}
                    <Tooltip
                      toolTipId={`extraInfo${data?._id}`}
                      place={TOOLTIP_CONSTANTS.TOOLTIP_POSITIONS.BOTTOM}
                      classNames={{toolTipBody: styles.staffDetailsTooltipBody}}
                      toolTipBody={staffDetails
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
      </PlainCard>
    )
  }

  // Returns vehicle assinged to route/routes component
  const RouteAssignedUI = () => {
    if (data?.route_details.length === 1) {
      return <RouteInfoCard routeData={data?.route_details[0]} />
    }
    return (
      <SimpleSlider
        options={data?.route_details?.map((routeObj) => (
          <RouteInfoCard key={routeObj._id} routeData={routeObj} />
        ))}
      />
    )
  }

  // Returns vehicle not assigned to route component
  const RouteNotAssignedUI = () => (
    <PlainCard className={styles.routeCard}>
      <EmptyState
        iconName="swapCalls"
        content={t('routeNotAssignedYet')}
        classes={{
          iconFrame: styles.emptyStateIconFrame,
        }}
        button={null}
      />
    </PlainCard>
  )

  // Get vehicle type name from value
  const getVehicleType = () =>
    VEHICLE_OPTIONS?.find((item) => item.value == data?.vehicle_type)?.label ||
    ''

  // Return delete popup component and related functions
  const DeletePopup = () => {
    const handleDelete = () => {
      if (data?.route_details?.[0]?._id) {
        dispatch(showErrorToast(t('routeAssignedVehicleDeleteErrMsg')))
        setShowDeletePopup(false)
      } else {
        const successAction = () => {
          setShowDeletePopup(false)
          eventManager.send_event(events.VEHICLE_DELETED_TFI, {
            screen_name: 'vehicles_tab',
            vehicle_capacity: data?.seating_capacity,
            vehicle_type: data?.vehicle_type,
          })
        }

        dispatch(
          globalActions?.deleteTransportVehicles?.request(
            {vehicles_list: [data._id]},
            successAction
          )
        )
      }
    }

    return (
      <Popup
        isOpen={true}
        onClose={() => setShowDeletePopup(false)}
        headerIcon={<Icon name="delete1" size={ICON_CONSTANTS.SIZES.SMALL} />}
        header={`${t('deleteThisVehicle')}?`}
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
            onClick: handleDelete,
            body: t('delete'),
            category: BUTTON_CONSTANTS.CATEGORY.DESTRUCTIVE,
          },
        ]}
      >
        <Para
          type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
          className={styles.deletePopupDescription}
        >
          {t('deleteVehiclePopupDesc')}
        </Para>
      </Popup>
    )
  }

  return (
    <PlainCard className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.SMALL}>
            {data?.number}
          </Heading>
          <div className={styles.vehicleNameWrapper}>
            {data.vehicle_name && (
              <>
                <Para>{`${data.vehicle_name} `}</Para>
                <span className={styles.dotSeparator}>.</span>
              </>
            )}
            <Para>{getVehicleType()}</Para>
            <span className={styles.dotSeparator}>.</span>
            <Button
              type={BUTTON_CONSTANTS.TYPE.TEXT}
              onClick={() => {
                setShowVehicleDocumentsModal(true)
              }}
            >
              {data?.documents?.length
                ? `${data.documents.length} ${
                    data.documents.length > 1 ? t('documents') : t('document')
                  }`
                : t('addDocuments')}
            </Button>
          </div>
        </div>
        <div className={`${styles.header}`}>
          <Badges
            showIcon={false}
            className={classNames(
              styles.badge,
              data?.is_gps_enabled ? styles.green : styles.grey
            )}
            label={data?.is_gps_enabled ? t('gpsEnabled') : t('gpsNotEnabled')}
            size={BADGES_CONSTANTS.SIZE.SMALL}
          />

          <KebabMenu
            options={kebabMenuOptions}
            isVertical={true}
            classes={{iconFrame: styles.kebabMenuIconFrame}}
          />
        </div>
      </div>

      {data?.route_details?.[0]?._id ? (
        <RouteAssignedUI />
      ) : (
        <RouteNotAssignedUI />
      )}

      {showEditVehicleModal && (
        <VehicleFormModal
          showModal={showEditVehicleModal}
          setShowModal={setShowEditVehicleModal}
          isEdit={true}
          editData={vehicleEditData}
        />
      )}

      {showDeletePopup && <DeletePopup />}
      {showVehicleDocumentsModal && (
        <VehicleDocumentsModal
          showModal={showVehicleDocumentsModal}
          setShowModal={setShowVehicleDocumentsModal}
          vehicleData={data}
        />
      )}
    </PlainCard>
  )
}
