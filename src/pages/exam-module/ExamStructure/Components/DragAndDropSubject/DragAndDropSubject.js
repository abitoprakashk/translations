import React, {useRef, useState, useEffect} from 'react'
import SubjectRow from '../SubjectRow/SubjectRow'
import {toCamelCasedKeys} from '../../../../../utils/Helpers'
import produce from 'immer'

const DragAndDropSubject = ({
  dataList,
  handleExamStructureChange,
  examStructure,
  termIndex,
  examIndex,
  handleIsUpdated,
  handleFlag,
  examTotalMarks,
  hasTotalMarksChanged,
}) => {
  const dragItem = useRef()
  const dragOverItem = useRef()
  const [list, setList] = useState(dataList)

  useEffect(() => {
    setList(dataList)
  }, [dataList])

  useEffect(() => {
    if (!hasTotalMarksChanged) return
    const updatedExamTotalMarks = produce(examStructure, (draft) => {
      draft.children[termIndex].children[examIndex].children.forEach((item) => {
        let pos = item.children.findIndex((sub) => sub.test_type === 0)
        item.children[pos].weightage = examTotalMarks
      })
    })
    handleExamStructureChange(updatedExamTotalMarks)
  }, [examTotalMarks])

  const dragStart = (position) => {
    dragItem.current = position
  }

  const dragEnter = (position) => {
    dragOverItem.current = position
  }

  const dragAndDrop = (currentDragItem, currentDragOverItem) => {
    const updatedExamStructure = produce(examStructure, (draft) => {
      const dragItemContent =
        examStructure.children[termIndex].children[examIndex].children[
          currentDragItem
        ]

      draft.children[termIndex].children[examIndex].children.splice(
        currentDragItem,
        1
      )
      draft.children[termIndex].children[examIndex].children.splice(
        currentDragOverItem,
        0,
        dragItemContent
      )
      const subs =
        examStructure.children[termIndex].children[examIndex].children
      for (let i = 0; i < subs.length; i++) {
        let tmp = {...draft.children[termIndex].children[examIndex].children[i]}
        tmp.order = i
        draft.children[termIndex].children[examIndex].children[i] = tmp
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
      {list?.map((item, index) => {
        const {
          name: subjectName,
          children: testList,
          checked: isChecked,
          nameError,
          weightageError,
        } = toCamelCasedKeys(item)
        let totalMarks = 0
        testList.forEach((child) => {
          if (child.checked) totalMarks += parseInt(child.weightage)
        })
        const theoryIndex = testList.findIndex((item) => item.test_type === 0)

        const practicalIndex = theoryIndex === 0 ? 1 : 0

        return (
          <div
            onDragStart={() => dragStart(index)}
            onDragEnter={() => dragEnter(index)}
            onDragOver={(e) => e.preventDefault()}
            onDragEnd={(e) => {
              drop(e)
            }}
            key={index}
            draggable
          >
            <SubjectRow
              key={index}
              isChecked={
                isChecked &&
                (testList[theoryIndex].checked ||
                  testList[practicalIndex].checked)
              }
              subjectName={subjectName}
              nameError={nameError}
              totalMarks={parseInt(totalMarks)}
              weightageError={weightageError}
              isTheoryChecked={testList[theoryIndex].checked}
              theoryMarks={
                testList[theoryIndex].checked
                  ? parseInt(testList[theoryIndex].weightage)
                  : NaN
              }
              theoryError={testList[theoryIndex].weightageError}
              isPracticalChecked={testList[practicalIndex].checked}
              practicalMarks={
                testList[practicalIndex].checked
                  ? parseInt(testList[practicalIndex].weightage)
                  : NaN
              }
              practicalError={testList[practicalIndex].weightageError}
              handleExamStructureChange={(value) => {
                handleExamStructureChange(value)
              }}
              examStructure={examStructure}
              termIndex={termIndex}
              examIndex={examIndex}
              subjectIndex={index}
              handleIsUpdated={handleIsUpdated}
              handleFlag={handleFlag}
            />
          </div>
        )
      })}
    </>
  )
}
export default DragAndDropSubject
