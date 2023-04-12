import React, {useMemo} from 'react'
import {toCamelCasedKeys} from '../../../../../utils/Helpers'
import DynamicInputFieldsPreviewHTML from './DynamicInputFieldsPreviewHTML'
import {getDropDownOptionArray} from './CategoryFieldsPreivewContainer.utils'
import styles from './CategoryFieldsPreivewContainer.module.css'

const CategoryFieldsPreivewContainer = ({categoryFieldsDetails}) => {
  // Get dynamic field options code start
  const getInputOptions = (item) => {
    let optionsValue = []
    if (item && item?.permissibleValues?.length > 0) {
      optionsValue = getDropDownOptionArray(item.permissibleValues)
    }
    return optionsValue
  }
  // Get dynamic field options code end
  return (
    <div className={styles.categoryFieldBox}>
      {categoryFieldsDetails.childrenFields.length > 0 &&
        categoryFieldsDetails.childrenFields.map((child) => {
          let item = useMemo(() => toCamelCasedKeys(child), [child])
          if (item?.isActive) {
            const inputOptionsValue = getInputOptions(item)
            return (
              <React.Fragment key={item.Id}>
                <DynamicInputFieldsPreviewHTML
                  item={item}
                  inputOptionsValue={inputOptionsValue}
                />
              </React.Fragment>
            )
          }
        })}
    </div>
  )
}

export default CategoryFieldsPreivewContainer
