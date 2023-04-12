import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {Button, Checkbox, BUTTON_CONSTANTS, Input} from '@teachmint/krayon'
import {v4 as uuidv4} from 'uuid'
import styles from './CoScholasticArea.module.css'
import {sortByOrderAndChecked} from '../../../../../../utils'
import SortableList from '../../../SortableList/SortableList'
import {EDIT_TEMPLATE_SECTIONS} from '../../../../../../../../constants'

const CoScholasticArea = ({data = {}, setData}) => {
  const [changedData, setChangedData] = useState({})

  const {t} = useTranslation()

  const handleCheckboxChange = ({fieldName, value}) => {
    let subjects = [...data.cosch_subjects]
    let index = subjects.findIndex((sub) => sub.id === fieldName)
    subjects[index] = {...subjects[index], checked: value}
    setData({
      ...data,
      cosch_subjects: [...subjects],
    })
    setChangedData({
      changes: value,
      changedSubjectId: fieldName,
    })
  }

  const handleSubjectNameChange = ({fieldName, value}) => {
    let subjects = [...data.cosch_subjects]
    let index = subjects.findIndex((sub) => sub.id === fieldName)
    subjects[index] = {...subjects[index], label: value}
    setData({
      ...data,
      cosch_subjects: [...subjects],
    })
    setChangedData({
      changes: value,
      changedSubjectId: fieldName,
    })
  }

  const handleAddNew = () => {
    let subjects = [...data.cosch_subjects]
    let id = uuidv4()
    subjects.push({
      id: id,
      label: '',
      checked: true,
      order: subjects.length,
    })
    setData({
      ...data,
      cosch_subjects: [...subjects],
    })
    setChangedData({
      changes: '',
      changedSubjectId: id,
    })
  }

  const handleDelete = (key) => {
    let subjects = [...data.cosch_subjects]
    let index = subjects.findIndex((item) => item.id === key)
    if (subjects[index].deleted === undefined) {
      subjects.splice(index, 1)
    } else {
      subjects[index] = {...subjects[index], deleted: true}
    }
    setData({
      ...data,
      cosch_subjects: [...subjects],
    })
    setChangedData({
      changes: key,
      changedSubjectId: key,
    })
  }

  const handleOnChange = (list) => {
    let tmp = list.map((id, i) => {
      let obj = data.cosch_subjects.find((item) => item.id === id)
      if (obj) {
        return {...obj, order: i}
      }
    })
    if (data.cosch_subjects.length > list.length) {
      data.cosch_subjects.forEach((item) => {
        if (!list.includes(item.id)) {
          tmp.push({...item, order: tmp.length})
        }
      })
    }
    tmp = sortByOrderAndChecked(tmp)
    setData({...data, cosch_subjects: tmp})
  }

  return (
    <div>
      <Input
        type="text"
        title={t('activityHeaderName')}
        fieldName={'co_scholastic_section_name'}
        value={data.co_sch_details.co_scholastic_section_name}
        classes={{wrapper: styles.sectionInputWrapper}}
        maxLength={50}
        onChange={(obj) =>
          setData({
            ...data,
            co_sch_details: {
              ...data.co_sch_details,
              [obj.fieldName]: obj.value,
            },
          })
        }
      />
      <SortableList
        sortableKey={
          data.cosch_subjects?.length +
          changedData.changes +
          changedData.changedSubjectId
        }
        onChange={handleOnChange}
        headerType={EDIT_TEMPLATE_SECTIONS.CO_SCHOLASTIC}
        subHeaderType={EDIT_TEMPLATE_SECTIONS.CO_SCHOLASTIC}
      >
        {data.cosch_subjects
          ?.filter((item) => !item.deleted)
          .map((item) => (
            <SortableList.ListItem
              key={item.id + item.label}
              id={item.id}
              hasDeleteBtn
              onDelete={handleDelete}
            >
              <Checkbox
                fieldName={item.id}
                isSelected={item.checked}
                handleChange={(obj) => handleCheckboxChange(obj, item.label)}
              />
              <Input
                key={item.label}
                type="text"
                fieldName={item.id}
                value={item.label}
                autoFocus={changedData.changedSubjectId == item.id}
                onChange={handleSubjectNameChange}
                classes={{wrapper: styles.inputWrapper}}
                maxLength={50}
              />
            </SortableList.ListItem>
          ))}
      </SortableList>
      <Button
        type={BUTTON_CONSTANTS.TYPE.TEXT}
        onClick={handleAddNew}
        classes={{button: styles.sectionInputWrapper}}
      >
        Add new
      </Button>
    </div>
  )
}

export default CoScholasticArea
