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
import styles from './StudentDirectory.module.css'
import {useDispatch, useSelector} from 'react-redux'
import {events} from '../../../../utils/EventsConstants'
import {
  checkSubscriptionType,
  createAndDownloadCSV,
  searchBoxFilter,
} from '../../../../utils/Helpers'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import StudentTable from '../../components/StudentTable/StudentTable'
import CommunicationSMSModal from '../../../../components/Common/CommunicationSMSModal/CommunicationSMSModal'
import {
  CommonActionType,
  SliderActionTypes,
} from '../../../communication/redux/actionTypes'
import {sidebarData} from '../../../../utils/SidebarItems'
import {announcementType} from '../../../communication/constants'
import history from '../../../../history'
import {getNodesListOfSimilarTypeWithChildren} from '../../../../utils/HierarchyHelpers'
import {NODE_CLASS, NODE_SECTION} from '../../../../utils/SchoolSetupConstants'
import StudentSearchFilterSection from '../../components/StudentSearchFilterSection/StudentSearchFilterSection'
import {processDataSettingsKeyIdCSV} from '../../../../components/SchoolSystem/SectionDetails/DynamicSettingsKeyIdCSV'
import SliderAddStudentDir from '../../components/SliderAddStudentDir/SliderAddStudentDir'
import {statusOptions, genderOptions} from '../../studentManagement.constants'
import {
  showErrorOccuredAction,
  showFeatureLockAction,
  showLoadingAction,
} from '../../../../redux/actions/commonAction'
import MultipleDuplicateUsers from '../../../../components/SchoolSystem/StudentDirectory/MultipleDuplicateUsers'
import {
  INSTITUTE_TYPES,
  INSTITUTE_MEMBER_TYPE,
} from '../../../../constants/institute.constants'

const initailFilterState = {status: [], gender: [], classes: []}
import hazardIcon from '../../../../assets/images/icons/hazard-icon.svg'
import {
  duplicateStudentListAction,
  instituteAllClassesAction,
  instituteStudentListAction,
  studentListLoadingAction,
} from '../../../../redux/actions/instituteInfoActions'
import {utilsGetUsersList} from '../../../../routes/dashboard'
import {utilsGetUncatergorizedClasses} from '../../../../routes/instituteSystem'
import {addPersonaMembersAction} from '../../../InstituteSettings/InstituteSettings.actions'
import {clearReduxStateAction} from '../../../user-profile/redux/actions/teacherActions'
import {
  setMessageAction,
  setTitleAction,
} from '../../../communication/redux/actions/announcementActions'
import UpdateDataModal from '../../components/UpdateDataModal/UpdateDataModal'

export default function StudentDirectory() {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {
    eventManager,
    instituteStudentList,
    instituteHierarchy,
    instituteInfo,
    duplicateStudentsList,
  } = useSelector((state) => state)
  const institutePersonaSettings = useSelector(
    (store) => store.globalData?.institutePersonaSettings?.data
  )
  const {student} = useSelector((state) => state.userProfileInfo)
  const [showAddNewStudentPopup, setShowAddNewStudentPopup] = useState(false)
  const [showUpdateStudentPopup, setShowUpdateStudentPopup] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchDropdownValue, setSearchDropdownValue] = useState('full_name')
  const [filterValueObj, setFilterValueObj] = useState(
    JSON.parse(JSON.stringify(initailFilterState))
  )
  const [globalStudentList, setGlobalStudentList] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [selectedStudents, setSelectedStudents] = useState([])
  const [smsPopupData, setSmsPopupData] = useState(null)
  const [classOptions, setClassOptions] = useState({})

  const [showCsvDuplicates, setShowCsvDuplicates] = useState(false)
  const isPremium = checkSubscriptionType(instituteInfo)

  // Update student data if redux updated
  useEffect(() => {
    setGlobalStudentList(
      instituteStudentList?.filter(
        ({verification_status}) => verification_status !== 4
      )
    )
  }, [instituteStudentList])

  // Update student data if Global list is updated
  useEffect(() => {
    handleSearchFilter(searchDropdownValue, searchText, filterValueObj)
  }, [globalStudentList])

  // Get and save class options in state
  useEffect(() => {
    getClassList()
  }, [instituteHierarchy])

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

  const handleSearchFilter = (searchBy, searchText, filterObj) => {
    // Filter
    const studentFiltedList = globalStudentList?.filter(
      ({verification_status, details, gender}) => {
        let flag = true

        // Status Check
        if (
          filterObj?.status?.length > 0 &&
          !filterObj?.status?.includes(verification_status)
        )
          flag = false

        // Gender check
        if (
          flag &&
          filterObj?.gender?.length > 0 &&
          !filterObj?.gender?.includes(gender)
        )
          flag = false

        // Classes check
        if (
          flag &&
          filterObj?.classes?.length > 0 &&
          !details?.sections?.some((item) => filterObj?.classes.includes(item))
        )
          flag = false

        return flag
      }
    )

    // Search
    let searchParams = [[searchBy]]
    setFilteredData(
      searchBoxFilter(searchText, studentFiltedList, searchParams)
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
    if (institutePersonaSettings?.length > 0) {
      eventManager.send_event(events.SIS_DOWNLOAD_LIST_CLICKED_TFI)

      const csvData = processDataSettingsKeyIdCSV(
        institutePersonaSettings,
        globalStudentList?.filter(({_id}) => selectedStudents?.includes(_id)),
        true
      )
      createAndDownloadCSV('Student-List', csvData)
    }
  }

  const handleSendAnnouncement = () => {
    dispatch({type: SliderActionTypes.SET_SLIDER, payload: true})

    dispatch(setTitleAction(''))
    dispatch(setMessageAction(''))
    dispatch({
      type: CommonActionType.SELECTED_USERS,
      payload: selectedStudents,
    })
    dispatch({
      type: CommonActionType.REDIRECT_ON_SUCCESS,
      payload: sidebarData.STUDENT_DIRECTORY.route,
    })
    dispatch({
      type: CommonActionType.REDIRECT_ON_CLOSE,
      payload: sidebarData.STUDENT_DIRECTORY.route,
    })

    history.push({
      pathname: sidebarData.ANNOUNCEMENTS.route,
      state: {selectedOption: announcementType.ANNOUNCEMENT},
    })

    eventManager.send_event(events.SIS_SEND_ANNOUNCEMENT_CLICKED_TFI)
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
      id: 'gender',
      label: t('gender'),
      chipList: filterValueObj?.gender?.map((item) => ({
        id: item,
        label: genderOptions[item]?.label,
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

  const handleSendSMS = () => {
    const studentMap = {}

    globalStudentList?.forEach((student) => {
      studentMap[student?._id] = student
    })

    setSmsPopupData({
      users: selectedStudents?.filter(
        (id) =>
          studentMap?.[id]?.verification_status === 2 &&
          studentMap?.[id]?.phone_number
      ),
    })

    eventManager.send_event(events.SIS_SEND_INVITE_CLICKED_TFI)
  }

  const cols = [
    {key: 'name', label: 'STUDENT NAME'},
    {key: 'enrollment_id', label: 'ENROLLMENT ID'},
    {key: 'phone_number', label: 'MOBILE NUMBER'},
    {
      key: 'class_section',
      label:
        instituteInfo.institute_type === INSTITUTE_TYPES.TUITION
          ? 'DEPARTMENT & BATCH'
          : 'CLASS & SECTION',
    },
    {key: 'icon', label: ' '},
  ]

  const getInstituteStudents = () => {
    dispatch(studentListLoadingAction(true))
    utilsGetUsersList({type: [INSTITUTE_MEMBER_TYPE.STUDENT]})
      .then(({status, obj}) => {
        dispatch(studentListLoadingAction(false))
        if (status) dispatch(instituteStudentListAction(obj))
      })
      .catch(() => dispatch(showErrorOccuredAction(true)))
      .finally(() => dispatch(studentListLoadingAction(false)))
  }

  const getInstituteClasses = () => {
    dispatch(showLoadingAction(true))
    utilsGetUncatergorizedClasses(instituteInfo?._id)
      .then(({status, obj}) => {
        if (status) dispatch(instituteAllClassesAction(obj))
      })
      .catch((_err) => dispatch(showErrorOccuredAction(true)))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const getDuplicateRows = (users) => {
    let rows = []
    users?.forEach((item) => {
      rows.push({
        id: item.phone_number,
        name: item.name,
        enrollment_id: item.enrollment_number ? item.enrollment_number : '-',
        phone_number: item.phone_number,
        class_section: item.standard + '-' + item.section,
        icon: <img className={styles.hazardIcon} src={hazardIcon}></img>,
      })
    })
    return rows
  }

  const handleAddDuplicateStudents = (users) => {
    const data = {users: users, type: 4, check: false}
    if ('nodeId' in duplicateStudentsList) {
      data['nodeId'] = duplicateStudentsList.nodeId
    }
    dispatch(addPersonaMembersAction({personaData: data, persona: 'STUDENT'}))
    setShowCsvDuplicates(false)
    dispatch(clearReduxStateAction())
    getInstituteStudents(instituteInfo._id)
    getInstituteClasses()
    dispatch(duplicateStudentListAction({}))
  }

  useEffect(() => {
    if (student.updated) {
      setShowCsvDuplicates(false)
      dispatch(clearReduxStateAction())
      getInstituteStudents(instituteInfo._id)
      getInstituteClasses()
      dispatch(duplicateStudentListAction({}))
    }
  }, [student?.updated])

  useEffect(() => {
    if (duplicateStudentsList?.users?.existing_users?.length > 0)
      setShowCsvDuplicates(true)
  }, [duplicateStudentsList])
  const chipsItemsData = chipsItems?.filter(
    ({chipList}) => chipList?.length > 0
  )

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerWrapper}>
        <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.MEDIUM}>
          {t('studentManagement')}
        </Heading>

        {globalStudentList?.length > 0 && (
          <div className={styles.headerButtonWrapper}>
            <Permission
              permissionId={PERMISSION_CONSTANTS.ipsController_addUsers_create}
            >
              <Button
                onClick={() => {
                  setShowAddNewStudentPopup(true)
                  eventManager.send_event(events.ADD_STUDENT_INITIALIZED_TFI, {
                    screen_name: 'student_directory',
                  })
                }}
                classes={{button: styles.headerButton}}
              >
                {t('addNewStudents')}
              </Button>
            </Permission>
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.ipsController_updateUsers_update
              }
            >
              <Button
                type={BUTTON_CONSTANTS.TYPE.OUTLINE}
                onClick={() => {
                  setShowUpdateStudentPopup(true)
                  eventManager.send_event(
                    events.UPDATE_EXISTING_STUDENT_CLICKED_TFI,
                    {screen_name: 'update_student'}
                  )
                }}
                classes={{button: styles.headerButton}}
              >
                {t('updateData')}
              </Button>
            </Permission>
          </div>
        )}
      </div>
      <Divider spacing="20px" />

      {globalStudentList?.length > 0 ? (
        <>
          <StudentSearchFilterSection
            instituteType={instituteInfo?.institute_type}
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
                      className={styles.filterChip}
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

          {selectedStudents?.length > 0 && (
            <div className={styles.selectionWrapper}>
              <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
                {`${selectedStudents?.length || 0}/${
                  globalStudentList?.length || 0
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
            <StudentTable
              instituteType={instituteInfo?.institute_type}
              filteredData={filteredData}
              selectedStudents={selectedStudents}
              setSelectedStudents={setSelectedStudents}
              setSmsPopupData={setSmsPopupData}
            />
          ) : (
            <EmptyState
              iconName="search"
              content={t('studentsEmptySearchTitle')}
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
              <Para className={styles.textCenter}>
                {t('studentsEmptyScreenTitle')}
              </Para>
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.ipsController_addUsers_create
                }
              >
                <Button
                  onClick={() => {
                    setShowAddNewStudentPopup(true)
                    eventManager.send_event(
                      events.ADD_STUDENT_INITIALIZED_TFI,
                      {screen_name: 'student_directory'}
                    )
                  }}
                  classes={{button: styles.emptyButtonWrapper}}
                >
                  {t('addNewStudents')}
                </Button>
              </Permission>
            </div>
          }
          button={null}
          classes={{wrapper: styles.emptyStateWrapper}}
        />
      )}

      {showAddNewStudentPopup && (
        <SliderAddStudentDir setSliderScreen={setShowAddNewStudentPopup} />
      )}

      {showUpdateStudentPopup && (
        <UpdateDataModal
          open={showUpdateStudentPopup}
          setShow={setShowUpdateStudentPopup}
        />
      )}

      {showCsvDuplicates && (
        <MultipleDuplicateUsers
          cols={cols}
          rows={getDuplicateRows(duplicateStudentsList.users.existing_users)}
          users={'Students'}
          items={duplicateStudentsList.users}
          setSliderScreen={() => setShowCsvDuplicates(false)}
          handleAddDuplicateUsers={handleAddDuplicateStudents}
          instituteID={instituteInfo._id}
        />
      )}

      <CommunicationSMSModal
        showModal={!!smsPopupData}
        setShowModal={setSmsPopupData}
        templateId="WELCOME_SMS"
        usersList={smsPopupData?.users}
      />
    </div>
  )
}
