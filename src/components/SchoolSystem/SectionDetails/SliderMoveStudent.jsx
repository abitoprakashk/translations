import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Trans, useTranslation} from 'react-i18next'
import {StickyFooter} from '@teachmint/common'
import InputField from '../../Common/InputField/InputField'
import SliderScreen from '../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../Common/SliderScreenHeader/SliderScreenHeader'
import * as SHC from '../../../utils/SchoolSetupConstants'
import {
  getNodesListOfSimilarType,
  getNodeDataWithChildrensParent,
} from '../../../utils/HierarchyHelpers'
import {
  utilsAssignStudentSection,
  utilsMoveStudent,
} from '../../../routes/instituteSystem'
import {
  showErrorOccuredAction,
  showLoadingAction,
  showToast,
} from '../../../redux/actions/commonAction'
import {instituteStudentListAction} from '../../../redux/actions/instituteInfoActions'
import {utilsGetUsersList} from '../../../routes/dashboard'
import {events} from '../../../utils/EventsConstants'
import styles from './SliderMoveStudent.module.css'
import classNames from 'classnames'
import {INSTITUTE_MEMBER_TYPE} from './../../../constants/institute.constants'

export default function SliderMoveStudent({
  setSliderScreen,
  sectionDetails,
  selectedStudent,
  setSelectedStudent,
  getSectionDetails = null,
  screenName = '',
  onSubmit,
  userList = [],
  setDuplicateUserScreen,
}) {
  const [classList, setClassList] = useState([])
  const [sectionList, setSectionList] = useState([])
  const [selectedClass, setSelectedClass] = useState(undefined)
  const [selectedSection, setSelectedSection] = useState(undefined)

  const {instituteInfo, instituteHierarchy, eventManager} = useSelector(
    (state) => state
  )

  const dispatch = useDispatch()
  const {t} = useTranslation()

  const handleMergeUser = () => {
    setDuplicateUserScreen(true)
    setSliderScreen(false)
  }

  // Get Classes List
  useEffect(() => {
    const classes = getNodesListOfSimilarType(
      instituteHierarchy,
      SHC.NODE_CLASS
    )
    const classesOptions = classes?.map(({id, name}) => {
      return {key: id, value: name}
    })
    // Add Select Option in dropdown items
    classesOptions.splice(0, 0, {key: 'Select', value: t('select')})

    setClassList(classesOptions)
    setSelectedClass('Select')
  }, [])

  // Get Section List on updating class
  useEffect(() => {
    if (selectedClass) {
      const sections = getNodeDataWithChildrensParent(
        instituteHierarchy,
        selectedClass
      )

      const sectionsOptions =
        sections?.children
          ?.filter(({type}) => type === SHC.NODE_SECTION)
          .map(({id, name}) => {
            return {key: id, value: name}
          }) || []

      // Add Select Option in dropdown items
      sectionsOptions.splice(0, 0, {key: 'Select', value: t('select')})

      setSectionList(sectionsOptions)
      setSelectedSection('Select')
    }
  }, [selectedClass])

  const getInstituteStudentsHierarchy = () => {
    dispatch(showLoadingAction(true))
    utilsGetUsersList({type: [INSTITUTE_MEMBER_TYPE.STUDENT]})
      .then(({status, obj}) => {
        if (status) dispatch(instituteStudentListAction(obj))
      })
      .catch(() => dispatch(showErrorOccuredAction(true)))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const moveStudent = () => {
    if (
      instituteInfo?._id &&
      selectedSection !== 'Select' &&
      selectedStudent?._id &&
      sectionDetails?.id !== selectedSection
    ) {
      dispatch(showLoadingAction(true))

      if (sectionDetails?.id) {
        eventManager.send_event(events.MOVE_STUDENT_CLICKED_TFI, {
          screen_name: screenName,
          type: 'move',
          section_id: sectionDetails.id,
        })
        utilsMoveStudent(
          instituteInfo?._id,
          selectedStudent?._id,
          sectionDetails?.id,
          selectedSection,
          selectedStudent?.phone_number
        )
          .then(({status}) => {
            if (status) {
              setSliderScreen(null)
              setSelectedStudent(null)
              getSectionDetails && getSectionDetails(sectionDetails?.id)
              getInstituteStudentsHierarchy(instituteInfo?._id)
              dispatch(
                showToast({
                  type: 'success',
                  message: (
                    <Trans i18nKey="moveStudentSuccessfullyMsg">
                      {selectedStudent?.name} has been moved successfully
                    </Trans>
                  ),
                })
              )
              eventManager.send_event(events.STUDENT_MOVED_TFI, {
                screen_name: screenName,
                type: 'move',
                section_id: sectionDetails.id,
              })
            } else {
              dispatch(
                showToast({type: 'error', message: t('unableToMoveStudent')})
              )
            }
          })
          .catch((_err) => dispatch(showErrorOccuredAction(true)))
          .finally(() => {
            setSliderScreen(null)
            dispatch(showLoadingAction(false))
          })
      } else {
        eventManager.send_event(events.MOVE_STUDENT_CLICKED_TFI, {
          screen_name: screenName,
          type: 'assign',
        })
        utilsAssignStudentSection(
          instituteInfo?._id,
          selectedStudent?._id,
          selectedStudent?.phone_number,
          selectedSection
        )
          .then(({status}) => {
            if (status) {
              setSliderScreen(null)
              setSelectedStudent(null)
              getInstituteStudentsHierarchy(instituteInfo?._id)
              dispatch(
                showToast({
                  type: 'success',
                  message: (
                    <Trans i18nKey="assignStudentSuccessfullyMsg">
                      {selectedStudent?.name} has been assigned successfully
                    </Trans>
                  ),
                })
              )
              eventManager.send_event(events.STUDENT_MOVED_TFI, {
                screen_name: screenName,
                type: 'assign',
              })
            } else {
              dispatch(
                showToast({type: 'error', message: t('unableToAssignStudent')})
              )
            }
          })
          .catch((_err) => dispatch(showErrorOccuredAction(true)))
          .finally(() => {
            setSliderScreen(null)
            dispatch(showLoadingAction(false))
          })
      }
    }
  }

  return (
    <SliderScreen setOpen={() => setSliderScreen(null)}>
      <>
        {screenName === 'PendingRequest' && (
          <>
            <SliderScreenHeader
              icon="https://storage.googleapis.com/tm-assets/icons/primary/teacher-primary.svg"
              title={t('addStudent')}
            />
            <div className={styles.infoDiv}>
              <p className={styles.heading}>{t('requestDetails')}</p>
              <div
                className={classNames(
                  styles.infoGrid,
                  'tm-border1',
                  'tm-border-radius1'
                )}
              >
                <div>
                  <p className={styles.textValue}>{selectedStudent?.name}</p>
                  <p className={styles.textKey}>{t('studentName')}</p>
                </div>
                <div>
                  <p className={styles.textValue}>
                    {selectedStudent?.class_detail}
                  </p>
                  <p className={styles.textKey}>{t('class')}</p>
                </div>
                <div>
                  <p className={styles.textValue}>
                    {selectedStudent?.phone_number}
                  </p>
                  <p className={styles.textKey}>{t('pNumber')}</p>
                </div>
                <div>
                  <p className={styles.textValue}>
                    {selectedStudent?.roll_no ? selectedStudent?.roll_no : 'NA'}
                  </p>
                  <p className={styles.textKey}>{t('rollNo')}</p>
                </div>
              </div>
            </div>
          </>
        )}
        <>
          {sectionDetails?.id && (
            <SliderScreenHeader
              icon="https://storage.googleapis.com/tm-assets/icons/primary/teacher-primary.svg"
              title={t('moveStudentToDifferentClass')}
            />
          )}
          <div className="p-5 lg:p-10 lg:pt-5 h-4/5 overflow-y-auto">
            {sectionDetails?.id ? (
              <>
                <div className="tm-para tm-para-14 mt-1">
                  <Trans i18nKey="studentMovetoBelowClassAndRemovedFrom">
                    {selectedStudent?.name} will be moved to the below class and
                    will be removed from {sectionDetails?.name}
                  </Trans>
                </div>
              </>
            ) : (
              <div className={styles.heading}>
                <Trans i18nKey="addStudentTobelowClass">
                  Select a class in which you want to add{' '}
                  {selectedStudent?.name}.
                </Trans>
              </div>
            )}

            <div className="mt-4">
              <InputField
                fieldType="dropdown"
                title={t('class')}
                placeholder={t('class')}
                value={selectedClass}
                handleChange={(_, value) => {
                  setSelectedClass(value)
                }}
                fieldName="class"
                dropdownItems={classList}
              />

              <InputField
                fieldType="dropdown"
                title={t('section')}
                placeholder={t('section')}
                value={selectedSection}
                handleChange={(_, value) => setSelectedSection(value)}
                fieldName="section"
                dropdownItems={sectionList}
              />

              {userList.length > 0 && (
                <p className={styles.heading}>
                  {`There are ${userList.length} profiles in student directory with same details.
              Please check it once to avoid duplication`}{' '}
                  <button onClick={handleMergeUser}>{t('checkHere')}</button>
                </p>
              )}
            </div>
          </div>
        </>
      </>
      <StickyFooter forSlider>
        <button
          className="tm-btn2-blue"
          onClick={() => {
            if (selectedSection)
              onSubmit
                ? onSubmit(
                    selectedSection !== t('select') ? selectedSection : null
                  )
                : moveStudent()
          }}
        >
          {sectionDetails?.id
            ? t('update')
            : onSubmit
            ? t('save')
            : t('assign')}
        </button>
      </StickyFooter>
    </SliderScreen>
  )
}
