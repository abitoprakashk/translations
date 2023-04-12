import React, {useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {
  showErrorOccuredAction,
  showLoadingAction,
  showToast,
} from '../../../redux/actions/commonAction'
import {instituteHierarchyAction} from '../../../redux/actions/instituteInfoActions'
import {schoolSystemScreenSelectedAction} from '../../../redux/actions/schoolSystemAction'
import {
  utilsAddSection,
  utilsGetInstituteHierarchy,
} from '../../../routes/instituteSystem'
import {
  handleHierarchyOpenClose,
  hierarchyInitialization,
  isHierarchyAvailable,
} from '../../../utils/HierarchyHelpers'
import * as SHC from '../../../utils/SchoolSetupConstants'
import ContentArea from '../../SchoolSystem/ContentArea/ContentArea'
import HeirarchySidebar from '../../SchoolSystem/HeirarchySidebar/HeirarchySidebar'
import {events} from '../../../utils/EventsConstants'

export default function System({match}) {
  const {
    instituteInfo,
    instituteHierarchy,
    eventManager,
    schoolSystemScreenSelected,
  } = useSelector((state) => state)
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const handleActions = (id, nodeType) => {
    const screenName = 'middle_bar'
    if (nodeType === SHC.NODE_ADD_SEC) {
      addNewSection(instituteInfo._id, id, screenName)
    } else {
      // Set School Setup Screen
      if (nodeType === SHC.NODE_SCHOOL_SYSTEM_OVERVIEW)
        dispatch(schoolSystemScreenSelectedAction(SHC.SCN_SCHOOL_SETUP))
      // Set Acrhived Screen
      else if (nodeType === SHC.NODE_SCHOOL_ARCHIVE)
        dispatch(schoolSystemScreenSelectedAction(SHC.SCN_ARCHIVED))
      // Set Unassigned Classes Screen
      else if (nodeType === SHC.NODE_UNASSIGNED_CLASSES)
        dispatch(schoolSystemScreenSelectedAction(SHC.SCN_UNASSIGNED))
      // Select Section Screen
      else if (nodeType === SHC.NODE_SECTION) {
        dispatch(schoolSystemScreenSelectedAction(SHC.SCN_SECTION))
      }

      dispatch(
        instituteHierarchyAction(
          handleHierarchyOpenClose(instituteHierarchy, id)
        )
      )
    }
  }

  useEffect(() => {
    if (!schoolSystemScreenSelected && instituteHierarchy) {
      dispatch(
        schoolSystemScreenSelectedAction(
          match.params.tab !== 'setup'
            ? SHC.SCN_TEACHER_DIRECTORY
            : isHierarchyAvailable(instituteHierarchy)
            ? SHC.SCN_SCHOOL_SETUP
            : SHC.SCN_CLASSROOM_PAGE
        )
      )
    }
  }, [instituteInfo, instituteHierarchy, schoolSystemScreenSelected])

  const getInstituteHierarchy = () => {
    if ((instituteInfo?._id, instituteInfo?.hierarchy_id)) {
      dispatch(showLoadingAction(true))
      utilsGetInstituteHierarchy(
        instituteInfo?._id,
        instituteInfo?.hierarchy_id
      )
        .then(({status, obj}) => {
          if (status)
            dispatch(
              instituteHierarchyAction(
                hierarchyInitialization(
                  instituteHierarchy,
                  obj,
                  instituteInfo?.institute_type
                )
              )
            )
          else
            dispatch(
              showToast({
                type: 'error',
                message: t('getInstituteHierarchyErrorToastMsg'),
              })
            )
        })
        .catch((_err) => dispatch(showErrorOccuredAction(true)))
        .finally(() => dispatch(showLoadingAction(false)))
    }
  }

  const addNewSection = (instituteId, uuid, screenName) => {
    dispatch(showLoadingAction(true))
    utilsAddSection(instituteId, uuid)
      .then(({status}) => {
        if (status) {
          eventManager.send_event(events.NEW_SECTION_ADDED_TFI, {
            screen_name: screenName,
          })
          getInstituteHierarchy()
          dispatch(
            showToast({
              type: 'success',
              message: t('addNewSectionSuccessToastMsg'),
            })
          )
        } else
          dispatch(
            showToast({
              type: 'error',
              message: t('addNewSectionErrorToastMsg'),
            })
          )
      })
      .catch(() => dispatch(showErrorOccuredAction(true)))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  return (
    <div className="w-full h-full flex">
      {isHierarchyAvailable(instituteHierarchy) &&
        match.params.tab === 'setup' && (
          <div className="hidden lg:block w-64 flex-shrink-0 h-full bg-white p-4 overflow-y-auto">
            <HeirarchySidebar
              hierarchy={instituteHierarchy}
              handleActions={handleActions}
            />
          </div>
        )}
      <div className="h-full overflow-y-auto flex-grow p-5">
        {schoolSystemScreenSelected ? (
          <ContentArea
            getInstituteHierarchy={getInstituteHierarchy}
            addNewSection={addNewSection}
            showTabs={match.params.tab !== 'setup'}
          />
        ) : (
          <div className="loader"></div>
        )}
      </div>
    </div>
  )
}
