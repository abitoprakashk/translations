import React from 'react'
import {useState, useRef, useMemo} from 'react'
import EmptyScreenV1 from '../../../../components/Common/EmptyScreenV1/EmptyScreenV1'
import DefaultView from './default_view.svg'
import {Table} from '@teachmint/common'
import {
  TAB_OPTIONS,
  WEEKLY_OFF,
  applicableForOptions,
  tagTypeOptions,
  WEEKLY_OFF_COLS,
} from '../../YearlyCalendar.constants'
import {INSTITUTE_TYPES} from '../../../../constants/institute.constants'

import {useEffect} from 'react'
import {getOrdinalNum, getClassesForRow} from '../../commonFunctions'
import * as SHC from '../../../../utils/SchoolSetupConstants'
import {useSelector} from 'react-redux'
import {getNodesListOfSimilarType} from '../../../../utils/HierarchyHelpers'
import {
  createCalendarItem,
  deleteCalendarItem,
} from '../../redux/actions/calendarActions'
import {useDispatch} from 'react-redux'
import style from '../../YearlyCalendar.module.scss'
import SubjectTooltipOptions from '../../../../components/SchoolSystem/SectionDetails/SubjectTooltipOptions'
import ConfirmationPopup from '../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import WeeklyOffAddSlider from './WeeklyOffAddSlider'
import {Icon} from '@teachmint/common'
import Filter from '../CalendarFilter/CalendarFilter'
import {t} from 'i18next'
import {events} from '../../../../utils/EventsConstants'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import Permission from '../../../../components/Common/Permission/Permission'

const multiplier = 24 * 60 * 60

const options = [
  {
    name: 'Mon',
    value: 1,
    fullname: 'Monday',
  },
  {
    name: 'Tue',
    value: 2,
    fullname: 'Tuesday',
  },
  {
    name: 'Wed',
    value: 3,
    fullname: 'Wednesday',
  },
  {
    name: 'Thu',
    value: 4,
    fullname: 'Thursday',
  },
  {
    name: 'Fri',
    value: 5,
    fullname: 'Friday',
  },
  {
    name: 'Sat',
    value: 6,
    fullname: 'Saturday',
  },
  {
    name: 'Sun',
    value: 7,
    fullname: 'Sunday',
  },
]

const WeeklyOffs = ({data = []}) => {
  const [showSlider, setSlider] = useState(false)
  const [activeRowItem, setActiveRowItem] = useState('')
  const [showConfirmPopup, setShowConfirmPopup] = useState(null)
  const [fieldsData, setfieldsData] = useState({
    activeDay: '',
    frequencyArray: [],
    applicableFor: 0,
    tagType: '',
    classList: [],
  })
  const [filteredData, setFilterData] = useState([])
  const [filter, setFilter] = useState({
    classes: [],
    applicableTo: null,
  })
  const [isFilterApplied, applyFilter] = useState(false)
  const {eventManager, calendarItemDeletedSaga} = useSelector((state) => state)
  const childRef = useRef()

  useEffect(() => {
    const filterData = []
    // filteredData?.length ? filteredData : data
    const toFilter = data
    const filterCount = Object.keys(filter).reduce((previous, key) => {
      if (key === 'classes' && filter[key] && Object.keys(filter[key]).length)
        return previous + 1
      else if (key != 'classes' && filter[key]) return previous + 1
      else return previous
    }, 0)
    const {classes, applicableTo} = filter
    isFilterApplied &&
      toFilter.forEach((item) => {
        let count = 0
        if (classes && Object.keys(classes).length > 0) {
          let found = 0
          const {node_ids, applicable_to} = item
          if (node_ids.length == 0 && applicable_to != 1) found++
          node_ids.forEach((node) => {
            if (node in classes) found++
          })
          if (found) count++
        }
        if (applicableTo) {
          if (applicableTo == item.applicable_to) count++
        }
        if (count === filterCount) filterData.push(item)
      })
    setFilterData(
      filterData.filter(
        (v, i, a) => a.findIndex((v2) => v2._id === v._id) === i
      )
    )
  }, [isFilterApplied])

  const finalData = isFilterApplied ? filteredData : data

  const {
    instituteHierarchy,
    instituteActiveAcademicSessionId,
    instituteAcademicSessionInfo,
    instituteInfo,
  } = useSelector((state) => state)
  const dispatch = useDispatch()

  const isSchool = useMemo(
    () => instituteInfo.institute_type === INSTITUTE_TYPES.SCHOOL,
    [instituteInfo]
  )

  const handleChange = (fieldName, value) => {
    const data = {...fieldsData}
    data[fieldName] = value
    if (fieldName == 'applicableFor' && value == 1)
      data.classList = data.classList.map((item) => {
        const obj = {...item}
        obj.selected = false
        return obj
      })
    setfieldsData({...data})
  }

  useEffect(() => {
    const classes = getNodesListOfSimilarType(
      instituteHierarchy,
      SHC.NODE_CLASS
    )
    const classesOptions = [
      // {key: '', value: 'Select All', selectAll: true},
      ...classes?.map(({id, name}) => {
        return {key: id, value: name, selected: false}
      }),
    ]
    if (classesOptions?.length > 0) {
      handleChange('classList', classesOptions)
    }
  }, [instituteHierarchy])

  useEffect(() => {
    if (fieldsData?.activeDay) {
      const arr = []
      for (let i = 0; i < 6; i++) {
        const key = i
        const value =
          i == 0
            ? `All Days`
            : `${getOrdinalNum(i)} ${
                options[fieldsData?.activeDay - 1].fullname
              } of the month`
        const selected =
          fieldsData?.frequencyArray?.length && fieldsData?.frequencyArray[i]
            ? fieldsData?.frequencyArray[i].selected
            : false
        arr.push({key, value, selected, selectAll: i === 0})
      }
      handleChange('frequencyArray', arr)
    }
  }, [fieldsData.activeDay])

  useEffect(() => {
    if (calendarItemDeletedSaga.status === true) {
      eventManager.send_event(events.WEEKLY_OFF_DELETED_TFI, {
        weekly_off_id: calendarItemDeletedSaga.id,
      })
      dispatch({
        type: 'calendar_item_deleted_event',
        payload: {status: false, id: false},
      })
    }
  }, [calendarItemDeletedSaga])

  const onSave = () => {
    const activeSession = instituteAcademicSessionInfo.filter(
      (item) => item._id === instituteActiveAcademicSessionId
    )[0]
    const {start_time, end_time} = activeSession
    const {classList, applicableFor, tagType, activeDay, frequencyArray} =
      fieldsData

    const payload = {
      starts_on: start_time ? parseInt(start_time / 1000) : null,
      ends_on: end_time ? parseInt(end_time / 1000) : null,
      event_name: options[activeDay - 1].fullname,
      event_type: TAB_OPTIONS[WEEKLY_OFF].eventType,
      type: TAB_OPTIONS[WEEKLY_OFF].type,
      node_ids: classList
        .filter((item) => {
          if (item.selected) return item.key
        })
        .map((ele) => ele.key),
      applicable_to: applicableFor,
      tag: tagType,
    }
    if (activeRowItem) {
      payload._id = activeRowItem._id
      setShowConfirmPopup(null)
    }
    const starDurationTime = []

    frequencyArray.forEach((item, i) => {
      if (i > 0 && item.selected) {
        const start_duration_time = 7 * i + options[activeDay - 1].value
        starDurationTime.push(start_duration_time * multiplier)
      }
    })
    payload.start_duration_time = starDurationTime
    eventManager.send_event(events.WEEKLY_OFF_SAVE_CLICKED_TFI, {
      type: payload?.tag
        ? payload.tag === 'halfday'
          ? 'half_day'
          : 'full_day'
        : undefined,
      applicableFor:
        applicableForOptions[payload?.applicable_to]?.value === undefined
          ? undefined
          : applicableForOptions[payload?.applicable_to]?.value.toLowerCase(),
      day: payload?.event_name ? payload?.event_name.toLowerCase() : undefined,
    })
    dispatch(createCalendarItem(payload))
    clearSliderFields()
    setSlider(false)
  }

  const parseFrequency = (item) => {
    const count = item?.start_duration_time?.length
    if (count == 5) return `All ${item.event_name}s`
    return (
      item.start_duration_time?.reduce((acc, elem, index) => {
        const calculated = elem / multiplier / 7
        const isSunday = !((elem / multiplier) % 7)
        if (acc)
          return `${acc} ${index + 1 == count ? ' & ' : ', '} ${getOrdinalNum(
            parseInt(isSunday ? calculated - 1 : calculated)
          )}`
        else
          return getOrdinalNum(parseInt(isSunday ? calculated - 1 : calculated))
      }, '') +
      ` ${
        options[
          parseInt((item?.start_duration_time[0] / multiplier) % 7) !== 0
            ? parseInt((item?.start_duration_time[0] / multiplier) % 7) - 1
            : 6
        ]?.fullname
      } of the month`
    )
  }

  const getRowData = (data) => {
    return data.map((item, index) => {
      if (item.event_type === TAB_OPTIONS[WEEKLY_OFF].eventType)
        return {
          key: item._id,
          day: item.event_name,
          starts_on: '',
          ends_on: '',
          frequency: parseFrequency(item),
          type: tagTypeOptions.find((elem) => elem.key == item.tag).value,
          applicableFor:
            item.applicable_to == 3
              ? t('studentsAndTeachers')
              : applicableForOptions[item?.applicable_to]?.value,
          classes: getClassesForRow(
            item.node_ids,
            fieldsData?.classList,
            index,
            item.applicable_to
          ),
          action: (
            <SubjectTooltipOptions
              subjectItem={item}
              options={[
                {
                  label: 'Edit',
                  action: 'edit',
                  permissionId:
                    PERMISSION_CONSTANTS.academicPlannerController_upsert_create,
                },
                {
                  label: 'Delete',
                  action: 'delete',
                  labelStyle: 'tm-cr-rd-1',
                  permissionId:
                    PERMISSION_CONSTANTS.academicPlannerController_deleteRoute_delete,
                },
              ]}
              trigger={
                <img
                  src="https://storage.googleapis.com/tm-assets/icons/secondary/settings-dots-secondary.svg"
                  alt=""
                  className="w-4 h-4"
                  onMouseOver={() => {}}
                />
              }
              handleChange={(action, item) => {
                setActiveRowItem(item)
                if (action == 'delete') {
                  eventManager.send_event(
                    events.DELETE_WEEKLY_OFF_CLICKED_TFI,
                    {
                      type: item?.tag
                        ? item.tag === 'halfday'
                          ? 'half_day'
                          : 'full_day'
                        : undefined,
                      applicableFor:
                        applicableForOptions[item?.applicable_to]?.value ===
                        undefined
                          ? undefined
                          : applicableForOptions[
                              item?.applicable_to
                            ]?.value.toLowerCase(),
                      day: item?.event_name
                        ? item?.event_name.toLowerCase()
                        : undefined,
                    }
                  )
                  setShowConfirmPopup('delete')
                } else if (action == 'edit') {
                  eventManager.send_event(events.EDIT_WEEKLY_OFF_CLICKED_TFI, {
                    type: item?.tag
                      ? item.tag === 'halfday'
                        ? 'half_day'
                        : 'full_day'
                      : undefined,
                    applicableFor:
                      applicableForOptions[item?.applicable_to]?.value ===
                      undefined
                        ? undefined
                        : applicableForOptions[
                            item?.applicable_to
                          ]?.value.toLowerCase(),
                    day: item?.event_name
                      ? item?.event_name.toLowerCase()
                      : undefined,
                  })
                  editRow(item)
                  setSlider(true)
                }
              }}
            />
          ),
        }
      else return {}
    })
  }

  const deleteRow = (item) => {
    dispatch(deleteCalendarItem(item._id))
    setShowConfirmPopup(null)
  }

  const editRow = (item) => {
    const {start_duration_time, node_ids, tag, applicable_to, _id} = item
    // const {activeDay,applicableFor,} = fieldsData
    const frequencyArr = []
    let activeDay
    const days = start_duration_time.map((item) => {
      activeDay = (item / multiplier) % 7
      return parseInt(item / multiplier / 7)
    })
    for (let i = 0; i < 6; i++) {
      const key = i
      const value =
        i == 0
          ? `All Day`
          : `${getOrdinalNum(i)} ${options[activeDay].fullname} of the month`
      let selected
      if (i != 0 && activeDay == 0) {
        selected = days.indexOf(i + 1) !== -1 ? true : false
      } else if (activeDay != 0) {
        selected = days.indexOf(i) !== -1 ? true : false
      }
      frequencyArr.push({
        key,
        value,
        selected,
        selectAll: i === 0,
      })
    }

    setfieldsData({
      activeDay:
        (start_duration_time[0] / multiplier) % 7 != 0
          ? (start_duration_time[0] / multiplier) % 7
          : 7,
      frequencyArray: frequencyArr,
      applicableFor: applicable_to,
      tagType: tag,
      classList: fieldsData?.classList.map((item) => {
        const obj = {...item}
        obj.selected = node_ids.indexOf(obj.key) !== -1 ? true : false
        return obj
      }),
      _id,
    })
    // setShowConfirmPopup(null)
    setSlider(true)
  }

  const clearSliderFields = () => {
    setActiveRowItem({})
    setfieldsData({
      activeDay: null,
      frequencyArray: fieldsData?.frequencyArray.map((item) => {
        const newItem = {...item}
        newItem.selected = false
        return newItem
      }),
      applicableFor: null,
      tagType: null,
      classList: fieldsData?.classList.map((item) => {
        const newItem = {...item}
        newItem.selected = false
        return newItem
      }),
    })
  }

  const getColumns = () => {
    if (!isSchool) {
      return WEEKLY_OFF_COLS.filter((item) => item.key !== 'classes')
    }
    return WEEKLY_OFF_COLS
  }

  return (
    <div>
      {showSlider && (
        <WeeklyOffAddSlider
          clearSliderFields={clearSliderFields}
          setSlider={setSlider}
          options={options}
          fieldsData={fieldsData}
          onSave={onSave}
          handleChange={handleChange}
          onEdit={() => setShowConfirmPopup('edit')}
        />
      )}
      {showConfirmPopup === 'delete' && (
        <ConfirmationPopup
          desc={t('deleteWeeklyOffConfirmantionPopupDesc')}
          icon={<Icon name="error" color="error" size="4xl" />}
          onAction={() => {
            eventManager.send_event(
              events.DELETE_WEEKLY_OFF_POPUP_CLICKED_TFI,
              {action: 'confirm'}
            )
            deleteRow(activeRowItem)
          }}
          onClose={() => {
            eventManager.send_event(
              events.DELETE_WEEKLY_OFF_POPUP_CLICKED_TFI,
              {action: 'cancel'}
            )
            setShowConfirmPopup(null)
          }}
          primaryBtnText="Cancel"
          secondaryBtnStyle="tm-btn2-red"
          secondaryBtnText="Delete"
          title={t('deleteWeeklyOffConfirmantionPopupTitle')}
        />
      )}
      {showConfirmPopup === 'edit' && (
        <ConfirmationPopup
          // desc={`If you edit the ${activeRowItem.event_name} weekly off it will show change data to teachers & students. All the data will be stored till date. You can edit it anytime.`}
          icon={<Icon name="error" color="warning" size="4xl" />}
          onAction={() => onSave()}
          onClose={() => setShowConfirmPopup(null)}
          primaryBtnText="Cancel"
          secondaryBtnStyle="tm-btn2-blue"
          secondaryBtnText="Update"
          title={`Are you sure you want to edit ${activeRowItem.event_name} weekly off?`}
        />
      )}
      {finalData.length || isFilterApplied ? (
        <div className={style.table_container}>
          <div className={style.filterRow}>
            <Filter
              showDateFilter={false}
              filter={filter}
              childRef={childRef}
              setFilter={setFilter}
              applyFilter={applyFilter}
              isFilterApplied={isFilterApplied}
            />

            <div className="flex items-center">
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.academicPlannerController_upsert_create
                }
              >
                <button
                  className="tm-btn2-blue ml-4 w-max"
                  onClick={() => {
                    eventManager.send_event(
                      events.CREATE_WEEKLY_OFF_CLICKED_TFI
                    )
                    setSlider(true)
                  }}
                >
                  {TAB_OPTIONS[WEEKLY_OFF].buttonText}
                </button>
              </Permission>
            </div>
          </div>
          {isFilterApplied && finalData.length == 0 ? (
            <div className={style.no_result}>
              <img
                src="https://storage.googleapis.com/tm-assets/icons/secondary/search-secondary.svg"
                alt=""
              />
              <p>No Results</p>
            </div>
          ) : (
            <Table cols={getColumns()} rows={getRowData(finalData)} />
          )}
        </div>
      ) : (
        <div className="mt-20">
          <EmptyScreenV1
            image={DefaultView}
            title=""
            desc={TAB_OPTIONS[WEEKLY_OFF].emptyStateText}
            btnText={TAB_OPTIONS[WEEKLY_OFF].buttonText}
            handleChange={() => {
              eventManager.send_event(events.CREATE_WEEKLY_OFF_CLICKED_TFI)
              setSlider(true)
            }}
            btnType="primary"
            permissionId={
              PERMISSION_CONSTANTS.academicPlannerController_upsert_create
            }
          />
        </div>
      )}
    </div>
  )
}

export default WeeklyOffs
