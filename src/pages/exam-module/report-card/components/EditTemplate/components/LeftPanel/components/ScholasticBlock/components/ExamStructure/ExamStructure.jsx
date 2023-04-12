import React, {useEffect, useMemo, useRef, useState} from 'react'
import {
  Accordion,
  Badges,
  BADGES_CONSTANTS,
  Button,
  BUTTON_CONSTANTS,
  Heading,
  HEADING_CONSTANTS,
  Input,
  KebabMenu,
} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import classNames from 'classnames'
import styles from './ExamStructure.module.css'
import commonStyles from './../../ScholasticBlock.module.css'
import {
  EDIT_TEMPLATE_SECTIONS,
  SCHOLASTIC_BLOCKS,
} from '../../../../../../../../constants'
import {createExamSubjectTable} from '../../../../../../utils'
import {sortByOrderAndChecked} from '../../../../../../utils'
import ToggleButtonWrapper from '../../../ToggleButtonWrapper'
import ConfirmationPopup from '../../../../../../../../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import {events} from '../../../../../../../../../../../utils/EventsConstants'

const TermExamStructure = React.memo(({termHeading, children}) => {
  const [heading, setHeading] = useState(termHeading)
  const [intersection, setIntersection] = useState([])
  const intersectionList = useRef()
  const listRef = useRef()

  intersectionList.current = intersection

  useEffect(() => {
    const root = document.getElementById('krayonRCContainer')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            const set = new Set(intersectionList.current || [])
            set.add(entry.target.dataset.name)
            setIntersection([...set])
          } else {
            const set = new Set(intersectionList.current || [])
            set.delete(entry.target.dataset.name)
            setIntersection([...set])
          }
      },
      {
        rootMargin: `0px 0px -${root.offsetHeight - 72 - 60 - 56}px 0px`,
        root,
      }
    )

    if (listRef.current?.children && listRef.current?.children?.length) {
      Array.from(listRef.current?.children).forEach((el) =>
        observer.observe(el)
      )
    }

    return () => observer.disconnect()
  }, [termHeading, intersectionList, listRef.current?.children?.length])

  useEffect(() => {
    if (intersection.length) {
      setHeading(
        `${termHeading} - ${intersection.sort()[intersection.length - 1]}`
      )
    } else {
      setHeading(termHeading)
    }
  }, [intersection])

  return children({heading, listRef})
})

TermExamStructure.displayName = 'TermExamStructure'

const ExamStructure = ({
  examStructureTree,
  setExamStructureTree,
  renderManageButton,
  objToSave,
  setObjToSave,
  userEventHandler,
}) => {
  const {t} = useTranslation()
  const TERM_LIMIT = 5
  const EXAM_LIMIT = 10

  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  const tree = useMemo(() => {
    let tmp = {...examStructureTree}
    tmp.children?.sort((a, b) => a.order - b.order)
    tmp.children.forEach((term) => {
      term.children?.sort((a, b) => a.order - b.order)
    })
    return tmp
  }, [examStructureTree])

  const sortedSelectedExamTypes = useMemo(
    () =>
      sortByOrderAndChecked(
        examStructureTree.exam_types.filter((item) => item.checked)
      ),
    [examStructureTree]
  )

  const updateObjToSave = (type, index, obj, examIndex) => {
    let terms = [...objToSave.scholastic.exam_str.children]
    if (type === 'term') {
      terms[index] = {
        ...terms[index],
        [obj.fieldName]: obj.value,
      }
    }
    if (type === 'exam') {
      let exams = [...terms[index].children]
      exams[examIndex] = {...exams[examIndex], [obj.fieldName]: obj.value}
      terms[index] = {...terms[index], children: exams}
    }
    let tmp = {
      ...objToSave,
      scholastic: {
        ...objToSave.scholastic,
        exam_str: {...objToSave.scholastic.exam_str, children: terms},
      },
    }
    setObjToSave(tmp)
  }

  const updateTermName = (terms, index, obj) => {
    let tmpTerm = {...terms[index], [obj.fieldName]: obj.value}
    let children = [...terms]
    children[index] = {...tmpTerm}
    setExamStructureTree({...tree, children})
    updateObjToSave('term', index, obj)
  }

  const updateExamName = (exams, index, obj, examIndex) => {
    let tmpExam = {...exams[examIndex], [obj.fieldName]: obj.value}
    let children = [...exams]
    children[examIndex] = {...tmpExam}
    let tmpTerms = [...tree.children]
    tmpTerms[index] = {...tmpTerms[index], children}
    setExamStructureTree({...tree, children: tmpTerms})
    updateObjToSave('exam', index, obj, examIndex)
  }

  const handleChange = (obj, type, id, index, termIndex) => {
    let tmp = {...tree}
    let terms = tmp.children
    if (!id && type === 'term') {
      updateTermName(terms, index, obj)
    } else if (!id && type === 'exam') {
      updateExamName([...terms[termIndex].children], termIndex, obj, index)
    } else {
      for (let i = 0; i < terms.length; i++) {
        if (type === 'term') {
          if (terms[i]._id === id) {
            updateTermName(terms, i, obj)
            break
          }
        } else {
          let exams = terms[i].children
          for (let j = 0; j < exams.length; j++) {
            if (exams[j]._id === id) {
              updateExamName(exams, i, obj, j)
              break
            }
          }
        }
      }
    }
  }

  const allTrueChecked = (subjects) => {
    let commonSubjects = objToSave.scholastic.common_subjects.params
    let tmp = []
    subjects.forEach((subject) => {
      let commonSubject = commonSubjects.find(
        (item) => item.id === subject.subject_master_id
      )
      if (commonSubject) {
        tmp.push({
          ...subject,
          checked: commonSubject.checked,
          children: subject.children.map((item) => ({
            ...item,
            checked: commonSubject.checked,
          })),
        })
      }
    })
    return tmp
  }

  const getNewExam = (index, terms) => {
    let term = {...terms[index]}
    let exams = [...term.children]
    exams.push({
      name: '',
      parent: exams[0]?.parent,
      ancestors: exams[0]?.ancestors,
      weightage: exams[0]?.weightage || 0,
      node_type: 'Test',
      class_id: exams[0]?.class_id,
      order: exams.length,
      children: allTrueChecked(
        getExamsWithoutId(exams[exams.length - 1].children)
      ),
      checked: true,
    })
    terms[index] = {...term, children: exams}
    return terms
  }

  const addNewExam = (index) => {
    userEventHandler(events.REPORT_CARD_ADD_NEW_EXAM_CLICKED_TFI)
    let terms2 = [...objToSave.scholastic.exam_str.children]
    setObjToSave({
      ...objToSave,
      scholastic: {
        ...objToSave.scholastic,
        exam_str: {
          ...objToSave.scholastic.exam_str,
          children: getNewExam(index, terms2),
        },
      },
    })
  }

  const handleDeleteExam = ({examIndex, termIndex}) => {
    let terms = [...tree.children]
    let exams = [...terms[termIndex].children]
    exams.splice(examIndex, 1)
    terms[termIndex] = {...terms[termIndex], children: exams}
    setExamStructureTree({...tree, children: terms})
    let termsInObj = [...objToSave.scholastic.exam_str.children]
    let examsInObj = [...termsInObj[termIndex].children]
    let deletedId = examsInObj[examIndex]._id
    let deletedList = objToSave.scholastic.deleted_ids
      ? objToSave.scholastic.deleted_ids
      : []
    examsInObj.splice(examIndex, 1)
    termsInObj[termIndex] = {...termsInObj[termIndex], children: examsInObj}
    setObjToSave({
      ...objToSave,
      scholastic: {
        ...objToSave.scholastic,
        exam_str: {...objToSave.scholastic.exam_str, children: termsInObj},
        deleted_ids: [...deletedList, deletedId],
      },
    })
  }

  const handleExamToggleChange = (obj, termIndex) => {
    userEventHandler(events.REPORT_CARD_SHOW_IN_REPORTCARD_CLICKED_TFI, {
      header_type: EDIT_TEMPLATE_SECTIONS.SCHOLASTIC,
      sub_header_type: 'exam',
      flag: obj.value ? 'Y' : 'N',
    })
    let terms = [...tree.children]
    let exams = [...terms[termIndex].children]
    let examIndex = obj.fieldName
    exams[examIndex] = {...exams[examIndex], checked: obj.value}
    terms[termIndex] = {...terms[termIndex], children: exams}
    setExamStructureTree({...tree, children: terms})
    let termsArr = [...objToSave.scholastic.exam_str.children]
    let examsArr = [...termsArr[termIndex].children]
    examsArr[examIndex] = {...examsArr[examIndex], checked: obj.value}
    termsArr[termIndex] = {...termsArr[termIndex], children: examsArr}
    updateObjToSave(
      'exam',
      termIndex,
      {...obj, fieldName: 'checked'},
      examIndex
    )
  }

  const getExamsWithoutId = (exams) => {
    return JSON.parse(
      JSON.stringify(exams).replaceAll(
        /("(_id|deleted|c|u|parent)":.*?,)|("ancestors":\[.*?\],)/gi,
        ''
      )
    )
  }

  const addNewTermInObj = (term, addDuplicate) => {
    let terms = [...objToSave.scholastic.exam_str.children]
    let lastTerm = terms[terms.length - 1]
    terms.push({
      ...term,
      children: addDuplicate
        ? getExamsWithoutId(lastTerm.children)
        : [
            {
              name: '',
              node_type: 'Test',
              weightage: lastTerm.children[0].weightage,
              children: getExamsWithoutId(lastTerm.children[0].children),
              order: 0,
              checked: true,
            },
          ],
    })
    setObjToSave({
      ...objToSave,
      scholastic: {
        ...objToSave.scholastic,
        exam_str: {...objToSave.scholastic.exam_str, children: terms},
      },
    })
  }

  const addNewTerm = (addDuplicate) => {
    userEventHandler(
      addDuplicate
        ? events.REPORT_CARD_DUPLICATE_TERM_CLICKED_TFI
        : events.REPORT_CARD_ADD_NEW_TERM_CLICKED_TFI
    )
    let terms = [...examStructureTree.children]
    let lastTerm = terms[terms.length - 1]
    let term = {
      checked: addDuplicate ? lastTerm.checked : true,
      name: addDuplicate ? lastTerm.name : '',
      weightage: lastTerm.weightage || 0,
      node_type: 'Term',
      class_id: lastTerm.class_id,
      order: terms.length,
      children: addDuplicate
        ? lastTerm.children
        : [
            {
              name: '',
              node_type: 'Test',
              weightage: lastTerm.children[0].weightage,
              children: lastTerm.children[0].children,
            },
          ],
    }
    terms.push(term)
    setExamStructureTree({...examStructureTree, children: terms})
    addNewTermInObj(term, addDuplicate)
  }

  const handleDeleteTerm = ({index}) => {
    let terms = [...tree.children]
    let deletedTerm = terms.splice(index, 1)
    setExamStructureTree({...tree, children: terms})
    let termsInObj = [...objToSave.scholastic.exam_str.children]
    termsInObj.splice(index, 1)
    let deletedList = objToSave.scholastic.deleted_ids
      ? objToSave.scholastic.deleted_ids
      : []
    setObjToSave({
      ...objToSave,
      scholastic: {
        ...objToSave.scholastic,
        exam_str: {...objToSave.scholastic.exam_str, children: termsInObj},
        deleted_ids: [...deletedList, deletedTerm[0]?._id],
      },
    })
  }

  const handleTermToggleChange = (obj) => {
    userEventHandler(events.REPORT_CARD_SHOW_IN_REPORTCARD_CLICKED_TFI, {
      header_type: EDIT_TEMPLATE_SECTIONS.SCHOLASTIC,
      sub_header_type: 'term',
      flag: obj.value ? 'Y' : 'N',
    })
    let terms = [...tree.children]
    let index = obj.fieldName
    terms[index] = {...terms[index], checked: obj.value}
    setExamStructureTree({...tree, children: terms})
    updateObjToSave('term', index, {...obj, fieldName: 'checked'})
  }

  const renderExamTag = (text, examIndex, termIndex, examLength) => {
    return (
      <div className={styles.accordianHeaderBlock}>
        <Badges
          size={BADGES_CONSTANTS.SIZE.LARGE}
          type={BADGES_CONSTANTS.TYPE.SUCCESS}
          inverted={true}
          label={text}
          showIcon={false}
        />
        {examLength > 1 && (
          <KebabMenu
            isVertical={true}
            options={[
              {
                content: t('delete'),
                handleClick: () =>
                  setShowConfirmationModal({
                    examIndex,
                    termIndex,
                    type: 'exam',
                  }),
              },
            ]}
            classes={{
              iconFrame: styles.kebabIconWrapper,
              tooltipWrapper: styles.kebabTooltipWrapper,
              option: styles.kebabOption,
              wrapper: 'relative',
            }}
          />
        )}
      </div>
    )
  }

  const renderTermHeading = (text, index) => {
    return (
      <>
        <span className={styles.accordianEdgeCover} />
        <span className={styles.accordianEdgeCover} />
        <div className={styles.accordianHeaderBlock}>
          <span>{text}</span>
          {tree.children.length > 1 && (
            <KebabMenu
              isVertical={true}
              options={[
                {
                  content: t('delete'),
                  handleClick: () =>
                    setShowConfirmationModal({index, type: 'term'}),
                },
              ]}
              classes={{
                iconFrame: classNames(
                  styles.kebabIconWrapper,
                  styles.kebabWhite
                ),
                tooltipWrapper: styles.kebabTooltipWrapper,
                option: styles.kebabOption,
                wrapper: 'relative',
              }}
            />
          )}
        </div>
      </>
    )
  }

  const renderTableHeading = () => {
    let arr = [<th key="subject">{t('subjects')}</th>]
    arr = [
      ...arr,
      ...sortedSelectedExamTypes.map((item) => (
        <th key={item._id}>{item.label}</th>
      )),
    ]
    return arr
  }

  const renderRowValues = (subject) => {
    return sortedSelectedExamTypes.map((type) => (
      <td key={type._id}>
        {subject.marks[type._id] ? (
          <>
            {subject.marks[type._id]}{' '}
            <span className={commonStyles.gradesSubtext}>{t('marks')}</span>
          </>
        ) : (
          '--'
        )}
      </td>
    ))
  }

  const renderSubjects = (exam) => {
    let subjectList = createExamSubjectTable(exam)
    subjectList = subjectList.filter((sub) => sub.checked)
    return subjectList.map((subject) => (
      <tr key={subject.subject_master_id}>
        <td>{subject.name}</td>
        {renderRowValues(subject)}
      </tr>
    ))
  }

  const renderExams = (term, termIndex) => {
    return term.children.map((exam, i) => (
      <Accordion
        key={exam._id || i}
        classes={{
          accordionHeader: styles.accordionExamHeader,
          accordionBody: styles.accordionExamBody,
          accordionWrapper: commonStyles.marginBottom,
        }}
        isOpen={true}
        headerContent={renderExamTag(
          `Exam ${i + 1}`,
          i,
          termIndex,
          term.children.length
        )}
        data-name={`Exam ${i + 1}`}
      >
        <div className={styles.nameWrapper}>
          <Input
            type="text"
            title={t('examName')}
            value={exam.name}
            fieldName="name"
            classes={{wrapper: styles.inputWrapper}}
            isRequired={true}
            onChange={(obj) =>
              handleChange(obj, 'exam', exam._id, i, termIndex)
            }
            maxLength={20}
          />
          <div className={styles.toggleWrapper}>
            <ToggleButtonWrapper
              fieldName={i}
              methodName={termIndex}
              handleChange={handleExamToggleChange}
              isSelected={exam.checked}
            />
          </div>
        </div>
        <div className={styles.headingWrapper}>
          <Heading
            textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}
            className={commonStyles.marginBottom}
          >
            {t('subjectMarks')}
          </Heading>
          {renderManageButton(SCHOLASTIC_BLOCKS.MANAGE_EXAM, {
            termIndex: termIndex,
            examIndex: i,
          })}
        </div>
        <table className={styles.tableStyles}>
          <thead>
            <tr>{renderTableHeading()}</tr>
          </thead>
          <tbody>{renderSubjects(exam)}</tbody>
        </table>
      </Accordion>
    ))
  }

  const renderTerms = () => {
    return tree.children.map((term, i) => (
      <TermExamStructure key={term._id || i} termHeading={`Term ${i + 1}`}>
        {({heading, listRef}) => (
          <Accordion
            classes={{
              accordionHeader: styles.accordionTermHeader,
              accordionWrapper: commonStyles.marginBottom,
            }}
            isOpen={true}
            headerContent={renderTermHeading(heading, i)}
          >
            <div className={styles.nameWrapper}>
              <Input
                type="text"
                title={t('termName')}
                value={term.name}
                fieldName="name"
                classes={{wrapper: styles.inputWrapper}}
                onChange={(obj) => handleChange(obj, 'term', term._id, i)}
                isRequired={true}
                maxLength={20}
              />
              <div className={styles.toggleWrapper}>
                <ToggleButtonWrapper
                  fieldName={i}
                  handleChange={handleTermToggleChange}
                  isSelected={term.checked}
                />
              </div>
            </div>
            <div ref={listRef}>{renderExams(term, i)}</div>
            {term.children.length < EXAM_LIMIT && (
              <Button
                type={BUTTON_CONSTANTS.TYPE.OUTLINE}
                onClick={() => addNewExam(i)}
                classes={{button: styles.marginAuto}}
              >
                {t('addNewExam')}
              </Button>
            )}
          </Accordion>
        )}
      </TermExamStructure>
    ))
  }

  return (
    <div>
      {renderTerms()}
      {tree.children.length < TERM_LIMIT && (
        <div className={styles.buttonWrapper}>
          <Button
            type={BUTTON_CONSTANTS.TYPE.OUTLINE}
            onClick={() => addNewTerm(true)}
            prefixIcon="copy"
          >
            {t('duplicateLastTerm')}
          </Button>
          <Button
            type={BUTTON_CONSTANTS.TYPE.OUTLINE}
            onClick={() => addNewTerm()}
          >
            {t('addNewTerm')}
          </Button>
        </div>
      )}
      {showConfirmationModal && (
        <ConfirmationPopup
          onClose={() => setShowConfirmationModal(false)}
          onAction={() => {
            if (showConfirmationModal.type === 'exam') {
              handleDeleteExam({...showConfirmationModal})
            } else {
              handleDeleteTerm({...showConfirmationModal})
            }
            setShowConfirmationModal(false)
          }}
          title={
            showConfirmationModal.type === 'exam'
              ? t('deleteExamQues')
              : t('deleteTermQues')
          }
          desc={t('deleteExamDesc')}
          primaryBtnText={t('cancel')}
          secondaryBtnStyle={'tm-btn2-red w-9/10'}
          secondaryBtnText={t('delete')}
        />
      )}
    </div>
  )
}

export default React.memo(ExamStructure)
