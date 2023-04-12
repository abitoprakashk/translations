import produce from 'immer'
import classNames from 'classnames'
import {toCamelCasedKeys} from '../../../../../utils/Helpers'
import {useSelector} from 'react-redux'
import styles from './DynamicInputFieldsHTML.module.css'
import {USER_TYPES} from '../../../constants'

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

export const getConditionalProps = ({
  editFieldValue,
  isAdd,
  item,
  userType,
}) => {
  const {currentAdminInfo, instituteInfo} = useSelector((state) => state)
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
    propsObject = produce(propsObject, (draft) => {
      draft.className = styles.customDatePicker
      return draft
    })
  }

  if (!isAdd && editFieldValue !== '') {
    if (!item.isValueEditableByAdmin) {
      propsObject = produce(propsObject, (draft) => {
        draft.disabled = true
        draft.className = classNames('teachmint zipy-block', styles.noBorder)
        return draft
      })
    }
    if (item.keyId === 'roles') {
      propsObject = produce(propsObject, (draft) => {
        draft.type = 'readonly'
        return draft
      })
    }
    if (
      (item.keyId === 'phone_number' || item.keyId === 'email') &&
      userType === USER_TYPES['ADMIN'] &&
      !currentAdminInfo.role_ids.includes('owner')
    ) {
      propsObject = produce(propsObject, (draft) => {
        draft.type = 'readonly'
        return draft
      })
    }

    if (
      (item.keyId === 'phone_number' || item.keyId === 'email') &&
      instituteInfo.subscription_type === 1
    ) {
      propsObject = produce(propsObject, (draft) => {
        draft.type = 'readonly'
        return draft
      })
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

export const getUserLabel = (userType) => {
  let userLabel = 'user'
  if (userType === USER_TYPES['STUDENT']) {
    userLabel = USER_TYPES['STUDENT']
  } else if (userType === USER_TYPES['TEACHER']) {
    userLabel = USER_TYPES['TEACHER']
  } else if (userType === USER_TYPES['ADMIN']) {
    userLabel = 'user'
  }
  return userLabel.charAt(0).toUpperCase() + userLabel.slice(1)
}
