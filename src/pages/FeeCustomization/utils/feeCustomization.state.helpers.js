import produce from 'immer'
import {
  PIVOT_TABLE_EDITOR_DATA_FIELDS,
  PIVOT_TABLE_EDITOR_FILTER_FIELDS,
} from '../constants/feeCustomization.editor.constants'

export const convertValueObjToArr = (data) => {
  return produce(data, (draft) => {
    draft.values = draft.values?.map((obj) => {
      return obj?.key
    })
    return draft
  })
}

export const convertValueArrToObj = (data) => {
  return produce(data, (draft) => {
    draft.values = draft.values.map((value) => ({
      key: value,
      func: 'sum',
    }))
  })
}

export const setSelectedOptions = ({options, arr, key}) => {
  return arr.map((item) => {
    if (options.includes(item[key])) {
      item.isSelected = true
    } else {
      item.isSelected = false
    }
    return item
  })
}

export const ignoreExtraFields = (_data) => {
  if (!_data) return _data
  const data = structuredClone(_data)
  return Object.values(PIVOT_TABLE_EDITOR_DATA_FIELDS).reduce((acc, key) => {
    if (key === PIVOT_TABLE_EDITOR_DATA_FIELDS.FILTERS) {
      acc[key] = Object.values(PIVOT_TABLE_EDITOR_FILTER_FIELDS).reduce(
        (acc, _key) => {
          acc[_key] = data[key]?.[_key]
          return acc
        },
        {}
      )
    } else {
      acc[key] = data[key]
      if (key === PIVOT_TABLE_EDITOR_DATA_FIELDS.DATERANGE && acc[key]?.type) {
        delete acc[key].from
        delete acc[key].to
      }
    }
    return acc
  }, {})
}

export const searchAndRemove = (arr1, arr2, searchVal) => {
  const matchingIndices = []
  for (let i = 0; i < arr1.length; i++) {
    const subArr = arr1[i]
    for (let j = 0; j < subArr.length; j++) {
      if (
        typeof subArr[j] === 'string' &&
        subArr[j].toUpperCase().includes(searchVal?.toUpperCase())
      ) {
        matchingIndices.push(i)
        break
      } else if (
        typeof subArr[j] === 'number' &&
        subArr[j] === Number(searchVal?.toUpperCase())
      ) {
        matchingIndices.push(i)
        break
      } else if (typeof subArr[j] === 'object') {
        if (
          subArr[j].props?.title
            ?.toUpperCase()
            .includes(searchVal?.toUpperCase()) ||
          subArr[j].props?.desc
            ?.toUpperCase()
            .includes(searchVal?.toUpperCase())
        ) {
          matchingIndices.push(i)
          break
        }
      }
    }
  }
  for (let i = arr2.length - 1; i >= 0; i--) {
    if (!matchingIndices.includes(i)) {
      arr2.splice(i, 1)
      arr1.splice(i, 1)
    }
  }
  return [arr1, arr2]
}
