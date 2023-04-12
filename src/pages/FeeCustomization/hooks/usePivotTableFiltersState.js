import produce from 'immer'
import {useEffect, useMemo, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import useInstituteHeirarchy from '../../AttendanceReport/pages/StudentWiseAttendance/hooks/useInstituteHeirarchy'
import {
  FEE_CUSTOMIZATION_API_KEYS_REQUEST,
  FEE_CUSTOMIZATION_API_KEYS_RESPONSE,
} from '../constants/feeCustomization.api.constants'
import {
  FEE_PAYMENT_MODE_OPTIONS,
  FILTER_OPTIONS,
  FILTER_OPTIONS_CONSTANTS,
  TRANSACTION_STATUS,
} from '../constants/feeCustomization.editor.constants'
import {getInstallmentLabels} from '../utils/feeCustomization.helpers'
import {setSelectedOptions} from '../utils/feeCustomization.state.helpers'

function usePivotTableFiltersState({reset} = {}) {
  const {t} = useTranslation()
  const instalmentTimestampList = useSelector(
    (state) => state.feeReports.instalmentTimestampList
  )
  const feeTypeList = useSelector((state) => state.feeReports.feeTypeList)
  const {filters: selectedFilters} = useSelector(
    (state) => state.feeCustomization.editor
  )
  const [filters, setFilter] = useState(() => {
    return produce(FILTER_OPTIONS, (draft) => {
      Object.keys(draft).reduce((obj, key) => {
        obj[key] = {
          ...draft[key],
        }
        return obj
      }, {})
      return draft
    })
  })
  const {heirarchy, handleSelection} = useInstituteHeirarchy({})
  // This is to get selected classes.
  const {allSlectedSectionsDetails, handleSelectionHelper} =
    useInstituteHeirarchy({
      setData: filters[FILTER_OPTIONS_CONSTANTS.SECTION].data,
    })

  // STATIC data
  useEffect(() => {
    setFilter(
      produce(filters, (draft) => {
        draft[FILTER_OPTIONS_CONSTANTS.PAYMENT_MODE] = {
          ...FILTER_OPTIONS.PAYMENT_MODE,
          data: FEE_PAYMENT_MODE_OPTIONS?.map(
            ({labelKey, value, enum: enumarator}) => ({
              label: t(labelKey),
              enum: enumarator,
              value,
            })
          ),
        }
        draft[FILTER_OPTIONS_CONSTANTS.TRANSACTION_STATUS] = {
          ...FILTER_OPTIONS.TRANSACTION_STATUS,
          data: (() => {
            const data = []
            TRANSACTION_STATUS?.forEach(
              ({labelKey, value, enum: enumarator}) => {
                if (enumarator !== -1 && enumarator !== 3)
                  data.push({label: t(labelKey), enum: enumarator, value})
              }
            )
            return data
          })(),
        }
        return draft
      })
    )
  }, [])

  useEffect(() => {
    setFilter((filters) =>
      produce(filters, (draft) => {
        draft[FILTER_OPTIONS_CONSTANTS.SECTION].data = heirarchy
        return draft
      })
    )
  }, [heirarchy])

  useEffect(() => {
    setFilter((filters) =>
      produce(filters, (draft) => {
        draft[FILTER_OPTIONS_CONSTANTS.INSTALLMENT_DATE].data =
          getInstallmentLabels(instalmentTimestampList)
        return draft
      })
    )
  }, [instalmentTimestampList])

  useEffect(() => {
    setFilter((filters) =>
      produce(filters, (draft) => {
        const _data = feeTypeList?.map((type) => ({
          label: type.name,
          value: type._id,
        }))
        draft[FILTER_OPTIONS_CONSTANTS.FEE_TYPE].data = _data
        return draft
      })
    )
  }, [feeTypeList])

  const selectedFilterValues = useMemo(() => {
    const selectedData = Object.keys(filters).reduce((obj, key) => {
      if (filters[key].value === FILTER_OPTIONS_CONSTANTS.SECTION) {
        obj[key] = allSlectedSectionsDetails.current
      } else {
        obj[key] = filters[key].data?.filter((item) => item.isSelected)
      }
      return obj
    }, {})
    return selectedData
  }, [filters, allSlectedSectionsDetails.current])

  // Set selected filters
  useEffect(() => {
    if (
      feeTypeList?.length &&
      instalmentTimestampList?.length &&
      selectedFilters &&
      Object.keys(selectedFilters)?.length &&
      heirarchy &&
      !reset
    ) {
      setFilter((filters) =>
        produce(filters, (draft) => {
          Object.keys(selectedFilters).map((key) => {
            const _key = FEE_CUSTOMIZATION_API_KEYS_RESPONSE[key]
            switch (_key) {
              case FILTER_OPTIONS_CONSTANTS.FEE_TYPE:
              case FILTER_OPTIONS_CONSTANTS.INSTALLMENT_DATE:
                draft[_key].data = setSelectedOptions({
                  options: selectedFilters[key],
                  arr: draft[_key].data,
                  key: 'value',
                })
                break
              case FILTER_OPTIONS_CONSTANTS.PAYMENT_MODE:
              case FILTER_OPTIONS_CONSTANTS.TRANSACTION_STATUS:
                draft[_key].data = setSelectedOptions({
                  options: selectedFilters[key],
                  arr: draft[_key].data,
                  key: 'enum',
                })
                break
              case FILTER_OPTIONS_CONSTANTS.SECTION:
                handleSelectionHelper({
                  selectedItem: selectedFilters[key].map((id) => ({_id: id})),
                  data: heirarchy,
                  setData: (data) => {
                    draft[_key].data = data
                  },
                })
                break
            }
          })
          return draft
        })
      )
    }
  }, [feeTypeList, instalmentTimestampList, selectedFilters, heirarchy])
  const getSelectedFilterApiReq = () => {
    const filter = {}
    Object.keys(FEE_CUSTOMIZATION_API_KEYS_REQUEST).map((key) => {
      if (key === FILTER_OPTIONS.SECTION.value) {
        const arr = selectedFilterValues[key].map((item) => item._id)
        filter[FEE_CUSTOMIZATION_API_KEYS_REQUEST[key]] = arr
      }
      if (key === FILTER_OPTIONS.INSTALLMENT_DATE.value) {
        const arr = selectedFilterValues[key].map((item) => item.value)
        filter[FEE_CUSTOMIZATION_API_KEYS_REQUEST[key]] = arr
      }
      if (key === FILTER_OPTIONS.FEE_TYPE.value) {
        const arr = selectedFilterValues[key].map((item) => item.value)
        filter[FEE_CUSTOMIZATION_API_KEYS_REQUEST[key]] = arr
      }
      if (key === FILTER_OPTIONS.PAYMENT_MODE.value) {
        const arr = selectedFilterValues[key].map((item) => item.enum)
        filter[FEE_CUSTOMIZATION_API_KEYS_REQUEST[key]] = arr
      }
      if (key === FILTER_OPTIONS.TRANSACTION_STATUS.value) {
        const arr = selectedFilterValues[key].map((item) => item.enum)
        filter[FEE_CUSTOMIZATION_API_KEYS_REQUEST[key]] = arr
      }
    })
    return filter
  }

  return [
    filters,
    setFilter,
    selectedFilterValues,
    handleSelection,
    getSelectedFilterApiReq,
  ]
}

export default usePivotTableFiltersState
