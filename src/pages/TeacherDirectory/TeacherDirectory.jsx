import React, {useEffect, useState} from 'react'
import {
  Button,
  BUTTON_CONSTANTS,
  Chips,
  CHIP_CONSTANTS,
  Divider,
  EmptyState,
  Heading,
  HEADING_CONSTANTS,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import styles from './TeacherDirectory.module.css'
import SliderAddTeacherDir from './components/SliderAddTeacherDir/SliderAddTeacherDir'
import {useDispatch, useSelector} from 'react-redux'
import {events} from '../../utils/EventsConstants'
import {
  checkSubscriptionType,
  createAndDownloadCSV,
  searchBoxFilter,
} from '../../utils/Helpers'
import Permission from '../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../utils/permission.constants'
import TeacherTable from './components/TeacherTable/TeacherTable'
import CommunicationSMSModal from '../../components/Common/CommunicationSMSModal/CommunicationSMSModal'
import {
  CommonActionType,
  SliderActionTypes,
} from '../communication/redux/actionTypes'
import {sidebarData} from '../../utils/SidebarItems'
import {announcementType} from '../communication/constants'
import history from '../../history'
import {getNodesListOfSimilarTypeWithChildren} from '../../utils/HierarchyHelpers'
import {NODE_CLASS, NODE_SECTION} from '../../utils/SchoolSetupConstants'
import TeacherSearchFilterSection from './components/TeacherSearchFilterSection/TeacherSearchFilterSection'
import {USER_TYPE_SETTINGS} from '../user-profile/constants'
import globalActions from '../../redux/actions/global.actions'
import {getCategoriesCollection} from '../ProfileSettings/ProfileSettings.utils'
import {SETTING_TYPE} from '../ProfileSettings/ProfileSettings.constant'
import {fetchCategoriesRequestAction} from '../ProfileSettings/redux/actions/ProfileSettingsActions'
import {personaProfileSettingsSelector} from '../ProfileSettings/redux/ProfileSettingsSelectors'
import {
  addPersonaMembersAction,
  getInstitutePersonaSettingsAction,
} from '../InstituteSettings/InstituteSettings.actions'
import {processDataSettingsKeyIdCSV} from '../../components/SchoolSystem/SectionDetails/DynamicSettingsKeyIdCSV'
import SliderTeacherDetail from './components/SliderTeacherDetail/SliderTeacherDetail'
import {
  showErrorOccuredAction,
  showFeatureLockAction,
} from '../../redux/actions/commonAction'
import MultipleDuplicateUsers from '../../components/SchoolSystem/StudentDirectory/MultipleDuplicateUsers'
import hazardIcon from '../../assets/images/icons/hazard-icon.svg'
import {clearReduxStateAction} from '../user-profile/redux/actions/teacherActions'
import {
  duplicateTeacherListAction,
  instituteTeacherListAction,
  teacherListLoadingAction,
} from '../../redux/actions/instituteInfoActions'
import {INSTITUTE_MEMBER_TYPE} from '../../constants/institute.constants'
import {utilsGetUsersList} from '../../routes/dashboard'
import Loader from '../../components/Common/Loader/Loader'
import {
  setMessageAction,
  setTitleAction,
} from '../communication/redux/actions/announcementActions'

const initailFilterState = {status: [], classes: []}

export default function TeacherDirectory() {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const institutePersonaSettings = useSelector(
    (store) => store.globalData?.institutePersonaSettings?.data
  )
  const personaProfileSettingsData = personaProfileSettingsSelector()
  const {
    eventManager,
    instituteTeacherList,
    instituteHierarchy,
    duplicateTeachersList,
    instituteInfo,
    teacherListLoading,
  } = useSelector((state) => state)
  const {teacher} = useSelector((state) => state.userProfileInfo)

  const [showCsvDuplicates, setShowCsvDuplicates] = useState(false)
  const [showAddNewTeacherPopup, setShowAddNewTeacherPopup] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchDropdownValue, setSearchDropdownValue] = useState('full_name')
  const [filterValueObj, setFilterValueObj] = useState(
    JSON.parse(JSON.stringify(initailFilterState))
  )
  const [filteredData, setFilteredData] = useState([])
  const [selectedTeachers, setSelectedTeachers] = useState([])
  const [smsPopupData, setSmsPopupData] = useState(null)
  const [classOptions, setClassOptions] = useState({})
  const [showTeacherDetailsSilder, setShowTeacherDetailsSilder] = useState(null)
  const isPremium = checkSubscriptionType(instituteInfo)
  const [isLoading, setIsLoading] = useState(true)

  // Update teacher data if redux updated
  useEffect(() => {
    handleSearchFilter(searchDropdownValue, searchText, filterValueObj)
  }, [instituteTeacherList])

  // Get and save class options in state
  useEffect(() => {
    getClassList()
  }, [instituteHierarchy])

  const statusOptions = {
    1: {label: t('joinedOnApp'), value: 1},
    2: {label: t('appNotInstalled'), value: 2},
    4: {label: t('inactive'), value: 4},
  }

  // Get Category collection functions start
  useEffect(() => {
    const getProfileSettings = {persona: USER_TYPE_SETTINGS.STAFF.id}
    dispatch(
      globalActions?.fetchPersonaProfileSettingsRequestAction?.request(
        getProfileSettings
      )
    )
    dispatch(getInstitutePersonaSettingsAction('STAFF'))
  }, [])

  useEffect(() => {
    let categoriesCollection = null
    if (personaProfileSettingsData?.data?.length > 0) {
      categoriesCollection = getCategoriesCollection(
        personaProfileSettingsData.data,
        SETTING_TYPE.CATEGORY_FOR_INFO
      )
    }
    dispatch(fetchCategoriesRequestAction(categoriesCollection))
  }, [personaProfileSettingsData])
  // Get Category collection functions end

  const getClassList = () => {
    const classNodes = getNodesListOfSimilarTypeWithChildren(
      instituteHierarchy,
      NODE_CLASS
    )

    const classOptionsTemp = {}
    classNodes?.forEach((classItem) => {
      classItem?.children?.forEach((sectionItem) => {
        if (sectionItem?.type === NODE_SECTION)
          classOptionsTemp[sectionItem.id] = {
            value: sectionItem?.id,
            label: `${classItem?.name} - ${sectionItem?.name}`,
          }
      })
    })
    setClassOptions(classOptionsTemp)
  }

  const getInstituteTeachers = () => {
    dispatch(teacherListLoadingAction(true))
    utilsGetUsersList({type: [INSTITUTE_MEMBER_TYPE.TEACHER]})
      .then(({status, obj}) => {
        if (status) dispatch(instituteTeacherListAction(obj))
      })
      .catch(() => dispatch(showErrorOccuredAction(true)))
      .finally(() => dispatch(teacherListLoadingAction(false)))
  }

  useEffect(() => {
    setIsLoading(teacherListLoading)
  }, [teacherListLoading])

  const handleSearchFilter = (searchBy, searchText, filterObj) => {
    // Filter
    const teacherFilteredList = instituteTeacherList?.filter(
      ({verification_status, details}) => {
        let keepTeacher = true

        // Status Check
        if (
          filterObj?.status?.length > 0 &&
          !filterObj?.status?.includes(verification_status)
        )
          keepTeacher = false

        // Classes check
        if (
          keepTeacher &&
          filterObj?.classes?.length > 0 &&
          !details?.sections?.some((item) => filterObj?.classes.includes(item))
        )
          keepTeacher = false

        return keepTeacher
      }
    )

    // Search
    let searchParams = [[searchBy]]
    setFilteredData(
      searchBoxFilter(searchText, teacherFilteredList, searchParams)
    )
  }

  const handleRemoveFilterChip = (type, chipId) => {
    let filterValueNew = filterValueObj?.[type]?.filter(
      (item) => item !== chipId
    )
    const filterValueObjNew = {...filterValueObj, [type]: filterValueNew}
    setFilterValueObj(filterValueObjNew)
    handleSearchFilter(searchDropdownValue, searchText, filterValueObjNew)
  }

  const handleDownload = () => {
    if (institutePersonaSettings && institutePersonaSettings?.length > 0)
      createAndDownloadCSV(
        'Teacher-List',
        processDataSettingsKeyIdCSV(
          institutePersonaSettings,
          instituteTeacherList?.filter(({_id}) =>
            selectedTeachers?.includes(_id)
          )
        )
      )
  }

  const handleSendAnnouncement = () => {
    dispatch({type: SliderActionTypes.SET_SLIDER, payload: true})

    dispatch(setTitleAction(''))
    dispatch(setMessageAction(''))
    dispatch({
      type: CommonActionType.REDIRECT_ON_SUCCESS,
      payload: sidebarData.TEACHER_DIRECTORY.route,
    })
    dispatch({
      type: CommonActionType.REDIRECT_ON_CLOSE,
      payload: sidebarData.STUDENT_DIRECTORY.route,
    })
    dispatch({
      type: CommonActionType.SELECTED_USERS,
      payload: selectedTeachers,
    })

    history.push({
      pathname: sidebarData.ANNOUNCEMENTS.route,
      state: {selectedOption: announcementType.ANNOUNCEMENT},
    })
  }

  const handleSendSMS = () => {
    const teacherMap = {}

    instituteTeacherList?.forEach((teacher) => {
      teacherMap[teacher?._id] = teacher
    })

    setSmsPopupData({
      users: selectedTeachers?.filter(
        (id) =>
          teacherMap?.[id]?.verification_status === 2 &&
          teacherMap?.[id]?.phone_number
      ),
    })
  }

  const chipsItems = [
    {
      id: 'status',
      label: t('status'),
      chipList: filterValueObj?.status?.map((item) => ({
        id: item,
        label: statusOptions[item]?.label,
      })),
    },
    {
      id: 'classes',
      label: t('class'),
      chipList: filterValueObj?.classes?.map((item) => ({
        id: item,
        label: classOptions[item]?.label,
      })),
    },
  ]
  const chipsItemsData = chipsItems?.filter(
    ({chipList}) => chipList?.length > 0
  )

  const cols = [
    {key: 'name', label: t('teacherNameCP')},
    {key: 'employee_id', label: t('employeeId')},
    {key: 'phone_number', label: t('mobileNumberCP')},
    {key: 'icon', label: ' '},
  ]

  const getDuplicateRows = (users) => {
    let rows = []
    users?.forEach((item) => {
      rows.push({
        id: item.phone_number,
        name: item.name,
        employee_id: item.employee_id ? item.employee_id : '-',
        phone_number: item.phone_number,
        icon: <img src={hazardIcon}></img>,
      })
    })
    return rows
  }

  const handleAddDuplicateTeachers = (users) => {
    const data = {users: users, type: 2, check: false}
    dispatch(addPersonaMembersAction({personaData: data, persona: 'TEACHER'}))
    setShowCsvDuplicates(false)
    dispatch(clearReduxStateAction())
    dispatch(duplicateTeacherListAction([]))
    getInstituteTeachers(instituteInfo._id)
  }

  useEffect(() => {
    if (duplicateTeachersList?.existing_users?.length > 0)
      setShowCsvDuplicates(true)
  }, [duplicateTeachersList])

  useEffect(() => {
    if (teacher.updated) {
      setShowCsvDuplicates(false)
      dispatch(clearReduxStateAction())
      getInstituteTeachers(instituteInfo._id)
    }
  }, [teacher?.updated])

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerWrapper}>
        <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.MEDIUM}>
          {t('teacherDirectory')}
        </Heading>

        {instituteTeacherList?.length > 0 && (
          <Permission
            permissionId={PERMISSION_CONSTANTS.ipsController_addUsers_create}
          >
            <Button
              onClick={() => {
                setShowAddNewTeacherPopup(true)
                eventManager.send_event(events.ADD_TEACHER_CLICKED, {
                  screen_name: 'teachers_directory',
                })
              }}
            >
              {t('addNewTeacher')}
            </Button>
          </Permission>
        )}
      </div>
      <Divider spacing="20px" />

      {instituteTeacherList?.length > 0 ? (
        <>
          <TeacherSearchFilterSection
            instituteType={instituteInfo?.institute_type}
            statusOptions={statusOptions}
            classOptions={classOptions}
            searchText={searchText}
            setSearchText={setSearchText}
            searchDropdownValue={searchDropdownValue}
            setSearchDropdownValue={setSearchDropdownValue}
            filterValueObj={filterValueObj}
            setFilterValueObj={setFilterValueObj}
            handleSearchFilter={handleSearchFilter}
          />

          {chipsItemsData?.length > 0 && (
            <div className={styles.chipsWrapper}>
              {chipsItemsData?.map(({id, label, chipList}, i) => (
                <>
                  <div className={styles.filterChipItem}>
                    <Para>{label}</Para>
                    <Chips
                      size={CHIP_CONSTANTS.SIZE.SMALL}
                      chipList={chipList}
                      onChange={(chipId) => handleRemoveFilterChip(id, chipId)}
                    />
                  </div>

                  {i !== chipsItemsData?.length - 1 && (
                    <Divider
                      isVertical={true}
                      classes={{
                        wrapper: styles.chipsDividerWrapper,
                        divider: styles.chipsDivider,
                      }}
                      spacing="0px"
                    />
                  )}
                </>
              ))}

              <Button
                type={BUTTON_CONSTANTS.TYPE.TEXT}
                category={BUTTON_CONSTANTS.CATEGORY.DESTRUCTIVE}
                onClick={() => {
                  const filterValueObjNew = JSON.parse(
                    JSON.stringify(initailFilterState)
                  )
                  setFilterValueObj(filterValueObjNew)
                  handleSearchFilter(
                    searchDropdownValue,
                    searchText,
                    filterValueObjNew
                  )
                }}
              >
                {t('clearAll')}
              </Button>
            </div>
          )}

          {selectedTeachers?.length > 0 && (
            <div className={styles.selectionWrapper}>
              <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
                {`${selectedTeachers?.length || 0}/${
                  instituteTeacherList?.length || 0
                } ${t('selected')}`}
              </Para>

              <div className={styles.actionsWrapper}>
                <Button
                  type={BUTTON_CONSTANTS.TYPE.TEXT}
                  onClick={handleDownload}
                >
                  {t('downloadList')}
                </Button>
                <Divider isVertical={true} spacing="0" />
                <Button
                  type={BUTTON_CONSTANTS.TYPE.TEXT}
                  onClick={handleSendAnnouncement}
                >
                  {t('sendAnnouncement')}
                </Button>
                <Divider isVertical={true} spacing="0" />

                <Permission
                  permissionId={PERMISSION_CONSTANTS.SmsController_send_create}
                >
                  <Button
                    type={BUTTON_CONSTANTS.TYPE.TEXT}
                    onClick={() => {
                      isPremium
                        ? handleSendSMS()
                        : dispatch(showFeatureLockAction(!isPremium))
                    }}
                  >
                    {t('sendInvite')}
                  </Button>
                </Permission>
              </div>
            </div>
          )}

          {filteredData?.length > 0 ? (
            <TeacherTable
              instituteType={instituteInfo?.institute_type}
              filteredData={filteredData}
              selectedTeachers={selectedTeachers}
              setSelectedTeachers={setSelectedTeachers}
              setSmsPopupData={setSmsPopupData}
              setShowTeacherDetailsSilder={setShowTeacherDetailsSilder}
            />
          ) : (
            <EmptyState
              iconName="search"
              content={t('teachersEmptySearchTitle')}
              classes={{wrapper: styles.emptyStateWrapper}}
              button={null}
            />
          )}
        </>
      ) : (
        <EmptyState
          iconName="viewQuilt"
          content={
            <div>
              <Para>{t('addingTeachersInstituteEmptyScreenTitle')}</Para>
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.ipsController_addUsers_create
                }
              >
                <Button
                  onClick={() => {
                    setShowAddNewTeacherPopup(true)
                    eventManager.send_event(events.ADD_TEACHER_CLICKED, {
                      screen_name: 'teachers_directory',
                    })
                  }}
                  classes={{button: styles.emptyButtonWrapper}}
                >
                  {t('addNewTeacher')}
                </Button>
              </Permission>
            </div>
          }
          button={null}
          classes={{wrapper: styles.emptyStateWrapper}}
        />
      )}

      {showAddNewTeacherPopup && (
        <SliderAddTeacherDir setSliderScreen={setShowAddNewTeacherPopup} />
      )}

      {showTeacherDetailsSilder && (
        <SliderTeacherDetail
          setSliderScreen={setShowTeacherDetailsSilder}
          selectedTeacher={showTeacherDetailsSilder}
        />
      )}

      {showCsvDuplicates && (
        <MultipleDuplicateUsers
          cols={cols}
          rows={getDuplicateRows(duplicateTeachersList.existing_users)}
          users={'Teachers'}
          items={duplicateTeachersList}
          setSliderScreen={() => setShowCsvDuplicates(false)}
          handleAddDuplicateUsers={handleAddDuplicateTeachers}
        />
      )}
      <Loader show={isLoading} />
      <CommunicationSMSModal
        showModal={!!smsPopupData}
        setShowModal={setSmsPopupData}
        templateId="WELCOME_SMS"
        usersList={smsPopupData?.users}
      />
    </div>
  )
}
