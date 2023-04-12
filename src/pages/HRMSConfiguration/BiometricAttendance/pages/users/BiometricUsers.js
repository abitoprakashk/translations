import {
  Breadcrumb,
  Button,
  Table,
  Icon,
  BREADCRUMB_CONSTANTS,
  BUTTON_CONSTANTS,
} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import {useHistory, useLocation, useRouteMatch} from 'react-router-dom'
import styles from './users.module.css'
import {
  HeaderTemplate,
  KebabMenu,
  PARA_CONSTANTS,
  ICON_CONSTANTS,
  TabGroup,
  Para,
  EmptyState,
  TOOLTIP_CONSTANTS,
  Tooltip,
} from '@teachmint/krayon'
import {ATTENDANCE_METHOD} from '../../../AttendanceShifts/constants/shift.constants'
import globalActions from '../../../../../redux/actions/global.actions'
import {fetchStaffListRequestAction} from '../../../../../components/Attendance/components/StaffAttendance/redux/actions/StaffAttendanceActions'
import React, {useState, useEffect} from 'react'
import SearchBox from '../../../../../components/Common/SearchBox/SearchBox'
import RoleFilterDropdown from './components/roleFilterDropdown/RoleFilterDropdown'
import BiometricUserMappingBulkUploadModal from './components/bulkUpload/bulkUploadModal'
import {BiometricUsersTablist} from './UsersTabList'
import {biometricUsersRoutesList} from '../../utils/routing.constants'
import Permission from '../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'
import EditUsersModal from './components/editUsersModal/editUsersModal'
import {useSelector, useDispatch} from 'react-redux'
import {events} from '../../../../../utils/EventsConstants'
import {UserIDStatusTabMap} from '../../utils/routing.constants'

export default function BiometricUsers() {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const [showEmptyState, setShowEmptyState] = useState(false)
  const [allRows, setAllRows] = useState([])
  const [searchText, setSearchText] = useState('')
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false)
  const [selectedTab, setSelectedTab] = useState(1)
  const [showEditModal, setShowEditModal] = useState(false)
  const [filteredData, setFilteredData] = useState([])
  const [typeOfRoles, setTypeOfRoles] = useState({})
  const {eventManager} = useSelector((state) => state)
  const currentLocation = useLocation()
  const [userData, setUserData] = useState({
    iid: '',
    user_id: '',
  })

  const [cardError, setCardError] = useState({
    iid: '',
    user_id: '',
  })

  const registerEvent = (page) => {
    switch (page) {
      case biometricUsersRoutesList.all:
        eventManager.send_event(
          events.HRMS_USER_MAPPING_ALL_USERS_TAB_CLICKED_TFI
        )
        break
      case biometricUsersRoutesList.registered:
        eventManager.send_event(
          events.HRMS_USER_MAPPING_REGISTERED_USERS_TAB_CLICKED_TFI
        )
        break
      case biometricUsersRoutesList.unregistered:
        eventManager.send_event(
          events.HRMS_USER_MAPPING_UNREGISTERED_USERS_TAB_CLICKED_TFI
        )
        break
      default:
        break
    }
  }

  let history = useHistory()
  let {path} = useRouteMatch()

  const handleTabClick = (tab) => {
    history.push(tab.link)
    registerEvent(tab.link)
  }

  const {staffListData} = useSelector((state) => state.staffAttendance)
  const shiftList = useSelector((state) => state?.globalData?.shiftList?.data)

  const biometricUserMapping = useSelector(
    (state) => state?.globalData?.fetchBiometricUsersList?.data
  )

  const biometricUsersTabOptions = Object.values(BiometricUsersTablist()).map(
    (page) => ({
      id: page.id,
      label: page.label,
      link: page.route,
    })
  )

  const [currentTab, setCurrentTab] = useState(null)

  const rowItemPreview = (data1, data2) => (
    <div>
      <Para
        type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
        className={styles.phoneNumber}
      >
        {data1}
      </Para>
      {data2 && <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>{data2}</Para>}
    </div>
  )

  useEffect(() => {
    let selectedTab = biometricUsersTabOptions.find(
      (obj) => obj.link === currentLocation.pathname
    )
    setCurrentTab(selectedTab)

    if (selectedTab?.id) {
      setCurrentTab(selectedTab)
      setSelectedTab(selectedTab.id)
    } else {
      history.push(`${path}/all`)
      setCurrentTab(biometricUsersTabOptions[0])
    }

    if (!biometricUserMapping || !staffListData || !shiftList) {
      dispatch(globalActions?.fetchBiometricUsersList?.request())
      dispatch(globalActions?.fetchShiftList?.request())
      dispatch(fetchStaffListRequestAction())
    }
  }, [currentLocation.pathname])

  useEffect(() => {
    setCardError({
      iid: '',
      user_id: '',
    })
  }, [showEditModal])

  const handleEdit = (rowData) => {
    let editData = {
      imember_id: rowData?.imember_id,
      user_id: rowData?.user_id || '',
    }
    setUserData(editData)
    setShowEditModal(true)
  }

  // Return kebab menu component
  const UsersKebabMenu = ({rowData}) => (
    <div className={styles.kebabMenuWrapper}>
      <KebabMenu
        options={[
          {
            content: (
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.BiometricUserMappingController_update_route_update
                }
              >
                <div
                  className={styles.menuItem}
                  onClick={() => {
                    eventManager.send_event(
                      events.HRMS_EDIT_USER_ID_CLICKED_TFI
                    )
                    handleEdit(rowData)
                  }}
                >
                  <Icon
                    size={ICON_CONSTANTS.SIZES.X_SMALL}
                    name="edit1"
                    version={ICON_CONSTANTS.VERSION.OUTLINED}
                  />
                  {t('editUserID')}
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
          tooltipWrapper: styles.tooltipWrapper,
        }}
      />
    </div>
  )

  useEffect(() => {
    let userMappingDict = {}
    let registeredDict = {}

    let staffInBiometricShifts = []
    if (shiftList) {
      staffInBiometricShifts = shiftList
        .filter(
          (shift) =>
            shift?.setting?.attendance_method === ATTENDANCE_METHOD.BIOMETRIC
        )
        .reduce(
          (acc, shift) => Array.from(new Set([...acc, ...shift?.staffs])),
          []
        )
    }

    if (biometricUserMapping?.length > 0) {
      setShowEmptyState(false)

      biometricUserMapping?.forEach((user) => {
        userMappingDict[user.iid] = user.user_id
        registeredDict[user.iid] = user.registered
      })
    } else {
      setShowEmptyState(true)
    }

    let staffShiftNameMap = {}
    shiftList?.map((shift) => {
      if (shift?.staffs?.length > 0) {
        shift?.staffs?.map((staff) => (staffShiftNameMap[staff] = shift?.name))
      }
    })
    const rows =
      staffListData
        ?.filter((obj) => {
          if (staffInBiometricShifts.includes(obj?._id)) {
            return obj
          }
        })
        ?.map((obj) => ({
          imember_id: obj?._id,
          name: obj?.name,
          shift_name: staffShiftNameMap?.[obj?._id] || '-',
          user_details: rowItemPreview(
            obj.name,
            obj?.phone_number ? `+${obj?.phone_number}` : obj?.email
          ),
          phone_number: obj?.phone_number,
          email_id: obj?.email,
          role: obj?.role_name,
          user_id: userMappingDict[obj._id] || '-',
          status_value: registeredDict[obj._id],
          status: registeredDict[obj._id] ? (
            <div className={styles.registered}>{t('registered')}</div>
          ) : (
            <div className={styles.unregistered}>{t('unregistered')}</div>
          ),
          kebabMenu: (
            <UsersKebabMenu
              rowData={{
                imember_id: obj?._id,
                user_id: userMappingDict[obj._id] || '',
              }}
            />
          ),
        })) || []

    setAllRows(rows)
  }, [biometricUserMapping, staffListData])

  const getFilteredData = (value) => {
    let filteredDataList = allRows

    // Search
    if (value) {
      value = value.toLowerCase().trim()
      filteredDataList = filteredDataList?.filter(
        (item) =>
          item?.name?.toLowerCase()?.includes(value) ||
          item?.user_id?.toLowerCase()?.includes(value) ||
          item?.phone_number?.toLowerCase()?.startsWith(value)
      )
    }

    // verified unverified map
    let link = currentTab?.link
    if (UserIDStatusTabMap[link] !== null) {
      filteredDataList = filteredDataList?.filter((item) => {
        if (UserIDStatusTabMap[link]) {
          return item?.status_value === true
        } else {
          return item?.status_value !== true
        }
      })
    }

    // role filters
    let roleFilters = Object.values(typeOfRoles)
      ?.filter((item) => item?.selected)
      ?.map((item) => item?.id)

    if (roleFilters?.length) {
      filteredDataList = filteredDataList?.filter((item) => {
        if (roleFilters.includes(item?.role)) {
          return item
        }
      })
    }
    setFilteredData(filteredDataList)
  }

  useEffect(() => {
    let tempData = allRows?.reduce(function (currentDict, item) {
      currentDict[item?.role] = {
        id: item?.role,
        label: item?.role,
        selected: false,
      }
      return currentDict
    }, {})
    setTypeOfRoles(tempData || {})
    getFilteredData(searchText)
  }, [currentTab, allRows, staffListData])

  useEffect(() => {
    getFilteredData(searchText)
  }, [typeOfRoles])

  const USERS_TABLE_COLUMNS = [
    {key: 'user_details', label: t('userDetails1')},
    {key: 'shift_name', label: t('shiftName')},
    {key: 'role', label: t('userRolesPlaceholder')},
    {key: 'user_id', label: t('userID')},
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
              toolTipBody={t('biometricUserPageStatusHeaderTooltipText')}
              classNames={{toolTipBody: styles.statusTooltipBody}}
            ></Tooltip>
          </div>
        </div>
      ),
    },
    {key: 'kebabMenu', label: ''},
  ]

  const handleSearchFilter = (text) => {
    setSearchText(text)
    getFilteredData(text)
  }

  return (
    <>
      <div className={styles.wrapper}>
        <Breadcrumb
          textSize={BREADCRUMB_CONSTANTS.TEXT_SIZES.LARGE}
          paths={[
            {
              label: t('biometricConfiguration'),
              onClick: () =>
                history.push(
                  '/institute/dashboard/hrms-configuration/biometric-configuration'
                ),
            },
            {
              label: t('userMapping'),
              onClick: () =>
                history.push(
                  '/institute/dashboard/hrms-configuration/biometric-users'
                ),
            },
          ]}
        />
        <div className={styles.header}>
          <HeaderTemplate
            showBreadcrumb={false}
            mainHeading={t('userMapping')}
            classes={{
              mainHeading: styles.mainHeading,
              subHeading: styles.subHeading,
              divider: styles.divider,
            }}
          />
          {!showEmptyState ? (
            <>
              <div className={styles.tabGroupWrapper}>
                <TabGroup
                  showMoreTab={false}
                  tabOptions={biometricUsersTabOptions}
                  selectedTab={selectedTab}
                  onTabClick={handleTabClick}
                />
              </div>
              <div className={styles.container}>
                <div className={styles.searchBox}>
                  <SearchBox
                    value={searchText}
                    placeholder={t('searchBiometricUsersPlaceholder')}
                    handleSearchFilter={handleSearchFilter}
                  />
                </div>
                <div className={styles.container}>
                  <div>
                    <RoleFilterDropdown
                      allData={allRows}
                      typeOfRoles={typeOfRoles}
                      setTypeOfRoles={setTypeOfRoles}
                    />
                  </div>
                  <div className={styles.bulkUploadButton}>
                    <Permission
                      permissionId={
                        PERMISSION_CONSTANTS.BiometricUserMappingController_update_route_update
                      }
                    >
                      <Button
                        prefixIcon={
                          <Icon
                            name="uploadAlt"
                            type={ICON_CONSTANTS.TYPES.INVERTED}
                            size={ICON_CONSTANTS.SIZES.XX_SMALL}
                          />
                        }
                        onClick={() => {
                          setShowBulkUploadModal(true)
                          eventManager.send_event(
                            events.HRMS_USER_MAPPING_BULK_UPLOAD_INITIATE_CLICKED_TFI
                          )
                        }}
                        width={BUTTON_CONSTANTS.WIDTH.FULL}
                        classes={{
                          prefixIcon: styles.bulkUploadIcon,
                          label: styles.marginRight,
                        }}
                      >
                        <span>{t('bulkUpload')}</span>
                      </Button>
                    </Permission>
                  </div>
                </div>
              </div>
              <div className={styles.marginTop}>
                <Table rows={filteredData} cols={USERS_TABLE_COLUMNS} />
              </div>

              <EditUsersModal
                showModal={showEditModal}
                setShowModal={setShowEditModal}
                userData={userData}
                cardError={cardError}
                setUserData={setUserData}
                setCardError={setCardError}
                allRows={allRows}
              />
            </>
          ) : (
            <EmptyState
              iconName="viewQuilt"
              content={
                <Para>
                  {t('biometricUserMappingEmptyState')}
                  <Permission
                    permissionId={
                      PERMISSION_CONSTANTS.BiometricUserMappingController_update_route_update
                    }
                  >
                    <Button
                      prefixIcon={
                        <Icon
                          name="uploadAlt"
                          type={ICON_CONSTANTS.TYPES.INVERTED}
                          size={ICON_CONSTANTS.SIZES.XX_SMALL}
                        />
                      }
                      onClick={() => {
                        setShowBulkUploadModal(true)
                        eventManager.send_event(
                          events.HRMS_USER_MAPPING_BULK_UPLOAD_INITIATE_CLICKED_TFI
                        )
                      }}
                      classes={{button: styles.buttonWrapper}}
                    >
                      {t('bulkUpload')}
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
        </div>
      </div>
      <BiometricUserMappingBulkUploadModal
        showModal={showBulkUploadModal}
        setShowModal={setShowBulkUploadModal}
        allData={allRows}
      />
    </>
  )
}
