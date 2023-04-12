import React, {useState, useEffect, useRef} from 'react'
import {MultiSelect, FlatAccordion, Button} from '@teachmint/common'
import styles from './items.module.css'
import {useDispatch, useSelector} from 'react-redux'
import {
  getAllItemsListRequestAction,
  setPage,
  setApiFilterData,
  setCurrentPageReference,
  setSelectedFilters,
} from '../../redux/actions/actions'
import {useOutsideClickHandler} from '@teachmint/common'
import {
  CONST_ITEM_CONDITION_LIST,
  PAGE_LIMIT,
} from '../../../../../../constants/inventory.constants'
import {events} from '../../../../../../utils/EventsConstants'
import {useTranslation} from 'react-i18next'

export const checkBoxGroup = (groupName, options, selected, onChange) => {
  return (
    <>
      <FlatAccordion title={groupName}>
        <MultiSelect
          options={options}
          selectedOptions={selected}
          frozenOptions={[]}
          onChange={onChange}
          className={styles.checkboxOption}
          showSelectAll={false}
        />
      </FlatAccordion>
    </>
  )
}

export const FiltersUI = ({setShowFilters, setLastPage}) => {
  const CONST_ALLOCATION_FILTER = [
    {label: 'None', value: 'UNALLOCATED'},
    {label: 'Individuals', value: 'INDIVIDUAL'},
    {label: 'Room', value: 'STORE'},
  ]

  const inventoryState = useSelector((state) => state.inventoryOverview)
  const {eventManager} = useSelector((state) => state)
  const {t} = useTranslation()

  const [itemTypesFilter, setItemTypesFilter] = useState([])
  const [categoryFilters, setCategoryFilters] = useState([])
  const dispatch = useDispatch()
  const [filtersListMapping, setFiltersListMapping] = useState({
    Category: categoryFilters,
    'Item Type': itemTypesFilter,
    Condition: CONST_ITEM_CONDITION_LIST,
    'Allocated to': CONST_ALLOCATION_FILTER,
  })

  const filtersAPIMapping = {
    category_id: 'Category',
    item_id: 'Item Type',
    allocated_to_type: 'Allocated to',
    condition: 'Condition',
  }

  const getFiltersForAPI = () => {
    let apiFilters = {
      category_id: [],
      item_id: [],
      allocated_to_type: [],
      condition: [],
    }
    Object.keys(filtersAPIMapping).forEach((key) => {
      inventoryState?.selectedFilters.forEach((selectedValue) => {
        filtersListMapping[filtersAPIMapping[key]].map((str) => {
          if (selectedValue === str.value) {
            apiFilters[key].push(str.value)
          }
        })
      })
    })
    dispatch(setApiFilterData(apiFilters))
    return apiFilters
  }
  const categoriesAndItemParser = (data) => {
    if (data?.length > 0) {
      let categories = []
      let items = []
      data?.forEach((row) => {
        categories.push({label: row['name'], value: row['_id']})
        row['item_list'].forEach((row) => {
          items.push({label: row['name'], value: row['_id']})
        })
      })
      items.sort(function (a, b) {
        return ('' + a.label).localeCompare('' + b.label)
      })
      categories.sort(function (a, b) {
        return ('' + a.label).localeCompare('' + b.label)
      })
      setItemTypesFilter(items)
      setCategoryFilters(categories)
      setFiltersListMapping({
        ...filtersListMapping,
        'Item Type': items,
        Category: categories,
      })
    }
  }

  const handleApplyFilters = () => {
    let payload = {
      filters: getFiltersForAPI(),
      limit: PAGE_LIMIT,
    }
    if (inventoryState?.searchText?.length >= 1) {
      payload = {...payload, search_text: inventoryState?.searchText}
    }
    if (inventoryState?.possibleAllocatedIds?.length > 0) {
      payload = {
        ...payload,
        possible_allocation_ids: inventoryState?.possibleAllocatedIds,
      }
    }
    dispatch(getAllItemsListRequestAction(payload))
    setShowFilters(false)
    dispatch(setPage(1))
    setLastPage('many')
    dispatch(setApiFilterData(getFiltersForAPI()))
    dispatch(setCurrentPageReference({limit: PAGE_LIMIT, next: true}))
    eventManager.send_event(events.IM_FILTER_TYPE_CLICKED_TFI, {
      screen_name: 'Item Allocation',
      filter_type: payload.filters,
    })
  }

  const handleRemoveFilters = () => {
    let filters = {
      category_id: [],
      item_id: [],
      allocated_to_type: [],
      condition: [],
    }
    let payload = {
      limit: PAGE_LIMIT,
      next: true,
    }
    if (inventoryState?.searchText?.length >= 1) {
      payload = {...payload, search_text: inventoryState?.searchText}
    }
    if (inventoryState?.possibleAllocatedIds?.length > 0) {
      payload = {
        ...payload,
        possible_allocation_ids: inventoryState?.possibleAllocatedIds,
      }
    }
    dispatch(getAllItemsListRequestAction(payload))
    setShowFilters(false)
    dispatch(setPage(1))
    setLastPage('many')
    dispatch(setSelectedFilters([]))
    dispatch(setApiFilterData(filters))
    dispatch(setCurrentPageReference({limit: PAGE_LIMIT, next: true}))
  }

  useEffect(() => {
    categoriesAndItemParser(inventoryState?.allCategories?.obj)
  }, [inventoryState.allCategories])

  const handleOnChange = (val) => {
    dispatch(setSelectedFilters(val))
  }
  const filterRef = useRef(null)
  useOutsideClickHandler(filterRef, () => {
    setShowFilters(false)
  })

  return (
    <>
      <div className={styles.filterWrapper} id="">
        <div className={styles.filters} ref={filterRef}>
          {Object.keys(filtersListMapping).map((filter) => {
            return checkBoxGroup(
              filter,
              filtersListMapping[filter],
              inventoryState?.selectedFilters,
              handleOnChange
            )
          })}
        </div>
        <div className={styles.applyButtonWrapper}>
          <Button
            className={styles.applyButton}
            onClick={handleRemoveFilters}
            type="border"
          >
            {t('reset')}
          </Button>
          <Button className={styles.applyButton} onClick={handleApplyFilters}>
            {t('apply')}
          </Button>
        </div>
      </div>
    </>
  )
}
