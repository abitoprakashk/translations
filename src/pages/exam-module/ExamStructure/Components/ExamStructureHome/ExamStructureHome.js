import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import useQuery from '../../../../../hooks/UseQuery'
import {fetchClassesExamStructuresAction} from '../../Redux/ExamStructureActions'
import {useClassesExamStructureList} from '../../Redux/ExamStructureSelectors'
import ExamPatternAccordion from '../ExamPatternAccordion/ExamPatternAccordion'
import styles from './ExamStructureHome.module.css'
import {getNodesListOfSimilarTypeWithChildren} from '../../../../../utils/HierarchyHelpers'

const ExamStructureHome = () => {
  const dispatch = useDispatch()
  const query = useQuery()
  const [selectedClass, setSelectedClass] = useState(0)
  const [listOfClasses, setListOfClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState(query.get('classId'))
  const {instituteHierarchy} = useSelector((state) => state)

  useEffect(() => {
    setListOfClasses([
      ...getNodesListOfSimilarTypeWithChildren(instituteHierarchy, 'STANDARD'),
    ])
  }, [instituteHierarchy])

  useEffect(() => {
    dispatch(fetchClassesExamStructuresAction())
    const classId = query.get('classId')
    if (classId) {
      setSelectedClassId(classId)
      setSelectedClass(-1)
    }
  }, [])
  const examStructureObj = useClassesExamStructureList()

  const onAction = (index) => {
    setSelectedClass(index)
  }

  return (
    <div className={styles.container}>
      {examStructureObj ? (
        <div className={styles.accordionContainer}>
          {listOfClasses?.map((item, index) => (
            <div key={index}>
              <ExamPatternAccordion
                item={examStructureObj[item.id]}
                isOpen={selectedClass === index || selectedClassId === item.id}
                onAction={onAction}
                handleActions={() => {
                  onAction(index)
                }}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default ExamStructureHome
