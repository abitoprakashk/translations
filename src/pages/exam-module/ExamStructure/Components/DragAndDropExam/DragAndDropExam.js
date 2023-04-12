import React, {useRef, useState, useEffect} from 'react'
import produce from 'immer'

import {toCamelCasedKeys} from '../../../../../utils/Helpers'
import ExamRow from '../ExamRow/ExamRow'

const DragAndDropExam = ({
  dataList,
  handleExamStructureChange,
  examStructure,
  termIndex,
  handleIsUpdated,
  handleFlag,
  handleDeleteIds,
  classId,
}) => {
  const dragItem = useRef()
  const dragOverItem = useRef()
  const [list, setList] = useState(dataList)
  const [selectedExam, setSelectedExam] = useState(0)
  // const [showConfirmModal, setShowConfirmModal] = useState(false)
  // const [showActionDeniedModal, setShowActionDeniedModal] = useState(false)
  // const [updateData, setUpdateData] = useState(null)

  useEffect(() => {
    setList(dataList)
  }, [dataList])

  const dragStart = (position) => {
    dragItem.current = position
  }

  const dragEnter = (position) => {
    dragOverItem.current = position
  }

  // const checkAndUpdateStructure = (
  //   updatedExamStructure,
  //   disabled,
  //   isSubjectLevelChange
  // ) => {
  //   if (disabled && !isSubjectLevelChange) {
  //     setShowActionDeniedModal(true)
  //   } else if (disabled && isSubjectLevelChange) {
  //     setShowConfirmModal(true)
  //     setUpdateData(updatedExamStructure)
  //   } else {
  //     handleExamStructureChange(updatedExamStructure)
  //   }
  // }

  const dragAndDrop = (currentDragItem, currentDragOverItem) => {
    const updatedExamStructure = produce(examStructure, (draft) => {
      const dragItemContent =
        examStructure.children[termIndex].children[currentDragItem]

      draft.children[termIndex].children.splice(currentDragItem, 1)
      draft.children[termIndex].children.splice(
        currentDragOverItem,
        0,
        dragItemContent
      )
      const subs = examStructure.children[termIndex].children
      for (let i = 0; i < subs.length; i++) {
        let tmp = {...draft.children[termIndex].children[i]}
        tmp.order = i
        draft.children[termIndex].children[i] = tmp
      }
    })

    handleExamStructureChange(updatedExamStructure)
  }

  const drop = (e) => {
    dragAndDrop(dragItem.current, dragOverItem.current)
    dragItem.current = null
    dragOverItem.current = null
    e.stopPropagation()
  }

  return (
    <>
      {list &&
        list?.map((item, index) => {
          const {
            name: examName,
            weightage: totalMarks,
            children: subjectList,
            nameError,
            weightageError,
            examPlannerId,
          } = toCamelCasedKeys(item)

          return (
            <div
              onDragStart={() => dragStart(index)}
              onDragEnter={() => dragEnter(index)}
              onDragOver={(e) => e.preventDefault()}
              onDragEnd={(e) => {
                drop(e)
              }}
              key={index}
              draggable={examPlannerId ? false : true}
            >
              <ExamRow
                key={index}
                examName={examName}
                nameError={nameError}
                totalMarks={totalMarks}
                weightageError={weightageError}
                subjectList={subjectList}
                onExamClick={() => {
                  setSelectedExam(index)
                }}
                isOpen={selectedExam === index}
                handleExamStructureChange={handleExamStructureChange}
                examStructure={examStructure}
                termIndex={termIndex}
                examIndex={index}
                handleIsUpdated={handleIsUpdated}
                handleFlag={handleFlag}
                handleDeleteIds={handleDeleteIds}
                classId={classId}
                disabled={examPlannerId ? true : false}
              />
            </div>
          )
        })}
    </>
  )
}
export default DragAndDropExam
