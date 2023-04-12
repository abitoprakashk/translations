import {useTranslation} from 'react-i18next'
import MarksAndGrades from '../MarksAndGrades/MarksAndGrades'
import useQuery from '../../../../../hooks/UseQuery'
import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
  fetchExamStructuresForClassAction,
  fetchGradesCriteriaAction,
  postExamStructureData,
} from '../../Redux/ExamStructureActions'
import {
  useExamStructureForClass,
  useExamStructureSaved,
} from '../../Redux/ExamStructureSelectors'
import {toCamelCasedKeys} from '../../../../../utils/Helpers'
import TermRow from '../TermRow/TermRow'
import produce from 'immer'
import styles from './ExamTemplateEditor.module.css'
import {Button, Breadcrumb} from '@teachmint/common'
import {
  addErrorKey,
  modifyObjectAsNewEntry,
  removeErrorFields,
  validateExamStructure,
} from '../../utils/Utils'
import EmptyScreenV1 from '../../../../../components/Common/EmptyScreenV1/EmptyScreenV1'
import ConfirmationPopup from '../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import {DASHBOARD} from '../../../../../utils/SidebarItems'
import {useHistory} from 'react-router'
import examMobileImage from '../../../../../assets/images/dashboard/exam-mobile.svg'
import {events} from '../../../../../utils/EventsConstants'
import {EXAM_STRUCTURE_PATHS} from '../../Constants/Constants'
import {showErrorToast} from '../../../../../redux/actions/commonAction'

const ExamTemplateEditor = () => {
  const [isUpdated, setIsUpdated] = useState(false)
  const [examStructure, setExamStructure] = useState({})
  const [selectedTerm, setSelectedTerm] = useState(0)
  const [deleteIds, setDeleteIds] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const {t} = useTranslation()
  const {eventManager} = useSelector((state) => state)
  const query = useQuery()
  const dispatch = useDispatch()
  const history = useHistory()

  const examStructureInitialValue = useExamStructureForClass()
  const isSaved = useExamStructureSaved()

  const standardName = toCamelCasedKeys(useExamStructureForClass())?.className

  const handleExamStructureChange = (value) => {
    setExamStructure(value)
  }

  const classId = query.get('classId')
  const path = [
    {
      label: 'Exam Structure',
      to: EXAM_STRUCTURE_PATHS.examPattern,
    },
    {
      label: `Class ${standardName}`,
      to: window.location.pathname,
    },
  ]

  useEffect(() => {
    dispatch(fetchExamStructuresForClassAction(classId))
    dispatch(fetchGradesCriteriaAction(classId))
  }, [classId])

  useEffect(() => {
    if (isSaved) {
      setIsLoading(false)
      history.push({
        pathname: EXAM_STRUCTURE_PATHS.examPattern,
        search: `?classId=${classId}`,
      })
    }
  }, [isSaved])

  useEffect(() => {
    if (examStructureInitialValue)
      setExamStructure(addErrorKey(examStructureInitialValue))
  }, [examStructureInitialValue])

  const handleIsUpdated = () => {
    setIsUpdated(true)
  }

  const handleFlag = () => {
    // setFlag(false)
  }

  const handleDeleteIds = (id) => {
    setDeleteIds((prevState) => [...prevState, id])
  }

  const getTerms = () => {
    return examStructure?.children?.map((item, index) => {
      const {
        name: termName,
        weightage: termWeightage,
        children: examList,
        nameError,
        weightageError,
        Id: id,
      } = toCamelCasedKeys(item)
      return (
        <TermRow
          key={id}
          termIndex={index}
          termName={termName}
          nameError={nameError}
          termWeightage={termWeightage}
          weightageError={weightageError}
          examList={examList}
          onTermClick={() => {
            setSelectedTerm(index)
          }}
          isOpen={selectedTerm === index}
          handleExamStructureChange={(value) => {
            handleExamStructureChange(value)
          }}
          // sampleExam={sampleTerm.children[0]}
          examStructure={examStructure}
          handleIsUpdated={handleIsUpdated}
          handleFlag={handleFlag}
          handleDeleteIds={handleDeleteIds}
          classId={classId}
        />
      )
    })
  }

  const handleOnSaveClick = () => {
    eventManager.send_event(events.EXAM_STRUCTURE_SAVE_CLICKED_TFI, {
      class_id: classId,
      ...examStructure,
    })
    let hasNoError = validateExamStructure(examStructure)
    if (!hasNoError || hasNoError?.error) {
      dispatch(showErrorToast(hasNoError?.errorMsg || 'Invalid Data'))
    } else {
      setShowConfirmModal(true)
    }
  }

  const handleSaveStructure = () => {
    setIsLoading(true)
    dispatch(
      postExamStructureData({
        data: removeErrorFields(examStructure),
        delete_ids: deleteIds,
      })
    )
    setIsUpdated(false)
  }

  return (
    <>
      <div className="lg:hidden mt-20">
        <EmptyScreenV1
          image={examMobileImage}
          title={t('examPlannerEmptyScreenTitle')}
          desc=""
          btnText={t('goToDashboard')}
          handleChange={() => history.push(DASHBOARD)}
          btnType="primary"
        />
      </div>
      <div className="hidden lg:block">
        <div className={styles.wrapper}>
          <div className={styles.container}>
            <div className={styles.breadcrumWrapper}>
              <Breadcrumb path={path} />
            </div>
            <div className={styles.title}>
              {`${standardName} - ${t('examStructure')}`}
            </div>
            <div className={styles.desc}>{t('structureCreatedHere')}</div>
            <div className={styles.marksAndGrades}>
              <MarksAndGrades classId={classId} />
            </div>
            {/* <DragAndDrop dataList={getTerms()} dragAndDrop={dragAndDrop} /> */}
            {getTerms()}
            {examStructure?.children?.length < 2 ? (
              <div
                className={styles.addTermBtn}
                onClick={() => {
                  eventManager.send_event(events.EXAM_STRUCTURE_ADD_TERM_TFI, {
                    class_id: classId,
                  })
                  const updatedExamStructure = produce(
                    examStructure,
                    (draft) => {
                      if (draft.children.length < 3) {
                        let lastTerm = modifyObjectAsNewEntry(
                          draft.children.at(-1)
                        )
                        lastTerm = {
                          ...lastTerm,
                          show_attendance: false,
                          show_cosch: false,
                          section_details: {},
                        }
                        setSelectedTerm(0)
                        draft.children.push(lastTerm)
                      }
                    }
                  )
                  handleExamStructureChange(updatedExamStructure)
                }}
              >{`+ ${t('addTerm')}`}</div>
            ) : null}
            {/* <AdditionalExams
              classId={classId}
              terms={() => {
                return examStructure?.children.map(({_id, name}) => ({
                  _id,
                  name,
                }))
              }}
            /> */}
          </div>
          <div className={styles.saveContainer}>
            <Button
              className={styles.save}
              size="big"
              color="primary"
              disabled={!isUpdated && false}
              onClick={handleOnSaveClick}
            >
              {t('publish')}
            </Button>
          </div>
        </div>
        {isLoading && <div className="loader" />}

        {showConfirmModal && (
          <ConfirmationPopup
            onClose={() => setShowConfirmModal(false)}
            onAction={() => {
              setShowConfirmModal(false)
              handleSaveStructure()
            }}
            title={t('saveStructureTitleText')}
            desc={t('saveStructureDescText')}
            primaryBtnText={t('no')}
            secondaryBtnText={t('yes')}
          />
        )}
      </div>
    </>
  )
}

export default ExamTemplateEditor
