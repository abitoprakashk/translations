import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import NormalCard from '../../Common/NormalCard/NormalCard'
import SearchBox from '../../Common/SearchBox/SearchBox'
import Table from '../../Common/Table/Table'
import {Button, Table as CommonTable} from '@teachmint/common'
import {
  HIERARCHY_STUDENT_DIR_TABLE_HEADERS,
  HIERARCHY_STUDENT_DIR_TABLE_HEADERS_MOBILE,
  NON_HIERARCHY_STUDENT_DIR_TABLE_HEADERS,
  HIERARCHY_STUDENT_DIR_TABLE_HEADERS_TUITION,
  HIERARCHY_STUDENT_DIR_TABLE_HEADERS_MOBILE_TUITION,
} from '../../../utils/HierarchyOptions'
import UserProfile from '../../Common/UserProfile/UserProfile'
import * as SHC from '../../../utils/SchoolSetupConstants'
import SliderAddStudentDir from '../../../pages/StudentManagement/components/SliderAddStudentDir/SliderAddStudentDir'
import SliderStudentDetail from './SliderStudentDetail'
import SliderUpdateStudentCSV from '../SectionDetails/SliderUpdateStudentCSV'
import RadioInput from '../../Common/RadioInput/RadioInput'
import DropdownField from '../../Common/DropdownField/DropdownField'
import SliderMoveStudent from '../SectionDetails/SliderMoveStudent'
import EmptyScreenV1 from '../../Common/EmptyScreenV1/EmptyScreenV1'
import defaultStudentImage from '../../../assets/images/dashboard/empty-student.png'
import {events} from '../../../utils/EventsConstants'
import {isHierarchyAvailable} from '../../../utils/HierarchyHelpers'
import {getScreenWidth} from '../../../utils/Helpers'
import classNames from 'classnames'
import {INSTITUTE_TYPES} from '../../../constants/institute.constants'
import {useDispatch} from 'react-redux'
import {clearReduxStateAction} from '../../../pages/user-profile/redux/actions/studentActions'
import {searchBoxFilter} from '../../../utils/Helpers'
import {getActiveStudents} from '../../../redux/reducers/CommonSelectors'
import globalActions from '../../../redux/actions/global.actions'
import {personaProfileSettingsSelector} from '../../../pages/ProfileSettings/redux/ProfileSettingsSelectors'
import {getCategoriesCollection} from '../../../pages/ProfileSettings/ProfileSettings.utils'
import {fetchCategoriesRequestAction} from '../../../pages/ProfileSettings/redux/actions/ProfileSettingsActions'
import {USER_TYPE_SETTINGS} from '../../../pages/user-profile/constants'
import {SETTING_TYPE} from '../../../pages/ProfileSettings/ProfileSettings.constant'
import styles from './StudentDirectory.module.css'
import Loader from '../../Common/Loader/Loader'
import AcknowledgementPopup from '../../Common/AcknowledgementPopup/AcknowledgementPopup'
import lockedIcon from '../../../assets/images/icons/popup/locked-red.svg'
import {utilsGetSubscriptionData} from '../../../routes/dashboard'
import {dummySubscriptionData} from '../../../utils/DummyStats'
import {tooManyStudentsErrorContent} from '../../../utils/subscriptionHelpers'
import Permission from '../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../utils/permission.constants'

export default function StudentDirectory() {
  const [sourceList, setSourceList] = useState([])
  const [filteredStudent, setFilteredStudent] = useState([])
  const [sliderScreen, setSliderScreen] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [studentType, setStudentType] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [showManageStudent, setShowManageStudent] = useState(false)
  const [isLoadingLocal, setIsLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [subscriptionData, setSubscriptionData] = useState(
    dummySubscriptionData
  )
  const [popupTitle, setPopupTitle] = useState('Student licenses exhausted')

  const dispatch = useDispatch()
  const {t} = useTranslation()

  const {eventManager, instituteHierarchy, instituteInfo, studentListLoading} =
    useSelector((state) => state)

  const personaProfileSettingsData = personaProfileSettingsSelector()

  const instituteStudentList = getActiveStudents(true)
  const {student} = useSelector((state) => state.userProfileInfo)

  // Get Category collection functions start
  useEffect(() => {
    const getProfileSettings = {
      persona: USER_TYPE_SETTINGS.STUDENT.id,
    }
    dispatch(
      globalActions?.fetchPersonaProfileSettingsRequestAction?.request(
        getProfileSettings
      )
    )
  }, [])

  useEffect(() => {
    let categoriesCollection = null
    if (
      personaProfileSettingsData.data &&
      personaProfileSettingsData.data.length > 0
    ) {
      categoriesCollection = getCategoriesCollection(
        personaProfileSettingsData.data,
        SETTING_TYPE.CATEGORY_FOR_INFO
      )
    }
    dispatch(fetchCategoriesRequestAction(categoriesCollection))
  }, [personaProfileSettingsData])
  // Get Category collection functions end

  useEffect(() => {
    setSourceList(instituteStudentList)
    setFilteredStudent(instituteStudentList)
    setStudentType(0)
  }, [instituteStudentList])

  useEffect(() => {
    setIsLoading(studentListLoading)
  }, [studentListLoading])

  const joinedStudents = instituteStudentList?.filter(
    ({verification_status}) => !verification_status || verification_status === 1
  )
  const pendingStudents = instituteStudentList?.filter(
    ({verification_status}) => verification_status === 2
  )
  const rejectedStudents = instituteStudentList?.filter(
    ({verification_status}) => verification_status === 3
  )

  const studentTypeOptions = [
    // {key: 0, value: `All - ${instituteStudentList?.length || 0}`},
    // { key: 0,value: <Trans i18nKey="userTypeOptionsValAll">All - {instituteStudentList?.length || 0}</Trans>},
    {
      key: 0,
      value: `${t('uTypeOptionsValAll')} ${instituteStudentList?.length || 0}`,
    },
    {
      key: 1,
      value: `${t('uTypeOptionsValJoined')} ${joinedStudents?.length || 0}`,
    },
    {
      key: 2,
      value: `${t('uTypeOptionsValPending')} ${pendingStudents?.length || 0}`,
    },
  ]

  useEffect(() => {
    if (student.updated) {
      dispatch(clearReduxStateAction())
    }
  }, [student?.updated])

  useEffect(() => {
    getSubscriptionData()
  }, [])

  function getSubscriptionData() {
    utilsGetSubscriptionData(instituteInfo._id).then(({data}) => {
      if (data.obj.subscription_type !== 2)
        data.obj.lms_order_form_students = 10
      setSubscriptionData(data)
    })
  }

  const handleChange = (action, node = null) => {
    switch (action) {
      case SHC.ACT_STD_DIR_ADD_STUDENT: {
        eventManager.send_event(events.ADD_STUDENT_INITIALIZED_TFI, {
          screen_name: 'student_directory',
        })
        getSubscriptionData()
        let studentLimit = 10
        if (
          subscriptionData.obj &&
          subscriptionData.obj.subscription_type === 2 &&
          subscriptionData.obj.lms_order_form_students
        )
          studentLimit = subscriptionData.obj.lms_order_form_students
        if (instituteStudentList.length >= studentLimit) {
          setShowPopup(true)
          setSliderScreen(false)
          if (instituteStudentList.length > studentLimit)
            setPopupTitle('Student licenses exceeded!')
          else setPopupTitle('Student licenses exhausted!')
        } else {
          setShowPopup(false)
          setSliderScreen(SHC.SCN_SLI_ADD_DIR_STUDENT)
        }
        break
      }
      case SHC.SCN_SLI_STUDENT_UPDATE_CSV: {
        eventManager.send_event(events.UPDATE_EXISTING_STUDENT_CLICKED_TFI, {
          screen_name: 'update_student',
        })
        setSliderScreen(SHC.SCN_SLI_STUDENT_UPDATE_CSV)
        break
      }
      case SHC.ACT_STD_DIR_STUDENT_DETAIL: {
        eventManager.send_event(events.STUDENT_SELECTED_TFI, {
          screen_name: 'student_directory',
          section_id: node?.sectionId,
        })
        setSliderScreen(SHC.SCN_SLI_STUDENT_DETAIL)
        setSelectedStudent(node)
        break
      }
      case SHC.ACT_STD_MOVE_STUDENT:
        eventManager.send_event(events.MOVE_STUDENT_INITIALIZED_TFI, {
          screen_name: 'student_directory',
          type: 'move',
          section_id: node?.sectionId,
        })
        setSliderScreen(SHC.SCN_SLI_SEC_MOVE_STUDENT)
        setSelectedStudent(node)
        break

      case SHC.ACT_STD_ASSIGN_STUDENT: {
        eventManager.send_event(events.MOVE_STUDENT_INITIALIZED_TFI, {
          screen_name: 'student_directory',
          type: 'assign',
        })
        setSliderScreen(SHC.SCN_SLI_SEC_MOVE_STUDENT)
        setSelectedStudent(node)
        break
      }
      case SHC.ACT_SUB_SEARCH_SELECT: {
        setStudentType(node)
        let list = []
        node = Number(node)
        switch (node) {
          case 0:
            list = instituteStudentList
            break
          case 1:
            list = joinedStudents
            break
          case 2:
            list = pendingStudents
            break
          case 3:
            list = rejectedStudents
            break
          default:
            break
        }
        setSourceList(list)
        setFilteredStudent(list)
        setSearchText('')
        break
      }
      default:
        break
    }
  }

  const getSliderScreen = (id) => {
    switch (id) {
      case SHC.SCN_SLI_ADD_DIR_STUDENT:
        return <SliderAddStudentDir setSliderScreen={setSliderScreen} />

      case SHC.SCN_SLI_STUDENT_DETAIL:
        return (
          <SliderStudentDetail
            setSliderScreen={setSliderScreen}
            studentId={selectedStudent}
            width={'900'}
          />
        )
      case SHC.SCN_SLI_SEC_MOVE_STUDENT:
        return (
          <SliderMoveStudent
            setSliderScreen={setSliderScreen}
            sectionDetails={{
              id: selectedStudent?.sectionId,
              name: selectedStudent?.classroom,
            }}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            screenName="student_directory"
          />
        )
      case SHC.SCN_SLI_STUDENT_UPDATE_CSV:
        return <SliderUpdateStudentCSV setSliderScreen={setSliderScreen} />
      default:
        break
    }
  }

  const handleSearchFilter = (text) => {
    setSearchText(text)
    let searchParams = [
      ['name'],
      ['phone_number'],
      ['email'],
      ['enrollment_number'],
    ]
    setFilteredStudent(searchBoxFilter(text, sourceList, searchParams))
  }

  const getRows = (students) => {
    let rows = []
    students?.forEach(
      ({
        _id,
        name,
        full_name,
        img_url,
        phone_number,
        email,
        enrollment_number,
        verification_status,
        classroom,
        classrooms,
        predecessor_id,
        details,
      }) => {
        rows.push({
          id: _id,
          student_details: (
            <UserProfile
              image={img_url}
              name={full_name && full_name !== '' ? full_name : name}
              phoneNumber={
                enrollment_number?.trim() ||
                phone_number?.trim() ||
                email?.trim()
              }
              joinedState={verification_status}
              handleChange={() =>
                handleChange(SHC.ACT_STD_DIR_STUDENT_DETAIL, _id)
              }
            />
          ),
          class_section: (
            <div className="tm-para tm-para-14">
              <div className="tm-para tm-para-14">
                {classrooms?.length > 0 ? classrooms?.join(', ') : 'NA'}
              </div>
            </div>
          ),
          action: verification_status !== 3 && verification_status !== 4 && (
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.instituteClassController_moveStudentSection_update
              }
            >
              <div
                className="tm-para-14 tm-cr-bl-2 cursor-pointer"
                onClick={() =>
                  handleChange(
                    classroom
                      ? SHC.ACT_STD_MOVE_STUDENT
                      : SHC.ACT_STD_ASSIGN_STUDENT,
                    {
                      phone_number,
                      name,
                      classroom,
                      id: predecessor_id,
                      _id: _id,
                      sectionId: details?.sections?.[0],
                    }
                  )
                }
              >
                {classroom ? t('move') : t('assign')}
              </div>
            </Permission>
          ),
        })
      }
    )
    return rows
  }

  return (
    <div className={styles.studentDirectoryWrapper}>
      {instituteStudentList?.length > 0 ? (
        <NormalCard
          className={styles.studentListCardWrapper}
          classes={{
            childrenWrapper: styles.studentList,
          }}
        >
          <div className="flex flex-wrap justify-between items-center p-4">
            <div className="w-full lg:max-w-md">
              <SearchBox
                value={searchText}
                placeholder={t('searchForStudentsByNameAndEnrollmentId')}
                handleSearchFilter={handleSearchFilter}
              />
            </div>
            <div className="w-full lg:w-min text-right tm-hdg-12 lg:tm-hdg-14 cursor-pointer tm-cr-bl-2 mt-4 lg:mt-0">
              <div className={styles.dropdown}>
                <Button
                  size="medium"
                  onClick={() => {
                    setShowManageStudent(true)
                    eventManager.send_event(events.MANAGE_STUDENT_CLICKED_TFI, {
                      screen_name: 'student_directory',
                    })
                  }}
                  className={styles.fullWidth}
                >
                  {t('manageStudents')}
                </Button>

                {showPopup ? (
                  <AcknowledgementPopup
                    onClose={setShowPopup}
                    icon={lockedIcon}
                    title={popupTitle}
                    desc={tooManyStudentsErrorContent(
                      subscriptionData,
                      instituteStudentList.length
                    )}
                    hideButtons={true}
                    closeActive={true}
                    dangerouslySetInnerHTML={true}
                  />
                ) : null}

                {showManageStudent && (
                  <div className={styles.dropdownContent}>
                    <Permission
                      permissionId={
                        PERMISSION_CONSTANTS.ipsController_addUsers_create
                      }
                    >
                      <button
                        onClick={() =>
                          handleChange(SHC.ACT_STD_DIR_ADD_STUDENT)
                        }
                      >
                        {t('addNewStudents')}
                      </button>
                    </Permission>
                    <Permission
                      permissionId={
                        PERMISSION_CONSTANTS.ipsController_updateUsers_update
                      }
                    >
                      <button
                        onClick={() =>
                          handleChange(SHC.SCN_SLI_STUDENT_UPDATE_CSV)
                        }
                      >
                        {t('updateExistingStudents')}
                      </button>
                    </Permission>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="hidden lg:block px-4">
            <RadioInput
              value={studentType}
              fieldName="studentType"
              handleChange={(_, value) =>
                handleChange(SHC.ACT_SUB_SEARCH_SELECT, value)
              }
              dropdownItems={studentTypeOptions}
            />
          </div>

          <div className="px-4 pb-2 lg:hidden">
            <DropdownField
              value={studentType}
              fieldName="studentType"
              handleChange={(_, value) =>
                handleChange(SHC.ACT_SUB_SEARCH_SELECT, value)
              }
              dropdownItems={studentTypeOptions}
            />
          </div>

          {getScreenWidth() < 1024 ? (
            <Table
              rows={getRows(filteredStudent)}
              cols={
                isHierarchyAvailable(instituteHierarchy)
                  ? instituteInfo.institute_type === INSTITUTE_TYPES.TUITION
                    ? HIERARCHY_STUDENT_DIR_TABLE_HEADERS_MOBILE_TUITION
                    : HIERARCHY_STUDENT_DIR_TABLE_HEADERS_MOBILE
                  : NON_HIERARCHY_STUDENT_DIR_TABLE_HEADERS
              }
            />
          ) : (
            <div className={classNames(styles.studentsListTableContainer)}>
              <CommonTable
                autoSize
                virtualized={filteredStudent?.length > 100}
                stickyHeader={false}
                itemSize={76}
                className="tm-bgcr-wh-1"
                rows={getRows(filteredStudent)}
                cols={
                  isHierarchyAvailable(instituteHierarchy)
                    ? instituteInfo.institute_type === INSTITUTE_TYPES.TUITION
                      ? HIERARCHY_STUDENT_DIR_TABLE_HEADERS_TUITION
                      : HIERARCHY_STUDENT_DIR_TABLE_HEADERS
                    : NON_HIERARCHY_STUDENT_DIR_TABLE_HEADERS
                }
              />
              {/*<Table*/}
              {/*  rows={getRows(filteredStudent)}*/}
              {/*  cols={*/}
              {/*    isHierarchyAvailable(instituteHierarchy)*/}
              {/*      ? HIERARCHY_STUDENT_DIR_TABLE_HEADERS*/}
              {/*      : NON_HIERARCHY_STUDENT_DIR_TABLE_HEADERS*/}
              {/*  }*/}
              {/*/>*/}
            </div>
          )}
        </NormalCard>
      ) : (
        <div className="bg-white rounded-lg w-full mt-6 h-screen pt-20 px-6">
          <EmptyScreenV1
            image={defaultStudentImage}
            title={t('addingStudentsEmptyScreenTitle')}
            desc={t('addingStudentsEmptyScreenDesc')}
            btnText={t('addStudents')}
            handleChange={() => handleChange(SHC.ACT_STD_DIR_ADD_STUDENT)}
            permissionId={PERMISSION_CONSTANTS.ipsController_addUsers_create}
          />
        </div>
      )}

      <Loader show={isLoadingLocal} />
      <div>{getSliderScreen(sliderScreen)}</div>
    </div>
  )
}
