import {Dropdown, SearchBar} from '@teachmint/krayon'
import {t} from 'i18next'
import React from 'react'
import {useSelector} from 'react-redux'
import {INSTITUTE_TYPES} from '../../../../constants/institute.constants'
import {events} from '../../../../utils/EventsConstants'
import {statusOptions, genderOptions} from '../../studentManagement.constants'
import styles from './StudentSearchFilterSection.module.css'

export default function StudentSearchFilterSection({
  instituteType,
  classOptions,
  searchText,
  setSearchText,
  searchDropdownValue,
  setSearchDropdownValue,
  filterValueObj,
  setFilterValueObj,
  handleSearchFilter,
}) {
  const eventManager = useSelector((state) => state.eventManager)

  return (
    <div className={styles.searchFilterWrapper}>
      <div className={styles.searchWrapper}>
        <Dropdown
          fieldName="search"
          options={[
            {label: `${t('searchBy')} ${t('name')}`, value: 'full_name'},
            {
              label: `${t('searchBy')} ${t('enrollmentID')}`,
              value: 'enrollment_number',
            },
            {
              label: `${t('searchBy')} ${t('mobileNumber')}`,
              value: 'phone_number',
            },
            {
              label: `${t('searchBy')} ${t('fatherNameImisFieldLabel')}`,
              value: 'father_name',
            },
            {
              label: `${t('searchBy')} ${t('classRollNo')}`,
              value: 'roll_number',
            },
          ]}
          onChange={({value}) => {
            setSearchText('')
            setSearchDropdownValue(value)
            handleSearchFilter(value, '', filterValueObj)
            eventManager.send_event(
              events.SIS_SEARCH_FILTER_TYPE_SELECTED_TFI,
              {type: value}
            )
          }}
          classes={{
            wrapperClass: styles.searchDropdown,
            dropdownClass: styles.mobileDropdown,
            optionsClass: styles.mobileDropdownOptionsClass,
          }}
          selectedOptions={searchDropdownValue}
        />
        <SearchBar
          placeholder={t('search')}
          value={searchText}
          handleChange={({value}) => {
            setSearchText(value)
            handleSearchFilter(searchDropdownValue, value, filterValueObj)
          }}
          classes={{wrapper: styles.searchBar}}
          onFocus={() =>
            eventManager.send_event(events.SIS_SEARCH_BAR_FOCUSSED_TFI)
          }
        />
      </div>
      <div className={styles.filtersWrapper}>
        <Dropdown
          fieldName="status"
          placeholder={t('status')}
          options={Object.values(statusOptions)}
          onChange={({value}) => {
            const filterValueObjNew = {...filterValueObj, status: [...value]}
            setFilterValueObj(filterValueObjNew)
            handleSearchFilter(
              searchDropdownValue,
              searchText,
              filterValueObjNew
            )
            eventManager.send_event(events.SIS_STATUS_FILTER_SELECTED_TFI, {
              filter: value,
            })
          }}
          selectedOptions={filterValueObj?.status || []}
          classes={{wrapperClass: styles.statusFilterWrapper}}
          isMultiSelect={true}
          showSelectedItemsInInput={false}
        />
        {instituteType !== INSTITUTE_TYPES.COLLEGE ? (
          <Dropdown
            fieldName="class"
            placeholder={t('class')}
            options={Object.values(classOptions)}
            onChange={({value}) => {
              const filterValueObjNew = {...filterValueObj, classes: [...value]}
              setFilterValueObj(filterValueObjNew)
              handleSearchFilter(
                searchDropdownValue,
                searchText,
                filterValueObjNew
              )
              eventManager.send_event(events.SIS_CLASS_FILTER_SELECTED_TFI, {
                filter: value,
              })
            }}
            selectedOptions={filterValueObj?.classes || []}
            classes={{wrapperClass: styles.classFilterWrapper}}
            isMultiSelect={true}
            showSelectedItemsInInput={false}
          />
        ) : null}
        <Dropdown
          fieldName="gender"
          placeholder={t('gender')}
          options={Object.values(genderOptions)}
          onChange={({value}) => {
            const filterValueObjNew = {...filterValueObj, gender: [...value]}
            setFilterValueObj(filterValueObjNew)
            handleSearchFilter(
              searchDropdownValue,
              searchText,
              filterValueObjNew
            )
            eventManager.send_event(events.SIS_GENDER_FILTER_SELECTED_TFI, {
              filter: value,
            })
          }}
          selectedOptions={filterValueObj?.gender || []}
          classes={{wrapperClass: styles.genderFilterWrapper}}
          isMultiSelect={true}
          showSelectedItemsInInput={false}
        />
      </div>
    </div>
  )
}
