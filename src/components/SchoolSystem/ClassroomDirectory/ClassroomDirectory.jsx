import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Trans, useTranslation} from 'react-i18next'
import NormalCard from '../../Common/NormalCard/NormalCard'
import SearchBox from '../../Common/SearchBox/SearchBox'
import * as SHC from '../../../utils/SchoolSetupConstants'
import EmptyScreenV1 from '../../Common/EmptyScreenV1/EmptyScreenV1'
import defaultTeacherImage from '../../../assets/images/dashboard/empty-teacher.png'
import {events} from '../../../utils/EventsConstants'
import SliderAddClassroomDir from './SliderAddClassroomDir'
import {Button, ErrorBoundary} from '@teachmint/common'
import UncategorizedClassroomCard from './UncategorizedClassroomCard/UncategorizedClassroomCard'
import SliderEditSectionName from '../SectionDetails/SliderEditSectionName'
import {
  showEditSessionAction,
  showLoadingAction,
  showToast,
} from '../../../redux/actions/commonAction'
import {
  utilsDeleteSubject,
  utilsRemoveSubjectTeacher,
  utilsUpdateNodeName,
} from '../../../routes/instituteSystem'
import SliderAddStudentUncategorized from './SliderAddStudentUncategorized'
import ConfirmationPopup from '../../Common/ConfirmationPopup/ConfirmationPopup'
import SliderTeacher from '../SectionDetails/SliderTeacher'
import produce from 'immer'
import {searchBoxFilter} from '../../../utils/Helpers'
import globalActions from '../../../redux/actions/global.actions'
import {USER_TYPE_SETTINGS} from '../../../pages/user-profile/constants'
import {personaProfileSettingsSelector} from '../../../pages/ProfileSettings/redux/ProfileSettingsSelectors'
import {getCategoriesCollection} from '../../../pages/ProfileSettings/ProfileSettings.utils'
import {SETTING_TYPE} from '../../../pages/ProfileSettings/ProfileSettings.constant'
import {fetchCategoriesRequestAction} from '../../../pages/ProfileSettings/redux/actions/ProfileSettingsActions'
import Permission from '../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../utils/permission.constants'
import {isHierarchyAvailable} from '../../../utils/HierarchyHelpers'

export default function ClassroomDirectory({getInstituteClasses}) {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const [filteredClassrooms, setFilteredClassrooms] = useState([])
  const [searchText, setSearchText] = useState('')
  const [sliderScreen, setSliderScreen] = useState(null)
  const [selectedClassroom, setSelectedClassroom] = useState(null)
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(null)
  const [personaValue, setPersonaValue] = useState(USER_TYPE_SETTINGS.STAFF.id)
  const {instituteInfo, instituteAllClasses, eventManager} = useSelector(
    (state) => state
  )
  const instituteHierarchy = useSelector((state) => state.instituteHierarchy)
  const instituteHasHierarchy = isHierarchyAvailable(instituteHierarchy)
  const personaProfileSettingsData = personaProfileSettingsSelector()

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
    setFilteredClassrooms(instituteAllClasses)
  }, [instituteAllClasses])

  const setToastData = (type, message) => dispatch(showToast({type, message}))

  const handleSearchFilter = (text) => {
    setSearchText(text)
    let searchParams = [['name'], ['subject'], ['teacher', 'name']]
    setFilteredClassrooms(
      searchBoxFilter(text, instituteAllClasses, searchParams)
    )
  }

  const handleChange = (action, node = null) => {
    setSelectedClassroom(node)
    switch (action) {
      case SHC.ACT_CLS_DIR_ADD_CLASSROOM: {
        eventManager.send_event(events.ADD_CLASSROOM_CLICKED, {
          screen_name: 'classroom_directory',
        })
        setSliderScreen(SHC.SCN_SLI_ADD_DIR_CLASSROOM)
        break
      }
      case SHC.ACT_UNC_CLS_EDIT_CLASS_NAME: {
        setSliderScreen(SHC.SCN_SLI_EDIT_CLASSROOM_NAME)
        break
      }
      case SHC.ACT_UNC_CLS_ADD_STUDENTS: {
        setSliderScreen(SHC.SCN_SLI_STUDENT)
        setPersonaValue(USER_TYPE_SETTINGS.STUDENT.id)
        break
      }
      case SHC.ACT_UNC_CLS_VIEW_STUDENTS: {
        setSliderScreen(SHC.SCN_SLI_STUDENT)
        setPersonaValue(USER_TYPE_SETTINGS.STUDENT.id)
        break
      }
      case SHC.ACT_UNC_CLS_REPLACE_TEACHER: {
        setSliderScreen(SHC.SCN_SLI_TEACHER)
        setPersonaValue(USER_TYPE_SETTINGS.STAFF.id)
        break
      }
      case SHC.ACT_UNC_CLS_REMOVE_TEACHER: {
        setShowConfirmationPopup({
          title: t('actUncClsRemoveTeacherTitle'),
          desc: t('actUncClsRemoveTeacherDesc'),
          imgSrc:
            'https://storage.googleapis.com/tm-assets/icons/colorful/remove-bg-red.svg',
          primaryBtnText: t('cancel'),
          secondaryBtnText: t('remove'),
          onAction: () => removeTeacher(node?._id),
        })
        break
      }
      case SHC.ACT_UNC_CLS_DELETE_CLASS: {
        setShowConfirmationPopup({
          title: (
            <Trans i18nKey="actUncClsDeleteClassTitle">
              Delete class {node?.name}?
            </Trans>
          ),
          desc: t('actUncClsDeleteClassDesc'),
          imgSrc:
            'https://storage.googleapis.com/tm-assets/icons/colorful/remove-bg-red.svg',
          primaryBtnText: t('cancel'),
          secondaryBtnText: t('delete'),
          onAction: () => deleteSubject(node?._id),
        })
        break
      }
      default:
        break
    }
  }

  const getSliderScreen = (id) => {
    switch (id) {
      case SHC.SCN_SLI_ADD_DIR_CLASSROOM:
        return <SliderAddClassroomDir setSliderScreen={setSliderScreen} />
      case SHC.SCN_SLI_EDIT_CLASSROOM_NAME:
        return (
          <SliderEditSectionName
            setSliderScreen={setSliderScreen}
            setSelectedSubject={setSelectedClassroom}
            oldName={selectedClassroom?.name}
            handleSubmit={updateNodeName}
            nodeId={selectedClassroom?._id}
            title={t('editClassroomName')}
            fieldName={t('classroomName')}
            maxLength={100}
          />
        )
      case SHC.SCN_SLI_STUDENT:
        return (
          <SliderAddStudentUncategorized
            setSliderScreen={setSliderScreen}
            classroomDetails={selectedClassroom}
            getInstituteClasses={getInstituteClasses}
          />
        )
      case SHC.SCN_SLI_TEACHER: {
        const selectedClassroomTemp = selectedClassroom
          ? produce(selectedClassroom, (draft) => {
              draft.id = draft?._id
              draft.classroomName = draft?.name
              draft.name = null
            })
          : {}

        return (
          <SliderTeacher
            callback={(_doUpdate) => {
              setSelectedClassroom(null)
              setSliderScreen(null)
              getInstituteClasses()
            }}
            setSliderScreen={setSliderScreen}
            nodeDetails={selectedClassroomTemp}
          />
        )
      }
      default:
        break
    }
  }

  const updateNodeName = (id, name) => {
    dispatch(showLoadingAction(true))
    utilsUpdateNodeName(instituteInfo._id, id, name)
      .then(() => {
        getInstituteClasses()
        setToastData('success', t('nameSuccessfullyUpdated'))
      })
      .catch(() => setToastData('error', t('unableToUpdateName')))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const removeTeacher = (id) => {
    dispatch(showLoadingAction(true))
    utilsRemoveSubjectTeacher(instituteInfo._id, id)
      .then(() => {
        getInstituteClasses()
        setToastData('success', t('classTeacherSuccessfullyRemoved'))
      })
      .catch(() => setToastData('error', t('unableToRemoveClassTeacher')))
      .finally(() => {
        dispatch(showLoadingAction(false))
        setShowConfirmationPopup(null)
      })
  }

  const deleteSubject = (id) => {
    dispatch(showLoadingAction(true))
    utilsDeleteSubject(instituteInfo._id, id)
      .then(() => {
        getInstituteClasses()
        setToastData('success', t('classroomSuccessfullyDeleted'))
      })
      .catch(() => setToastData('error', t('unableToDeleteClassroom')))
      .finally(() => {
        dispatch(showLoadingAction(false))
        setShowConfirmationPopup(null)
      })
  }

  const handleImportSession = () => {
    dispatch(showEditSessionAction(true))
  }

  const getEmptyView = () => {
    if (instituteHasHierarchy) {
      return (
        <>
          <EmptyScreenV1
            image={defaultTeacherImage}
            title={t('addCustomClassesTitle')}
            desc={t('addCustomClassesDesc')}
          />
          <div className="flex justify-center mt-2 gap-4">
            <Button
              onClick={() => handleChange(SHC.ACT_CLS_DIR_ADD_CLASSROOM)}
              type="border"
            >
              {t('addClassrooms')}
            </Button>
          </div>
        </>
      )
    }

    return (
      <>
        <EmptyScreenV1
          image={defaultTeacherImage}
          title={t('addClassStructureTitle')}
          desc={t('addingClassroomsEmptyScreenDesc')}
        />
        <div className="flex justify-center mt-2 gap-4">
          <Button onClick={handleImportSession}>
            {t('importFromPrevSession')}
          </Button>
        </div>
      </>
    )
  }

  return (
    <div>
      <div className="tm-hdg tm-hdg-24 mb-2">{t('classroomSetup')} </div>

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

      {instituteAllClasses?.length > 0 ? (
        <NormalCard>
          <div className="flex flex-wrap justify-between items-center p-4">
            <div className="w-full lg:w-96">
              <SearchBox
                value={searchText}
                placeholder={t('searchForClassrooms')}
                handleSearchFilter={handleSearchFilter}
              />
            </div>
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.instituteClassController_createUncategorizedClassroom_create
              }
            >
              <Button
                onClick={() => handleChange(SHC.ACT_CLS_DIR_ADD_CLASSROOM)}
              >
                {t('addClassroomsPlus')}
              </Button>
            </Permission>
          </div>
        </NormalCard>
      ) : (
        <div className="bg-white rounded-lg w-full h-screen pt-20 px-6">
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.instituteClassController_createUncategorizedClassroom_create
            }
          >
            {getEmptyView()}
          </Permission>
        </div>
      )}

      <div className="mt-4">
        <ErrorBoundary>
          {filteredClassrooms &&
            filteredClassrooms.map((item, index) => (
              <ErrorBoundary key={index}>
                <UncategorizedClassroomCard
                  classroomItem={item}
                  handleChange={handleChange}
                />
              </ErrorBoundary>
            ))}
        </ErrorBoundary>
      </div>

      <div>{getSliderScreen(sliderScreen)}</div>
    </div>
  )
}
