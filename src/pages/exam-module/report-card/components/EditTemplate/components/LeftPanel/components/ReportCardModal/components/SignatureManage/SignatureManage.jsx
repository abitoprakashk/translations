import {Button, Checkbox, BUTTON_CONSTANTS, Input} from '@teachmint/krayon'
import {v4 as uuidv4} from 'uuid'
import {sortByOrderAndChecked} from '../../../../../../utils'
import styles from './SignatureManage.module.css'
import commonStyles from './../../../ScholasticBlock/ScholasticBlock.module.css'
import SortableList from '../../../SortableList/SortableList'
import {EDIT_TEMPLATE_SECTIONS} from '../../../../../../../../constants'

const SignatureManage = ({data = {}, setData}) => {
  const handleCheckboxChange = ({fieldName, value}) => {
    let signs = {...data.params_signatures}
    signs[fieldName] = {...signs[fieldName], checked: value}
    signs = {...signs, [fieldName]: {...signs[fieldName]}}
    setData({
      ...data,
      params_signatures: {...signs},
      changes: value,
      changedSignature: fieldName,
    })
  }

  const handleSignNameChange = ({fieldName, value}) => {
    let signs = {...data.params_signatures}
    signs[fieldName] = {...signs[fieldName], label: value}
    signs = {...signs, [fieldName]: {...signs[fieldName]}}
    setData({
      ...data,
      params_signatures: {...signs},
      changes: value,
      changedSignature: fieldName,
    })
  }

  const handleAddNew = () => {
    let signs = {...data.params_signatures}
    let length = Object.keys(signs).length
    let id = uuidv4()
    let tmp = {id, checked: true, label: '', order: length}
    signs = {
      ...signs,
      [id]: tmp,
    }
    let arr = [...data.signature_arr]
    arr.push(tmp)
    setData({
      ...data,
      params_signatures: {...signs},
      signature_arr: arr,
      changes: '',
      changedSignature: id,
    })
  }

  const handleDelete = (key) => {
    let signs = {...data.params_signatures}
    delete signs[key]
    let arr = [...data.signature_arr]
    let index = arr.findIndex((item) => item.id === key)
    arr.splice(index, 1)
    setData({
      ...data,
      params_signatures: {...signs},
      signature_arr: arr,
      changes: key,
      changedSignature: key,
    })
  }

  const handleOnChange = (list) => {
    let tmp = list.map((id, i) => ({...data.params_signatures[id], order: i}))
    tmp = sortByOrderAndChecked(tmp)
    setData({...data, signature_arr: tmp})
  }

  return (
    <div>
      <SortableList
        sortableKey={
          data.signature_arr.length + data.changes + data.changedSignature
        }
        onChange={handleOnChange}
        headerType={EDIT_TEMPLATE_SECTIONS.ADDITIONAL_INFO}
        subHeaderType={EDIT_TEMPLATE_SECTIONS.ADDITIONAL_INFO}
      >
        {data.signature_arr.map(({id: key}) => (
          <SortableList.ListItem
            key={key}
            id={key}
            hasDeleteBtn
            onDelete={handleDelete}
          >
            <Checkbox
              fieldName={key}
              isSelected={data.params_signatures[key].checked}
              handleChange={handleCheckboxChange}
            />
            <Input
              type="text"
              fieldName={key}
              value={data.params_signatures[key].label}
              autoFocus={data.changedSignature == key}
              onChange={handleSignNameChange}
              maxLength={50}
              classes={{wrapper: styles.inputWrapper}}
            />
          </SortableList.ListItem>
        ))}
      </SortableList>
      {Object.keys(data.params_signatures).length < 5 && (
        <Button
          type={BUTTON_CONSTANTS.TYPE.TEXT}
          onClick={handleAddNew}
          classes={{button: commonStyles.marginTop}}
        >
          Add new
        </Button>
      )}
    </div>
  )
}

export default SignatureManage
