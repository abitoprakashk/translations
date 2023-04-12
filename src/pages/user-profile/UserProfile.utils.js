import {FIELD_TYPES} from '../ProfileSettings/ProfileSettings.constant'
import {USER_TYPES, USER_TYPE_SETTINGS} from './constants'

export const getPersonaValue = (type) => {
  const userValue = type?.toLowerCase()
  let personaValue = USER_TYPE_SETTINGS.STUDENT.id
  if (userValue && userValue !== '') {
    if (userValue === USER_TYPES.STUDENT) {
      personaValue = USER_TYPE_SETTINGS.STUDENT.id
    } else {
      personaValue = USER_TYPE_SETTINGS.STAFF.id
    }
  }
  return personaValue
}

export const getInitialDynamicFieldsState = (personaCategoryListData) => {
  let dynamicFieldsState = {}
  if (personaCategoryListData.length > 0) {
    personaCategoryListData.forEach((categoryElement) => {
      if (
        categoryElement.is_active &&
        !categoryElement.deleted &&
        categoryElement.childrenFields.length > 0
      ) {
        categoryElement.childrenFields.forEach((fieldElement) => {
          if (fieldElement.is_active && !fieldElement.deleted) {
            dynamicFieldsState[fieldElement.key_id] = ''
          }
        })
      }
    })
  }
  return dynamicFieldsState
}

export const checkDuplicates = (data, key, value) => {
  return data.filter(
    (item) => item[key] === value || item[key]?.split('@')[0] === value
  )
}

export const modifyDataForPost = (data, settingObj, isSameAddress, imgUrl) => {
  settingObj.forEach((item) => {
    if (
      item.field_type === FIELD_TYPES.PHONE_NUMBER.key &&
      data[item.key_id] !== '' &&
      data[item.key_id + '_countryCode']
    ) {
      data[item.key_id] = `${
        data[item.key_id + '_countryCode'] &&
        data[item.key_id + '_countryCode'] !== ''
          ? data[item.key_id + '_countryCode']
          : '91'
      }-${
        data[item.key_id].split('-').length === 1
          ? data[item.key_id]
          : data[item.key_id].split('-')[1]
      }`
    }
    if (item.field_type === FIELD_TYPES.DATE.key) {
      try {
        data[item.key_id] = data[item.key_id].getTime() / 1000
      } catch (e) {
        console.error(e)
      }
    }
  })
  data.img_url = imgUrl || ''
  if (isSameAddress) {
    for (let key in data) {
      if (key.match(/^c_/)) {
        let pKey = `p_${key.substring(2)}`
        data[pKey] = data[key]
      }
    }
  }
  for (let key in data) {
    if (key.includes('countryCode')) delete data[key]
  }
  return data
}
