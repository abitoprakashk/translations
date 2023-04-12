import {
  Icon,
  Input,
  INPUT_TYPES,
  Modal,
  MODAL_CONSTANTS,
  PlainCard,
} from '@teachmint/krayon'
import React, {useEffect, useState} from 'react'
import {Trans, useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {
  showErrorOccuredAction,
  showLoadingAction,
  showToast,
} from '../../../../redux/actions/commonAction'
import {instituteStudentListAction} from '../../../../redux/actions/instituteInfoActions'
import {
  utilsAssignStudentSection,
  utilsMoveStudent,
} from '../../../../routes/instituteSystem'
import {events} from '../../../../utils/EventsConstants'
import {
  getNodeDataWithChildrensParent,
  getNodesListOfSimilarType,
} from '../../../../utils/HierarchyHelpers'
import {NODE_CLASS, NODE_SECTION} from '../../../../utils/SchoolSetupConstants'
import styles from './AssignToClassModal.module.css'
import {utilsGetUsersList} from '../../../../routes/dashboard'
import {
  INSTITUTE_MEMBER_TYPE,
  INSTITUTE_TYPES,
} from '../../../../constants/institute.constants'

export default function AssignToClassModal({
  showModal,
  setShowModal,
  student,
  screenName,
  currentClass,
  currentSection,
}) {
  const [classList, setClassList] = useState([])
  const [sectionList, setSectionList] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [selectedSection, setSelectedSection] = useState(null)

  const {instituteInfo, instituteHierarchy, eventManager} = useSelector(
    (state) => state
  )
  const dispatch = useDispatch()
  const {t} = useTranslation()

  useEffect(() => {
    setSelectedClass(currentClass)
    setSelectedSection(currentSection)
  }, [currentClass, currentSection])

  // Get Classes List
  useEffect(() => {
    const classes = getNodesListOfSimilarType(instituteHierarchy, NODE_CLASS)
    const classesOptions = classes?.map(({id, name}) => {
      return {value: id, label: name}
    })

    setClassList(classesOptions)

    if (!classesOptions?.find(({value}) => value === currentClass))
      setSelectedClass(null)
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
          ?.filter(({type}) => type === NODE_SECTION)
          .map(({id, name}) => {
            return {value: id, label: name}
          }) || []

      setSectionList(sectionsOptions)
      if (!sectionsOptions?.find(({value}) => value === currentSection))
        setSelectedSection(null)
    }
  }, [selectedClass])

  const moveStudent = () => {
    const currentSectionId = student?.details?.sections?.[0]

    if (
      instituteInfo?._id &&
      selectedSection !== 'Select' &&
      student?._id &&
      currentSectionId !== selectedSection
    ) {
      dispatch(showLoadingAction(true))

      if (currentSectionId) {
        eventManager.send_event(events.MOVE_STUDENT_CLICKED_TFI, {
          screen_name: screenName,
          type: 'move',
          section_id: currentSectionId,
        })
        utilsMoveStudent(
          instituteInfo?._id,
          student?._id,
          currentSectionId,
          selectedSection,
          student?.phone_number
        )
          .then(({status}) => {
            if (status) {
              setShowModal(false)
              getInstituteStudentsHierarchy(instituteInfo?._id)
              dispatch(
                showToast({
                  type: 'success',
                  message: (
                    <Trans i18nKey="moveStudentSuccessfullyMsg">
                      {student?.name} has been moved successfully
                    </Trans>
                  ),
                })
              )
              eventManager.send_event(events.STUDENT_MOVED_TFI, {
                screen_name: screenName,
                type: 'move',
                section_id: currentSectionId,
              })
            } else {
              dispatch(
                showToast({type: 'error', message: t('unableToMoveStudent')})
              )
            }
          })
          .catch((_err) => dispatch(showErrorOccuredAction(true)))
          .finally(() => {
            setShowModal(false)
            dispatch(showLoadingAction(false))
          })
      } else {
        eventManager.send_event(events.MOVE_STUDENT_CLICKED_TFI, {
          screen_name: screenName,
          type: 'assign',
        })
        utilsAssignStudentSection(
          instituteInfo?._id,
          student?._id,
          student?.phone_number,
          selectedSection
        )
          .then(({status}) => {
            if (status) {
              setShowModal(false)
              getInstituteStudentsHierarchy(instituteInfo?._id)
              dispatch(
                showToast({
                  type: 'success',
                  message: (
                    <Trans i18nKey="assignStudentSuccessfullyMsg">
                      {student?.name} has been assigned successfully
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
            setShowModal(false)
            dispatch(showLoadingAction(false))
          })
      }
    }
  }

  const getInstituteStudentsHierarchy = () => {
    dispatch(showLoadingAction(true))
    utilsGetUsersList({type: [INSTITUTE_MEMBER_TYPE.STUDENT]})
      .then(({status, obj}) => {
        if (status) dispatch(instituteStudentListAction(obj))
      })
      .catch(() => dispatch(showErrorOccuredAction(true)))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  return (
    <Modal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      header={
        instituteInfo?.institute_type === INSTITUTE_TYPES.TUITION
          ? student?.details?.sections?.[0]
            ? t('changeDepartment')
            : t('assignDepartment')
          : student?.details?.sections?.[0]
          ? t('changeClassroom')
          : t('assignClassroom')
      }
      headerIcon={<Icon name="swapHorizontal" />}
      classes={{modal: styles.modal}}
      actionButtons={[
        {
          onClick: moveStudent,
          body: t('save'),
          isDisabled: !(selectedClass && selectedSection),
        },
      ]}
      size={MODAL_CONSTANTS.SIZE.SMALL}
    >
      <PlainCard className={styles.inputCard}>
        <Input
          type={INPUT_TYPES.DROPDOWN}
          isRequired={true}
          title={t(
            instituteInfo?.institute_type === INSTITUTE_TYPES.TUITION
              ? 'department'
              : 'class'
          )}
          fieldName="class"
          options={classList || []}
          selectedOptions={selectedClass}
          shouldOptionsOccupySpace={false}
          onChange={({value}) => setSelectedClass(value)}
          placeholder={t('select')}
          isDisabled={!classList?.length > 0}
          classes={{optionsClass: styles.optionsClass}}
        />

        <Input
          type={INPUT_TYPES.DROPDOWN}
          isRequired={true}
          title={t(
            instituteInfo?.institute_type === INSTITUTE_TYPES.TUITION
              ? 'batch'
              : 'section'
          )}
          fieldName="section"
          options={sectionList || []}
          selectedOptions={selectedSection}
          shouldOptionsOccupySpace={false}
          onChange={({value}) => setSelectedSection(value)}
          placeholder={t('select')}
          isDisabled={!sectionList?.length > 0}
          classes={{
            optionsClass: styles.optionsClass,
            dropdownClass:
              sectionList?.length > 0 ? '' : styles.dropdownClassDisabled,
          }}
        />
      </PlainCard>
    </Modal>
  )
}
