import React, {useRef} from 'react'

const DragAndDrop = ({dataList, dragAndDrop}) => {
  const dragItem = useRef()
  const dragOverItem = useRef()

  const dragStart = (position) => {
    dragItem.current = position
  }

  const dragEnter = (position) => {
    dragOverItem.current = position
  }

  const drop = (e) => {
    e.preventDefault()
    dragAndDrop(dragItem.current, dragOverItem.current)
    dragItem.current = null
    dragOverItem.current = null
  }

  return (
    <>
      {dataList &&
        dataList.map((item, index) => (
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
            {item}
          </div>
        ))}
    </>
  )
}
export default DragAndDrop
