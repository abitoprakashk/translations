import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector, shallowEqual} from 'react-redux'
import styles from './stopsListing.module.css'
import ManualAdditionModal from '../ManualAdditionModal/ManualAdditionModal'
import {
  Button,
  ButtonDropdown,
  BUTTON_CONSTANTS,
  EmptyState,
  Icon,
  ICON_CONSTANTS,
  KebabMenu,
  Para,
  PARA_CONSTANTS,
  Popup,
  SearchBar,
  Table,
} from '@teachmint/krayon'
import globalActions from '../../../../../../redux/actions/global.actions'
import {STOP_TABLE_COLUMNS} from '../../constants'
import {events} from '../../../../../../utils/EventsConstants'
import {showErrorToast} from '../../../../../../redux/actions/commonAction'
import Permission from '../../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'
import BulkUploadStopsModal from '../BulkUploadStopsModal/BulkUploadStopsModal'
import BulkUploadPassengersModal from '../BulkUploadPassengers/BulkUploadPassengersModal'
import StopsListingEmptyState from './StopsListingEmptyState'

export default function StopsListing() {
  const [filteredData, setFilteredData] = useState([])
  const [selectedRowData, setSelectedRowData] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [editModalStep, setEditModalStep] = useState(0)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [showBulkUploadModal, setBulkUploadModal] = useState()
  const [showBulkUploadDropDown, setShowBulkUploadDropDown] = useState(false)

  const {t} = useTranslation()

  const transportStops = useSelector((state) => {
    let stopsWithLocation = []
    let stopsWithoutLocation = []

    state?.globalData?.transportStops?.data?.forEach((stopObj) => {
      if (parseFloat(stopObj?.latitude)) stopsWithLocation.push(stopObj)
      else stopsWithoutLocation.push(stopObj)
    })
    return [...stopsWithoutLocation, ...stopsWithLocation]
  }, shallowEqual)
  const schoolTransportSettings = useSelector(
    (state) => state?.globalData?.schoolTransportSettings
  )
  const instituteInfo = useSelector((state) => state?.instituteInfo)
  const eventManager = useSelector((state) => state?.eventManager)

  const dispatch = useDispatch()

  // Filter data based on new redux data
  useEffect(() => {
    getFilteredData(searchText)
  }, [transportStops])

  // Filter data based on search text
  const getFilteredData = (value) => {
    let filteredDataList = (transportStops || [])?.filter(
      ({name}) => name !== instituteInfo?._id
    )
    if (value) {
      value = value.toLowerCase().trim()
      filteredDataList = filteredDataList?.filter((item) => {
        return (
          item?.name?.toLowerCase()?.includes(value) ||
          String(item?.distance)?.toLowerCase()?.includes(value) ||
          String(item?.passenger_ids?.length || 0)
            ?.toLowerCase()
            ?.includes(value) ||
          item?.address?.toLowerCase()?.includes(value)
        )
      })
    }

    setFilteredData(filteredDataList)
  }

  // Handle manage passengers click
  const onPassengersClick = (rowData) => {
    setSelectedRowData(rowData)
    setEditModalStep(1)
    setShowEditModal(true)
  }

  // Return manage passenger component
  const ManagePassengers = ({rowData}) => (
    <Permission
      permissionId={
        PERMISSION_CONSTANTS.transportPickupPointController_updateRoute_update
      }
    >
      <Button
        type={BUTTON_CONSTANTS.TYPE.TEXT}
        onClick={() => {
          onPassengersClick(rowData)
          eventManager.send_event(events.MANAGE_PASSENGERS_CLICKED_TFI, {
            screen_name: 'stops_tab',
          })
        }}
      >
        {t('managePassengers')}
      </Button>
    </Permission>
  )

  const AddLocationButton = ({rowData}) => {
    return (
      <Permission
        permissionId={
          PERMISSION_CONSTANTS.transportPickupPointController_updateRoute_update
        }
      >
        <Button
          type={BUTTON_CONSTANTS.TYPE.TEXT}
          onClick={() => handleEdit(rowData, false)}
        >
          {t('addLocation')}
        </Button>{' '}
      </Permission>
    )
  }

  // Get table rows to display
  const getTableRows = () => {
    let allRows = []
    if (filteredData)
      allRows = filteredData?.map((obj) => ({
        name: obj.name,
        distance:
          obj.distance || obj.distance === 0
            ? `${obj.distance} ${t('km')}`
            : '-',
        passengers: obj.passenger_ids?.length || 0,
        location: parseFloat(obj.latitude) ? (
          obj.address
        ) : (
          <AddLocationButton rowData={obj} />
        ),
        managePassengers: schoolTransportSettings?.data
          ?.is_school_address_set ? (
          <ManagePassengers rowData={obj} />
        ) : (
          ''
        ),
        kebabMenu: schoolTransportSettings?.data?.is_school_address_set ? (
          <StopsKebabMenu rowData={obj} />
        ) : (
          ''
        ),
      }))

    return allRows
  }

  // Return kebab menu component
  const StopsKebabMenu = ({rowData}) => (
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
                onClick={() => handleEdit(rowData, true)}
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
                PERMISSION_CONSTANTS.transportPickupPointController_deleteRoute_delete
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
                {t('delete')}
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

  const getAllotedPassengersIds = (id) => {
    let allotedPassengers = []

    transportStops?.forEach(({_id, passenger_ids}) => {
      if (id !== _id && passenger_ids)
        allotedPassengers = [...allotedPassengers, ...passenger_ids]
    })

    return allotedPassengers
  }

  // Handle Edit
  const handleEdit = (rowData, isKmenu) => {
    // Check if associated with fees
    if (rowData?.is_associated_with_fees) {
      dispatch(showErrorToast(t('feesAssociatedWithStopEditError')))
      return
    }

    setEditModalStep(0)
    setSelectedRowData(rowData)
    setShowEditModal(true)
    eventManager.send_event(events.STOPS_KMENU_OPTIONS_CLICKED_TFI, {
      action: 'edit',
      kmenu: isKmenu,
    })
  }

  // Handle delete
  const handleDelete = (rowData) => {
    setSelectedRowData(rowData)
    setShowDeletePopup(true)
    eventManager.send_event(events.STOPS_KMENU_OPTIONS_CLICKED_TFI, {
      action: 'delete',
    })
  }

  // Return delete popup component with close and confirm functions
  const DeletePopup = () => {
    const handleClosePopup = () => {
      setShowDeletePopup(false)
      setSelectedRowData(null)
    }

    const dispatchDelete = () => {
      if (selectedRowData?.is_associated_with_fees) {
        handleClosePopup()
        dispatch(showErrorToast(t('feesAssociatedWithStopDeleteError')))
        return
      }

      const successAction = () => {
        handleClosePopup()
        eventManager.send_event(events.STOP_DELETED_TFI)
      }
      const payload = {pickup_points_list: [selectedRowData._id]}
      dispatch(
        globalActions?.deleteTransportStops?.request(
          payload,
          successAction,
          handleClosePopup
        )
      )
    }

    return (
      <Popup
        isOpen={true}
        onClose={handleClosePopup}
        headerIcon={<Icon name="delete1" size={ICON_CONSTANTS.SIZES.SMALL} />}
        header={`${t('deleteThisStop')}?`}
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
            onClick: dispatchDelete,
            body: t('delete'),
            category: BUTTON_CONSTANTS.CATEGORY.DESTRUCTIVE,
          },
        ]}
      >
        <Para
          type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
          className={styles.deletePopupContent}
        >
          {t('deleteStopPopupDesc')}
        </Para>
      </Popup>
    )
  }

  const bulkUploadButtonDropdownObj = {
    buttonObj: {
      children: t('bulkUpload'),
      suffixIcon: 'downArrow',
      type: BUTTON_CONSTANTS.TYPE.OUTLINE,
    },
    options: [
      {id: 'STOPS', label: t('stops')},
      {id: 'PASSENGERS', label: t('passengers')},
    ],
    handleOptionClick: (e) => {
      setBulkUploadModal(e.value)
      let event_option = e.value === 'STOPS' ? 'stops' : 'passengers'
      eventManager.send_event(events.TRANSPORT_BULKUPLOAD_INITIATED_TFI, {
        option: event_option,
      })
    },
    classes: {
      dropdownContainer: styles.buttonDropdownContainer,
      wrapper: styles.buttonDropDownWrapper,
    },
    onClick: () => {
      if (!showBulkUploadDropDown) {
        eventManager.send_event(events.TRANSPORT_BULKUPLOAD_CLICKED_TFI, {})
      }
      setShowBulkUploadDropDown(!showBulkUploadDropDown)
    },
  }

  return (
    <div className={styles.wrapper}>
      {transportStops?.length > 0 ? (
        <>
          <div className={styles.header}>
            <SearchBar
              value={searchText}
              placeholder={t('stopsPageSearchPlaceholder')}
              handleChange={({value}) => {
                setSearchText(value)
                getFilteredData(value)
              }}
              classes={{wrapper: styles.searchBar}}
            />
            {schoolTransportSettings?.data?.is_school_address_set && (
              <div className={styles.addButtons}>
                <Permission
                  permissionId={
                    PERMISSION_CONSTANTS.transportPickupPointController_updateRoute_update
                  }
                >
                  <ButtonDropdown {...bulkUploadButtonDropdownObj} />
                </Permission>
                <Permission
                  permissionId={
                    PERMISSION_CONSTANTS.transportPickupPointController_updateRoute_update
                  }
                >
                  <Button
                    onClick={() => {
                      eventManager.send_event(events.ADD_STOPS_CLICKED_TFI, {
                        screen_name: 'stops_tab',
                      })
                      setShowAddModal(true)
                    }}
                  >
                    {t('addStop')}
                  </Button>
                </Permission>
              </div>
            )}
          </div>
          <div>
            {filteredData?.length > 0 ? (
              <Table rows={getTableRows()} cols={STOP_TABLE_COLUMNS} />
            ) : (
              <EmptyState
                iconName="search"
                content={t('noSearchResultFound')}
                classes={{
                  wrapper: styles.emptyStateWrapper,
                  iconFrame: styles.emptyStateIconFrame,
                }}
                button={null}
              />
            )}
          </div>
        </>
      ) : (
        <StopsListingEmptyState setShowAddModal={setShowAddModal} />
      )}
      <ManualAdditionModal
        showModal={showAddModal}
        setShowModal={setShowAddModal}
        allotedPassengerIds={getAllotedPassengersIds(selectedRowData?._id)}
      />
      <ManualAdditionModal
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        isEdit={true}
        editData={{
          name: selectedRowData?.name,
          address: selectedRowData?.address,
          latitude: selectedRowData?.latitude,
          longitude: selectedRowData?.longitude,
          distance: selectedRowData?.distance,
          _id: selectedRowData?._id,
          passengersData: selectedRowData?.passenger_ids,
        }}
        step={editModalStep}
        allotedPassengerIds={getAllotedPassengersIds(selectedRowData?._id)}
      />
      <BulkUploadStopsModal
        showModal={showBulkUploadModal === 'STOPS'}
        setShowModal={setBulkUploadModal}
      />
      <BulkUploadPassengersModal
        showModal={showBulkUploadModal === 'PASSENGERS'}
        setShowModal={setBulkUploadModal}
      />
      {showDeletePopup && <DeletePopup />}
    </div>
  )
}
