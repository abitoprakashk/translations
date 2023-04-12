import {Breadcrumb, Button, Table} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import styles from './biometricMachines.module.css'
import {useDispatch, useSelector} from 'react-redux'
import {
  HeaderTemplate,
  KebabMenu,
  ICON_CONSTANTS,
  Icon,
  Para,
  PARA_CONSTANTS,
  Popup,
  BUTTON_CONSTANTS,
  EmptyState,
  TOOLTIP_CONSTANTS,
  Tooltip,
} from '@teachmint/krayon'
import history from '../../../../../history'
import {useState, useEffect} from 'react'
import AddMachineModal from './components/AddMachineModal/AddMachineModal'
import globalActions from '../../../../../redux/actions/global.actions'
import SearchBox from '../../../../../components/Common/SearchBox/SearchBox'
import {events} from '../../../../../utils/EventsConstants'
import Permission from '../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'

export default function BiometricMachines() {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const [showAddMachineModal, setShowAddMachineModal] = useState(false)
  const biometricMachines = useSelector(
    (state) => state?.globalData?.fetchBiometricMachinesList?.data
  )
  const {eventManager} = useSelector((state) => state)
  const [selectedRowData, setSelectedRowData] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [filteredData, setFilteredData] = useState([])
  const [machineData, setMachineData] = useState({
    _id: '',
    deviceID: '',
    companyName: '',
    location: '',
  })

  const [cardError, setCardError] = useState({
    deviceID: '',
    companyName: '',
    location: '',
  })

  useEffect(() => {
    setCardError({
      deviceID: '',
      companyName: '',
      location: '',
    })
    setMachineData({
      _id: '',
      deviceID: '',
      companyName: '',
      location: '',
    })
  }, [showAddMachineModal])

  const handleEdit = (rowData) => {
    let editData = {
      _id: rowData?._id || '',
      deviceID: rowData?.device_id || '',
      companyName: rowData?.model_name || '',
      location: rowData?.machine_location || '',
    }
    setMachineData(editData)
    setSelectedRowData(rowData)

    setShowEditModal(true)
  }

  const handleDelete = (rowData) => {
    setSelectedRowData(rowData)
    setShowDeletePopup(true)
  }

  const handleSearchFilter = (text) => {
    setSearchText(text)
    if (text === '') setFilteredData(allRows)
    else {
      getFilteredData(text)
    }
  }

  // Return delete popup component with close and confirm functions
  const DeletePopup = () => {
    const handleClosePopup = () => {
      setShowDeletePopup(false)
      setSelectedRowData(null)
    }

    const handleDelete = () => {
      const successAction = () => {
        handleClosePopup()
      }
      dispatch(
        globalActions?.deleteBiometricMachines?.request(
          {machine_id_list: [selectedRowData._id]},
          successAction
        )
      )
    }

    return (
      <Popup
        isOpen={true}
        onClose={handleClosePopup}
        headerIcon={<Icon name="delete1" size={ICON_CONSTANTS.SIZES.SMALL} />}
        header={`${t('deleteMachineTitle')}?`}
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
          {t('deleteMachineDesc')}
        </Para>
      </Popup>
    )
  }

  // Filter data based on search text
  const getFilteredData = (value) => {
    let filteredDataList = allRows

    if (value) {
      value = value.toLowerCase().trim()
      filteredDataList = filteredDataList?.filter(
        (item) =>
          item?.device_id?.toLowerCase()?.includes(value) ||
          item?.model_name?.toLowerCase()?.includes(value) ||
          item?.location?.toLowerCase()?.includes(value)
      )
    }

    filteredDataList = filteredDataList?.map((item) => {
      item.model_name = item?.model_name || '-'
      item.location = item?.location || '-'

      return item
    })

    setFilteredData(filteredDataList)
  }

  // Filter data based on new redux data
  useEffect(() => {
    getFilteredData(searchText)
    if (!biometricMachines) {
      dispatch(globalActions?.fetchBiometricMachinesList?.request())
    }
  }, [biometricMachines])

  // Return kebab menu component
  const MachinesKebabMenu = ({rowData}) => (
    <div className={styles.kebabMenuWrapper}>
      <KebabMenu
        options={[
          {
            content: (
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.BiometricMachineController_update_route_update
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
                  PERMISSION_CONSTANTS.BiometricMachineController_delete_route_delete
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
        isVertical
        classes={{
          iconFrame: styles.kebabMenuIconFrame,
          content: styles.contentWrapper,
          tooltipWrapper: styles.tooltipWrapper,
        }}
      />
    </div>
  )

  const allRows = biometricMachines?.map((obj) => ({
    _id: String(obj?._id),
    device_id: obj.device_id,
    model_name: obj.model_name,
    location: obj.machine_location,
    status: obj.verified ? (
      <div className={styles.verified}>{t('verified')}</div>
    ) : (
      <div className={styles.verificationPending}>
        {t('verificationPending')}
      </div>
    ),
    kebabMenu: <MachinesKebabMenu rowData={obj} />,
  }))

  const USERS_TABLE_COLUMNS = [
    {key: 'device_id', label: t('biometricMachineSerialNumber')},
    {key: 'model_name', label: t('companyNameModelNumber')},
    {key: 'location', label: t('machineLocation')},
    {
      key: 'status',
      label: (
        <div className={styles.statusHeader}>
          <Para>{t('status')}</Para>
          <div>
            <div
              data-tip
              data-for="extraInfo"
              className={styles.statusHeaderIconWrapper}
            >
              <Icon
                name="info"
                version={ICON_CONSTANTS.VERSION.OUTLINED}
                type={ICON_CONSTANTS.TYPES.SECONDARY}
                size={ICON_CONSTANTS.SIZES.XXX_SMALL}
              />
            </div>

            <Tooltip
              toolTipId="extraInfo"
              place={TOOLTIP_CONSTANTS.TOOLTIP_POSITIONS.BOTTOM}
              toolTipBody={t('biometricMachinePageStatusHeaderTooltipText')}
              classNames={{toolTipBody: styles.statusTooltipBody}}
            ></Tooltip>
          </div>
        </div>
      ),
    },
    {key: 'kebabMenu', label: ''},
  ]

  return (
    <>
      <div className={styles.wrapper}>
        <Breadcrumb
          textSize="l"
          paths={[
            {
              label: t('biometricConfiguration'),
              onClick: () =>
                history.push(
                  '/institute/dashboard/hrms-configuration/biometric-configuration'
                ),
            },
            {
              label: t('biometricMachines'),
              onClick: () =>
                history.push(
                  '/institute/dashboard/hrms-configuration/biometric-machines'
                ),
            },
          ]}
        />
        <div className={styles.header}>
          <HeaderTemplate
            showBreadcrumb={false}
            mainHeading={t('biometricMachines')}
            classes={{
              mainHeading: styles.mainHeading,
              subHeading: styles.subHeading,
              divider: styles.divider,
            }}
          />
        </div>
        {biometricMachines?.length > 0 ? (
          <>
            <div className={styles.container}>
              <div className="w-full lg:w-96">
                <SearchBox
                  value={searchText}
                  placeholder={t('searchBiometricMachinesPlaceholder')}
                  handleSearchFilter={handleSearchFilter}
                />
              </div>
              <div>
                <Permission
                  permissionId={
                    PERMISSION_CONSTANTS.BiometricMachineController_update_route_update
                  }
                >
                  <Button
                    onClick={() => {
                      setShowAddMachineModal(true)
                      eventManager.send_event(
                        events.HRMS_ADD_NEW_MACHINE_CLICKED_TFI
                      )
                    }}
                  >
                    <span>{t('addBiometricMachine')}</span>
                  </Button>
                </Permission>
              </div>
            </div>
            <div className={styles.lineBreak}>
              <hr />
            </div>
            <Table rows={filteredData} cols={USERS_TABLE_COLUMNS} />
          </>
        ) : (
          <>
            <div className={styles.lineBreak}>
              <hr />
            </div>
            <EmptyState
              iconName="fingerprint"
              content={
                <Para>
                  {t('biometricMachineEmptyState')}
                  <Permission
                    permissionId={
                      PERMISSION_CONSTANTS.BiometricMachineController_update_route_update
                    }
                  >
                    <Button
                      onClick={() => {
                        setShowAddMachineModal(true)
                        eventManager.send_event(
                          events.HRMS_ADD_NEW_MACHINE_CLICKED_TFI
                        )
                      }}
                      classes={{button: styles.buttonWrapper}}
                    >
                      {t('addNewMachine')}
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
          </>
        )}
        <AddMachineModal
          showModal={showAddMachineModal}
          setShowModal={setShowAddMachineModal}
          machineData={machineData}
          cardError={cardError}
          setMachineData={setMachineData}
          setCardError={setCardError}
          allRows={allRows}
        />
        <AddMachineModal
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          isEdit={true}
          machineData={machineData}
          cardError={cardError}
          setMachineData={setMachineData}
          setCardError={setCardError}
          allRows={allRows}
        />
        {showDeletePopup && <DeletePopup />}
      </div>
    </>
  )
}
