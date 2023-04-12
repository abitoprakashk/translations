import {Chips, Divider, Input} from '@teachmint/krayon'
import classNames from 'classnames'
import React, {useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import Sortable from 'react-sortablejs'
import {v4} from 'uuid'
import {events} from '../../../../../../../../utils/EventsConstants'
import CommonTitle from './components/CommonTitle'
import styles from './RenderEditorCategory.module.css'

function RenderSortableEditorCategory({
  data,
  setData,
  setOrderedData,
  orderedData,
  title,
  tooltip,
  selectedOptions,
  chipListData,
  exclusive,
}) {
  const {t} = useTranslation()
  const uuid = useMemo(() => v4(), [])
  const eventManager = useSelector((state) => state.eventManager)

  const onDropdownChange = ({value}) => {
    let deleteIndex = -1
    let addItemIndex = -1
    const orderedDataMap = {}
    orderedData.forEach(({value}, index) => {
      orderedDataMap[value] = index
    })
    // DELETE
    Object.keys(orderedDataMap).map((key) => {
      if (!value.includes(key)) {
        deleteIndex = orderedDataMap[key]
      }
    })

    const newData = data.map((item, index) => {
      item.isSelected = false
      if (value.includes(item.value)) {
        item.isSelected = true
        if (!Object.keys(orderedDataMap).includes(item.value)) {
          addItemIndex = index
        }
      }
      return item
    })
    setData(newData)
    if (deleteIndex !== -1) {
      setOrderedData(orderedData.filter((_, index) => index !== deleteIndex))
    }
    if (addItemIndex !== -1) {
      setOrderedData([...orderedData, data[addItemIndex]])
    }
    eventManager.send_event(events.FEE_REPORTS_CUSTOM_SELECTION_CLICKED_TFI, {
      type: title,
      selection: value,
    })
  }

  const onSortChange = (reOrderedValues) => {
    const newData = []
    reOrderedValues.map((newIndex, oldIndex) => {
      newData[+newIndex] = structuredClone(orderedData[oldIndex])
    })
    setOrderedData(newData)
  }

  const onChipCancel = (id) => {
    let match = null
    setData(
      data.map((item) => {
        if (item.value === id) {
          item.isSelected = false
          match = item
        }
        return item
      })
    )
    setOrderedData(orderedData.filter((item) => item.value !== id))
    eventManager.send_event(events.FEE_REPORTS_CUSTOM_CHIP_CANCEL_CLICKED_TFI, {
      selection: match,
    })
  }

  return (
    <div>
      <CommonTitle
        title={title}
        tooltip={tooltip}
        rightJSX={
          <Input
            classes={{
              wrapper: styles.wrapper,
              optionsClass: styles.optionsClass,
              dropdownClass: styles.dropdownClass,
              dropdownOptions: classNames(
                'show-scrollbar show-scrollbar-small'
              ),
            }}
            frozenOptions={exclusive}
            isRequired
            onChange={onDropdownChange}
            options={data}
            placeholder={<div className={styles.select}>{t('select')}</div>}
            type="dropdown"
            isMultiSelect
            selectedOptions={selectedOptions}
            dropDownIcon={{
              up: 'chevronUp',
              down: 'chevronDown',
            }}
            showSelectedItemsInInput={false}
          />
        }
      />
      <div className={styles.chipWrapper}>
        <Sortable
          onChange={onSortChange}
          options={{
            group: uuid,
            ghostClass: styles.placeHolder,
            animation: 200,
            forceFallback: true,
            fallbackClass: 'sortable-drag',
          }}
        >
          <Chips
            isClosable
            className={styles.chip}
            onChange={onChipCancel}
            chipList={chipListData}
          />
        </Sortable>
      </div>
      <Divider classes={{wrapper: styles.divider}} />
    </div>
  )
}

export default RenderSortableEditorCategory
