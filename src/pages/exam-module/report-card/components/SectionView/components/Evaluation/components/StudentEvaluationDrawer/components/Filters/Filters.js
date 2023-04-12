import React from 'react'
import {ButtonDropdown, Checkbox} from '@teachmint/krayon'
import styles from './Filters.module.css'
import {
  SORT_DATA_TYPE,
  SORT_ORDER,
} from '../../../../../../../../../../../hooks/useSort'
import SearchInput from '../../../../../../../../../../../components/Common/Krayon/SearchInput'
import {events} from '../../../../../../../../../../../utils/EventsConstants'
import classNames from 'classnames'
import {IS_MOBILE} from '../../../../../../../../../../../constants'

const sortOptions = {
  1: {
    id: 1,
    label: 'Name (Ascending, A-Z)',
    key: 'name',
    dataType: SORT_DATA_TYPE.STRING,
    order: SORT_ORDER.AESC,
  },
  2: {
    id: 2,
    label: 'Name (Descending, Z-A)',
    key: 'name',
    dataType: SORT_DATA_TYPE.STRING,
    order: SORT_ORDER.DESC,
  },
  3: {
    id: 3,
    label: 'Roll No. (Ascending, 0-9)',
    key: 'roll_number',
    dataType: SORT_DATA_TYPE.INTEGER,
    order: SORT_ORDER.AESC,
  },
  4: {
    id: 4,
    label: 'Roll No. (Descending, 9-0)',
    key: 'roll_number',
    dataType: SORT_DATA_TYPE.INTEGER,
    order: SORT_ORDER.DESC,
  },
}

const sortOptionsList = Object.values(sortOptions)

const Filters = ({
  query,
  setQuery,
  setActiveSort,
  pending,
  setPending,
  sendFilterEvents,
  evaluationCompleted = false,
}) => {
  return (
    <div className={classNames(styles.wrapper, {[styles.mobile]: IS_MOBILE})}>
      <SearchInput
        placeholder="Search"
        value={query}
        onChange={({value}) => setQuery(value)}
      />
      <ButtonDropdown
        buttonObj={{
          classes: {
            prefixIcon: styles.sortIcon,
            button: styles.btn,
          },
          prefixIcon: 'importExport',
        }}
        handleOptionClick={({value}) => {
          setActiveSort(sortOptions[value])
          sendFilterEvents(
            events.REPORT_CARD_EVALUATION_STUDENT_SORT_FILTER_CLICKED_TFI
          )
        }}
        options={sortOptionsList}
        classes={{
          wrapper: styles.dropdown,
          dropdownContainer: styles.dropdownContainer,
        }}
      />
      {!evaluationCompleted && (
        <Checkbox
          handleChange={({value}) => {
            setPending({value})
            sendFilterEvents(
              events.REPORT_CARD_SHOW_PENDING_EVALUATIONS_CLICKED_TFI
            )
          }}
          label="Show only pending evaluation"
          classes={{wrapper: styles.checkbox}}
          isSelected={pending}
        />
      )}
    </div>
  )
}

export default React.memo(Filters)
