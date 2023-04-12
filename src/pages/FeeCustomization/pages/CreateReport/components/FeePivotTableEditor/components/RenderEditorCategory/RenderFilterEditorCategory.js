import {Button, BUTTON_CONSTANTS, Divider} from '@teachmint/krayon'
import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import useInstituteHeirarchy from '../../../../../../../AttendanceReport/pages/StudentWiseAttendance/hooks/useInstituteHeirarchy'
import CommonTitle from './components/CommonTitle'
import FilterModal from '../FilterModal/FilterModal'
import styles from './RenderEditorCategory.module.css'
import RenderSelectedFilter from './components/RenderSelectedFilter'
import {FILTER_OPTIONS_CONSTANTS} from '../../../../../../constants/feeCustomization.editor.constants'
import {useSelector} from 'react-redux'
import {events} from '../../../../../../../../utils/EventsConstants'

function RenderFilterEditorCategory({
  filters: filterData,
  setFilter: setFilterData,
  selectedFilterValues,
  title,
}) {
  const eventManager = useSelector((state) => state.eventManager)
  const {t} = useTranslation()
  const [showModal, setShowModal] = useState(false)
  // this is to handle chip cancel of classes
  const {handleSelectionHelper} = useInstituteHeirarchy({
    setData: filterData[FILTER_OPTIONS_CONSTANTS.SECTION].data,
  })

  const setSingleFilterData = ({key, value, classData}) => {
    if (
      key === FILTER_OPTIONS_CONSTANTS.SECTION &&
      filterData[FILTER_OPTIONS_CONSTANTS.SECTION]?.data
    ) {
      handleSelectionHelper({
        selectedItem: classData,
        data: filterData[FILTER_OPTIONS_CONSTANTS.SECTION].data,
        setData: (data) => {
          setFilterData({
            ...filterData,
            [FILTER_OPTIONS_CONSTANTS.SECTION]: {
              ...filterData[FILTER_OPTIONS_CONSTANTS.SECTION],
              data,
            },
          })
        },
      })
    } else {
      setFilterData({
        ...filterData,
        [key]: {
          ...filterData[key],
          data: value,
        },
      })
    }
  }

  const handleChipCancel = ({selectedValue, key}) => {
    if (key === FILTER_OPTIONS_CONSTANTS.SECTION) {
      setSingleFilterData({
        key,
        classData: {_id: selectedValue, isSelected: true},
      })
    } else {
      setSingleFilterData({
        key,
        value: filterData[key].data.map((option) => {
          const _option = structuredClone(option)
          if (_option.value === selectedValue) {
            _option.isSelected = false
          }
          return _option
        }),
      })
    }
    eventManager.send_event(events.FEE_REPORTS_CUSTOM_CHIP_CANCEL_CLICKED_TFI, {
      selection: {selectedValue, key},
    })
  }

  return (
    <div>
      <CommonTitle
        title={title}
        rightJSX={
          <Button
            classes={{button: styles.btn}}
            size={BUTTON_CONSTANTS.SIZE.SMALL}
            onClick={() => {
              setShowModal(true)
              eventManager.send_event(
                events.FEE_REPORTS_CUSTOM_FILTER_SELECTION_CLICKED_TFI
              )
            }}
            type="outline"
          >
            {t('add')}
          </Button>
        }
      />
      <RenderSelectedFilter
        handleChipCancel={handleChipCancel}
        selectedFilterValues={selectedFilterValues}
      />
      <Divider classes={{wrapper: styles.divider}} />
      {showModal ? (
        <FilterModal
          filterData={filterData}
          setFilterData={setFilterData}
          onClose={() => setShowModal(false)}
          selectedFilterValues={selectedFilterValues}
        />
      ) : null}
    </div>
  )
}

export default RenderFilterEditorCategory
