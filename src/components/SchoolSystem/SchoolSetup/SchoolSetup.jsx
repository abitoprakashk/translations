import React, {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {Trans, useTranslation} from 'react-i18next'
import {instituteHierarchyAction} from '../../../redux/actions/instituteInfoActions'
import {
  schoolSystemScreenSelectedAction,
  schoolSystemSectionSelectedAction,
} from '../../../redux/actions/schoolSystemAction'
import {handleHierarchyOpenClose} from '../../../utils/HierarchyHelpers'
import * as SHC from '../../../utils/SchoolSetupConstants'
import CollapseHeader from '../../Common/CollapseHeader/CollapseHeader'
import {events} from '../../../utils/EventsConstants'
import {
  INSTITUTE_TYPES,
  SECTION_COUNT_LIMIT,
} from '../../../constants/institute.constants'
import {Button} from '@teachmint/common'
import styles from './SchoolSetup.module.css'
import SliderEditStructure from './SliderEditStructure'
import Permission from '../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../utils/permission.constants'

export default function SchoolSetup({getInstituteHierarchy, addNewSection}) {
  const {instituteInfo, instituteHierarchy, eventManager} = useSelector(
    (state) => state
  )
  const [showEditSlider, setShowEditSlider] = useState(false)
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const handleActions = (id, nodeType) => {
    const screenName = 'school_setup_tab'
    switch (nodeType) {
      case SHC.NODE_DEPARTMENT: {
        let hierarchyTemp = JSON.parse(JSON.stringify(instituteHierarchy))
        handleCollapseAction(hierarchyTemp, id)
        dispatch(instituteHierarchyAction(hierarchyTemp))
        break
      }
      case SHC.NODE_ADD_SEC: {
        addNewSection(instituteInfo._id, id, screenName)
        break
      }
      case SHC.NODE_SECTION: {
        eventManager.send_event(events.CLASS_SECTION_CLICKED_TFI, {
          screen_name: screenName,
        })
        dispatch(
          instituteHierarchyAction(
            handleHierarchyOpenClose(instituteHierarchy, id)
          )
        )
        dispatch(schoolSystemSectionSelectedAction(id))
        dispatch(schoolSystemScreenSelectedAction(SHC.SCN_SECTION))
        break
      }
      default:
        break
    }
  }

  const handleCollapseAction = (hierarchy, id) => {
    if (hierarchy && hierarchy.id) {
      // Base Condition
      if (hierarchy.id === id) {
        hierarchy.frontendOptions.collapseHeader =
          !hierarchy.frontendOptions.collapseHeader
        return
      }

      // Traverse through child nodes
      hierarchy &&
        hierarchy.children &&
        hierarchy.children.map((item) => handleCollapseAction(item, id))
    }
  }

  return (
    <>
      <div className={styles.header}>
        <div className="tm-hdg tm-hdg-24">
          {instituteInfo?.institute_type === INSTITUTE_TYPES.TUITION
            ? t('batchSetup')
            : t('classroomSetup')}
        </div>

        <Permission
          permissionId={
            PERMISSION_CONSTANTS.instituteController_editStructure_update
          }
        >
          <Button
            type="border"
            onClick={() => {
              setShowEditSlider(true)
              eventManager.send_event(events.EDIT_SCHOOL_STRUCTURE_CLICKED_TFI)
            }}
          >
            {t('editStructure')}
          </Button>
        </Permission>
      </div>
      <div>
        {instituteHierarchy &&
          instituteHierarchy.children &&
          instituteHierarchy.children
            .filter(({type}) => type === SHC.NODE_DEPARTMENT)
            .map((dep) => (
              <div key={dep.id}>
                <div className="tm-box-shadow1 tm-border-radius1 p-4 bg-white my-4">
                  <CollapseHeader
                    title={dep.name}
                    collapse={dep.frontendOptions.collapseHeader}
                    setCollapse={() => {
                      handleActions(dep.id, dep.type)
                    }}
                  />
                  <div
                    className={
                      dep.frontendOptions.collapseHeader ? 'hidden' : ''
                    }
                  >
                    <div className="tm-bdr-t-gy-3">
                      {dep.children
                        ? dep.children
                            // .filter(({status}) => status === 1)  //show inactive classes to admin
                            .map((classroom, index) => (
                              <div
                                key={classroom.id}
                                className={`py-4 ${
                                  index !== dep.children.length - 1
                                    ? 'tm-bdr-b-gy-3'
                                    : ''
                                }`}
                              >
                                <div className="w-full flex justify-between tm-hdg tm-hdg-16 break-words">
                                  <div>
                                    <Trans
                                      i18nKey={
                                        instituteInfo?.institute_type ==
                                        INSTITUTE_TYPES.TUITION
                                          ? 'dyDepartmentName'
                                          : 'dyClassroomName'
                                      }
                                    >
                                      {instituteInfo?.institute_type ==
                                      INSTITUTE_TYPES.TUITION
                                        ? 'Class -'
                                        : 'Department -'}
                                      {classroom.name}
                                    </Trans>
                                  </div>
                                  {classroom.children.filter(
                                    ({type}) => type === SHC.NODE_SECTION
                                  ).length < SECTION_COUNT_LIMIT && (
                                    <Permission
                                      permissionId={
                                        PERMISSION_CONSTANTS.instituteClass_addSection_create
                                      }
                                    >
                                      <div
                                        className="tm-para-14 tm-cr-bl-2 cursor-pointer"
                                        onClick={() => {
                                          handleActions(
                                            classroom.id,
                                            SHC.NODE_ADD_SEC
                                          )
                                          eventManager.send_event(
                                            events.ADD_NEW_SECTION_CLICKED_TFI,
                                            {screen_name: 'school_setup_tab'}
                                          )
                                        }}
                                      >
                                        {instituteInfo?.institute_type ===
                                        INSTITUTE_TYPES.SCHOOL
                                          ? t('addNewSection')
                                          : t('addNewBatch')}
                                      </div>
                                    </Permission>
                                  )}
                                </div>
                                <div className="my-3 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 w-full pb-3">
                                  {classroom.children &&
                                    classroom.children
                                      .filter(
                                        ({type}) => type === SHC.NODE_SECTION
                                      )
                                      .map((section) => (
                                        <div
                                          key={section.id}
                                          className="tm-bg-light-gray p-3 rounded-lg cursor-pointer"
                                          onClick={() =>
                                            handleActions(
                                              section.id,
                                              section.type
                                            )
                                          }
                                        >
                                          <div>
                                            <div className="tm-hdg tm-hdg-16 overflow-hidden break-words">{`${classroom.name} - ${section.name}`}</div>
                                            <div className="w-full flex justify-end items-center pt-8">
                                              <div className="tm-para-14 tm-cr-bl-2">
                                                {instituteInfo.institute_type ===
                                                INSTITUTE_TYPES.TUITION
                                                  ? t('viewBatch')
                                                  : t('viewClass')}
                                              </div>
                                              <img
                                                src="https://storage.googleapis.com/tm-assets/icons/blue/right-arrow-blue.svg"
                                                alt=""
                                                className="w-3 h-3 ml-1 pt-0.5"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                </div>
                              </div>
                            ))
                        : null}
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>
      {showEditSlider && (
        <SliderEditStructure
          departments={instituteHierarchy?.children.filter(
            ({type}) => type === 'DEPARTMENT'
          )}
          setShowEditSlider={setShowEditSlider}
          getInstituteHierarchy={getInstituteHierarchy}
          eventManager={eventManager}
        />
      )}
    </>
  )
}
