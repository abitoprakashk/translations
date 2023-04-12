import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Checkbox} from '@teachmint/krayon'
import {sortByOrderAndChecked} from '../../../../../utils'
import SortableList from '../../SortableList/SortableList'
import {getStudentDetailFieldsAction} from '../../../../../../../redux/actions'
import {EDIT_TEMPLATE_SECTIONS} from '../../../../../../../constants'

const StudentFields = ({
  selectedFields,
  setSelectedFields,
  setDisableApply,
}) => {
  const dispatch = useDispatch()
  const [fields, setFields] = useState([])

  const studentFields = useSelector(({reportCard}) => reportCard.studentFields)

  const keys = selectedFields.map((item) => item.id)

  useEffect(() => {
    if (fields.length) {
      let jj = fields.map((item) => {
        if (keys.includes(item.key_id)) {
          return {...item, checked: true}
        } else {
          return {...item, checked: false}
        }
      })
      // setFields(sortByOrderAndChecked(jj))
      setFields(jj)
    }
  }, [selectedFields])

  useEffect(() => {
    if (studentFields && studentFields.length > 0) {
      const STUDENT = 2
      let fields = studentFields.filter((item) => item.setting_type === STUDENT)
      let selected = []
      let nonSelected = []
      fields.forEach((item) => {
        let index = keys.indexOf(item.key_id)
        if (index !== -1) {
          selected.push({...item, checked: true, order: index})
        } else {
          nonSelected.push({
            ...item,
            checked: false,
            order: keys.length + nonSelected.length,
          })
        }
      })
      setFields(sortByOrderAndChecked([...selected, ...nonSelected]))
    } else {
      dispatch(getStudentDetailFieldsAction())
    }
  }, [studentFields])

  const handleCheckboxChange = (obj, item, index) => {
    const isChecked = obj.value
    let tmp = [...selectedFields]
    if (isChecked) {
      tmp.push({
        id: item.key_id,
        label: item.label,
        order: index,
        value: '',
        checked: true,
      })
    } else {
      let arrIndex = tmp.findIndex((field) => field.id === obj.fieldName)
      tmp.splice(arrIndex, 1)
    }
    if (tmp.length) {
      setDisableApply(false)
    } else {
      setDisableApply(true)
    }
    // let allFields = [...fields]
    // allFields[index] = {...allFields[index], checked: isChecked}
    // allFields = allFields.sort((a, b) => b.checked - a.checked)
    // console.log(allFields)
    // setFields(allFields)
    setSelectedFields(tmp)
  }

  const handleOnChange = (list) => {
    let tmp = list.map((id, i) => {
      let obj = fields.find((item) => item._id === id)
      if (obj) {
        return {...obj, order: i}
      }
    })
    setFields(sortByOrderAndChecked(tmp))
    let arr = selectedFields.map((item) => ({
      ...item,
      order: tmp.findIndex((field) => item.id === field.key_id),
    }))
    arr = sortByOrderAndChecked(arr)
    setSelectedFields(arr)
  }

  return (
    <SortableList
      sortableKey={fields.length + keys.length}
      onChange={handleOnChange}
      headerType={EDIT_TEMPLATE_SECTIONS.STUDENT_DETAILS}
      subHeaderType={EDIT_TEMPLATE_SECTIONS.STUDENT_DETAILS}
    >
      {fields.map((item, index) => (
        <SortableList.ListItem key={item._id} id={item._id}>
          <Checkbox
            fieldName={item.key_id}
            label={item.label}
            isSelected={keys.includes(item.key_id)}
            handleChange={(e) => handleCheckboxChange(e, item, index)}
          />
        </SortableList.ListItem>
      ))}
    </SortableList>
  )
}

export default StudentFields
