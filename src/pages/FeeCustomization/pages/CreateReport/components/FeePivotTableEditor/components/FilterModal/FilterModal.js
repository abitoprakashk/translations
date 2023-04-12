import {Modal, MODAL_CONSTANTS} from '@teachmint/krayon'
import React, {useEffect, useMemo, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import {events} from '../../../../../../../../utils/EventsConstants'
import useInstituteHeirarchy from '../../../../../../../AttendanceReport/pages/StudentWiseAttendance/hooks/useInstituteHeirarchy'
import {FILTER_OPTIONS_CONSTANTS} from '../../../../../../constants/feeCustomization.editor.constants'
import FilterDetails from './FilterDetails'
import FilterList from './FilterList'
import styles from './FilterModal.module.css'

function FilterModal({onClose, filterData, setFilterData}) {
  const {t} = useTranslation()
  const eventManager = useSelector((state) => state.eventManager)
  // CREATE COPY : because apply changes only on submit
  //  ALSO COPY HOOK
  const [data, setData] = useState(filterData)
  const {heirarchy, handleSelection, allSlectedSectionsDetails} =
    useInstituteHeirarchy({
      selectedItem: null,
      setData: filterData[FILTER_OPTIONS_CONSTANTS.SECTION]?.data, // sets default data
    })

  // used only to disable ```apply filter``` button
  const selectedFilterValues = useMemo(() => {
    const selectedData = Object.keys(data).reduce((obj, key) => {
      if (data[key].value === FILTER_OPTIONS_CONSTANTS.SECTION) {
        obj[key] = allSlectedSectionsDetails.current
      } else {
        obj[key] = data[key].data?.filter((item) => item.isSelected)
      }
      return obj
    }, {})
    return selectedData
  }, [data, allSlectedSectionsDetails.current])

  // used only to disable ```apply filter``` button
  // eslint-disable-next-line no-unused-vars
  const disableBtn = useMemo(() => {
    let disabled = true
    Object.keys(selectedFilterValues).some((key) => {
      if (selectedFilterValues[key].length) {
        disabled = false
        return true
      }
    })
    return disabled
  }, [selectedFilterValues])

  useEffect(() => {
    setData(filterData)
  }, [filterData])

  useEffect(() => {
    setData({
      ...data,
      [FILTER_OPTIONS_CONSTANTS.SECTION]: {
        ...data[FILTER_OPTIONS_CONSTANTS.SECTION],
        data: heirarchy,
      },
    })
  }, [heirarchy])

  const setSingleFilterData = ({key, value}, ...props) => {
    if (key === FILTER_OPTIONS_CONSTANTS.SECTION) {
      handleSelection(...props)
    } else {
      setData({
        ...data,
        [key]: {
          ...data[key],
          data: value,
        },
      })
    }
  }
  return (
    <Modal
      actionButtons={[
        {
          body: t('applyFilter'),
          isDisabled: false, //disableBtn,
          onClick: () => {
            setFilterData(data)
            onClose()
            eventManager.send_event(
              events.FEE_REPORTS_CUSTOM_FILTER_SELECTION_APPLY_CLICKED_TFI,
              {
                ...data,
              }
            )
          },
        },
      ]}
      isOpen
      header={t('filters')}
      classes={{
        content: styles.content,
        modal: styles.modal,
      }}
      onClose={onClose}
      size={MODAL_CONSTANTS.SIZE.MEDIUM}
    >
      <FilterList data={data} setData={setData} />
      <FilterDetails data={data} setSingleFilterData={setSingleFilterData} />
    </Modal>
  )
}

export default FilterModal
