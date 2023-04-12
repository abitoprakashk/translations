import {BUTTON_CONSTANTS, Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import classNames from 'classnames'
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {events} from '../../../../../../utils/EventsConstants'
import FeeCustomizationPropmpt from '../../../../components/FeeCustomizationPropmpt/FeeCustomizationPropmpt'
import {FEE_CUSTOMIZATION_API_KEYS_REQUEST} from '../../../../constants/feeCustomization.api.constants'
import usePivotTableEditorState, {
  DEFAULT_DATE,
} from '../../../../hooks/usePivotTableEditorState'
import {setEditorFieldsAction} from '../../../../redux/feeCustomization.actions'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import RenderDateRangeCategory from './components/RenderEditorCategory/RenderDateRangeCategory'
import RenderFilterEditorCategory from './components/RenderEditorCategory/RenderFilterEditorCategory'
import RenderSortableEditorCategory from './components/RenderEditorCategory/RenderSortableEditorCategory'
import {VALUE_OPTIONS} from '../../../../constants/feeCustomization.editor.constants'
import useGetDateFilterRange, {
  DATE_FILTER,
} from '../../../../../../hooks/useFilterDateRange'
import styles from './FeePivotTableEditor.module.css'

const FeePivotTableEditor = forwardRef((_, ref) => {
  const {
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
    selectedFilterValues, // selected filter values
    selectedDate,
    setSelectedDate,
    onReset,
    getSelectedFilterApiReq,
  } = usePivotTableEditorState()
  const dateApiReq = useGetDateFilterRange({defaultDate: selectedDate})
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const [showResetPrompt, setShowResetPrompt] = useState(false)
  const resetClicked = useRef(null) // to handle reset click. to update redux on reset click
  const eventManager = useSelector((state) => state.eventManager)
  const isDuePresent = useMemo(() => {
    let present = false
    orderedValues.some((item) => {
      if (item.value === VALUE_OPTIONS.DUE.value) {
        present = true
        return true
      }
    })
    return present
  })

  useImperativeHandle(ref, () => ({
    selectedFilterValues,
    dateApiReq,
  }))

  //  Handle DUE case
  useEffect(() => {
    if (isDuePresent) {
      setSelectedDate(DATE_FILTER.THIS_SESSION)
    }
  }, [isDuePresent])

  const sortableData = useMemo(() => {
    const {
      selectedOptions: rowsSelectedOptions,
      chipListData: rowsChipListData,
    } = selectedOptionsAndChips(orderedRows)
    const {
      selectedOptions: colsSelectedOptions,
      chipListData: colsChipListData,
    } = selectedOptionsAndChips(orderedColumns)
    const {
      selectedOptions: valuesSelectedOptions,
      chipListData: valuesChipListData,
    } = selectedOptionsAndChips(orderedValues)
    return [
      {
        data: rows,
        setData: setRows,
        orderedData: orderedRows,
        setOrderedData: setorderedRows,
        title: t('rows'),
        selectedOptions: rowsSelectedOptions,
        chipListData: rowsChipListData,
        exclusive: colsSelectedOptions,
      },
      {
        data: cols,
        setData: setCols,
        orderedData: orderedColumns,
        setOrderedData: setorderedColumns,
        title: t('columns'),
        selectedOptions: colsSelectedOptions,
        chipListData: colsChipListData,
        exclusive: rowsSelectedOptions,
      },
      {
        data: values,
        setData: setValues,
        orderedData: orderedValues,
        setOrderedData: setorderedValues,
        title: t('Column Values'),
        tooltip: {
          title: t('columnTooltipTitle'),
          desc: t('columnTooltipDesc'),
        },
        selectedOptions: valuesSelectedOptions,
        chipListData: valuesChipListData,
      },
    ]
  }, [rows, cols, orderedRows, orderedColumns, t, values, orderedValues])

  const filterData = useMemo(
    () => ({
      filters,
      setFilter,
      selectedFilterValues,
      title: t('filter'),
    }),
    [t, filters, setFilter, selectedFilterValues]
  )

  const [disableResetBtn, disableUpdateBtn] = useMemo(() => {
    let resetDisabled = true
    let UpdateDisabled = true
    if (
      (sortableData[0].selectedOptions?.length ||
        sortableData[1].selectedOptions?.length) &&
      sortableData[2].selectedOptions?.length
    ) {
      UpdateDisabled = false
    } else {
      UpdateDisabled = true
    }

    if (
      sortableData[0].selectedOptions?.length ||
      sortableData[1].selectedOptions?.length ||
      sortableData[2].selectedOptions?.length
    ) {
      resetDisabled = false
    }

    Object.keys(selectedFilterValues)?.some((key) => {
      if (selectedFilterValues[key].length) {
        resetDisabled = false
        return true
      }
    })

    if (selectedDate.value !== DEFAULT_DATE.value) {
      resetDisabled = false
    }
    return [resetDisabled, UpdateDisabled]
  }, [selectedFilterValues, rows, cols, sortableData, selectedDate])

  //  update redux on reset. to show empty state
  //  dateApiReq is enough as dependency *disableResetBtn* is not required. dateApiReq comes after changes on date
  useEffect(() => {
    //  ref is used to maintain reset click.
    if (resetClicked.current && disableResetBtn) {
      updateRedux()
      resetClicked.current = false
    }
  }, [dateApiReq])

  const closePromptModal = useCallback(() => {
    setShowResetPrompt(false)
    eventManager.send_event(events.FEE_REPORTS_CUSTOM_RESET_POPUP_CLICKED_TFI, {
      action: 'cancel',
    })
  }, [])

  // Add values to redux on every update table
  const updateRedux = () => {
    const _data = getAPICompatibleData()

    dispatch(setEditorFieldsAction(_data))
    eventManager.send_event(
      events.FEE_REPORTS_CUSTOM_UPDATE_TABLE_CLICKED_TFI,
      {
        selection: {
          ...selectedFilterValues,
          orderedColumns,
          orderedRows,
          orderedValues,
        },
      }
    )
  }

  const getAPICompatibleData = () => {
    const _data = {}
    const _dataKeys = ['rows', 'columns', 'values']
    sortableData.map((item, i) => {
      _data[_dataKeys[i]] = item.selectedOptions.map(
        (key) => FEE_CUSTOMIZATION_API_KEYS_REQUEST[key]
      )
    })
    _data.filters = getSelectedFilterApiReq()
    _data.dateRange = dateApiReq

    return _data
  }

  return (
    <div>
      <div className={styles.stickyHeader}>
        <Header
          isDuePresent={isDuePresent}
          showReset={!disableResetBtn}
          onReset={() => {
            setShowResetPrompt(true)
            eventManager.send_event(events.FEE_REPORTS_CUSTOM_RESET_CLICKED_TFI)
          }}
        />
      </div>
      {sortableData.map((data, i) => (
        <RenderSortableEditorCategory key={i} {...data} />
      ))}
      <RenderFilterEditorCategory {...filterData} />
      <RenderDateRangeCategory
        isDuePresent={isDuePresent}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        title={t('dateRange')}
      />
      {showResetPrompt ? (
        <FeeCustomizationPropmpt
          title={t('unpublisedRedport')}
          desc={t('feeCustomisationReset')}
          onClose={closePromptModal}
          actionButtons={[
            {
              body: t('cancel'),
              onClick: closePromptModal,
              type: 'outline',
              size: BUTTON_CONSTANTS.SIZE.MEDIUM,
              classes: {button: styles.btn},
            },
            {
              body: t('reset'),
              onClick: () => {
                closePromptModal()
                onReset()
                eventManager.send_event(
                  events.FEE_REPORTS_CUSTOM_RESET_POPUP_CLICKED_TFI,
                  {
                    action: 'reset',
                  }
                )
                resetClicked.current = true
              },
              category: BUTTON_CONSTANTS.CATEGORY.DESTRUCTIVE,
              size: BUTTON_CONSTANTS.SIZE.MEDIUM,
              classes: {button: styles.btn},
            },
          ]}
        />
      ) : null}
      <Footer isDisabled={disableUpdateBtn} onClick={updateRedux} />
    </div>
  )
})
export default FeePivotTableEditor

FeePivotTableEditor.displayName = 'FeePivotTableEditor'

const selectedOptionsAndChips = (data) => {
  const selectedOptions = []
  const chipListData = []
  data.forEach((item, index) => {
    if (item.isSelected) {
      selectedOptions.push(item.value)
      chipListData.push({
        label: (
          <div className={classNames('flex items-center', styles.chipLabel)}>
            <Icon
              name={'dragIndicator'}
              size={ICON_CONSTANTS.SIZES.XXX_SMALL}
            />
            <div className="sentenceCase">{item.label}</div>
          </div>
        ),
        ['data-id']: index,
        id: item.value,
      })
    }
  })
  return {selectedOptions, chipListData}
}
