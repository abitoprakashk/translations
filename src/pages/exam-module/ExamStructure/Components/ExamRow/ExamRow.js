import {useState} from 'react'
import {FlatAccordion, Icon, Input} from '@teachmint/common'
import {useTranslation} from 'react-i18next'
import styles from './ExamRow.module.css'
import produce from 'immer'
import DragAndDropSubject from '../DragAndDropSubject/DragAndDropSubject'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../../redux/actions/commonAction'
import ConfirmationPopup from '../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import {useDispatch, useSelector} from 'react-redux'
import {events} from '../../../../../utils/EventsConstants'
import {MAX_LENGTH_EXAM_NAME} from '../../Constants/Constants'

const ExamRow = ({
  examName,
  nameError,
  totalMarks,
  subjectList,
  onExamClick,
  handleExamStructureChange,
  examStructure,
  termIndex,
  examIndex,
  handleIsUpdated,
  handleFlag,
  handleDeleteIds,
  classId,
  disabled,
}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {eventManager} = useSelector((state) => state)
  const [hasTotalMarksChanged, setHasTotalMarksChanged] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const showExamWeightageError = () => {
    let showError = false
    subjectList?.forEach((subject) => {
      if (subject.checked) {
        let subjectListTotal = 0
        subject.children.forEach((child) => {
          if (child.checked) subjectListTotal += parseInt(child.weightage)
        })
        if (subjectListTotal !== parseInt(totalMarks)) showError = true
      }
    })
    return showError
  }

  const deleteExam = () => {
    eventManager.send_event(events.EXAM_STRUCTURE_DELETE_EXAM_NAME_TFI, {
      class_id: classId,
      exam_name: examName,
    })
    const updatedExamStructure = produce(examStructure, (draft) => {
      draft.children[termIndex]?.children.splice(examIndex, 1)
    })
    if (examStructure.children[termIndex]?.children[examIndex]._id)
      handleDeleteIds(
        examStructure.children[termIndex]?.children[examIndex]._id
      )
    dispatch(showSuccessToast(t('examDeletedSuccessfully')))
    handleExamStructureChange(updatedExamStructure)
    handleIsUpdated()
  }

  return (
    <div className={styles.container}>
      <FlatAccordion
        openOnlyOnArrowClick={true}
        title={
          <div className={styles.examName}>
            <div className={styles.DragHolder}>::</div>
            <Input
              title={t('examName')}
              fieldName={'examName'}
              type="text"
              isRequired={true}
              errorMsg={nameError}
              value={examName}
              maxLength={MAX_LENGTH_EXAM_NAME}
              classes={{wrapper: styles.textInputClass, title: 'tm-para'}}
              onChange={({value}) => {
                let updatedExamStructure = produce(examStructure, (draft) => {
                  draft.children[termIndex].children[examIndex].name = value
                  draft.children[termIndex].children[examIndex].nameError = null
                })
                if (!value)
                  updatedExamStructure = produce(
                    updatedExamStructure,
                    (draft) => {
                      draft.children[termIndex].children[examIndex].nameError =
                        t('examName') + ' ' + t('required')
                    }
                  )
                handleExamStructureChange(updatedExamStructure)
                handleIsUpdated()
              }}
            />
            <Input
              title={t('examTotalMarks')}
              fieldName={'examTotalMarks'}
              type="number"
              suffix="marks"
              value={totalMarks}
              showError={showExamWeightageError()}
              errorMsg={totalMarks ? t('examWeightageError') : null}
              classes={{wrapper: styles.numberInputClass, title: 'tm-para'}}
              onChange={({value}) => {
                if (value < 0) return
                setHasTotalMarksChanged(true)
                let updatedExamStructure = produce(examStructure, (draft) => {
                  draft.children[termIndex].children[examIndex].weightage =
                    value
                  draft.children[termIndex].children[examIndex].weightageError =
                    null
                })
                if (!value || isNaN(parseInt(value)) || value == 0) {
                  updatedExamStructure = produce(
                    updatedExamStructure,
                    (draft) => {
                      draft.children[termIndex].children[
                        examIndex
                      ].weightageError = t('examTotalMarksEmpty')
                    }
                  )
                }
                handleExamStructureChange(updatedExamStructure)
                handleIsUpdated()
              }}
            />
            <div
              // className={styles.deleteExamContainer}
              onClick={() => {
                if (examStructure.children[termIndex]?.children.length <= 1) {
                  dispatch(showErrorToast(t('atleastOneExam')))
                } else if (disabled) {
                  handleExamStructureChange(null)
                } else {
                  setShowConfirmModal(true)
                }
              }}
            >
              <Icon name="delete" type="outlined" size="xs" color="error" />
            </div>
          </div>
        }
        onClick={onExamClick}
        isOpen={true}
        titleClass={styles.titleClass}
        accordionClass={styles.accordionClass}
      >
        <hr className={styles.horizontalLine} />
        <div className={styles.subjectListContainer}>
          <div>Selected subjects will appear in Report Card</div>
          {/* <DragAndDrop dataList={getSubjectList()} dragAndDrop={dragAndDrop} /> */}
          <DragAndDropSubject
            dataList={subjectList}
            handleExamStructureChange={(value) => {
              handleExamStructureChange(value, true)
            }}
            examStructure={examStructure}
            termIndex={termIndex}
            examIndex={examIndex}
            handleIsUpdated={handleIsUpdated}
            handleFlag={handleFlag}
            examTotalMarks={
              examStructure.children[termIndex].children[examIndex]?.weightage
            }
            hasTotalMarksChanged={hasTotalMarksChanged}
          />
        </div>
        {/* <div
          className={styles.deleteExamContainer}
          onClick={() => {
            const updatedExamStructure = produce(examStructure, (draft) => {
              draft.children[termIndex].children.splice(examIndex, 1)
            })
            handleExamStructureChange(updatedExamStructure)
            handleIsUpdated()
          }}
        >
          <Icon name="delete" type="outlined" size="xs" color="warning" />
          <div className={styles.deleteExam}>{t('deleteExam')}</div>
        </div> */}
      </FlatAccordion>
      {showConfirmModal && (
        <ConfirmationPopup
          onClose={() => setShowConfirmModal(false)}
          onAction={() => {
            setShowConfirmModal(false)
            deleteExam()
          }}
          title={t('deleteExamTitleText')}
          primaryBtnText={t('cancel')}
          secondaryBtnStyle={'tm-btn2-red w-9/10'}
          secondaryBtnText={t('confirm')}
        />
      )}
    </div>
  )
}

export default ExamRow
