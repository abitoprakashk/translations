import React, {useEffect, useState} from 'react'
import SchoolSetup from '../SchoolSetup/SchoolSetup'
import * as SHC from '../../../utils/SchoolSetupConstants'
import {useSelector, useDispatch} from 'react-redux'
import {schoolSystemScreenSelectedAction} from '../../../redux/actions/schoolSystemAction'
import SectionDetails from '../SectionDetails/SectionDetails'
import LinearTabOptions from '../../Common/LinearTabOptions/LinearTabOptions'
import {SCHOOL_OVERVIEW_TABS} from '../../../utils/HierarchyOptions'
import TeacherDirectory from '../TeacherDirectory/TeacherDirectory'
import StudentDirectory from '../StudentDirectory/StudentDirectory'
import {events} from '../../../utils/EventsConstants'
import {
  isHierarchyAvailable,
  handleHierarchyOpenClose,
} from '../../../utils/HierarchyHelpers'
import {getDifferenceBetweenDateNToday} from '../../../utils/Helpers'
import ClassroomDirectory from '../ClassroomDirectory/ClassroomDirectory'
import styles from './ContentArea.module.css'
import FreeTrialBannerDashboard from '../../Dashboard/FreeTrialBanner/FreeTrialBannerDashboard'
import {t} from 'i18next'
import MultipleDuplicateUsers from '../StudentDirectory/MultipleDuplicateUsers'
import hazardIcon from '../../../assets/images/icons/hazard-icon.svg'
import {clearReduxStateAction} from '../../../pages/user-profile/redux/actions/studentActions'
import {utilsGetUsersList} from '../../../routes/dashboard'
import {
  instituteStudentListAction,
  duplicateStudentListAction,
  studentListLoadingAction,
} from '../../../redux/actions/instituteInfoActions'
import {
  showLoadingAction,
  showErrorOccuredAction,
} from '../../../redux/actions/commonAction'
import {
  instituteAllClassesAction,
  instituteHierarchyAction,
} from '../../../redux/actions/instituteInfoActions'
import {utilsGetUncatergorizedClasses} from '../../../routes/instituteSystem'
import {addPersonaMembersAction} from '../../../pages/InstituteSettings/InstituteSettings.actions'
import {
  INSTITUTE_TYPES,
  INSTITUTE_MEMBER_TYPE,
} from '../../../constants/institute.constants'

const TAB_OPTIONS_EVENT_MAP = {
  [SHC.SCN_SCHOOL_SETUP]: events.SCHOOL_SETUP_CLICKED_TFI,
  [SHC.SCN_TEACHER_DIRECTORY]: events.TEACHERS_DIRECTORY_CLICKED_TFI,
  [SHC.SCN_STUDENT_DIRECTORY]: events.STUDENT_DIRECTORY_CLICKED_TFI,
}

export default function ContentArea({
  getInstituteHierarchy,
  addNewSection,
  showTabs,
}) {
  const {
    schoolSystemScreenSelected,
    eventManager,
    instituteHierarchy,
    instituteInfo,
    duplicateStudentsList,
  } = useSelector((state) => state)
  const {student} = useSelector((state) => state.userProfileInfo)
  const dispatch = useDispatch()

  const [showBanner, setShowBanner] = useState(false)
  const [showCsvDuplicates, setShowCsvDuplicates] = useState(false)

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

  useEffect(() => {
    if (!schoolSystemScreenSelected && instituteHierarchy) {
      dispatch(
        schoolSystemScreenSelectedAction(
          showTabs
            ? SHC.SCN_TEACHER_DIRECTORY
            : isHierarchyAvailable(instituteHierarchy)
            ? SHC.SCN_SCHOOL_SETUP
            : SHC.SCN_CLASSROOM_PAGE
        )
      )
    }
  }, [instituteHierarchy])

  useEffect(() => {
    if (instituteHierarchy) {
      dispatch(
        schoolSystemScreenSelectedAction(
          showTabs
            ? [SHC.SCN_TEACHER_DIRECTORY, SHC.SCN_STUDENT_DIRECTORY].includes(
                schoolSystemScreenSelected
              )
              ? schoolSystemScreenSelected
              : SHC.SCN_TEACHER_DIRECTORY
            : isHierarchyAvailable(instituteHierarchy)
            ? [SHC.SCN_TEACHER_DIRECTORY, SHC.SCN_STUDENT_DIRECTORY].includes(
                schoolSystemScreenSelected
              )
              ? SHC.SCN_SCHOOL_SETUP
              : schoolSystemScreenSelected
            : SHC.SCN_CLASSROOM_PAGE
        )
      )
      if (
        showTabs &&
        (schoolSystemScreenSelected === SHC.SCN_SECTION ||
          schoolSystemScreenSelected === SHC.SCN_UNASSIGNED)
      ) {
        dispatch(
          instituteHierarchyAction(
            handleHierarchyOpenClose(instituteHierarchy, 'SSO')
          )
        )
      }
    }
  }, [showTabs])

  useEffect(() => {
    const diff = getDifferenceBetweenDateNToday(instituteInfo.c)
    if (diff < 15) {
      setShowBanner(true)
    } else {
      setShowBanner(false)
    }
    setShowCsvDuplicates(false)
  }, [instituteInfo])

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

  const getScreen = (id) => {
    switch (id) {
      case SHC.SCN_SCHOOL_SETUP:
        return (
          <SchoolSetup
            addNewSection={addNewSection}
            getInstituteHierarchy={getInstituteHierarchy}
          />
        )
      case SHC.SCN_ARCHIVED:
        return <div>{t('archived')}</div>
      case SHC.SCN_TEACHER_DIRECTORY:
        return <TeacherDirectory />
      case SHC.SCN_STUDENT_DIRECTORY:
        return <StudentDirectory />
      case SHC.SCN_SECTION:
        return <SectionDetails getInstituteHierarchy={getInstituteHierarchy} />
      case SHC.SCN_UNASSIGNED:
      case SHC.SCN_CLASSROOM_PAGE:
        return <ClassroomDirectory getInstituteClasses={getInstituteClasses} />
      default:
        break
    }
  }

  const getPageHeader = () => {
    if (instituteInfo?.institute_type === INSTITUTE_TYPES.SCHOOL)
      return t('schoolDirectory')
    else if (instituteInfo?.institute_type === INSTITUTE_TYPES.COLLEGE)
      return t('collegeDirectory')
    else if (instituteInfo?.institute_type === INSTITUTE_TYPES.TUITION)
      return t('coachingDirectory')
    else return t('instituteDirectory')
  }

  return (
    <div className={styles.contentAreaWrapper}>
      {[SHC.SCN_TEACHER_DIRECTORY, SHC.SCN_STUDENT_DIRECTORY].includes(
        schoolSystemScreenSelected
      ) && <div className="tm-hdg tm-hdg-24 mb-2">{getPageHeader()}</div>}

      {[
        SHC.SCN_SCHOOL_SETUP,
        SHC.SCN_TEACHER_DIRECTORY,
        SHC.SCN_STUDENT_DIRECTORY,
        SHC.SCN_CLASSROOM_PAGE,
      ].includes(schoolSystemScreenSelected) && showTabs ? (
        <>
          <LinearTabOptions
            options={SCHOOL_OVERVIEW_TABS?.filter(({status}) => status)}
            selected={schoolSystemScreenSelected}
            handleChange={(id) => {
              eventManager.send_event(TAB_OPTIONS_EVENT_MAP[id])
              dispatch(schoolSystemScreenSelectedAction(id))
            }}
          />
          {showBanner && <FreeTrialBannerDashboard />}
        </>
      ) : null}

      <div className={styles.selectedItemWrapper}>
        {getScreen(schoolSystemScreenSelected)}
      </div>
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
    </div>
  )
}
