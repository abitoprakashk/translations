import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import useGetDateFilterRange, {
  DATE_FILTER,
  DATE_FILTER_API_REQUEST,
  DATE_FILTER_API_RESPONSE,
} from '../../../hooks/useFilterDateRange'
import {FEE_CUSTOMIZATION_API_KEYS_RESPONSE} from '../constants/feeCustomization.api.constants'
import {
  COLUMN_OPTIONS,
  ROW_OPTIONS,
  VALUE_OPTIONS,
} from '../constants/feeCustomization.editor.constants'
import usePivotTableFiltersState from './usePivotTableFiltersState'

export const DEFAULT_DATE = DATE_FILTER.THIS_WEEK

function usePivotTableEditorState() {
  const {t} = useTranslation()

  const {
    rows: rowAttr,
    columns: colAttr,
    values: valueAttr,
    dateRange,
  } = useSelector((state) => state.feeCustomization.editor)

  const [rows, setRows] = useState(
    Object.values(ROW_OPTIONS).map((val) => ({...val, label: t(val.titleKey)}))
  )
  const [orderedRows, setorderedRows] = useState([])
  const [cols, setCols] = useState(
    Object.values(COLUMN_OPTIONS).map((val) => ({
      ...val,
      label: t(val.titleKey),
    }))
  )
  const [orderedColumns, setorderedColumns] = useState([])
  const [values, setValues] = useState(
    Object.values(VALUE_OPTIONS).map((val) => ({
      ...val,
      label: t(val.titleKey),
    }))
  )
  const [orderedValues, setorderedValues] = useState([])

  const [
    filters,
    setFilter,
    selectedFilterValues,
    handleSelection,
    getSelectedFilterApiReq,
  ] = usePivotTableFiltersState()

  const [resetFilter] = usePivotTableFiltersState({reset: true}) //used to RESET
  const [selectedDate, setSelectedDate] = useState(
    structuredClone(DEFAULT_DATE)
  )
  const dateApiReq = useGetDateFilterRange({defaultDate: selectedDate})
  useEffect(() => {
    // SET rows cols and values from redux to state. in the selected order
    const fromWrapper = [rowAttr, colAttr, valueAttr]
    const toWrapper = [
      [rows, setRows, setorderedRows],
      [cols, setCols, setorderedColumns],
      [values, setValues, setorderedValues],
    ]
    fromWrapper.map((fromArr, index) => {
      if (fromArr) {
        const selectedItems = fromArr.map(
          (key) => FEE_CUSTOMIZATION_API_KEYS_RESPONSE[key]
        )
        const selectedArray = []
        const setToArray = toWrapper[index][1]
        const setToOrderedArray = toWrapper[index][2]
        selectedItems.forEach((key) => {
          const match = toWrapper[index][0].filter((item) => key === item.value)
          if (match?.length) {
            selectedArray.push(...match)
          }
        })

        setToArray(
          toWrapper[index][0].map((item) => {
            if (selectedItems.includes(item.value)) {
              item.isSelected = true
            } else {
              item.isSelected = false
            }
            return item
          })
        )
        setToOrderedArray(selectedArray)
      }
    })
  }, [rowAttr, colAttr, valueAttr])

  useEffect(() => {
    if (dateRange?.type) {
      const date = structuredClone(
        DATE_FILTER[DATE_FILTER_API_RESPONSE[dateRange?.type]]
      )
      if (dateRange?.type === DATE_FILTER_API_REQUEST.CUSTOM) {
        //
        date.meta = {
          startDate:
            typeof dateRange.from === 'string'
              ? new Date(dateRange.from)
              : dateRange.from,
          endDate:
            typeof dateRange.to === 'string'
              ? new Date(dateRange.to)
              : dateRange.to,
          key: 'selection',
        }
      }

      setSelectedDate(date)
    }
  }, [dateRange])

  const onReset = () => {
    setRows(
      Object.values(ROW_OPTIONS).map((val) => ({
        ...val,
        label: t(val.titleKey),
      }))
    )
    setorderedRows([])
    setCols(
      Object.values(COLUMN_OPTIONS).map((val) => ({
        ...val,
        label: t(val.titleKey),
      }))
    )
    setorderedColumns([])
    setValues(
      Object.values(VALUE_OPTIONS).map((val) => ({
        ...val,
        label: t(val.titleKey),
      }))
    )
    setorderedValues([])
    setFilter(resetFilter)
    setSelectedDate(structuredClone(DEFAULT_DATE))
  }

  return {
    rows,
    setRows,
    orderedRows,
    setorderedRows,
    cols,
    setCols,
    orderedColumns,
    setorderedColumns,
    values,
    setValues,
    orderedValues,
    setorderedValues,
    filters,
    setFilter,
    selectedFilterValues,
    selectedDate,
    setSelectedDate,
    handleSelection,
    onReset,
    getSelectedFilterApiReq, // data for api to get table
    dateApiReq, // data for api to get table
  }
}

export default usePivotTableEditorState
