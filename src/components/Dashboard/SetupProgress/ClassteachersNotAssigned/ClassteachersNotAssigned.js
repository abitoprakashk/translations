import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import SliderScreen from '../../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../../Common/SliderScreenHeader/SliderScreenHeader'
import {ErrorBoundary, StickyFooter} from '@teachmint/common'
import * as SHC from '../../../../utils/SchoolSetupConstants'
import UnassignedClasses from './components/UnassignedClasses'
import {utilsBulkAssignClassTeachersToSection} from '../../../../routes/dashboard'
import {
  showErrorOccuredAction,
  showLoadingAction,
  showToast,
} from '../../../../redux/actions/commonAction'
import {events} from '../../../../utils/EventsConstants'
import {getActiveTeachers} from '../../../../redux/reducers/CommonSelectors'
import {getNodesListOfSimilarTypeWithChildren} from '../../../../utils/HierarchyHelpers'

const ClassteachersNotAssigned = ({
  setSliderScreen,
  getUnassignedClassTeachersToSection,
  getData,
}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {instituteInfo, eventManager, instituteHierarchy} = useSelector(
    (state) => state
  )
  const instituteTeacherList = getActiveTeachers(true)

  const [selectedClassteachers, setSelectedClassteachers] = useState({})
  const handleInputChange = (obj) => {
    setSelectedClassteachers({
      ...selectedClassteachers,
      [obj.fieldName]: obj.value,
    })
  }

  const assignClassteachers = async () => {
    eventManager.send_event(
      events.ASSIGN_CLASS_TEACHER_ONBAORDING_CLICKED_TFI,
      {
        section_id: Object.keys(selectedClassteachers),
        teacher_id: Object.values(selectedClassteachers),
      }
    )
    dispatch(showLoadingAction(true))
    await utilsBulkAssignClassTeachersToSection(
      Object.keys(getUnassignedClassTeachersToSection)
        .filter(
          (key) =>
            selectedClassteachers[getUnassignedClassTeachersToSection[key]]
        )
        .map((key) => {
          return {
            section_id: key,
            teacher_id:
              selectedClassteachers[getUnassignedClassTeachersToSection[key]],
          }
        }),
      eventManager.send_event(events.CLASS_TEACHER_ONBOARDING_POSTED_TFI)
    ).catch(() => {
      dispatch(showErrorOccuredAction(true))
    })
    dispatch(showLoadingAction(false))
    dispatch(showToast({type: 'success', message: t('classTeachersAssigned')}))
    setSliderScreen(false)
    getData()
  }

  const sortedList = (classMap) => {
    const classes = getNodesListOfSimilarTypeWithChildren(
      instituteHierarchy,
      SHC.NODE_CLASS
    )
    const ans = []
    classes.map((class1) =>
      class1.children
        .filter((section1) =>
          Object.values(classMap).includes(class1.name + ' ' + section1.name)
        )
        .map((section1) => ans.push(class1.name + ' ' + section1.name))
    )
    return ans
  }

  return (
    <SliderScreen setOpen={() => setSliderScreen(null)} width={900}>
      <>
        <ErrorBoundary>
          <SliderScreenHeader
            icon="https://storage.googleapis.com/tm-assets/icons/primary/announcement-primary.svg"
            title={t('assignClassTeacher').substring(1)}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <UnassignedClasses
            unassignedClasses={sortedList(getUnassignedClassTeachersToSection)}
            allTeachersList={instituteTeacherList}
            handleInputChange={handleInputChange}
            selectedClassteachers={selectedClassteachers}
          />
        </ErrorBoundary>
        {!!Object.keys(selectedClassteachers).length && (
          <StickyFooter forSlider>
            <div>
              <button
                onClick={() => assignClassteachers(instituteInfo)}
                className="tm-btn2-blue"
              >
                {t('assignClassTeacher').substring(1)}
              </button>
            </div>
          </StickyFooter>
        )}
      </>
    </SliderScreen>
  )
}

export default ClassteachersNotAssigned
