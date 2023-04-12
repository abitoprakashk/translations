import React, {useMemo, useState} from 'react'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import style from '../../YearlyCalendar.module.scss'
import RadioInput from '../../../../components/Common/RadioInput/RadioInput'
import FloatingCardModal from '../../../../components/Common/FloatingCardModal/FloatingCardModal'
import InstituteTree from '../../../fee/components/tfi-common/InstituteTree/InstituteTree'
import DateField from '../../../../components/Common/DateField/DateField'
import cx from 'classnames'
import {
  INSTITUTE_HIERARCHY_TYPES,
  YEARLY_LABELS as LABELS,
} from '../../YearlyCalendar.constants'
import {INSTITUTE_TYPES} from '../../../../constants/institute.constants'
import moment from 'moment'
import {applicableForOptions} from '../../YearlyCalendar.constants'
import s from './CalendarFilter.module.scss'
import {Icon} from '@teachmint/common'
import {Button, BUTTON_CONSTANTS} from '@teachmint/krayon'

const Filter = ({
  childRef,
  filter,
  setFilter,
  applyFilter,
  isFilterApplied,
  showDateFilter = false,
  showTypeFilter = true,
}) => {
  const {instituteInfo} = useSelector((state) => state)
  const isSchool = useMemo(
    () => instituteInfo.institute_type === INSTITUTE_TYPES.SCHOOL,
    [instituteInfo]
  )

  const getSelectedNodes = (nodes) => {
    const classIds = {}
    Object.keys(nodes).map((node) => {
      if (nodes[node].type === INSTITUTE_HIERARCHY_TYPES.STANDARD) {
        classIds[node] = nodes[node].name
      }
    })
    setFilter({...filter, classes: classIds})
  }

  const filterChange = (type, data) => {
    switch (type) {
      case 'classes':
        getSelectedNodes(data)
        break
      case 'applicableTo':
        setFilter({...filter, applicableTo: data})
        break
      case 'startDate':
        setFilter({...filter, startDate: data})
        break
      case 'endDate':
        setFilter({...filter, endDate: data})
        break
      case 'default':
        return
    }
  }
  const clearFilter = () => {
    setFilter({
      classes: [],
      applicableTo: null,
      startDate: null,
      endDate: null,
    })
    applyFilter(false)
  }
  const remove = (key, value) => {
    const obj = {...filter}
    if (key == 'classes') {
      delete obj.classes[value]
      if (Object.keys(obj.classes).length === 0) delete obj.classes
    } else delete obj[key]
    const filterCount = Object.keys(filter).reduce((previous, key) => {
      if (key === 'classes' && filter[key] && Object.keys(filter[key]).length)
        return previous + 1
      else if (key != 'classes' && filter[key]) return previous + 1
      else return previous
    }, 0)

    if (Object.keys(obj).length === 0 || filterCount === 0) {
      setFilter({...obj})
      applyFilter(false)
    } else {
      setFilter({...obj})
      applyFilter(Math.random())
    }
  }
  const showClearAll = () => {
    let showClearAllButton = false
    let filterCount = 0
    Object.keys(filter).forEach((key) => {
      if (typeof filter[key] == 'object' && filter[key] !== null) {
        showClearAllButton = filter[key] && Object.keys(filter[key]).length > 1
        filterCount = Object.keys(filter[key]).length
          ? filterCount++
          : filterCount
      } else if (filter[key] && typeof filter[key] != 'object') {
        filterCount++
      }
    })
    showClearAllButton = showClearAllButton ? true : filterCount > 2
    return showClearAllButton
  }
  return (
    <>
      <div className={style.filterContainer}>
        <div>
          <FilterChips
            isFilterApplied={isFilterApplied}
            filter={filter}
            remove={remove}
            showClearAll={showClearAll}
            clearFilter={clearFilter}
          />
        </div>
        <FloatingCardModal
          ref={childRef}
          wrapperClass={!isSchool ? s.filterBox : null}
          rightAlign
        >
          <div className={style.filters}>
            {isSchool ? (
              <div className={style.class_selection}>
                <label className={style.filter_label}>
                  {LABELS.CLASSES_AND_SECTIONS}
                </label>
                <InstituteTree
                  isVertical={true}
                  // allChecked={allDeptChecked}
                  expandChildNodesDefault={false}
                  expandTill=""
                  preSelectedNodes={filter.classes}
                  getSelectedNodes={(nodes) => filterChange('classes', nodes)}
                  hierarchyTypes={[
                    INSTITUTE_HIERARCHY_TYPES.DEPARTMENT,
                    INSTITUTE_HIERARCHY_TYPES.STANDARD,
                  ]}
                />
              </div>
            ) : null}
            {showTypeFilter && (
              <>
                {instituteInfo.institute_type === INSTITUTE_TYPES.SCHOOL ? (
                  <div className={style.divider}></div>
                ) : null}
                <div>
                  <label className={cx(style.filter_label, style.mb)}>
                    {LABELS.APPLICABLE_FOR}
                  </label>
                  <RadioInput
                    dropdownItems={Object.keys(applicableForOptions).map(
                      (key) => {
                        return applicableForOptions[key]
                      }
                    )}
                    value={filter?.applicableTo}
                    handleChange={(name, value) =>
                      filterChange('applicableTo', value)
                    }
                    fieldName="applicableTo"
                    options={{isVerticalRadio: true}}
                  />
                </div>
              </>
            )}
          </div>
          <div className={style.btn}>
            <button
              onClick={() => {
                applyFilter(filter)
                childRef.current.closeFilter()
              }}
              className="tm-btn3-blue"
            >
              {LABELS.APPLY_FILTER}
            </button>
          </div>
        </FloatingCardModal>
        {showDateFilter && (
          <>
            <DateField
              handleChange={(fieldName, value) => {
                if (!value) {
                  setFilter({...filter, startDate: null, endDate: null})
                  filterChange('startDate', value)
                  applyFilter('')
                  return
                }
                filterChange('startDate', value)
                applyFilter(moment(value).valueOf())
              }}
              value={filter.startDate ? filter.startDate : ''}
              placeholder="DD/MM/YYYY"
            />
            <DateField
              disabled={!filter.startDate}
              handleChange={(fieldname, value) => {
                if (!value) {
                  setFilter({...filter, endDate: null})
                  filterChange('endDate', value)
                  applyFilter('')
                  return
                }
                filterChange('endDate', value)
                applyFilter(moment(value).valueOf())
              }}
              value={filter.endDate ? filter.endDate : ''}
              min={filter.startDate}
              placeholder="DD/MM/YYYY"
            />
          </>
        )}
      </div>
    </>
  )
}

const FilterChips = ({
  isFilterApplied,
  filter,
  remove,
  showClearAll,
  clearFilter,
}) => {
  const [showAllFilters, setShowAllFilters] = useState(false)
  const {t} = useTranslation()

  if (!isFilterApplied) {
    return null
  }

  const numActiveFilterClasses = Object.keys(filter?.classes || {}).length
  const showMoreChipsButton = numActiveFilterClasses > 4

  const toggleShowAllFilters = () => setShowAllFilters((show) => !show)

  return (
    <div className={s.applied_filter_list}>
      {Object.keys(filter).map((key, idx) => {
        const item = filter[key]
        if (key == 'classes' && Object.keys(item).length) {
          return Object.keys(item)
            .slice(0, showAllFilters ? numActiveFilterClasses : 4)
            .map((classKey) => (
              <div key={classKey} onClick={() => remove(key, classKey)}>
                <span>
                  {item[classKey]?.length == 1
                    ? `Class ${item[classKey]}`
                    : item[classKey]}
                </span>
                <Icon
                  name="circledClose"
                  type="outlined"
                  size="xxxs"
                  color="secondary"
                />
              </div>
            ))
        } else if (key == 'applicableTo' && applicableForOptions[item]) {
          return (
            <div
              key={`calenderFilter-${idx}`}
              onClick={() => remove(key, item)}
            >
              <span>{applicableForOptions[item]?.value}</span>
              <Icon
                name="circledClose"
                type="outlined"
                size="xxxs"
                color="secondary"
              />
            </div>
          )
        }
      })}
      {showMoreChipsButton && (
        <Button
          type={BUTTON_CONSTANTS.TYPE.TEXT}
          classes={{label: s.noBorder}}
          onClick={toggleShowAllFilters}
        >
          {showAllFilters
            ? t('showLess')
            : t('numItemsMore', {count: numActiveFilterClasses - 4})}
        </Button>
      )}
      {showClearAll() && (
        <div
          onClick={() => {
            clearFilter()
          }}
          className={s.clear_filter}
        >
          <span>{LABELS.CLEAR_ALL}</span>
          <Icon name="circledClose" type="outlined" size="xxxs" color="error" />
        </div>
      )}
    </div>
  )
}

export default Filter
