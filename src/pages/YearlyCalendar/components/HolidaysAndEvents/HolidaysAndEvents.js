import React, {useRef, useMemo} from 'react'
import {useState} from 'react'
import EmptyScreenV1 from '../../../../components/Common/EmptyScreenV1/EmptyScreenV1'
import DefaultViewHolidays from './default_view_holidays.svg'
import DefaultViewEvents from './default_view_events.png'
import {Table} from '@teachmint/common'
import moment from 'moment'
import AddEventHolidaySlider from './AddEventHolidaySlider'
import {
  TAB_OPTIONS,
  applicableForOptions,
  HOLIDAY_EVENT_OFF_COLS,
  HOLIDAY,
} from '../../YearlyCalendar.constants'
import {INSTITUTE_TYPES} from '../../../../constants/institute.constants'
import {useEffect} from 'react'
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
import Banner from '../Banner/Banner'
import ConfirmationPopup from '../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import {getClassesForRow} from '../../commonFunctions'
import Filter from '../CalendarFilter/CalendarFilter'
import {Icon} from '@teachmint/common'
import {t} from 'i18next'
import {events} from '../../../../utils/EventsConstants'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import Permission from '../../../../components/Common/Permission/Permission'

const WeeklyOffs = ({data = [], header, primaryFieldLabel, event}) => {
  const [showSlider, setSlider] = useState(
    window?.location?.search?.toString().split('=')[1] ? true : false
  )
  const [showConfirmPopup, setShowConfirmPopup] = useState(null)
  const [activeRowItem, setActiveRowItem] = useState({})
  const {instituteHierarchy} = useSelector((state) => state)
  const [filteredData, setFilterData] = useState([])
  const [upcomingOffData, setUpcomingOff] = useState({})
  const [filter, setFilter] = useState({
    classes: [],
    applicableTo: null,
    startDate: null,
    endDate: null,
  })
  const [isFilterApplied, applyFilter] = useState(false)
  const [fieldsData, updateFieldsData] = useState({
    eventName: '',
    startDate: null,
    endDate: null,
    applicableFor: null,
    classes: [],
  })
  const {eventManager, calendarItemDeletedSaga, instituteInfo} = useSelector(
    (state) => state
  )
  const dispatch = useDispatch()
  const childRef = useRef()

  const isSchool = useMemo(
    () => instituteInfo.institute_type === INSTITUTE_TYPES.SCHOOL,
    [instituteInfo]
  )

  useEffect(() => {
    let arr = [...data]
    arr.sort((a, b) => {
      if (a.starts_on < b.starts_on) return -1
      else if (a.starts_on > b.starts_on < 0) return 1
      return 0
    })
    let nearestHoliday = {}
    arr.forEach((item) => {
      if (
        Object.keys(nearestHoliday).length == 0 &&
        (item.starts_on === moment().startOf('day').valueOf() / 1000 ||
          item.starts_on > moment().startOf('day').valueOf() / 1000)
      )
        nearestHoliday = item
    })
    setUpcomingOff(nearestHoliday)
  }, [data])

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
    const {classes, applicableTo, startDate, endDate} = filter
    isFilterApplied &&
      filterCount &&
      toFilter.forEach((item) => {
        let count = 0
        if (classes && Object.keys(classes).length > 0) {
          let found = 0
          const {node_ids, applicableTo} = item
          if (node_ids.length == 0 && applicableTo != 1) found++
          node_ids.forEach((node) => {
            if (node in classes) found++
          })
          if (found) count++
        }
        if (applicableTo) {
          if (applicableTo == item.applicable_to) count++
        }
        if (startDate) {
          if (item.starts_on >= parseInt(moment(startDate).valueOf() / 1000))
            count++
        }
        if (endDate) {
          if (
            item.ends_on &&
            item.ends_on <= parseInt(moment(endDate).valueOf() / 1000) &&
            item.starts_on >= parseInt(moment(startDate).valueOf() / 1000)
          )
            count++
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
    // console.log(classesOptions)
    if (classesOptions?.length > 0) {
      const data = {...fieldsData}
      data.classes = classesOptions
      updateFieldsData(data)
    }
  }, [])

  useEffect(() => {
    if (calendarItemDeletedSaga.status === true) {
      if (event === HOLIDAY) {
        eventManager.send_event(events.HOLIDAY_CALENDAR_DELETED_TFI, {
          holiday_id: calendarItemDeletedSaga.id,
        })
      } else {
        eventManager.send_event(events.EVENT_AND_ACTIVITY_DELETED_TFI, {
          event_id: calendarItemDeletedSaga.id,
        })
      }
      dispatch({
        type: 'calendar_item_deleted_event',
        payload: {status: false, id: false},
      })
    }
  }, [calendarItemDeletedSaga])

  const onSave = () => {
    const payload = {
      event_name: fieldsData?.eventName,
      event_type: TAB_OPTIONS[event].eventType,
      type: TAB_OPTIONS[event].type,
      starts_on: moment(fieldsData?.startDate).valueOf() / 1000,
      ends_on: fieldsData?.endDate
        ? moment(fieldsData?.endDate).valueOf() / 1000
        : moment(fieldsData?.startDate).valueOf() / 1000,
      node_ids: fieldsData?.classes
        .filter((item) => {
          if (item.selected) return item
        })
        .map((ele) => ele.key),
      applicable_to: fieldsData?.applicableFor,
    }
    if (fieldsData?._id) {
      payload._id = fieldsData._id
      setActiveRowItem({})
      setShowConfirmPopup(null)
    }

    eventManager.send_event(
      event === HOLIDAY
        ? events.HOLIDAY_SAVE_CLICKED_TFI
        : events.EVENT_AND_ACTIVITY_SAVE_CLICKED_TFI,
      {
        event_name: payload?.event_name,
        applicable:
          applicableForOptions[payload?.applicable_to]?.value === undefined
            ? undefined
            : applicableForOptions[payload?.applicable_to]?.value.toLowerCase(),
        start_date: payload?.starts_on,
        end_date: payload?.ends_on,
      }
    )
    dispatch(createCalendarItem(payload))
    closeSlider()
    setActiveRowItem({})
    setShowConfirmPopup(null)
  }

  const getRowData = (data) => {
    return data.map((item, index) => {
      return {
        key: item._id,
        day: (
          <p title={item?.event_name} className={style.event_name}>
            {item?.event_name?.length > 30
              ? item.event_name.substring(0, 30) + '...'
              : item.event_name}
          </p>
        ),
        applicableFor:
          item.applicable_to == 3
            ? t('studentsAndTeachers')
            : applicableForOptions[item?.applicable_to]?.value,
        frequency:
          item.ends_on == item.starts_on
            ? `${moment(item.starts_on * 1000).format('DD MMM YYYY')}`
            : item.ends_on
            ? `${moment(item.starts_on * 1000).format('DD MMM')} - ${moment(
                item.ends_on * 1000
              ).format('DD MMM')}`
            : `${moment(item.starts_on * 1000).format('DD MMM YYYY')}`,
        classes: getClassesForRow(
          item.node_ids,
          fieldsData.classes,
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
                  event === HOLIDAY
                    ? events.DELETE_HOLIDAY_CLICKED_TFI
                    : events.DELETE_EVENT_AND_ACTIVITY_CLICKED_TFI,
                  {
                    event_name: item?.event_name,
                    applicable:
                      applicableForOptions[item?.applicable_to]?.value ===
                      undefined
                        ? undefined
                        : applicableForOptions[
                            item?.applicable_to
                          ]?.value.toLowerCase(),
                    start_date: item?.starts_on,
                    end_date: item?.ends_on,
                  }
                )
                setShowConfirmPopup('delete')
              } else if (action == 'edit') {
                eventManager.send_event(
                  event === HOLIDAY
                    ? events.EDIT_HOLIDAY_CLICKED_TFI
                    : events.EDIT_EVENT_AND_ACTIVITY_CLICKED_TFI,
                  {
                    event_name: item?.event_name,
                    applicable:
                      applicableForOptions[item?.applicable_to]?.value ===
                      undefined
                        ? undefined
                        : applicableForOptions[
                            item?.applicable_to
                          ]?.value.toLowerCase(),
                    start_date: item?.starts_on,
                    end_date: item?.ends_on,
                  }
                )
                // setShowConfirmPopup('edit')
                editRow(item)
              }
            }}
          />
        ),
      }
    })
  }

  const deleteRow = (item) => {
    dispatch(deleteCalendarItem(item._id))
    setShowConfirmPopup(null)
    setActiveRowItem({})
  }

  const editRow = (item) => {
    const {starts_on, ends_on, event_name, node_ids, applicable_to, _id} = item
    const data = {...fieldsData}
    data.startDate = new Date(Number(starts_on) * 1000)
    if (ends_on) data.endDate = new Date(Number(ends_on) * 1000)
    else data.endDate = null
    data.eventName = event_name
    data.applicableFor = applicable_to
    data.classes = fieldsData.classes.map((item) => {
      const obj = {...item}
      obj.selected = node_ids.indexOf(obj.key) !== -1 ? true : false
      return obj
    })
    data._id = _id
    updateFieldsData(data)
    setSlider(true)
  }

  const onChange = (fieldName, value) => {
    const data = {...fieldsData}
    data[fieldName] = value
    if (fieldName == 'startDate') data['endDate'] = ''
    if (fieldName == 'applicableFor' && value == 1)
      data.classes = data.classes.map((item) => {
        const obj = {...item}
        obj.selected = false
        return obj
      })
    updateFieldsData({...data})
  }

  const closeSlider = () => {
    updateFieldsData({
      eventName: '',
      startDate: null,
      endDate: null,
      applicableFor: null,
      classes: fieldsData?.classes.map((item) => {
        const newItem = {...item}
        newItem.selected = false
        return newItem
      }),
    })
    setActiveRowItem({})
    setSlider(false)
  }

  const getColumns = () => {
    if (!isSchool) {
      return HOLIDAY_EVENT_OFF_COLS.filter((item) => item.key !== 'classes')
    }
    return HOLIDAY_EVENT_OFF_COLS
  }

  return (
    <div>
      {showConfirmPopup === 'delete' && (
        <ConfirmationPopup
          desc="If you delete this, it will be removed from the calander and will not be visible to student and teachers."
          icon={<Icon name="error" color="error" size="4xl" />}
          onAction={() => {
            eventManager.send_event(
              event === HOLIDAY
                ? events.DELETE_HOLIDAY_POPUP_CLICKED_TFI
                : events.DELETE_EVENT_AND_ACTIVITY_POPUP_CLICKED_TFI,
              {action: 'confirm'}
            )
            deleteRow(activeRowItem)
          }}
          onClose={() => {
            eventManager.send_event(
              event === HOLIDAY
                ? events.DELETE_HOLIDAY_POPUP_CLICKED_TFI
                : events.DELETE_EVENT_AND_ACTIVITY_POPUP_CLICKED_TFI,
              {action: 'cancel'}
            )
            setShowConfirmPopup(null)
          }}
          primaryBtnText="Cancel"
          secondaryBtnStyle="tm-btn2-red"
          secondaryBtnText="Delete"
          title="Are you sure you want to delete?"
        />
      )}
      {showConfirmPopup === 'edit' && (
        <ConfirmationPopup
          icon={<Icon name="error" color="warning" size="4xl" />}
          onAction={() => onSave()}
          onClose={() => setShowConfirmPopup(null)}
          primaryBtnText="Cancel"
          secondaryBtnStyle="tm-btn2-blue"
          secondaryBtnText="Update"
          title={`Are you sure you want to Update  ${
            activeRowItem?.event_name?.length > 30
              ? `${activeRowItem.event_name.substring(0, 15)}...`
              : activeRowItem?.event_name
          }?`}
        />
      )}
      {showSlider && (
        <AddEventHolidaySlider
          setSlider={closeSlider}
          header={header}
          onChange={onChange}
          primaryFieldLabel={primaryFieldLabel}
          fieldsData={fieldsData}
          applicableForOptions={applicableForOptions}
          onSave={onSave}
          onEdit={() => setShowConfirmPopup('edit')}
          eventType={event}
        />
      )}
      {finalData.length || isFilterApplied ? (
        <div>
          {upcomingOffData?.starts_on && (
            <Banner
              type={TAB_OPTIONS[event].header}
              eventName={upcomingOffData?.event_name}
              theme={event == HOLIDAY ? 'dark' : 'light'}
              date={
                upcomingOffData?.ends_on != upcomingOffData?.starts_on
                  ? `${moment(upcomingOffData?.starts_on * 1000).format(
                      'dddd'
                    )}, ${moment(upcomingOffData.starts_on * 1000).format(
                      'DD MMM'
                    )} - ${moment(upcomingOffData.ends_on * 1000).format(
                      'DD MMM'
                    )}`
                  : `${moment(upcomingOffData?.starts_on * 1000).format(
                      'dddd'
                    )}, ${moment(upcomingOffData.starts_on * 1000).format(
                      'DD MMM YYYY'
                    )}`
              }
            />
          )}
          <div className={style.filterRow}>
            <Filter
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
                      event === HOLIDAY
                        ? events.CREATE_HOLIDAY_CLICKED_TFI
                        : events.CREATE_EVENT_AND_ACTIVITY_CLICKED_TFI
                    )
                    setSlider(true)
                  }}
                >
                  {TAB_OPTIONS[event].buttonText}
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
            <div className={style.table_container}>
              <Table cols={getColumns()} rows={getRowData(finalData)} />
            </div>
          )}
        </div>
      ) : (
        <div className="mt-20">
          <EmptyScreenV1
            image={event === HOLIDAY ? DefaultViewHolidays : DefaultViewEvents}
            title=""
            desc={TAB_OPTIONS[event].emptyStateText}
            btnText={TAB_OPTIONS[event].buttonText}
            handleChange={() => {
              eventManager.send_event(
                event === HOLIDAY
                  ? events.CREATE_HOLIDAY_CLICKED_TFI
                  : events.CREATE_EVENT_AND_ACTIVITY_CLICKED_TFI
              )
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
