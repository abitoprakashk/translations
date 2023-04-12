import produce from 'immer'
import {toCamelCasedKeys} from '../../../../../utils/Helpers'

export const getDropDownOptionArray = (optionArray = []) => {
  let initialOptionsArray = []
  if (optionArray.length > 0) {
    initialOptionsArray = optionArray.map((item) => ({
      value: item,
      label: item,
      // label: item.charAt(0).toUpperCase() + item.substr(1),
    }))
  }
  return initialOptionsArray
}

export const getConditionalProps = ({item}) => {
  let propsObject = {}
  if (item?.fieldType === 'DATE') {
    if (item.keyId == 'date_of_birth') {
      propsObject = produce(propsObject, (draft) => {
        draft.maxDate = new Date()
        return draft
      })
    } else {
      if (item?.dateRange?.length > 0) {
        propsObject = produce(propsObject, (draft) => {
          draft.minDate = new Date(item?.dateRange[0] * 1000)
          draft.maxDate = new Date(item?.dateRange[1] * 1000)
          return draft
        })
      }
    }
  }
  return propsObject
}

export const divideAddressObject = (obj) => {
  let category = {...obj}
  category.permanent = []
  category.current = []
  category.childrenFields.forEach((child) => {
    let item = toCamelCasedKeys(child)
    if (item.keyId.includes('p_')) {
      category.permanent = [...category.permanent, item]
    } else {
      category.current = [...category.current, item]
    }
  })
  return category
}
