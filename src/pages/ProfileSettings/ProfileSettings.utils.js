import {INSTITUTE_MEMBER_TYPE} from '../../constants/institute.constants'
import {PERSONA_STATUS, SETTING_TYPE} from './ProfileSettings.constant'

export const getActiveClassName = (persona) => {
  let selectClass = null
  if (persona == 'student') {
    selectClass = 'studentTabSelected'
  } else if (persona == 'staff') {
    selectClass = 'staffTabSelected'
  }
  return selectClass
}

// Get Profile Information && Document Categories
export const getCategoriesCollection = (
  personaCategoriesData,
  settingType,
  userType
) => {
  let categoriesList = []
  if (personaCategoriesData && personaCategoriesData.length > 0) {
    personaCategoriesData.forEach((outerElement) => {
      let categoryCollection = {}
      if (outerElement.setting_type === settingType) {
        let innerFieldsCollection = []
        categoryCollection = outerElement
        personaCategoriesData.forEach((innerElement) => {
          if (
            innerElement.category_id &&
            outerElement._id === innerElement.category_id
          ) {
            if (innerElement.key_id === 'roles') {
              if (!userType || userType !== INSTITUTE_MEMBER_TYPE.TEACHER) {
                innerElement = {...innerElement, is_value_mandatory: true}
                innerFieldsCollection.push(innerElement)
              }
            } else {
              innerFieldsCollection.push(innerElement)
            }
          }
        })
        categoryCollection = {
          ...categoryCollection,
          childrenFields: innerFieldsCollection,
        }
        categoriesList.push(categoryCollection)
      }
    })
    categoriesList.sort((a, b) => a.sequence - b.sequence)
    categoriesList.forEach((item) =>
      item.childrenFields.sort((a, b) => a.sequence - b.sequence)
    )
  }
  return categoriesList
}

// Get Persona wise Header Info
export const getProfileOrDocumentHeaderInfo = (persona, type) => {
  let headerInfo = {}
  if (persona && PERSONA_STATUS[persona]) {
    if (type === SETTING_TYPE['CATEGORY_FOR_INFO']) {
      headerInfo = {
        title: PERSONA_STATUS[persona].mainTitle,
        subTitle: PERSONA_STATUS[persona].subTitle,
      }
    } else if (type === SETTING_TYPE['CATEGORY_FOR_DOCUMENT']) {
      headerInfo = {
        title: PERSONA_STATUS[persona].mainDocTitle,
        subTitle: PERSONA_STATUS[persona].subDocTitle,
      }
    }
  }
  return headerInfo
}

// Verify URL code
export const categoryURLVerification = (searchParam) => {
  let isVerified = false
  const getURLData = new URLSearchParams(searchParam)
  const getUserTypeValue = getURLData.get('userType')
  const getCategoryValue = getURLData.get('category')
  if (getUserTypeValue && getCategoryValue) {
    if (
      getUserTypeValue !== '' &&
      getCategoryValue !== '' &&
      ['STUDENT', 'STAFF'].includes(getUserTypeValue)
    ) {
      isVerified = true
    }
  }
  return isVerified
}

export const categoryURLVerificationOld = (searchParam) => {
  let isVerified = false
  let stringData = searchParam.replace('?', '')
  let splitString = stringData.split('&')
  if (splitString && splitString.length > 0) {
    if (splitString[0] !== '' && splitString[1] !== '') {
      let stringArray1 = splitString[0]?.split('=')
      let stringArray2 = splitString[1]?.split('=')
      if (
        stringArray1.length == 2 &&
        stringArray1[0] === 'userType' &&
        ['STUDENT', 'STAFF'].includes(stringArray1[1])
      ) {
        if (
          stringArray2.length == 2 &&
          stringArray2[0] === 'category' &&
          stringArray2[1] !== ''
        ) {
          isVerified = true
        }
      }
    } else {
      isVerified = false
    }
  }
  return isVerified
}
