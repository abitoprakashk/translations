import {useState, useEffect} from 'react'
import styles from './StaffSelection.module.css'
import {t} from 'i18next'
import {
  Para,
  PARA_CONSTANTS,
  Avatar,
  SearchBar,
  Table,
  BADGES_CONSTANTS,
  Badges,
  Checkbox,
} from '@teachmint/krayon'
import classNames from 'classnames'
import {searchBoxFilter} from '../../../../../utils/Helpers'

export default function StaffSelection({
  show,
  data,
  onChange,
  filterOnProperty,
  preSelectedRows,
  staffType,
  isSelectable,
  hideTableHeader,
  searchPlaceholder,
}) {
  const [searchText, setSearchText] = useState('')
  const [filteredList, setFilteredList] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [isSelectAll, setIsSelectAll] = useState(false)

  useEffect(() => {
    if (preSelectedRows) {
      setSelectedRows([...preSelectedRows])
    }
  }, [preSelectedRows])

  useEffect(() => {
    const updatedData = searchBoxFilter(searchText, data, [filterOnProperty])
    setFilteredList(updatedData)
  }, [searchText, data])

  useEffect(() => {
    const enabledRowIds = getEnabledRowsIds(filteredList)
    setIsSelectAll(
      enabledRowIds.length > 0 && selectedRows.length === enabledRowIds.length
    )
  }, [selectedRows])

  const isRowDisabled = (rowId) => {
    return Boolean(data.some((item) => item._id === rowId && item.isDisabled))
  }

  const getEnabledRowsIds = (rows) => {
    return rows?.filter((row) => !row.isDisabled).map((row) => row._id)
  }

  const onSelectRow = (rowId, checked) => {
    if (isRowDisabled(rowId)) return
    const rows = checked
      ? Array.from(new Set([...selectedRows, rowId]))
      : selectedRows.filter((id) => id !== rowId)
    setSelectedRows(rows)
    onChange(rows)
  }
  const onSelectAll = ({value}) => {
    const rows = value ? getEnabledRowsIds(filteredList) : []
    setIsSelectAll(value)
    setSelectedRows(rows)
    onChange(rows)
  }

  return show ? (
    <div className={classNames(styles.container)}>
      <SearchBar
        value={searchText}
        placeholder={searchPlaceholder || t('search')}
        handleChange={({value}) => setSearchText(value)}
        classes={{
          wrapper: styles.searchBarWrapper,
        }}
      />
      <div
        className={classNames(
          styles.tableContainer,
          'krayon-show-scrollbar-small krayon-show-scrollbar',
          {
            [styles.onlyTableRows]: hideTableHeader,
          }
        )}
      >
        {isSelectable && (
          <div className={styles.colHeader}>
            <Checkbox
              classes={{label: styles.checkboxLabel}}
              isSelected={isSelectAll}
              key={'selectAll'}
              fieldName={'selectAll'}
              handleChange={onSelectAll}
              label={`${selectedRows.length} / ${data.length} ${t(
                staffType
              )} ${t('selected')}`}
            />
          </div>
        )}
        <Table
          cols={[{key: 'body', label: 'body'}]}
          rows={filteredList?.map((item) => {
            return {
              _id: item._id,
              body: (
                <div
                  key={item._id}
                  className={classNames(
                    styles.listRow,
                    item.isDisabled ? styles.disabledRow : ''
                  )}
                >
                  <Avatar imgSrc={item?.img_url} size="m" name={item?.name} />
                  <div className={styles.staffName}>
                    <Para
                      type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                      textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
                    >
                      {item?.name}
                    </Para>
                    <Para
                      type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}
                      textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                    >
                      {item?.phone_number}
                    </Para>
                  </div>
                  {item?.badgeLabel && (
                    <Badges
                      label={item?.badgeLabel}
                      size={BADGES_CONSTANTS.SIZE.SMALL}
                      type={BADGES_CONSTANTS.TYPE.BASIC}
                      showIcon={false}
                      className={styles.staffBadge}
                    />
                  )}
                </div>
              ),
            }
          })}
          uniqueKey={'_id'}
          classes={{
            table: styles.tableStyle,
          }}
          onSelectRow={onSelectRow}
          selectedRows={selectedRows}
          isSelectable={isSelectable}
          hideTableHeader={hideTableHeader}
          onSelectAll={() => {}} //overriding Table component's selectAll
        />
      </div>
    </div>
  ) : null
}
