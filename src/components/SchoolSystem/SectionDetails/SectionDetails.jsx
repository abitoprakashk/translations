/* eslint-disable react/no-unescaped-entities */
import React, {useState, useEffect} from 'react'
import {
  utilsAddNewSubject,
  utilsDeleteSection,
  utilsDeleteSubject,
  utilsGetSectionDetails,
  utilsRemoveClassTeacher,
  utilsRemoveSubjectTeacher,
  utilsUpdateNodeMetaData,
  utilsUpdateNodeName,
} from '../../../routes/instituteSystem'
import NormalCard from '../../Common/NormalCard/NormalCard'
import {useSelector, useDispatch} from 'react-redux'
import {Trans, useTranslation} from 'react-i18next'
import Table from '../../Common/Table/Table'
import {
  showErrorOccuredAction,
  showLoadingAction,
  showToast,
} from '../../../redux/actions/commonAction'
import UserProfile from '../../Common/UserProfile/UserProfile'
import Radio from '../../Common/Radio/Radio'
import {
  getSelectedNodeDataWithoutChildrens,
  handleHierarchyOpenClose,
} from '../../../utils/HierarchyHelpers'
import * as SHC from '../../../utils/SchoolSetupConstants'
import {
  DEPT_CLASSROOM_TABLE_HEADERS,
  SECTION_SUBJECT_TABLE_HEADERS,
  SUBJECT_TOOLTIP_OPTIONS,
  SUBJECT_TYPE,
} from '../../../utils/HierarchyOptions'
import {schoolSystemScreenSelectedAction} from '../../../redux/actions/schoolSystemAction'
import SliderTeacher from './SliderTeacher'
import SliderStudent from './SliderStudent'
import SliderEditSectionName from './SliderEditSectionName'
import SliderAddSubject from './SliderAddSubject'
import SubjectTooltipOptions from './SubjectTooltipOptions'
import StudentsTable from './StudentsTable'
import SliderMoveStudent from './SliderMoveStudent'
import SliderAddOptionalStudents from './SliderAddOptionalStudents'
import {instituteHierarchyAction} from '../../../redux/actions/instituteInfoActions'
import ConfirmationPopup from '../../Common/ConfirmationPopup/ConfirmationPopup'
import {getSectionProgress} from '../../../utils/Helpers'
import LinearProgressBar from '../../Common/LinearProgressBar/LinearProgressBar'
import {events} from '../../../utils/EventsConstants'
// import SliderSectionAttendance from './SliderSectionAttendance/SliderSectionAttendance'
import {
  getFromSessionStorage,
  getRequestStatusLabel,
} from '../../../utils/Helpers'
import {
  BROWSER_STORAGE_KEYS,
  INSTITUTE_TYPES,
} from '../../../constants/institute.constants'
import SliderCoTeacherList from './SliderCoTeacherList'
import SliderRemoveCoTeacher from './SliderRemoveCoTeacher'
import classNames from 'classnames'
import Permission from '../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../utils/permission.constants'
import {Icon} from '@teachmint/common'
import {utilsGetSubscriptionData} from '../../../routes/dashboard'
import {dummySubscriptionData} from '../../../utils/DummyStats'
import {tooManyStudentsErrorContent} from '../../../utils/subscriptionHelpers'
import AcknowledgementPopup from '../../Common/AcknowledgementPopup/AcknowledgementPopup'
import lockedIcon from '../../../assets/images/icons/popup/locked-red.svg'
import {getActiveStudents} from '../../../redux/reducers/CommonSelectors'
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary'
import {personaProfileSettingsSelector} from '../../../pages/ProfileSettings/redux/ProfileSettingsSelectors'
import {USER_TYPE_SETTINGS} from '../../../pages/user-profile/constants'
import globalActions from '../../../redux/actions/global.actions'
import styles from './SectionDetails.module.css'
import {getCategoriesCollection} from '../../../pages/ProfileSettings/ProfileSettings.utils'
import {SETTING_TYPE} from '../../../pages/ProfileSettings/ProfileSettings.constant'
import {fetchCategoriesRequestAction} from '../../../pages/ProfileSettings/redux/actions/ProfileSettingsActions'
import AddSectionStudent from './AddSectionStudent'

const {REACT_APP_BASE_URL} = process.env

export default function SectionDetails({getInstituteHierarchy}) {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const {instituteInfo, instituteHierarchy, eventManager} = useSelector(
    (state) => state
  )
  const personaProfileSettingsData = personaProfileSettingsSelector()

  const [sectionDetails, setSectionDetails] = useState({})
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [sliderScreen, setSliderScreen] = useState(null)
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(null)
  const [nodeStatus, setNodeStatus] = useState(1)
  const [personaValue, setPersonaValue] = useState(USER_TYPE_SETTINGS.STAFF.id)
  const [showPopup, setShowPopup] = useState(null)
  const [subscriptionData, setSubscriptionData] = useState(
    dummySubscriptionData
  )
  const instituteStudentList = getActiveStudents(true)
  const [popupTitle, setPopupTitle] = useState('Student licenses exhausted')
  const [activeTab, setActiveTab] = useState('ADD_STUDENT')

  // Get Category collection functions start
  useEffect(() => {
    const getProfileSettings = {
      persona: personaValue,
    }
    dispatch(
      globalActions?.fetchPersonaProfileSettingsRequestAction?.request(
        getProfileSettings
      )
    )
  }, [personaValue])

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
    const selectedSection = getSelectedNodeDataWithoutChildrens(
      instituteHierarchy,
      SHC.NODE_SECTION
    )
    setNodeStatus(selectedSection?.status)
    getSectionDetails(selectedSection?.id)
  }, [instituteHierarchy])

  useEffect(() => {
    getSubscriptionData()
  }, [])

  function getSubscriptionData() {
    utilsGetSubscriptionData(instituteInfo._id).then(({data}) => {
      if (data.obj.subscription_type === 1)
        data.obj.lms_order_form_students = 10
      setSubscriptionData(data)
    })
  }

  const setToastData = (type, message) => dispatch(showToast({type, message}))

  const getSectionDetails = (sectionID) => {
    if (instituteInfo?._id && sectionID) {
      dispatch(showLoadingAction(true))
      utilsGetSectionDetails(instituteInfo._id, sectionID)
        .then(({status, obj}) => {
          if (status) setSectionDetails(obj)
          else setToastData('error', t('unableToGetSectionDetails'))
        })
        .catch((_err) => dispatch(showErrorOccuredAction(true)))
        .finally(() => dispatch(showLoadingAction(false)))
    }
  }

  const updateNodeMetaData = (subjectID, metaData) => {
    if (instituteInfo?._id && subjectID && sectionDetails?.id) {
      dispatch(showLoadingAction(true))
      utilsUpdateNodeMetaData(instituteInfo._id, subjectID, metaData)
        .then(({status}) => {
          if (status) getSectionDetails(sectionDetails?.id)
          else setToastData('error', t('unableToUpdateData'))
        })
        .catch((_err) => dispatch(showErrorOccuredAction(true)))
        .finally(() => dispatch(showLoadingAction(false)))
    }
  }

  const deleteSection = () => {
    if (instituteInfo?._id && sectionDetails?.id) {
      dispatch(showLoadingAction(true))
      utilsDeleteSection(instituteInfo._id, sectionDetails.id)
        .then(({status, msg}) => {
          if (status) {
            setToastData(
              'success',
              <Trans i18nKey="sectionDetailsSuccessfullyDeleted">
                {sectionDetails?.parent?.name} - {sectionDetails?.name}
                successfully deleted
              </Trans>
            )
            eventManager.send_event(events.CLASS_SECTION_DELETED_TFI, {
              section_id: sectionDetails?.id,
            })
            // Update hierarchy
            dispatch(
              instituteHierarchyAction(
                handleHierarchyOpenClose(
                  instituteHierarchy,
                  SHC.NODE_SCHOOL_SYSTEM_OVERVIEW
                )
              )
            )

            // Show School overview screen
            dispatch(schoolSystemScreenSelectedAction(SHC.SCN_SCHOOL_SETUP))
            getInstituteHierarchy()
          } else {
            setToastData('error', msg)
          }
        })
        .catch((_err) => dispatch(showErrorOccuredAction(true)))
        .finally(() => {
          dispatch(showLoadingAction(false))
          setShowConfirmationPopup(null)
        })
    }
  }

  const updateNodeName = (id, name) => {
    if (instituteInfo?._id) {
      dispatch(showLoadingAction(true))
      utilsUpdateNodeName(instituteInfo._id, id, name)
        .then(() => {
          getInstituteHierarchy()
          setToastData('success', t('nameSuccessfullyUpdated'))
          eventManager.send_event(events.CLASS_SECTION_EDITED_TFI, {
            section_id: sectionDetails?.id,
          })
        })
        .catch(() => setToastData('error', t('unableToUpdateName')))
        .finally(() => dispatch(showLoadingAction(false)))
    }
  }

  const deleteSubject = (id) => {
    if (instituteInfo?._id && id) {
      dispatch(showLoadingAction(true))
      utilsDeleteSubject(instituteInfo._id, id)
        .then(() => {
          getInstituteHierarchy()
          setToastData('success', t('subjectSuccessfullyDeleted'))
          eventManager.send_event(events.SUBJECT_DELETED_TFI, {
            section_id: sectionDetails?.id,
            class_id: id,
          })
        })
        .catch(() => setToastData('error', t('unableToDeleteSubject')))
        .finally(() => {
          dispatch(showLoadingAction(false))
          setShowConfirmationPopup(null)
        })
    }
  }

  const addNewSubject = (subjectName) => {
    if (instituteInfo?._id && sectionDetails?.id && subjectName) {
      dispatch(showLoadingAction(true))
      utilsAddNewSubject(instituteInfo._id, sectionDetails?.id, subjectName)
        .then(({status}) => {
          if (status) {
            eventManager.send_event(events.SUBJECT_ADDED_TFI, {
              section_id: sectionDetails?.id,
            })
            getSectionDetails(sectionDetails?.id)
            setToastData('success', t('subjectSuccessfullyAdded'))
          } else setToastData('error', t('unableToAddSubject'))
        })
        .catch((_err) => dispatch(showErrorOccuredAction(true)))
        .finally(() => dispatch(showLoadingAction(false)))
    }
  }

  const removeSubjectTeacher = (id) => {
    if (instituteInfo?._id && id) {
      dispatch(showLoadingAction(true))
      utilsRemoveSubjectTeacher(instituteInfo._id, id)
        .then(() => {
          getSectionDetails(sectionDetails?.id)
          setToastData('success', t('subjectTeacherSuccessfullyRemoved'))
          eventManager.send_event(events.SUBJECT_TEACHER_REMOVED_TFI, {
            class_id: id,
            section_id: sectionDetails?.id,
          })
        })
        .catch(() => setToastData('error', t('unableToRemoveSubjectTeacher')))
        .finally(() => {
          dispatch(showLoadingAction(false))
          setShowConfirmationPopup(null)
        })
    }
  }

  const removeClassTeacher = () => {
    if (instituteInfo?._id && sectionDetails?.id) {
      dispatch(showLoadingAction(true))
      eventManager.send_event(events.REMOVE_CLASS_TEACHER_CLICKED_TFI, {
        section_id: sectionDetails?.id,
      })
      utilsRemoveClassTeacher(instituteInfo._id, sectionDetails?.id)
        .then(({status}) => {
          if (status) {
            getSectionDetails(sectionDetails?.id)
            setToastData('success', t('classTeacherRemovedSuccessfully'))
          } else setToastData('error', t('unableToRemoveClassTeacher'))
          eventManager.send_event(events.CLASS_TEACHER_REMOVED_TFI, {
            section_id: sectionDetails?.id,
          })
        })
        .catch((_err) => dispatch(showErrorOccuredAction(true)))
        .finally(() => {
          setShowConfirmationPopup(null)
          dispatch(showLoadingAction(false))
        })
    }
  }

  const classFullName = sectionDetails?.name
    ? `${sectionDetails?.parent?.name} - ${sectionDetails?.name}`
    : t('classSection1')

  const handleChange = (action, node = '', value = '') => {
    switch (action) {
      case SHC.ACT_SEC_DELETE_SEC: {
        eventManager.send_event(events.DELETE_CLASS_SECTION_CLICKED_TFI, {
          section_id: sectionDetails?.id,
        })
        setShowConfirmationPopup({
          title: (
            <Trans i18nKey="deleteClassroomShowConfirmationPopupTitle">
              Delete section {{classFullName}}?
            </Trans>
          ),
          desc: t('deleteClassroomShowConfirmationPopupDesc'),
          imgSrc:
            'https://storage.googleapis.com/tm-assets/icons/colorful/remove-bg-red.svg',
          primaryBtnText: t('cancel'),
          secondaryBtnText: t('delete'),
          onAction: deleteSection,
        })
        break
      }
      case SHC.ACT_SEC_CLASS_ASSIGN_TEACHER: {
        eventManager.send_event(events.ASSIGN_CLASS_TEACHER_INITIALIZED_TFI, {
          section_id: sectionDetails?.id,
        })
        setSliderScreen(SHC.SCN_SLI_CLASS_TEACHER)
        setPersonaValue(USER_TYPE_SETTINGS.STAFF.id)
        break
      }
      case SHC.ACT_SEC_ADD_SUBJECT: {
        setSliderScreen(SHC.SCN_SLI_SEC_ADD_SUBJECT)
        break
      }
      case SHC.ACT_SEC_EDIT_SUBJECT_TYPE: {
        updateNodeMetaData(node, {subject_type: value})
        break
      }
      case SHC.ACT_SEC_CLASS_ASSIGN_STUDENTS: {
        eventManager.send_event(events.ADD_STUDENT_INITIALIZED_TFI, {
          section_id: sectionDetails?.id,
          screen_name: 'section',
        })
        setPersonaValue(USER_TYPE_SETTINGS.STUDENT.id)
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
          setSliderScreen(SHC.SCN_SLI_STUDENT)
        }
        break
      }
      case SHC.ACT_SEC_ASSIGN_SUB_TEACHER: {
        eventManager.send_event(events.ASSIGN_SUBJECT_TEACHER_INITIALIZED_TFI, {
          class_id: node?.id,
        })
        setSelectedSubject(node)
        setSliderScreen(SHC.SCN_SLI_TEACHER)
        setPersonaValue(USER_TYPE_SETTINGS.STAFF.id)
        break
      }
      case SHC.ACT_SEC_EDIT_NAME: {
        eventManager.send_event(events.EDIT_CLASS_SECTION_CLICKED_TFI, {
          section_id: sectionDetails?.id,
        })
        setSliderScreen(SHC.SCN_SLI_EDIT_SEC_NAME)
        break
      }
      case SHC.ACT_SEC_EDIT_SUB_NAME: {
        setSelectedSubject(node)
        setSliderScreen(SHC.SCN_SLI_EDIT_SEC_NAME)
        eventManager.send_event(events.EDIT_SUBJECT_NAME_CLICKED_TFI, {
          section_id: sectionDetails?.id,
          class_id: node?.id,
        })
        break
      }
      case SHC.ACT_SEC_REMOVE_SUB_TEACHER: {
        setShowConfirmationPopup({
          title: (
            <Trans i18nKey="actSecRemoveSubTeacherTitle">
              Remove teacher from {node?.name} subject?
            </Trans>
          ),
          desc: (
            <Trans i18nKey="actSecRemoveSubTeacherDesc">
              {node.teacher_detail.name} won't have access to this subject
              anymore
            </Trans>
          ),
          imgSrc:
            'https://storage.googleapis.com/tm-assets/icons/colorful/remove-bg-red.svg',
          primaryBtnText: t('cancel'),
          secondaryBtnText: t('remove'),
          onAction: () => removeSubjectTeacher(node?.id),
        })
        eventManager.send_event(events.REMOVE_SUBJECT_TEACHER_CLICKED_TFI, {
          class_id: node?.id,
          section_id: sectionDetails?.id,
        })
        break
      }
      case SHC.ACT_SEC_REASSIGN_SUB_TEACHER: {
        eventManager.send_event(events.REPLACE_SUBJECT_TEACHER_CLICKED_TFI, {
          class_id: node?.meta?.class_id,
          section_id: sectionDetails?.id,
        })
        setSelectedSubject(node)
        setSliderScreen(SHC.SCN_SLI_TEACHER)
        setPersonaValue(USER_TYPE_SETTINGS.STAFF.id)
        break
      }
      case SHC.ACT_SEC_REMOVE_CLASS_TEACHER: {
        eventManager.send_event(events.REMOVE_CLASS_TEACHER_INITIALIZED_TFI, {
          section_id: sectionDetails?.id,
        })
        setShowConfirmationPopup({
          title: t('actSecRemoveClassTeacherTitle'),
          desc: t('actSecRemoveClassTeacherDesc'),
          imgSrc:
            'https://storage.googleapis.com/tm-assets/icons/colorful/remove-bg-red.svg',
          primaryBtnText: t('cancel'),
          secondaryBtnText: t('remove'),
          onAction: removeClassTeacher,
        })
        break
      }
      case SHC.ACT_SEC_REASSIGN_CLASS_TEACHER: {
        removeSubjectTeacher(node)
        break
      }
      case SHC.ACT_SEC_REMOVE_SUB: {
        eventManager.send_event(events.DELETE_SUBJECT_INITIALIZED_TFI, {
          section_id: sectionDetails?.id,
          class_id: node?.id,
        })
        setShowConfirmationPopup({
          title: (
            <Trans i18nKey="actSecRemoveSubTitle">
              Delete subject {node?.name}?
            </Trans>
          ),
          desc: t('actSecRemoveSubDesc'),
          imgSrc:
            'https://storage.googleapis.com/tm-assets/icons/colorful/remove-bg-red.svg',
          primaryBtnText: t('cancel'),
          secondaryBtnText: t('delete'),
          onAction: () => {
            deleteSubject(node?.id)
            eventManager.send_event(events.DELETE_SUBJECT_CLICKED_TFI, {
              section_id: sectionDetails?.id,
              class_id: node?.id,
            })
          },
        })
        break
      }
      case SHC.ACT_SEC_MOVE_STUDENT: {
        eventManager.send_event(events.MOVE_STUDENT_INITIALIZED_TFI, {
          screen_name: 'section',
          type: 'move',
          section_id: sectionDetails?.id,
        })
        setSliderScreen(SHC.SCN_SLI_SEC_MOVE_STUDENT)
        setSelectedStudent(node)
        break
      }
      case SHC.ACT_SEC_OPTIONAL_SUB_ASSIGN_STUDENT: {
        eventManager.send_event(events.ASSIGN_STUDENT_INITIALIZED_TFI, {
          section_id: sectionDetails?.id,
          class_id: node?.id,
        })
        setSelectedSubject(node)
        setSliderScreen(SHC.SCN_SLI_OPTIONAL_STUDENT)
        break
      }
      // case SHC.ACT_SEC_MANAGE_ATTENDANCE: {
      //   eventManager.send_event(events.MANAGE_ATTENDANCE_CLICKED_TFI, {
      //     class_id: sectionDetails?.id,
      //   })
      //   setSliderScreen(SHC.SCN_SLI_SECTION_ATTENDANCE)
      //   break
      // }
      case SHC.ACT_SEC_VIEW_CO_TEACHER:
        setSelectedSubject(node)
        setSliderScreen(SHC.SCN_SLI_CO_TEACHER)
        break
      case SHC.ACT_SEC_ADD_CO_TEACHER:
        eventManager.send_event(events.ASSIGN_CO_TEACHER_CLICKED_TFI, {
          section_id: sectionDetails?.id,
          class_id: node?.id,
          screen_name: 'manage_subject',
        })
        setSelectedSubject(node)
        setSliderScreen(SHC.SCN_SLI_ADD_CO_TEACHER)
        setPersonaValue(USER_TYPE_SETTINGS.STAFF.id)
        break
      case SHC.ACT_SEC_REMOVE_CO_TEACHER:
        eventManager.send_event(events.REMOVE_CO_TEACHER_CLICKED_TFI, {
          section_id: sectionDetails?.id,
          class_id: node?.id,
        })
        setSelectedSubject(node)
        setSliderScreen(SHC.SCN_SLI_REMOVE_CO_TEACHER)
        break

      default:
        break
    }
  }

  const getSliderScreen = (id) => {
    switch (id) {
      case SHC.SCN_SLI_TEACHER: {
        const selectedSubjectTemp = selectedSubject || {}
        selectedSubjectTemp.parentId = sectionDetails?.id
        selectedSubjectTemp.classroomName = `${sectionDetails?.parent.name} ${sectionDetails?.name}`
        selectedSubjectTemp.isClassTeacher = false
        selectedSubjectTemp.isCoTeacher = false

        return (
          <SliderTeacher
            callback={(doUpdate) => {
              setSelectedSubject(null)
              setSliderScreen(null)
              doUpdate && getSectionDetails(sectionDetails?.id)
            }}
            setSliderScreen={setSliderScreen}
            nodeDetails={selectedSubjectTemp}
          />
        )
      }
      case SHC.SCN_SLI_CLASS_TEACHER: {
        const sectionDeatilsTemp = sectionDetails || {}
        sectionDeatilsTemp.parentId = sectionDetails?.id
        sectionDeatilsTemp.classroomName = `${sectionDetails?.parent.name} ${sectionDetails?.name}`
        sectionDeatilsTemp.isClassTeacher = true
        sectionDeatilsTemp.isCoTeacher = false

        return (
          <SliderTeacher
            callback={(doUpdate) => {
              setSelectedSubject(null)
              setSliderScreen(null)
              doUpdate && getSectionDetails(sectionDetails?.id)
            }}
            setSliderScreen={setSliderScreen}
            nodeDetails={sectionDeatilsTemp}
          />
        )
      }
      case SHC.SCN_SLI_STUDENT:
        return (
          <SliderStudent
            setSliderScreen={setSliderScreen}
            sectionDetails={sectionDetails}
            getSectionDetails={getSectionDetails}
            defaultActiveTab={activeTab}
          />
        )
      case SHC.SCN_SLI_EDIT_SEC_NAME: {
        const ss = selectedSubject
        return (
          <SliderEditSectionName
            setSliderScreen={setSliderScreen}
            setSelectedSubject={setSelectedSubject}
            oldName={ss?.id ? ss?.name : sectionDetails?.name}
            handleSubmit={updateNodeName}
            nodeId={ss?.id || sectionDetails?.id}
            title={
              ss?.id
                ? instituteInfo.institute_type === INSTITUTE_TYPES.TUITION
                  ? t('editClassroomName')
                  : t('editSubjectName')
                : t('editSectionName')
            }
            fieldName={
              ss?.id
                ? instituteInfo.institute_type === INSTITUTE_TYPES.TUITION
                  ? t('className')
                  : t('subjectName')
                : t('sectionName')
            }
            maxLength={ss?.id ? 100 : 50}
          />
        )
      }
      case SHC.SCN_SLI_SEC_ADD_SUBJECT:
        return (
          <SliderAddSubject
            setSliderScreen={setSliderScreen}
            handleSubmit={addNewSubject}
            instituteType={instituteInfo?.institute_type}
          />
        )
      case SHC.SCN_SLI_SEC_MOVE_STUDENT:
        return (
          <SliderMoveStudent
            setSliderScreen={setSliderScreen}
            sectionDetails={{
              name: `${sectionDetails?.parent?.name} ${sectionDetails?.name}`,
              id: sectionDetails?.id,
            }}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            getSectionDetails={getSectionDetails}
            screenName="section"
          />
        )
      case SHC.SCN_SLI_OPTIONAL_STUDENT:
        return (
          <SliderAddOptionalStudents
            setSliderScreen={setSliderScreen}
            sectionDetails={sectionDetails}
            getSectionDetails={getSectionDetails}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
          />
        )
      case SHC.SCN_SLI_CO_TEACHER:
        return (
          <SliderCoTeacherList
            setSliderScreen={setSliderScreen}
            coTeacherList={selectedSubject?.co_teacher_detail}
          />
        )

      case SHC.SCN_SLI_ADD_CO_TEACHER: {
        const selectedSubjectTemp = selectedSubject || {}
        selectedSubjectTemp.parentId = sectionDetails?.id
        selectedSubjectTemp.classroomName = `${sectionDetails?.parent.name} ${sectionDetails?.name}`
        selectedSubjectTemp.isClassTeacher = false
        selectedSubjectTemp.isCoTeacher = true

        return (
          <SliderTeacher
            callback={(doUpdate) => {
              setSelectedSubject(null)
              setSliderScreen(null)
              doUpdate && getSectionDetails(sectionDetails?.id)
            }}
            setSliderScreen={setSliderScreen}
            nodeDetails={selectedSubjectTemp}
          />
        )
      }

      case SHC.SCN_SLI_REMOVE_CO_TEACHER:
        return (
          <SliderRemoveCoTeacher
            callback={(doUpdate) => {
              setSelectedSubject(null)
              setSliderScreen(null)
              doUpdate && getSectionDetails(sectionDetails?.id)
            }}
            setSliderScreen={setSliderScreen}
            coTeacherList={selectedSubject?.co_teacher_detail}
            nodeId={selectedSubject?.id}
            sectionId={SectionDetails?.id}
          />
        )

      default:
        break
    }
  }

  const getSubjectInfo = (key, item, isMobile) => {
    switch (key) {
      case 'subject_name':
        return (
          <div>
            <div className="flex">
              {(item?.teacher_detail?.phone_number ||
                item?.teacher_detail?.email) && (
                <img
                  src="https://storage.googleapis.com/tm-assets/icons/colorful/tick-bg-green.svg"
                  alt=""
                  className="w-4 h-4 mr-2"
                />
              )}
              <div title={item.name} className={styles.subjectName}>
                {item.name}
              </div>
            </div>

            {item?.meta?.subject_type === 2 && item?.meta?.class_id && (
              <div className="flex items-center mt-2">
                {item?.students?.length ? (
                  <>
                    <div className="tm-para tm-para-14 whitespace-nowrap">
                      {
                        <Trans i18nKey="studentLengthDynamic">
                          {`${item?.students?.length}`}
                          {`${item?.students?.length}` > 1 ? 's' : ''}
                        </Trans>
                      }
                    </div>
                    <img
                      src="https://storage.googleapis.com/tm-assets/icons/secondary/dot-secondary.svg"
                      alt=""
                      className="w-1 h-1 mx-2"
                    />
                  </>
                ) : null}
                <Permission
                  permissionId={
                    PERMISSION_CONSTANTS.instituteClassController_assignStudents_update
                  }
                >
                  <div
                    className="tm-hdg-14 tm-cr-bl-2 cursor-pointer whitespace-nowrap"
                    onClick={() =>
                      handleChange(
                        SHC.ACT_SEC_OPTIONAL_SUB_ASSIGN_STUDENT,
                        item
                      )
                    }
                  >
                    + {t('addStudents')}
                  </div>
                </Permission>
              </div>
            )}
          </div>
        )
      case 'settings': {
        let subjectTooltipOptionsTemp = JSON.parse(
          JSON.stringify(SUBJECT_TOOLTIP_OPTIONS)
        )
        subjectTooltipOptionsTemp[1].active =
          !!item?.teacher_detail?.phone_number || !!item?.teacher_detail?.email
        subjectTooltipOptionsTemp[2].active =
          !!item?.teacher_detail?.phone_number || !!item?.teacher_detail?.email
        subjectTooltipOptionsTemp[4].active =
          !!item?.co_teacher_detail?.length > 0

        return (
          <SubjectTooltipOptions
            subjectItem={item}
            options={subjectTooltipOptionsTemp.filter(({active}) => active)}
            trigger={
              <img
                src="https://storage.googleapis.com/tm-assets/icons/secondary/settings-dots-secondary.svg"
                alt=""
                className="w-4 h-4 p-0 lg:p-0"
                onMouseOver={() => {
                  eventManager.send_event(events.K_MENU_SUBJECT_CLICKED, {
                    section_id: sectionDetails?.id,
                    class_id: item?.id,
                  })
                }}
              />
            }
            handleChange={handleChange}
          />
        )
      }
      case 'subject_type':
        return (
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.instituteClassController_updateEntityMeta_update
            }
          >
            <Radio
              options={SUBJECT_TYPE}
              selectedId={item?.meta?.subject_type}
              handleChange={(value) => {
                if (value !== item?.meta?.subject_type) {
                  handleChange(SHC.ACT_SEC_EDIT_SUBJECT_TYPE, item?.id, value)
                  eventManager.send_event(events.SUBJECT_TYPE_CHANGED, {
                    section_id: sectionDetails?.id,
                    subject_type: SUBJECT_TYPE.find((item) => item.id === value)
                      ?.label,
                    class_id: item?.id,
                  })
                }
              }}
            />
          </Permission>
        )
      case 'subject_teacher':
        return item?.teacher_detail?.phone_number ||
          item?.teacher_detail?.email ? (
          <div className="w-max">
            <UserProfile
              image={item?.teacher_detail?.img_url}
              name={item?.teacher_detail?.name}
              phoneNumber={item?.teacher_detail?.phone_number}
              email={item?.teacher_detail?.email}
              joinedState={item?.teacher_detail?.verification_status}
              showProfileImg={false}
            />
          </div>
        ) : (
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.instituteClassController_assignSubjectTeacher_update
            }
          >
            <div
              className={classNames(
                'tm-hdg-14 tm-cr-bl-2 cursor-pointer',
                styles.co_teacher
              )}
              onClick={() => handleChange(SHC.ACT_SEC_ASSIGN_SUB_TEACHER, item)}
            >
              {t('assign')} {isMobile ? t('teacher') : ''}
            </div>
          </Permission>
        )
      case 'co_teacher':
        return item?.co_teacher_detail?.length > 0 ? (
          <div
            className={classNames(
              'tm-hdg-14 tm-cr-bl-2',
              styles.assign_co_teacher
            )}
            onClick={() => handleChange(SHC.ACT_SEC_VIEW_CO_TEACHER, item)}
          >
            {`${item.co_teacher_detail.length}`}
            <span className={styles.co_teacher}>
              {' '}
              {t('coTeacherWithSInBracket')}
            </span>
          </div>
        ) : (
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.instituteClassController_assignSubjectTeacher_update
            }
          >
            <div
              className={classNames(
                'tm-hdg-14 tm-cr-bl-2',
                styles.assign_co_teacher,
                styles.co_teacher
              )}
              onClick={() => handleChange(SHC.ACT_SEC_ADD_CO_TEACHER, item)}
            >
              {t('assign')} {isMobile ? t('coTeacher') : ''}
            </div>
          </Permission>
        )

      case 'view_classroom': {
        if (item?.teacher_detail?.phone_number || item?.teacher_detail?.email)
          return (
            <div
              className="items-center hidden lg:flex cursor-pointer"
              onClick={() => {
                window.open(
                  `${REACT_APP_BASE_URL}classroom/${instituteInfo?._id}/${
                    item?.meta?.class_id
                  }?admin_uuid=${getFromSessionStorage(
                    BROWSER_STORAGE_KEYS.ADMIN_UUID
                  )}`
                )
              }}
            >
              <div className="tm-para-14 tm-cr-bl-2">{t('viewDetails')}</div>
            </div>
          )
        return null
      }
      default:
        break
    }
  }

  const getRows = (sectionDetails) => {
    let rows = []

    if (sectionDetails?.children) {
      rows = sectionDetails?.children?.map((item) => {
        return {
          id: item?.id,
          subject_name: getSubjectInfo('subject_name', item),
          subject_type: getSubjectInfo('subject_type', item),
          subject_teacher: getSubjectInfo('subject_teacher', item),
          co_teacher: getSubjectInfo('co_teacher', item),
          settings: getSubjectInfo('settings', item),
          view_classroom: getSubjectInfo('view_classroom', item),
        }
      })
    }
    return rows
  }

  return (
    <div>
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

      {showConfirmationPopup && (
        <ConfirmationPopup
          onClose={setShowConfirmationPopup}
          onAction={showConfirmationPopup?.onAction}
          icon={showConfirmationPopup?.imgSrc}
          title={showConfirmationPopup?.title}
          desc={showConfirmationPopup?.desc}
          primaryBtnText={showConfirmationPopup?.primaryBtnText}
          secondaryBtnText={showConfirmationPopup?.secondaryBtnText}
          secondaryBtnStyle="tm-btn2-red"
        />
      )}

      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-4 bg-white p-5 lg:bg-transparent lg:p-0 rounded-lg">
          <div className="flex items-center tm-hdg tm-hdg-20 lg:tm-hdg-24">
            <div className="mr-2">{classFullName}</div>
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.instituteClassController_updateEntityName_update
              }
            >
              <img
                src="https://storage.googleapis.com/tm-assets/icons/blue/edit-blue.svg"
                alt=""
                className="ml-2 w-4 h-4 cursor-pointer"
                onClick={() => handleChange(SHC.ACT_SEC_EDIT_NAME)}
              />
            </Permission>
          </div>

          <Permission
            permissionId={
              PERMISSION_CONSTANTS.instituteClass_deleteSection_delete
            }
          >
            <div
              onClick={() => handleChange(SHC.ACT_SEC_DELETE_SEC)}
              className="cursor-pointer"
            >
              <Icon name="delete" size="xs" color="error" type="outlined" />
            </div>
          </Permission>
        </div>
        {nodeStatus === 2 && (
          <div className={styles.inactiveTag}>{getRequestStatusLabel(4)}</div>
        )}
      </div>

      <div className="mb-4">
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.instituteClassController_assignSubjectTeacher_update
          }
        >
          <LinearProgressBar
            {...getSectionProgress(sectionDetails)}
            sectionId={sectionDetails?.id}
            handleChange={handleChange}
          />
        </Permission>
      </div>

      <NormalCard
        title={
          <div className={styles.manageCardContainer}>
            <Trans i18nKey="manageClassTeacherNormalCardTitle">
              Manage class teacher, attendance for {{classFullName}}
            </Trans>
          </div>
        }
        desc={t('manageClassTeacherNormalCardDesc')}
        cardTag={
          sectionDetails?.class_teacher?.phone_number ? null : (
            <div className="tm-bgcr-og-2 tm-hdg-12 tm-cr-og-1 w-fit py-2 px-4 mb-3 rounded">
              {t('pending')}
            </div>
          )
        }
      >
        <div className="p-4">
          {sectionDetails?.class_teacher?.phone_number ||
          sectionDetails.class_teacher?.email ? (
            <div className="flex items-center justify-between">
              <UserProfile
                image={sectionDetails?.class_teacher?.img_url}
                name={sectionDetails?.class_teacher?.name}
                phoneNumber={sectionDetails?.class_teacher?.phone_number}
                email={sectionDetails?.class_teacher?.email}
                joinedState={sectionDetails?.class_teacher?.verification_status}
              />
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.instituteClassController_removeClassTeacher_update
                }
              >
                <div
                  className="tm-hdg-12 lg:tm-hdg-14 cursor-pointer tm-cr-rd-1"
                  onClick={() => handleChange(SHC.ACT_SEC_REMOVE_CLASS_TEACHER)}
                >
                  {t('remove')}
                </div>
              </Permission>
            </div>
          ) : (
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.instituteClassController_assignClassTeacher_update
              }
            >
              <div
                className="tm-hdg-12 lg:tm-hdg-14 cursor-pointer tm-cr-bl-2"
                onClick={() => handleChange(SHC.ACT_SEC_CLASS_ASSIGN_TEACHER)}
              >
                {t('assignClassTeacher')}
              </div>
            </Permission>
          )}
        </div>
      </NormalCard>

      <NormalCard
        title={
          instituteInfo?.institute_type === INSTITUTE_TYPES.TUITION ? (
            <Trans i18nKey="deptDetailsClassroomNormatCardTitle">
              Manage classrooms for {{classFullName}}
            </Trans>
          ) : (
            <Trans i18nKey="sectionDetailsSubjectsNormalCardTitle">
              Manage subjects for {{classFullName}}
            </Trans>
          )
        }
        desc={
          instituteInfo?.institute_type === INSTITUTE_TYPES.TUITION
            ? t('sectionDetailsClassroomsNormalCardDesc')
            : t('sectionDetailsSubjectsNormalCardDesc')
        }
      >
        <div className="tm-bdr-b-gy-3 hidden lg:block overflow-x-scroll">
          <Table
            className={styles.noMargin}
            rows={getRows(sectionDetails)}
            cols={
              instituteInfo?.institute_type === INSTITUTE_TYPES.TUITION
                ? DEPT_CLASSROOM_TABLE_HEADERS
                : SECTION_SUBJECT_TABLE_HEADERS
            }
          />
        </div>
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.instituteClassController_createSubject_create
          }
        >
          <div
            className="p-4 tm-hdg-12 lg:tm-hdg-14 cursor-pointer tm-cr-bl-2"
            onClick={() => {
              handleChange(SHC.ACT_SEC_ADD_SUBJECT)
              eventManager.send_event(events.ADD_MORE_SUBJECTS_CLICKED_TFI, {
                section_id: sectionDetails?.id,
              })
            }}
          >
            {instituteInfo?.institute_type === INSTITUTE_TYPES.TUITION
              ? t('addClassroomPlus')
              : t('addSubjectPlus')}
          </div>
        </Permission>

        <div className="w-full p-3 lg:hidden">
          {sectionDetails?.children?.map((item) => (
            <div
              className="w-full bg-white p-4 tm-bdr-gy-2 rounded-md mb-4"
              key={item?.id}
            >
              <div className="flex justify-between">
                {getSubjectInfo('subject_name', item)}
                {getSubjectInfo('settings', item)}
              </div>
              <div className="my-4">{getSubjectInfo('subject_type', item)}</div>
              <div>{getSubjectInfo('subject_teacher', item, true)}</div>
              <div>{getSubjectInfo('co_teacher', item, true)}</div>
            </div>
          ))}
        </div>
      </NormalCard>

      <NormalCard
        title={
          <Trans i18nKey="manageClassStudentNormalCardTitle">
            Manage students for {{classFullName}}
          </Trans>
        }
        desc={t('manageClassStudentNormalCardDesc')}
      >
        {sectionDetails?.section_students?.length > 0 ? (
          <StudentsTable
            students={sectionDetails?.section_students.filter(
              ({deleted}) => !deleted
            )}
            handleChange={handleChange}
            setActiveTab={setActiveTab}
          />
        ) : (
          <AddSectionStudent
            setActiveTab={setActiveTab}
            handleChange={handleChange}
            place="right"
          />
        )}
      </NormalCard>
      <ErrorBoundary>
        <div>{getSliderScreen(sliderScreen)}</div>
      </ErrorBoundary>
    </div>
  )
}
