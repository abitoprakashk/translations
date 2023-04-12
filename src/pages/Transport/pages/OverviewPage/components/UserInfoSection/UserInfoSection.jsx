import styles from './UserInfoSection.module.css'
import {
  Heading,
  HEADING_CONSTANTS,
  SearchBar,
  Table,
  KebabMenu,
  Icon,
  ICON_CONSTANTS,
  Para,
  PARA_CONSTANTS,
  Popup,
  BUTTON_CONSTANTS,
  EmptyState,
  Button,
} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import {useEffect, useState} from 'react'
import {USER_INFO_TABLE_COLUMNS} from './constants'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../../../redux/actions/global.actions'
import Permission from '../../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'
import BackendPagination from '../../../../../../components/Common/BackendPagination/BackendPagination'
import PassengersFilterModal from './components/PassengersFilterModal/PassengersFilterModal'
import AssignTransportModal from './components/AssignTransportModal/AssignTransportModal'
import {events} from '../../../../../../utils/EventsConstants'
import AddMemberModal from './components/AddMember/AddMemberModal'

const PAGE_LIMIT = 10

export default function UserInfoSection() {
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [selectedRowData, setSelectedRowData] = useState(null)
  const [paginationInputs, setPaginationInputs] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [showAssignTransportModal, setShowAssignTransportModal] =
    useState(false)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)

  const transportPassengers = useSelector(
    (state) => state?.globalData?.transportPassengers?.data
  )
  const eventManager = useSelector((state) => state?.eventManager)

  const {
    instituteActiveStudentList,
    instituteActiveTeacherList,
    instituteInfo,
  } = useSelector((state) => state)

  const {t} = useTranslation()
  const dispatch = useDispatch()

  const userTypeMap = {
    STUDENT: t('student'),
    TEACHER: t('teacher'),
  }

  const AssignTransportButton = ({rowData, buttonText}) => {
    return (
      <Permission
        permissionId={
          PERMISSION_CONSTANTS.transportPickupPointController_updateRoute_update
        }
      >
        <Button
          type={BUTTON_CONSTANTS.TYPE.TEXT}
          onClick={() => {
            handleEdit(rowData)
            eventManager.send_event(
              buttonText === t('assignStop')
                ? events.ASSIGN_STOP_CLICKED_TFI
                : events.ASSIGN_ROUTE_CLICKED_TFI,
              {passenger_id: rowData.iid}
            )
          }}
        >
          {buttonText}
        </Button>
      </Permission>
    )
  }

  const getSortedPassengers = (passengers) => {
    let passengersWithoutRoute = []
    let passengersWithRoute = []
    passengers?.forEach((obj) => {
      if (obj.pickup_point_id && obj.route_id) passengersWithRoute.push(obj)
      else passengersWithoutRoute.push(obj)
    })
    return [...passengersWithoutRoute, ...passengersWithRoute]
  }

  // Get table rows to display
  const getTableRows = () => {
    let allRows = []

    if (transportPassengers?.hits)
      allRows = getSortedPassengers(transportPassengers?.hits)?.map((obj) => ({
        passengerDetails: rowItemPreview(
          obj?.name,
          obj?.phone_number || obj?.email
        ),
        passengerType:
          instituteInfo?.institute_type == 'SCHOOL'
            ? rowItemPreview(
                userTypeMap[obj?.type],
                obj?.standard
                  ? `Class - ${obj?.standard} ${obj?.section}`
                  : null
              )
            : rowItemPreview(
                userTypeMap[obj?.type],
                obj?.standard ? `${obj?.standard} - ${obj?.section}` : null
              ),
        stopLocation: obj?.pickup_point_name ? (
          rowItemPreview(
            obj?.pickup_point_name,
            obj?.pickup_point_distance || obj?.pickup_point_distance === 0
              ? `${obj?.pickup_point_distance} Km`
              : '-'
          )
        ) : (
          <AssignTransportButton rowData={obj} buttonText={t('assignStop')} />
        ),
        assignedVehicle: rowItemPreview(obj?.vehicle_number || '-'),
        routeDetails: obj?.route_id ? (
          rowItemPreview(obj?.route_name)
        ) : (
          <AssignTransportButton rowData={obj} buttonText={t('assignRoute')} />
        ),
        kebabMenu: <UserKebabMenu rowData={obj} />,
      }))

    return allRows
  }

  // Get row item preview
  const rowItemPreview = (data1, data2) => (
    <div>
      <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>{data1}</Para>
      {data2 && <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>{data2}</Para>}
    </div>
  )

  useEffect(() => {
    dispatch(
      globalActions?.transportPassengers?.request({
        limit: PAGE_LIMIT,
        next: paginationInputs?.step === 'PREV' ? false : true,
        referenceId: paginationInputs?.referenceId || 0,
        possibleAllocationIds:
          paginationInputs?.searchText?.length > 0
            ? paginationInputs?.possibleAllocationIds || []
            : null,
        searchText: paginationInputs?.searchText,
        filters: paginationInputs?.filters,
      })
    )
  }, [paginationInputs])

  const getPassengerIds = (value) => {
    value = value.toLowerCase().trim()

    const studentIds = instituteActiveStudentList
      ?.filter(({name}) => name?.toLowerCase()?.includes(value))
      ?.map(({_id}) => _id)

    const teacherIds = instituteActiveTeacherList
      ?.filter(({name}) => name?.toLowerCase()?.includes(value))
      ?.map(({_id}) => _id)

    return [...studentIds, ...teacherIds]
  }

  const handleSearch = ({value}) => {
    if (value.length > 50) return
    setCurrentPage(1)
    setPaginationInputs({
      ...paginationInputs,
      next: true,
      referenceId: 0,
      searchText: value,
      possibleAllocationIds: getPassengerIds(value),
    })
  }

  const handleFiltersChange = (newFilters) => {
    setCurrentPage(1)
    setPaginationInputs({
      ...paginationInputs,
      next: true,
      referenceId: 0,
      filters: newFilters,
    })
  }

  const isFilterApplied =
    (paginationInputs?.filters || {})?.pickup_point_ids?.length > 0 ||
    (paginationInputs?.filters || {})?.route_ids?.length > 0

  const isSearchApplied = (paginationInputs?.searchText || '') !== ''

  // Return kebab menu component
  const UserKebabMenu = ({rowData}) => (
    <KebabMenu
      options={[
        {
          content: (
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.transportPickupPointController_updateRoute_update
              }
            >
              <div
                className={styles.menuItem}
                onClick={() => handleEdit(rowData)}
              >
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
                PERMISSION_CONSTANTS.transportPassengersController_deleteRoute_delete
              }
            >
              <div
                className={styles.menuItem}
                onClick={() => handleDelete(rowData)}
              >
                <Icon
                  size={ICON_CONSTANTS.SIZES.X_SMALL}
                  name="delete1"
                  type={ICON_CONSTANTS.TYPES.ERROR}
                  version={ICON_CONSTANTS.VERSION.OUTLINED}
                />
                {t('remove')}
              </div>
            </Permission>
          ),
          handleClick: () => {},
        },
      ]}
      isVertical={true}
      classes={{
        iconFrame: styles.kebabMenuIconFrame,
        content: styles.contentWrapper,
      }}
    />
  )

  // Handle delete
  const handleDelete = (rowData) => {
    setSelectedRowData(rowData)
    setShowDeletePopup(true)
  }

  const handleEdit = (rowData) => {
    setSelectedRowData(rowData)
    setShowAssignTransportModal(true)
  }

  // Return delete popup component with close and confirm functions
  const DeletePopup = () => {
    const handleClosePopup = () => {
      setShowDeletePopup(false)
      setSelectedRowData(null)
    }

    const deleteSuccessAction = () => {
      handleClosePopup()
      if (transportPassengers?.hits?.length === 1 && currentPage > 1)
        setCurrentPage(currentPage - 1)
    }

    const handleDelete = () => {
      dispatch(
        globalActions?.deleteTransportPassengers?.request(
          {
            passengers_list: [selectedRowData?.iid],
            paginationInputs: {
              limit: PAGE_LIMIT,
              next: transportPassengers?.hits?.length === 1 ? false : true,
              referenceId:
                (transportPassengers?.hits?.length === 1
                  ? selectedRowData?.iid
                  : paginationInputs?.referenceId) || 0,
              possibleAllocationIds:
                paginationInputs.searchText?.length > 0
                  ? paginationInputs?.possibleAllocationIds || []
                  : null,
              searchText: paginationInputs?.searchText,
            },
          },
          deleteSuccessAction
        )
      )
    }

    return (
      <Popup
        isOpen={true}
        onClose={handleClosePopup}
        headerIcon={<Icon name="delete1" size={ICON_CONSTANTS.SIZES.SMALL} />}
        header={`${t('removePassenger')}?`}
        actionButtons={[
          {
            id: 'cancel-btn',
            onClick: handleClosePopup,
            body: t('cancel'),
            type: BUTTON_CONSTANTS.TYPE.OUTLINE,
            classes: {button: styles.cancelButton},
          },
          {
            id: 'activate-btn',
            onClick: handleDelete,
            body: t('remove'),
            category: BUTTON_CONSTANTS.CATEGORY.DESTRUCTIVE,
          },
        ]}
      >
        <Para
          type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
          className={styles.deletePopupContent}
        >
          {t('deletePassengersPopupDesc')}
        </Para>
      </Popup>
    )
  }

  const getTransportData = () => {
    dispatch(
      globalActions?.transportPassengers?.request({
        limit: PAGE_LIMIT,
        next: paginationInputs?.step === 'PREV' ? false : true,
        referenceId: paginationInputs?.referenceId || 0,
        possibleAllocationIds:
          paginationInputs?.searchText?.length > 0
            ? paginationInputs?.possibleAllocationIds || []
            : null,
        searchText: paginationInputs?.searchText,
        filters: paginationInputs?.filters,
      })
    )
    dispatch(globalActions.transportRoutes.request())
    dispatch(globalActions?.transportStops?.request())
  }

  const handleAddMemberUserSelect = (userId) => {
    setSelectedRowData({iid: userId})
    setShowAssignTransportModal(true)
    setShowAddMemberModal(false)
  }

  return (
    <div>
      <div className={styles.header}>
        <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.SMALL}>
          {t('transportUserInformation')}
        </Heading>

        <div className={styles.rightWrapper}>
          {transportPassengers?.hits?.length > 0 ||
          isFilterApplied ||
          isSearchApplied ? (
            <>
              <SearchBar
                value={paginationInputs?.searchText}
                placeholder={t(
                  'transportUserInformationSectionSearchPlaceholder'
                )}
                handleChange={handleSearch}
                classes={{wrapper: styles.searchBar}}
              />
              <Button
                type={
                  isFilterApplied
                    ? BUTTON_CONSTANTS.TYPE.FILLED
                    : BUTTON_CONSTANTS.TYPE.OUTLINE
                }
                onClick={() => setShowFiltersModal(true)}
                classes={{button: styles.filterButton}}
              >
                <Icon
                  size={ICON_CONSTANTS.SIZES.SMALL}
                  name="filter"
                  type={
                    isFilterApplied
                      ? ICON_CONSTANTS.TYPES.INVERTED
                      : ICON_CONSTANTS.TYPES.PRIMARY
                  }
                  version={ICON_CONSTANTS.VERSION.OUTLINED}
                />
              </Button>
              <Button onClick={() => setShowAddMemberModal(true)}>
                {t('addMember')}
              </Button>
            </>
          ) : null}
        </div>
      </div>

      {transportPassengers?.hits?.length === 0 &&
      !(isFilterApplied || isSearchApplied) ? (
        <EmptyState
          iconName="user"
          content={t('transportPassengerInfoEmptyState')}
          classes={{
            wrapper: styles.emptyStateWrapper,
            iconFrame: styles.emptyStateIconFrame,
          }}
          button={null}
        />
      ) : transportPassengers?.hits?.length === 0 ? (
        <EmptyState
          iconName="search"
          content={t('noResultFound')}
          classes={{
            wrapper: styles.emptyStateWrapper,
            iconFrame: styles.emptyStateIconFrame,
          }}
          button={null}
        />
      ) : (
        <>
          <Table
            rows={getTableRows()}
            cols={USER_INFO_TABLE_COLUMNS}
            classes={{table: styles.tableWrapper}}
          />
          <BackendPagination
            paginationObj={transportPassengers?.pagination}
            pageSize={transportPassengers?.hits?.length || PAGE_LIMIT}
            onPageChange={({step, referenceId}) => {
              setPaginationInputs({...paginationInputs, step, referenceId})
            }}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}
      {showFiltersModal && (
        <PassengersFilterModal
          showModal={showFiltersModal}
          setShowModal={setShowFiltersModal}
          appliedFilters={paginationInputs?.filters || {}}
          handleFiltersChange={handleFiltersChange}
        />
      )}
      {showAssignTransportModal && (
        <AssignTransportModal
          showModal={showAssignTransportModal}
          setShowModal={setShowAssignTransportModal}
          passengerDetails={selectedRowData}
          getTransportData={getTransportData}
        />
      )}
      {showAddMemberModal && (
        <AddMemberModal
          showModal={showAddMemberModal}
          setShowModal={setShowAddMemberModal}
          handleUserSelect={handleAddMemberUserSelect}
        />
      )}
      {showDeletePopup && <DeletePopup />}
    </div>
  )
}
