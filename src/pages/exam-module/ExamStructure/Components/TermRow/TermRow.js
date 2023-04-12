import {useEffect, useState} from 'react'
import {FlatAccordion, Icon, Input} from '@teachmint/common'
import {useTranslation} from 'react-i18next'
import produce from 'immer'
import styles from './TermRow.module.css'

import DragAndDropExam from '../DragAndDropExam/DragAndDropExam'
import {modifyObjectAsNewEntry} from '../../utils/Utils'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../../redux/actions/commonAction'
import {useDispatch, useSelector} from 'react-redux'
import {events} from '../../../../../utils/EventsConstants'
import ConfirmationPopup from '../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import {MAX_LENGTH_TERM_NAME} from '../../Constants/Constants'

const TermRow = ({
  termName,
  nameError,
  termWeightage,
  weightageError,
  examList,
  onTermClick,
  handleExamStructureChange,
  examStructure,
  termIndex,
  handleIsUpdated,
  handleFlag,
  handleDeleteIds,
  classId,
}) => {
  const {t} = useTranslation()
  const {eventManager} = useSelector((state) => state)
  const dispatch = useDispatch()
  const [showWeightError, setShowWeightError] = useState(weightageError?.length)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  useEffect(() => {
    setShowWeightError(weightageError?.length ? true : false)
  }, [weightageError])

  const deleteTerm = () => {
    const updatedExamStructure = produce(examStructure, (draft) => {
      draft.children.splice(termIndex, 1)
    })
    if (examStructure.children[termIndex]._id)
      handleDeleteIds(examStructure.children[termIndex]._id)
    handleExamStructureChange(updatedExamStructure)
    handleIsUpdated()
    dispatch(showSuccessToast(t('termDeletedSuccessfully')))
  }

  return (
    <div className={styles.container}>
      <FlatAccordion
        title={
          <div className={styles.termName}>
            {/* <div className={styles.DragHolder}>::</div> */}
            <Input
              title={t('termName')}
              fieldName={'termName'}
              type="text"
              isRequired={true}
              errorMsg={nameError}
              value={termName}
              maxLength={MAX_LENGTH_TERM_NAME}
              classes={{wrapper: styles.textInputClass, title: 'tm-para'}}
              onChange={({value}) => {
                let updatedExamStructure = produce(examStructure, (draft) => {
                  draft.children[termIndex].name = value
                  draft.children[termIndex].nameError = null
                })
                if (!value)
                  updatedExamStructure = produce(
                    updatedExamStructure,
                    (draft) => {
                      draft.children[termIndex].nameError =
                        t('termName') + ' ' + t('required')
                    }
                  )
                handleExamStructureChange(updatedExamStructure)
                handleIsUpdated()
              }}
            />
            <Input
              onBlur={() => {}}
              title={t('termWeightage')}
              fieldName={'termWeightage'}
              suffix="%"
              isRequired={true}
              errorMsg={weightageError}
              showError={showWeightError}
              type="number"
              value={`${termWeightage}`}
              classes={{wrapper: styles.numberInputClass, title: 'tm-para'}}
              onChange={({value}) => {
                if (value < 0) return
                let updatedExamStructure = produce(examStructure, (draft) => {
                  draft.children[termIndex].weightage = value
                  draft.children[termIndex].weightageError = null
                })
                if (!value || value > 100 || value < 0)
                  updatedExamStructure = produce(
                    updatedExamStructure,
                    (draft) => {
                      draft.children[termIndex].weightageError =
                        t('termWeightageError')
                    }
                  )
                handleExamStructureChange(updatedExamStructure)
                handleIsUpdated()
              }}
            />
            <div
              className={styles.deleteTermContainer}
              onClick={() => {
                eventManager.send_event(
                  events.EXAM_STRUCTURE_DELETE_TERM_NAME_TFI,
                  {
                    class_id: classId,
                    term_name: termName,
                  }
                )
                if (examStructure.children.length > 1) {
                  setShowConfirmModal(true)
                } else {
                  dispatch(showErrorToast(t('atleastOneTerm')))
                }
              }}
            >
              <Icon name="delete" type="outlined" size="xs" color="error" />
            </div>
          </div>
        }
        onClick={onTermClick}
        isOpen={true}
        titleClass={styles.titleClass}
        accordionClass={styles.accordionClass}
        openOnlyOnArrowClick={true}
      >
        <div className={styles.examListContainer}>
          {/* <DragAndDrop dataList={getExamList()} dragAndDrop={dragAndDrop} /> */}
          <DragAndDropExam
            dataList={examList}
            handleExamStructureChange={(value) => {
              handleExamStructureChange(value)
            }}
            examStructure={examStructure}
            termIndex={termIndex}
            handleIsUpdated={handleIsUpdated}
            handleFlag={handleFlag}
            handleDeleteIds={handleDeleteIds}
            classId={classId}
          />
        </div>
        <div className={styles.termFooter}>
          {examStructure?.children[termIndex].children.length < 5 ? (
            <div
              className={styles.addExam}
              onClick={() => {
                eventManager.send_event(events.EXAM_STRUCTURE_ADD_EXAM_TFI, {
                  // total_marks: totalMarks,
                  class_id: classId,
                })
                const updatedExamStructure = produce(examStructure, (draft) => {
                  const lastExam = modifyObjectAsNewEntry(
                    draft.children[termIndex].children.at(-1),
                    draft.children[termIndex].children.length
                  )
                  draft.children[termIndex].children.push(lastExam)
                })

                handleExamStructureChange(updatedExamStructure)
                handleIsUpdated()
              }}
            >
              {`+ ${t('addExam')}`}
            </div>
          ) : null}
          {/* <div
            className={styles.deleteTermContainer}
            onClick={() => {
              const updatedExamStructure = produce(examStructure, (draft) => {
                draft.children.splice(termIndex, 1)
              })
              handleExamStructureChange(updatedExamStructure)
              handleIsUpdated()
            }}
          >
            <Icon name="delete" type="outlined" size="xs" color="warning" />
            <div className={styles.deleteTerm}>{t('deleteTerm')}</div>
          </div> */}
        </div>
      </FlatAccordion>
      {showConfirmModal && (
        <ConfirmationPopup
          onClose={() => setShowConfirmModal(false)}
          onAction={() => {
            setShowConfirmModal(false)
            deleteTerm()
          }}
          title={t('deleteTermTitleText')}
          primaryBtnText={t('cancel')}
          secondaryBtnStyle={'tm-btn2-red w-9/10'}
          secondaryBtnText={t('confirm')}
        />
      )}
    </div>
  )
}

export default TermRow
