import {useState} from 'react'
import {Button, Checkbox, BUTTON_CONSTANTS, Input} from '@teachmint/krayon'
import {v4 as uuidv4} from 'uuid'
import {sortByOrderAndChecked} from '../../../../../utils'
import commonStyles from './../../ScholasticBlock/ScholasticBlock.module.css'
import SortableList from '../../SortableList/SortableList'
import {
  EDIT_TEMPLATE_SECTIONS,
  SCHOLASTIC_BLOCKS,
} from '../../../../../../../constants'

const ExamTypes = ({selectedExamTypes = [], setSelectedExamTypes}) => {
  const [changedData, setChangedData] = useState({})

  const handleCheckboxChange = ({fieldName, value}) => {
    let types = [...selectedExamTypes]
    // if (!value) {
    //   let arr = types.filter((type) => type.checked)
    //   if (arr.length === 1) return
    // }
    let index = types.findIndex((type) => type._id === fieldName)
    types[index] = {...types[index], checked: value}
    setSelectedExamTypes([...types])
    setChangedData({
      changes: value,
      changedExamId: fieldName,
    })
  }

  const handleExamTypesChange = ({fieldName, value}) => {
    let types = [...selectedExamTypes]
    let index = types.findIndex((type) => type._id === fieldName)
    types[index] = {...types[index], label: value}
    setSelectedExamTypes([...types])
    setChangedData({
      changes: value,
      changedExamId: fieldName,
    })
  }

  const handleAddNew = () => {
    let types = [...selectedExamTypes]
    let id = uuidv4()
    types.push({
      ...types[0],
      _id: id,
      label: '',
      checked: true,
      order: types.length,
    })
    setSelectedExamTypes([...types])
    setChangedData({
      changes: '',
      changedExamId: id,
    })
  }

  const handleOnChange = (list) => {
    let tmp = list.map((id, i) => {
      let obj = selectedExamTypes.find((item) => item._id === id)
      if (obj) {
        return {...obj, order: i}
      }
    })
    tmp = sortByOrderAndChecked(tmp)
    setSelectedExamTypes([...tmp])
  }

  return (
    <div>
      <SortableList
        sortableKey={
          selectedExamTypes.length +
          changedData.changes +
          changedData.changedExamId
        }
        onChange={handleOnChange}
        headerType={EDIT_TEMPLATE_SECTIONS.SCHOLASTIC}
        subHeaderType={SCHOLASTIC_BLOCKS.EXAM_TYPES}
      >
        {selectedExamTypes.map((item) => (
          <SortableList.ListItem key={item._id} id={item._id}>
            <Checkbox
              fieldName={item._id}
              isSelected={item.checked}
              handleChange={handleCheckboxChange}
            />
            <Input
              type="text"
              fieldName={item._id}
              value={item.label}
              placeholder="Examples: Theory, Practical, Viva"
              maxLength={20}
              classes={{wrapper: commonStyles.marginTopHalf}}
              autoFocus={changedData.changedExamId == item._id}
              onChange={handleExamTypesChange}
            />
          </SortableList.ListItem>
        ))}
      </SortableList>
      {selectedExamTypes.length < 3 && (
        <Button
          type={BUTTON_CONSTANTS.TYPE.TEXT}
          classes={{button: commonStyles.marginTop}}
          onClick={handleAddNew}
        >
          Add new
        </Button>
      )}
    </div>
  )
}

export default ExamTypes
