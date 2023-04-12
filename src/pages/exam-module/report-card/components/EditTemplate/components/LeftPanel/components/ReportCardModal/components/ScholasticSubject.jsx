import {useState} from 'react'
import {Checkbox} from '@teachmint/krayon'
import {sortByOrderAndChecked} from '../../../../../utils'
import SortableList from '../../SortableList/SortableList'
import {
  EDIT_TEMPLATE_SECTIONS,
  SCHOLASTIC_BLOCKS,
} from '../../../../../../../constants'

const ScholasticSubject = ({
  subjectIds = [],
  setSubjectIds,
  setDisableApply,
}) => {
  const [change, setChanges] = useState(null)

  const handleCheckboxChange = (obj) => {
    let tmp = [...subjectIds]
    if (!obj.value) {
      let arr = tmp.filter((item) => item.checked)
      if (arr.length === 1) setDisableApply(true)
    } else {
      setDisableApply(false)
    }
    let index = tmp.findIndex((sub) => sub.id === obj.fieldName)
    tmp[index] = {...tmp[index], checked: obj.value}
    setChanges(obj.fieldName)
    setSubjectIds([...tmp])
  }

  const handleOnChange = (list) => {
    let tmp = list.map((id, i) => {
      let obj = subjectIds.find((item) => item.id === id)
      if (obj) {
        return {...obj, order: i}
      }
    })
    setSubjectIds([...sortByOrderAndChecked(tmp)])
  }

  return (
    <div>
      <SortableList
        sortableKey={subjectIds.length + change}
        onChange={handleOnChange}
        headerType={EDIT_TEMPLATE_SECTIONS.SCHOLASTIC}
        subHeaderType={SCHOLASTIC_BLOCKS.SUBJECTS}
      >
        {subjectIds.map((item) => (
          <SortableList.ListItem key={item.id} id={item.id}>
            <Checkbox
              fieldName={item.id}
              label={item.label}
              isSelected={item.checked}
              handleChange={(e) => handleCheckboxChange(e, item)}
            />
          </SortableList.ListItem>
        ))}
      </SortableList>
    </div>
  )
}

export default ScholasticSubject
