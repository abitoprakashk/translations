import React, {useMemo} from 'react'
import {Input} from '@teachmint/common'
import {
  getDropDownOptionArray,
  divideAddressObject,
} from './CategoryFieldsLoadingContainer.utils'
import DynamicInputFieldsHTML from './DynamicInputFieldsHTML'
import {toCamelCasedKeys} from '../../../../../utils/Helpers'
import {PERMANENT_IS_SAME, USER_TYPES} from '../../../constants'
import styles from './CategoryFieldsLoadingContainer.module.css'
import {ROLE_ID} from '../../../../../constants/permission.constants'

const CategoryFieldsLoadingContainer = ({
  isAdd,
  categoryFieldsDetails,
  fieldsHandleChange,
  userFieldsState,
  assignedToClass,
  classList,
  sectionList,
  handleValidationError,
  userList,
  openViewProfile,
  isSameAddress = true,
  setIsSameAddress,
  userDetails = null,
  roleLabelIdMap = [],
  userType = '',
  pickupPointList,
}) => {
  // Input field HTML show/hide code start
  const inputFieldHTMLShowHandler = (item) => {
    let fieldHtmlShow = true
    if (item.keyId === 'standard') {
      fieldHtmlShow = !assignedToClass && classList?.length > 0
    }
    if (item.keyId === 'section') {
      fieldHtmlShow = !assignedToClass && sectionList?.length > 0
    }
    if (item.keyId === 'roles' && userType === USER_TYPES['TEACHER']) {
      fieldHtmlShow = false
    }
    if (item.keyId === 'classroom_ids') {
      fieldHtmlShow = false
    }
    return fieldHtmlShow
  }
  // Input field HTML show/hide code end

  // Input New field value start
  const getFieldValue = (item) => {
    let newFieldValue = ''
    if (userFieldsState && userFieldsState[item?.keyId]) {
      newFieldValue = userFieldsState[item?.keyId]
      if (
        item.keyId == 'standard' &&
        classList.length > 0 &&
        userFieldsState?.standard !== ''
      ) {
        newFieldValue =
          classList.find((item) => item.label === userFieldsState.standard)
            ?.value || userFieldsState?.standard
      }
    }
    return newFieldValue
  }
  // Input New field value end

  // Get dynamic field options code start
  const getInputOptions = (item) => {
    let optionsValue = []
    if (item.keyId == 'standard' && classList.length > 0) {
      optionsValue = classList
    } else if (item.keyId == 'section') {
      optionsValue = sectionList
    } else if (item.keyId == 'roles') {
      optionsValue = roleLabelIdMap?.filter(
        (role) => role?.value !== ROLE_ID.KAM //don't show KAM role in the Dropdown of Add Admin form
      )
    } else if (item.keyId === 'transport_waypoint') {
      optionsValue = pickupPointList.map(({_id, name}) => {
        return {value: _id, label: name}
      })
    } else {
      optionsValue = getDropDownOptionArray(item?.permissibleValues)
    }
    return optionsValue
  }
  // Get dynamic field options code end

  const renderAddress = (arr) => (
    <div className={styles.categoryFieldBox}>
      {arr.length > 0 &&
        arr.map((item) => {
          const isInputFieldHTMLShow = inputFieldHTMLShowHandler(item)
          if (item?.isActive && isInputFieldHTMLShow) {
            // let fieldValue = ''
            // if (userFieldsState && userFieldsState[item?.keyId]) {
            //   fieldValue = userFieldsState[item?.keyId]
            // }
            const fieldValue = getFieldValue(item)

            let editFieldValue = ''
            if (!isAdd && userDetails && userDetails[item?.keyId]) {
              editFieldValue = userDetails[item?.keyId]
            }
            const inputOptionsValue = getInputOptions(item)
            return (
              <React.Fragment key={item.Id}>
                <DynamicInputFieldsHTML
                  item={item}
                  isAdd={isAdd}
                  fieldsHandleChange={fieldsHandleChange}
                  fieldValue={fieldValue}
                  inputOptionsValue={inputOptionsValue}
                  handleValidationError={handleValidationError}
                  userList={userList}
                  openViewProfile={openViewProfile}
                  editFieldValue={editFieldValue}
                  roleLabelIdMap={roleLabelIdMap}
                  userType={userType}
                />
              </React.Fragment>
            )
          }
        })}
    </div>
  )

  const renderAllAddresses = (obj) => (
    <>
      <div className={styles.subSection}>Current Address</div>
      {renderAddress(obj.current)}
      <Input
        type="checkbox"
        isChecked={isSameAddress}
        fieldName="permanent"
        onChange={(obj) => setIsSameAddress(obj.checked)}
        labelTxt={PERMANENT_IS_SAME}
      />
      {!isSameAddress && (
        <>
          <div className={styles.subSection}>Permanent Address</div>
          {renderAddress(obj.permanent)}
        </>
      )}
    </>
  )

  let nonAddress = (
    <div className={styles.categoryFieldBox}>
      {categoryFieldsDetails.childrenFields.length > 0 &&
        categoryFieldsDetails.childrenFields.map((child) => {
          let item = useMemo(() => toCamelCasedKeys(child), [child])
          const isInputFieldHTMLShow = inputFieldHTMLShowHandler(item)
          if (item?.isActive && isInputFieldHTMLShow) {
            // let fieldValue = ''
            // if (userFieldsState && userFieldsState[item?.keyId]) {
            //   fieldValue = userFieldsState[item?.keyId]
            // }
            const fieldValue = getFieldValue(item)

            let editFieldValue = ''
            if (!isAdd && userDetails && userDetails[item?.keyId]) {
              editFieldValue = userDetails[item?.keyId]
            }
            const inputOptionsValue = getInputOptions(item)
            return (
              <React.Fragment key={item.Id}>
                <DynamicInputFieldsHTML
                  item={item}
                  isAdd={isAdd}
                  fieldsHandleChange={fieldsHandleChange}
                  fieldValue={fieldValue}
                  inputOptionsValue={inputOptionsValue}
                  handleValidationError={handleValidationError}
                  userList={userList}
                  openViewProfile={openViewProfile}
                  editFieldValue={editFieldValue}
                  roleLabelIdMap={roleLabelIdMap}
                  userType={userType}
                />
              </React.Fragment>
            )
          }
        })}
    </div>
  )

  if (categoryFieldsDetails.key_id === 'address') {
    let obj = useMemo(
      () => divideAddressObject(categoryFieldsDetails),
      [categoryFieldsDetails]
    )
    return renderAllAddresses(obj)
  } else {
    return nonAddress
  }
}

export default CategoryFieldsLoadingContainer
