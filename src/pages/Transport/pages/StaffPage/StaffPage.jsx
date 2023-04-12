import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import styles from './staffPage.module.css'
import StaffFormModal from './components/StaffFormModal/StaffFormModal'
import {
  Button,
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
import globalActions from '../../../../redux/actions/global.actions'
import {STAFF_TABLE_COLUMNS} from './constants'
import IdProofModal from './components/IdProofModal/IdProofModal'
import {showErrorToast} from '../../../../redux/actions/commonAction'
import {events} from '../../../../utils/EventsConstants'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import {STAFF_OPTIONS} from './constants'

export default function StaffPage() {
  const [filteredData, setFilteredData] = useState([])
  const [selectedRowData, setSelectedRowData] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [staffEditData, setStaffEditData] = useState({})

  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [showAddStaffModal, setShowAddStaffModal] = useState(false)
  const [showEditStaffModal, setShowEditStaffModal] = useState(false)
  const [showIdProofModal, setShowIdProofModal] = useState(false)

  const {t} = useTranslation()

  const {eventManager} = useSelector((state) => state)
  const transportStaff = useSelector(
    (state) => state?.globalData?.transportStaff?.data
  )
  const dispatch = useDispatch()

  // Filter data based on new redux data
  useEffect(() => {
    getFilteredData(searchText)
  }, [transportStaff])

  const IdProofButton = ({rowData}) => {
    const handleClick = () => {
      setSelectedRowData(rowData)
      setShowIdProofModal(true)
    }
    return (
      <Button type={BUTTON_CONSTANTS.TYPE.TEXT} onClick={handleClick}>
        {t('viewId')}
      </Button>
    )
  }

  // Return kebab menu component
  const StaffKebabMenu = ({rowData}) => (
    <KebabMenu
      options={[
        {
          content: (
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.transportStaffController_updateRoute_update
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
                PERMISSION_CONSTANTS.transportStaffController_deleteRoute_delete
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

  //getting all rows from redux data
  const allRows = transportStaff?.map((obj) => ({
    name: obj.name,
    type: STAFF_OPTIONS.find((option) => option?.value === obj?.staff_type)
      ?.label,
    phoneNumber: `+${obj.phone_number}`,
    route:
      obj.route_details?.length > 0
        ? obj.route_details?.map(({route_name}) => route_name)?.join(', ')
        : '-',
    idProof:
      obj?.documents && obj.documents[0]?.document_url ? (
        <IdProofButton rowData={obj} />
      ) : (
        '-'
      ),
    kebabMenu: <StaffKebabMenu rowData={obj} />,
  }))

  // Filter data based on search text
  const getFilteredData = (value) => {
    let filteredDataList = allRows

    if (value) {
      value = value.toLowerCase().trim()
      filteredDataList = filteredDataList?.filter(
        (item) =>
          item?.name?.toLowerCase()?.includes(value) ||
          item?.phoneNumber?.toLowerCase()?.includes(value) ||
          item?.type?.toLowerCase()?.includes(value) ||
          item?.route?.toLowerCase()?.includes(value)
      )
    }

    setFilteredData(filteredDataList)
  }

  // Handle Edit
  const handleEdit = (rowData) => {
    const fileUrl = rowData?.documents[0]?.document_url || ''

    let newEditData = {
      [rowData._id]: {
        name: rowData.name,
        role: rowData.staff_type,
        countryCode: rowData.phone_number.split('-')[0],
        contact: rowData.phone_number.split('-')[1],
        isCheckboxSelected: rowData.show_contact_details_to_parents,
        idProof: fileUrl,
      },
    }
    setStaffEditData(newEditData)
    setSelectedRowData(rowData)
    setShowEditStaffModal(true)
    eventManager.send_event(events.TRANSPORT_STAFF_KMENU_OPTIONS_CLICKED_TFI, {
      action: 'edit',
    })
  }

  // Handle delete
  const handleDelete = (rowData) => {
    setSelectedRowData(rowData)
    setShowDeletePopup(true)
    eventManager.send_event(events.TRANSPORT_STAFF_KMENU_OPTIONS_CLICKED_TFI, {
      action: 'delete',
    })
  }

  const getDocUrl = (selectedRowData) => {
    if (selectedRowData?.documents && selectedRowData?.documents.length > 0)
      return selectedRowData?.documents[0]?.document_url
    return ''
  }

  // Return delete popup component with close and confirm functions
  const DeletePopup = () => {
    const handleClosePopup = () => {
      setShowDeletePopup(false)
      setSelectedRowData(null)
    }

    const handleDelete = () => {
      const successAction = () => {
        eventManager.send_event(events.TRANSPORT_STAFF_DELETED_TFI, {
          staff_type: selectedRowData.staff_type,
        })
        handleClosePopup()
      }

      if (selectedRowData?.route_details?.length > 0) {
        dispatch(showErrorToast(t('routeAssignedStaffDeleteErrMsg')))
        setShowDeletePopup(false)
      } else
        dispatch(
          globalActions?.deleteTransportStaff?.request(
            {staff_list: [selectedRowData._id]},
            successAction
          )
        )
    }

    return (
      <Popup
        isOpen={true}
        onClose={handleClosePopup}
        headerIcon={<Icon name="delete1" size={ICON_CONSTANTS.SIZES.SMALL} />}
        header={`${t('deleteThisStaff')}?`}
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
            body: t('delete'),
            category: BUTTON_CONSTANTS.CATEGORY.DESTRUCTIVE,
          },
        ]}
      >
        <Para
          type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
          className={styles.deletePopupContent}
        >
          {t('deleteStaffPopupDesc')}
        </Para>
      </Popup>
    )
  }

  const onIdProofModalClose = () => {
    setSelectedRowData(null)
    setShowIdProofModal(false)
  }

  return (
    <div className={styles.wrapper}>
      {transportStaff?.length > 0 ? (
        <>
          <div className={styles.header}>
            <SearchBar
              value={searchText}
              placeholder={t('staffPageSearchPlaceholder')}
              handleChange={({value}) => {
                setSearchText(value)
                getFilteredData(value)
              }}
              classes={{wrapper: styles.searchBar}}
            />
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.transportStaffController_updateRoute_update
              }
            >
              <Button
                onClick={() => {
                  eventManager.send_event(
                    events.ADD_TRANSPORT_STAFF_CLICKED_TFI,
                    {screen_name: 'staff_tab'}
                  )
                  setShowAddStaffModal(true)
                }}
              >
                {t('addStaff')}
              </Button>
            </Permission>
          </div>

          {filteredData?.length > 0 ? (
            <Table rows={filteredData} cols={STAFF_TABLE_COLUMNS} />
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
        </>
      ) : (
        <EmptyState
          iconName="people"
          content={
            <Para>
              {t('emptyStaffListDesc')}
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.transportStaffController_updateRoute_update
                }
              >
                <Button
                  onClick={() => {
                    eventManager.send_event(
                      events.ADD_TRANSPORT_STAFF_CLICKED_TFI,
                      {
                        screen_name: 'staff_tab',
                      }
                    )
                    setShowAddStaffModal(true)
                  }}
                  classes={{button: styles.buttonWrapper}}
                >
                  {t('addStaff')}
                </Button>
              </Permission>
            </Para>
          }
          button={null}
          classes={{
            wrapper: styles.emptyStateWrapper,
            iconFrame: styles.emptyStateIconFrame,
          }}
        />
      )}

      <StaffFormModal
        showModal={showAddStaffModal}
        setShowModal={setShowAddStaffModal}
      />
      <StaffFormModal
        showModal={showEditStaffModal}
        setShowModal={setShowEditStaffModal}
        isEdit={true}
        editData={staffEditData}
      />
      <IdProofModal
        isOpen={showIdProofModal}
        fileUrl={getDocUrl(selectedRowData)}
        onClose={onIdProofModalClose}
      />
      {showDeletePopup && <DeletePopup />}
    </div>
  )
}
