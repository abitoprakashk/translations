import {Modal} from '@teachmint/krayon'
import {t} from 'i18next'
import React, {useEffect, useMemo, useState} from 'react'
import {useSelector} from 'react-redux'
import {events} from '../../../../../../utils/EventsConstants'
import {GROUPS_KEYS} from '../../companyAccConstants'
import GroupClasses from './GroupClasses/GroupClasses'
// import GroupFeeTypes from './GroupFeeTypes/GroupFeeTypes'

export default function GroupClassFeeTypes({
  isOpen = false,
  groupBy = 'class',
  onClose = () => {},
  data = [],
  allReadyGroupedValue = [],
  modalHeader = 'Group Classes',
  setGroupes = () => {},
  selectedFeeTypes = [],
  metaDataInfo = {},
}) {
  const [tempGrouping, setTempGrouping] = useState([])
  const eventManager = useSelector((state) => state.eventManager)
  useEffect(() => {
    setTempGrouping([...allReadyGroupedValue])
  }, [])

  const handleGroupBtnClick = (selecteditemIds) => {
    if (selecteditemIds?.length > 1) {
      setTempGrouping((prev) => [...prev, selecteditemIds])
    }
  }

  const handleUngroupedBtnClick = (selecteditemIds) => {
    if (!selecteditemIds && selecteditemIds.length === 0) return
    let newValues = [...tempGrouping].filter((subArr) => {
      return !subArr.every((item) => selecteditemIds.includes(item))
    })
    setTempGrouping(newValues)
  }

  const handleCancelGrouping = () => {
    eventManager.send_event(
      events.FEE_ACCOUNT_MAPPING_CLASSES_GROUP_CLICKED_TFI,
      {action: 'cancel'}
    )
    onClose()
  }

  const handleConfirmGrouping = () => {
    eventManager.send_event(
      events.FEE_ACCOUNT_MAPPING_CLASSES_GROUP_CLICKED_TFI,
      {action: 'confirm', class_ids: tempGrouping}
    )
    let groupBySubType = groupBy.split(':')

    if (groupBySubType[0] === GROUPS_KEYS.FEE_TYPE) {
      if (groupBySubType[1] === GROUPS_KEYS.GROUPED_BY_CLASS) {
        setGroupes((prev) => {
          return {
            ...prev,
            feeType: {
              ...prev.feeType,
              [groupBySubType[1]]: {
                ...prev[groupBySubType[1]],
                [metaDataInfo?.class?.id]: tempGrouping,
              },
            },
          }
        })
      } else if (groupBySubType[1] === GROUPS_KEYS.GROUPED_BY_SECTION) {
        setGroupes((prev) => {
          return {
            ...prev,
            feeType: {
              ...prev.feeType,
              [groupBySubType[1]]: {
                ...prev[groupBySubType[1]],
                [metaDataInfo?.section?.id]: tempGrouping,
              },
            },
          }
        })
      } else {
        setGroupes((prev) => {
          return {
            ...prev,
            feeType: {...prev.feeType, [groupBySubType[1]]: tempGrouping},
          }
        })
      }
    } else {
      setGroupes((prev) => {
        return {
          ...prev,
          class: tempGrouping,
        }
      })
    }
    onClose()
  }

  const options = useMemo(() => {
    let groupBySubType = groupBy.split(':')
    if (groupBySubType[0] === GROUPS_KEYS.CLASS) {
      return data.map((item) => {
        return {value: item.classId, label: item.className}
      })
    } else if (groupBySubType[0] === GROUPS_KEYS.FEE_TYPE) {
      return data
        .filter((item) =>
          selectedFeeTypes.length > 0
            ? selectedFeeTypes.includes(item._id)
            : true
        )
        .map((item) => {
          if (
            (groupBySubType[1] &&
              groupBySubType[1] === GROUPS_KEYS.GROUPED_BY_CLASS) ||
            false
          ) {
            return {
              value: item?._id,
              label: `${metaDataInfo?.class?.name} - ${item?.name}`,
            }
          } else if (
            (groupBySubType[1] &&
              groupBySubType[1] === GROUPS_KEYS.GROUPED_BY_SECTION) ||
            false
          ) {
            return {
              value: item?._id,
              label: `${metaDataInfo?.class?.name} ${metaDataInfo?.section?.name} - ${item?.name}`,
            }
          } else {
            return {value: item?._id, label: item?.name}
          }
        })
    }
  }, [data])

  return (
    <Modal
      isOpen={isOpen}
      actionButtons={[
        {
          body: t('cancel'),
          onClick: handleCancelGrouping,
          type: 'outline',
        },
        {
          body: t('confirm'),
          onClick: handleConfirmGrouping,
          isDisabled:
            allReadyGroupedValue?.length === 0 && tempGrouping?.length === 0,
        },
      ]}
      header={modalHeader}
      onClose={onClose}
      size="m"
    >
      <div>
        <GroupClasses
          data={data}
          allReadyGroupedValue={[...tempGrouping]}
          onGroupClick={handleGroupBtnClick}
          options={options}
          onUngroupClick={handleUngroupedBtnClick}
          metaDataInfo={metaDataInfo}
        />
      </div>
    </Modal>
  )
}
