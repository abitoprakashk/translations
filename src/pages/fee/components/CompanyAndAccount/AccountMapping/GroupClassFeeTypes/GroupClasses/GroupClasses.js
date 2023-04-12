import React, {useEffect, useMemo, useState} from 'react'
import styles from './GroupClasses.module.css'
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  PlainCard,
} from '@teachmint/krayon'
import {TRANSLATIONS_CA} from '../../../companyAccConstants'

export default function GroupClasses({
  onGroupClick = () => {},
  onUngroupClick = () => {},
  options = [],
  allReadyGroupedValue = [],
}) {
  const [selectedItems, setSelectedItems] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  const getNonGroupItems = () => {
    return options?.filter(
      (item) => !allReadyGroupedValue.flat().includes(item?.value)
    )
  }
  const getNonGroupItemsIds = () => {
    return getNonGroupItems().map((item) => item.value)
  }
  const handleSelectAll = ({value}) => {
    if (value) {
      let selectAll = getNonGroupItemsIds()
      setSelectedItems(selectAll)
    } else {
      setSelectedItems([])
    }
    setSelectAll(value)
  }

  useEffect(() => {
    let a = getNonGroupItemsIds()
    setSelectAll(a.length === selectedItems.length)
  }, [selectedItems])

  const getOptionsLength = useMemo(
    () =>
      options.filter(
        (item) => !allReadyGroupedValue.flat().includes(item?.value)
      ).length !== 0,
    [allReadyGroupedValue, options]
  )

  return (
    <div className={styles.section}>
      {getOptionsLength && (
        <>
          <div className={styles.classSelectionSection}>
            <div>
              <Checkbox
                fieldName="selectAllClasses"
                handleChange={(obj) => handleSelectAll(obj)}
                label="Select all"
                isSelected={selectAll}
              />
            </div>
            <div>
              <CheckboxGroup
                name="sections"
                onChange={(obj) => {
                  setSelectedItems([...obj])
                }}
                wrapperClass={styles.checkboxGroupWrapperClass}
                options={options.filter(
                  (item) => !allReadyGroupedValue.flat().includes(item?.value)
                )}
                selectedOptions={selectedItems}
              />
            </div>
            <div className={styles.groupBtnSection}>
              <Button
                classes={{}}
                onClick={() => {
                  setSelectedItems([])
                  onGroupClick(selectedItems)
                }}
                type="outline"
              >
                {TRANSLATIONS_CA.group}
              </Button>
            </div>
          </div>
          <Divider spacing="0px" thickness="1px" />
        </>
      )}
      <div className={styles.groupedCardSection}>
        {allReadyGroupedValue.map((groupIds, idx) => {
          let groupedItems = options.filter((option) =>
            groupIds.includes(option.value)
          )
          let groupedIds = groupedItems.map((item) => item?.value)

          return (
            <PlainCard key={`card${idx}`} className={styles.groupCard}>
              <div>{groupedItems.map((item) => item?.label).join(', ')}</div>
              <div>
                <Button
                  classes={{}}
                  onClick={() => {
                    setSelectAll(false)
                    onUngroupClick(groupedIds)
                  }}
                  type="text"
                >
                  {TRANSLATIONS_CA.ungroup}
                </Button>
              </div>
            </PlainCard>
          )
        })}
      </div>
    </div>
  )
}
