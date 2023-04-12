import {Dropdown, SearchBar} from '@teachmint/krayon'
import {t} from 'i18next'
import React from 'react'
import {INSTITUTE_TYPES} from '../../../../constants/institute.constants'
import styles from './TeacherSearchFilterSection.module.css'

export default function TeacherSearchFilterSection({
  instituteType,
  statusOptions,
  classOptions,
  searchText,
  setSearchText,
  searchDropdownValue,
  setSearchDropdownValue,
  filterValueObj,
  setFilterValueObj,
  handleSearchFilter,
}) {
  return (
    <div className={styles.searchFilterWrapper}>
      <div className={styles.searchWrapper}>
        <Dropdown
          fieldName="search"
          options={[
            {label: `${t('searchBy')} ${t('name')}`, value: 'full_name'},
            {
              label: `${t('searchBy')} ${t('employeeIdSm')}`,
              value: 'employee_id',
            },
            {
              label: `${t('searchBy')} ${t('mobileNumber')}`,
              value: 'phone_number',
            },
          ]}
          onChange={({value}) => {
            setSearchText('')
            setSearchDropdownValue(value)
            handleSearchFilter(value, '', filterValueObj)
          }}
          classes={{
            wrapperClass: styles.searchDropdown,
            dropdownClass: styles.mobileDropdown,
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
            }}
            selectedOptions={filterValueObj?.classes || []}
            classes={{wrapperClass: styles.classFilterWrapper}}
            isMultiSelect={true}
            showSelectedItemsInInput={false}
          />
        ) : null}
      </div>
    </div>
  )
}
