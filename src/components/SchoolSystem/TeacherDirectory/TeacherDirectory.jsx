import classNames from 'classnames'
import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {Button} from '@teachmint/common'
import NormalCard from '../../Common/NormalCard/NormalCard'
import SearchBox from '../../Common/SearchBox/SearchBox'
import Table from '../../Common/Table/Table'
import {
  HIERARCHY_TEACHER_DIR_TABLE_HEADERS,
  HIERARCHY_TEACHER_DIR_TABLE_HEADERS_MOBILE,
} from '../../../utils/HierarchyOptions'
import UserProfile from '../../Common/UserProfile/UserProfile'
import * as SHC from '../../../utils/SchoolSetupConstants'
import SliderTeacherDetail from '../../../pages/TeacherDirectory/components/SliderTeacherDetail/SliderTeacherDetail'
import RadioInput from '../../Common/RadioInput/RadioInput'
import DropdownField from '../../Common/DropdownField/DropdownField'
import defaultTeacherImage from '../../../assets/images/dashboard/empty-teacher.png'
import EmptyScreenV1 from '../../Common/EmptyScreenV1/EmptyScreenV1'
import {events} from '../../../utils/EventsConstants'
import MultipleDuplicateUsers from '../StudentDirectory/MultipleDuplicateUsers'
import hazardIcon from '../../../assets/images/icons/hazard-icon.svg'
import {clearReduxStateAction} from '../../../pages/user-profile/redux/actions/studentActions'
import {
  duplicateTeacherListAction,
  instituteTeacherListAction,
  teacherListLoadingAction,
} from '../../../redux/actions/instituteInfoActions'
import {showErrorOccuredAction} from '../../../redux/actions/commonAction'
import {searchBoxFilter} from '../../../utils/Helpers'
import {addPersonaMembersAction} from '../../../pages/InstituteSettings/InstituteSettings.actions'
import {utilsGetUsersList} from '../../../routes/dashboard'
import globalActions from '../../../redux/actions/global.actions'
import {personaProfileSettingsSelector} from '../../../pages/ProfileSettings/redux/ProfileSettingsSelectors'
import {getCategoriesCollection} from '../../../pages/ProfileSettings/ProfileSettings.utils'
import {fetchCategoriesRequestAction} from '../../../pages/ProfileSettings/redux/actions/ProfileSettingsActions'
import {USER_TYPE_SETTINGS} from '../../../pages/user-profile/constants'
import {SETTING_TYPE} from '../../../pages/ProfileSettings/ProfileSettings.constant'
import {INSTITUTE_MEMBER_TYPE} from '../../../constants/institute.constants'
import Permission from '../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../utils/permission.constants'
import Loader from '../../Common/Loader/Loader'
import SliderAddTeacherDir from '../../../pages/TeacherDirectory/components/SliderAddTeacherDir/SliderAddTeacherDir'
import styles from './TeacherDirectory.module.css'

export default function TeacherDirectory() {
  const [sourceList, setSourceList] = useState([])
  const [filteredTeachers, setFilteredTeachers] = useState([])
  const [sliderScreen, setSliderScreen] = useState(null)
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [teacherType, setTeacherType] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [showCsvDuplicates, setShowCsvDuplicates] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const {teacher} = useSelector((state) => state.userProfileInfo)
  const {teacherListLoading} = useSelector((state) => state)
  const personaProfileSettingsData = personaProfileSettingsSelector()

  const {
    instituteInfo,
    eventManager,
    duplicateTeachersList,
    instituteTeacherList,
  } = useSelector((state) => state)

  useEffect(() => {
    setSourceList(instituteTeacherList)
    setFilteredTeachers(instituteTeacherList)
    setTeacherType(0)
  }, [instituteTeacherList])

  useEffect(() => {
    if (duplicateTeachersList?.existing_users?.length > 0)
      setShowCsvDuplicates(true)
  }, [duplicateTeachersList])

  // Get Category collection functions start
  useEffect(() => {
    const getProfileSettings = {
      persona: USER_TYPE_SETTINGS.STAFF.id,
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
    setIsLoading(teacherListLoading)
  }, [teacherListLoading])

  const joinedTeachers = instituteTeacherList.filter(
    ({verification_status}) => !verification_status || verification_status === 1
  )
  const pendingTeachers = instituteTeacherList.filter(
    ({verification_status}) => verification_status === 2
  )
  const rejectedTeachers = instituteTeacherList.filter(
    ({verification_status}) => verification_status === 3
  )
  const inactiveTeachers = instituteTeacherList.filter(
    ({verification_status}) => verification_status === 4
  )

  const handleAddDuplicateTeachers = (users) => {
    const data = {users: users, type: 2, check: false}
    dispatch(addPersonaMembersAction({personaData: data, persona: 'TEACHER'}))
    setShowCsvDuplicates(false)
    dispatch(clearReduxStateAction())
    dispatch(duplicateTeacherListAction([]))
    getInstituteTeachers(instituteInfo._id)
  }

  useEffect(() => {
    if (teacher.updated) {
      setShowCsvDuplicates(false)
      dispatch(clearReduxStateAction())
      getInstituteTeachers(instituteInfo._id)
    }
  }, [teacher?.updated])

  const getInstituteTeachers = () => {
    dispatch(teacherListLoadingAction(true))
    utilsGetUsersList({type: [INSTITUTE_MEMBER_TYPE.TEACHER]})
      .then(({status, obj}) => {
        if (status) dispatch(instituteTeacherListAction(obj))
      })
      .catch(() => dispatch(showErrorOccuredAction(true)))
      .finally(() => dispatch(teacherListLoadingAction(false)))
  }
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

  const teacherTypeOptions = [
    // {key: 0, value: <Trans i18nKey="userTypeOptionsValAll">All - {instituteTeacherList?.length || 0}</Trans>},
    // {key: 0, value: `All - ${instituteTeacherList?.length || 0}`},
    {
      key: 0,
      value: `${t('uTypeOptionsValAll')} ${instituteTeacherList?.length || 0}`,
    },
    {
      key: 1,
      value: `${t('uTypeOptionsValJoined')} ${joinedTeachers?.length || 0}`,
    },
    {
      key: 2,
      value: `${t('uTypeOptionsValPending')} ${pendingTeachers?.length || 0}`,
    },
    {
      key: 4,
      value: `${t('uTypeOptionsValDeactivated')} ${
        inactiveTeachers?.length || 0
      }`,
    },
  ]

  const handleChange = (action, node = null) => {
    switch (action) {
      case SHC.ACT_TCH_DIR_ADD_TEACHER: {
        eventManager.send_event(events.ADD_TEACHER_CLICKED, {
          screen_name: 'teachers_directory',
        })
        setSliderScreen(SHC.SCN_SLI_ADD_DIR_TEACHER)
        break
      }
      case SHC.ACT_TCH_DIR_TCH_DETAIL: {
        // if (getScreenWidth() < 1024)
        //   history.push(
        //     `${secondaryItems.EDIT_TEACHER_DETAILS.route}/${node._id}`
        //   )
        // else {
        setSliderScreen(SHC.SCN_SLI_TEACHER_DETAIL)
        setSelectedTeacher(node)
        // }
        break
      }
      case SHC.ACT_SUB_SEARCH_SELECT: {
        setTeacherType(node)
        let list = []
        node = Number(node)
        switch (node) {
          case 0:
            list = instituteTeacherList
            break
          case 1:
            list = joinedTeachers
            break
          case 2:
            list = pendingTeachers
            break
          case 3:
            list = rejectedTeachers
            break
          case 4:
            list = inactiveTeachers
            break
          default:
            break
        }
        setSourceList(list)
        setFilteredTeachers(list)
        setSearchText('')
        break
      }
      default:
        break
    }
  }

  const getSliderScreen = (id) => {
    switch (id) {
      case SHC.SCN_SLI_ADD_DIR_TEACHER:
        return <SliderAddTeacherDir setSliderScreen={setSliderScreen} />
      case SHC.SCN_SLI_TEACHER_DETAIL:
        return (
          <SliderTeacherDetail
            setSliderScreen={setSliderScreen}
            selectedTeacher={selectedTeacher}
          />
        )
      default:
        break
    }
  }

  const handleSearchFilter = (text) => {
    setSearchText(text)
    let searchParams = [['name'], ['phone_number'], ['email']]
    setFilteredTeachers(searchBoxFilter(text, sourceList, searchParams))
  }

  const getRows = (teachers) => {
    return teachers?.map(
      ({
        _id,
        name,
        full_name,
        img_url,
        phone_number,
        email,
        verification_status,
        subjects,
        classrooms,
      }) => {
        return {
          id: _id,
          teacher_details: (
            <div className="w-max">
              <UserProfile
                image={img_url}
                name={full_name && full_name !== '' ? full_name : name}
                phoneNumber={
                  phone_number !== null && phone_number !== ''
                    ? phone_number
                    : email
                }
                joinedState={verification_status}
                handleChange={() =>
                  handleChange(SHC.ACT_TCH_DIR_TCH_DETAIL, {
                    _id,
                    phone_number,
                    subjects,
                    classrooms,
                  })
                }
              />
            </div>
          ),
          subjects: (
            <div className="tm-para tm-para-14">
              {subjects?.filter((v, i, a) => a.indexOf(v) === i).join(', ') ||
                'NA'}
            </div>
          ),
          classes: (
            <div className="tm-para tm-para-14">
              {classrooms
                ?.filter((v, i, a) => a.indexOf(v) === i)
                ?.join(', ') || 'NA'}
            </div>
          ),
        }
      }
    )
  }

  return (
    <div>
      {instituteTeacherList?.length > 0 ? (
        <NormalCard>
          <div className="flex flex-wrap justify-between items-center p-4">
            <div className="w-full lg:max-w-md">
              <SearchBox
                value={searchText}
                placeholder={t('searchForTeacher')}
                handleSearchFilter={handleSearchFilter}
              />
            </div>

            <Permission
              permissionId={PERMISSION_CONSTANTS.ipsController_addUsers_create}
            >
              <Button
                size="medium"
                className={classNames('mt-4 lg:mt-0', styles.addTeacherBtn)}
                onClick={() => handleChange(SHC.ACT_TCH_DIR_ADD_TEACHER)}
              >
                {t('addTeachersPlus')}
              </Button>
            </Permission>
          </div>

          <div className="hidden lg:block px-4">
            <RadioInput
              value={teacherType}
              fieldName="teacherType"
              handleChange={(_, value) =>
                handleChange(SHC.ACT_SUB_SEARCH_SELECT, value)
              }
              dropdownItems={teacherTypeOptions}
            />
          </div>
          <div className="px-4 pb-2 lg:hidden">
            <DropdownField
              value={teacherType}
              fieldName="teacherType"
              handleChange={(_, value) =>
                handleChange(SHC.ACT_SUB_SEARCH_SELECT, value)
              }
              dropdownItems={teacherTypeOptions}
            />
          </div>

          <div className="hidden lg:block">
            <Table
              rows={getRows(filteredTeachers)}
              cols={HIERARCHY_TEACHER_DIR_TABLE_HEADERS}
            />
          </div>
          <div className="lg:hidden">
            <Table
              rows={getRows(filteredTeachers)}
              cols={HIERARCHY_TEACHER_DIR_TABLE_HEADERS_MOBILE}
            />
          </div>
        </NormalCard>
      ) : (
        <div className="bg-white rounded-lg w-full mt-6 h-screen pt-20 px-6">
          <EmptyScreenV1
            image={defaultTeacherImage}
            title={t('addingTeachersInstituteEmptyScreenTitle')}
            desc={t('addingTeachersInstituteEmptyScreenDesc')}
            btnText={t('addTeachers')}
            handleChange={() => handleChange(SHC.ACT_TCH_DIR_ADD_TEACHER)}
            permissionId={PERMISSION_CONSTANTS.ipsController_addUsers_create}
          />
        </div>
      )}

      <div>{getSliderScreen(sliderScreen)}</div>
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
    </div>
  )
}
