import styles from './SubjectRow.module.css'
import {useTranslation} from 'react-i18next'
import {Input} from '@teachmint/common'
import produce from 'immer'
import classNames from 'classnames'

const SubjectRow = ({
  isChecked,
  subjectName,
  // nameError,
  totalMarks,
  weightageError,
  isTheoryChecked,
  theoryMarks,
  // theoryError,
  isPracticalChecked,
  practicalMarks,
  // practicalError,
  handleExamStructureChange,
  examStructure,
  termIndex,
  examIndex,
  subjectIndex,
  handleIsUpdated,
  handleFlag,
}) => {
  const {t} = useTranslation()

  const theoryIndex = examStructure?.children[termIndex].children[
    examIndex
  ]?.children[subjectIndex]?.children.findIndex((item) => item.test_type === 0)

  const practicalIndex = theoryIndex === 0 ? 1 : 0

  const onTheoryChange = (value) => {
    if (value < 0) return
    const updatedExamStructure = produce(examStructure, (draft) => {
      draft.children[termIndex].children[examIndex].children[
        subjectIndex
      ].children[theoryIndex].weightage = value
      draft.children[termIndex].children[examIndex].children[
        subjectIndex
      ].children[theoryIndex].weightageError =
        value && value > 0
          ? null
          : draft.children[termIndex].children[examIndex].children[subjectIndex]
              .name + ' marks is empty'
      const practicalMarksInt = practicalMarks ? parseInt(practicalMarks) : 0
      draft.children[termIndex].children[examIndex].children[
        subjectIndex
      ].weightage = parseInt(value) + practicalMarksInt
    })
    handleExamStructureChange(updatedExamStructure)
    handleIsUpdated()
    if (isTheoryChecked && !value) handleFlag()
  }

  return (
    <>
      <div className={styles.SubjectRow}>
        <div className={styles.DragHolder}>::</div>
        <div className={styles.Container}>
          <div className={styles.subjectName}>
            <Input
              id={`${termIndex}-${examIndex}-${subjectName}`}
              classes={{wrapper: styles.checkboxInput, title: 'tm-para'}}
              type="checkbox"
              isChecked={isChecked}
              onChange={({checked}) => {
                const updatedExamStructure = produce(examStructure, (draft) => {
                  draft.children[termIndex].children[examIndex].children[
                    subjectIndex
                  ].checked = checked
                  draft.children[termIndex].children[examIndex].children[
                    subjectIndex
                  ].children[theoryIndex].checked = checked
                  if (!checked) {
                    draft.children[termIndex].children[examIndex].children[
                      subjectIndex
                    ].children[practicalIndex].checked = false
                  } else {
                    let value =
                      examStructure.children[termIndex].children[examIndex]
                        .children[subjectIndex].children[theoryIndex].weightage
                    if (value === '') {
                      draft.children[termIndex].children[examIndex].children[
                        subjectIndex
                      ].children[theoryIndex].weightageError =
                        draft.children[termIndex].children[examIndex].children[
                          subjectIndex
                        ].name + ' marks is empty'
                    }
                    if (
                      draft.children[termIndex].children[examIndex].children[
                        subjectIndex
                      ].children[practicalIndex].checked
                    ) {
                      value =
                        examStructure.children[termIndex].children[examIndex]
                          .children[subjectIndex].children[practicalIndex]
                          .weightage
                      if (value === '') {
                        draft.children[termIndex].children[examIndex].children[
                          subjectIndex
                        ].children[practicalIndex].weightageError =
                          draft.children[termIndex].children[examIndex]
                            .children[subjectIndex].name +
                          'practical marks is empty'
                      }
                    }
                  }
                })
                handleExamStructureChange(updatedExamStructure)
                handleIsUpdated()
              }}
            />
            <label
              htmlFor={`${termIndex}-${examIndex}-${subjectName}`}
              className={styles.subject}
              title={subjectName}
            >
              {subjectName}
            </label>
          </div>

          <div className={styles.rowItem}>
            <Input
              id={`${termIndex}-${examIndex}-${subjectIndex}-${theoryIndex}`}
              classes={{wrapper: styles.checkboxInput, title: 'tm-para'}}
              type="checkbox"
              isChecked={isTheoryChecked}
              disabled={!isChecked}
              onChange={({checked}) => {
                const updatedExamStructure = produce(examStructure, (draft) => {
                  draft.children[termIndex].children[examIndex].children[
                    subjectIndex
                  ].children[theoryIndex].checked = checked
                  draft.children[termIndex].children[examIndex].children[
                    subjectIndex
                  ].children[theoryIndex].passing_percentage = checked ? 0 : NaN
                  if (!checked) {
                    draft.children[termIndex].children[examIndex].children[
                      subjectIndex
                    ].children[theoryIndex].weightageError = null
                  } else {
                    let value =
                      examStructure.children[termIndex].children[examIndex]
                        .children[subjectIndex].children[theoryIndex].weightage
                    if (value === '') {
                      draft.children[termIndex].children[examIndex].children[
                        subjectIndex
                      ].children[theoryIndex].weightageError =
                        draft.children[termIndex].children[examIndex].children[
                          subjectIndex
                        ].name + ' marks is empty'
                    }
                  }
                  draft.children[termIndex].children[examIndex].children[
                    subjectIndex
                  ].weightage = 0 + practicalMarks
                })

                handleExamStructureChange(updatedExamStructure)
                handleIsUpdated()
              }}
            />
            <label
              htmlFor={`${termIndex}-${examIndex}-${subjectIndex}-${theoryIndex}`}
            >
              {t('theory')}
            </label>
          </div>

          <div className={styles.rowItem}>
            <Input
              id={`${termIndex}-${examIndex}-${subjectIndex}-${practicalIndex}`}
              classes={{wrapper: styles.checkboxInput, title: 'tm-para'}}
              type="checkbox"
              isChecked={isPracticalChecked}
              disabled={!isChecked}
              onChange={({checked}) => {
                const updatedExamStructure = produce(examStructure, (draft) => {
                  draft.children[termIndex].children[examIndex].children[
                    subjectIndex
                  ].children[practicalIndex].checked = checked
                  draft.children[termIndex].children[examIndex].children[
                    subjectIndex
                  ].children[practicalIndex].passing_percentage = checked
                    ? 0
                    : NaN
                  if (!checked) {
                    draft.children[termIndex].children[examIndex].children[
                      subjectIndex
                    ].children[practicalIndex].weightageError = null
                  } else {
                    let value =
                      examStructure.children[termIndex].children[examIndex]
                        .children[subjectIndex].children[practicalIndex]
                        .weightage
                    if (value === '') {
                      draft.children[termIndex].children[examIndex].children[
                        subjectIndex
                      ].children[practicalIndex].weightageError =
                        draft.children[termIndex].children[examIndex].children[
                          subjectIndex
                        ].name + ' practical marks is empty'
                    }
                  }
                  draft.children[termIndex].children[examIndex].children[
                    subjectIndex
                  ].weightage = 0 + theoryMarks
                })
                handleExamStructureChange(updatedExamStructure)
                handleIsUpdated()
              }}
            />
            <label
              htmlFor={`${termIndex}-${examIndex}-${subjectIndex}-${practicalIndex}`}
            >
              {t('practical')}
            </label>
          </div>
          <div className={styles.rowItem}>{t('totalMarks')}</div>

          <Input
            classes={{wrapper: styles.numberInput, title: 'tm-para'}}
            className={classNames({
              [styles.disabled]: !isTheoryChecked,
            })}
            type="number"
            value={theoryMarks}
            disabled={!isTheoryChecked}
            suffix="marks"
            onChange={({value}) => onTheoryChange(value)}
          />
          <Input
            classes={{
              wrapper: styles.numberInput,
              title: 'tm-para',
            }}
            className={classNames({
              [styles.disabled]: !isPracticalChecked,
            })}
            type="number"
            value={practicalMarks}
            disabled={!isPracticalChecked}
            suffix="marks"
            onChange={({value}) => {
              if (value < 0) return
              const updatedExamStructure = produce(examStructure, (draft) => {
                draft.children[termIndex].children[examIndex].children[
                  subjectIndex
                ].children[practicalIndex].weightage = value
                draft.children[termIndex].children[examIndex].children[
                  subjectIndex
                ].children[practicalIndex].weightageError =
                  value && value > 0
                    ? null
                    : draft.children[termIndex].children[examIndex].children[
                        subjectIndex
                      ].name + ' practical marks is empty'
                const theoryMarksInt = theoryMarks ? parseInt(theoryMarks) : 0
                draft.children[termIndex].children[examIndex].children[
                  subjectIndex
                ].weightage = parseInt(value) + theoryMarksInt
              })
              handleExamStructureChange(updatedExamStructure)
              handleIsUpdated()
              if (isPracticalChecked && !value) handleFlag()
            }}
          />
          <Input
            classes={{wrapper: styles.numberInput, title: 'tm-para'}}
            className={styles.totalMarks}
            disabled={true}
            suffix="marks"
            errorMsg={weightageError}
            type="number"
            value={totalMarks}
            // onChange={({value}) => {
            //   const updatedExamStructure = produce(examStructure, (draft) => {
            //     draft.children[termIndex].children[examIndex].children[
            //       subjectIndex
            //     ].weightage = value
            //   })
            //   handleExamStructureChange(updatedExamStructure)
            //   handleIsUpdated()
            // }}
          />
        </div>
      </div>
    </>
  )
}

export default SubjectRow
