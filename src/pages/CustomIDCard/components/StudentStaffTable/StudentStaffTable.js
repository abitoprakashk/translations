import {
  Button,
  BUTTON_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
  SearchBar,
  Table,
} from '@teachmint/krayon'
import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import {useParams} from 'react-router-dom'
import ClassHeirarchy from '../../../../components/Common/ClassHeirarchy/ClassHeirarchy'
import useInstituteHeirarchy from '../../../AttendanceReport/pages/StudentWiseAttendance/hooks/useInstituteHeirarchy'
import {STUDENT, TABLE_COLS} from '../../CustomId.constants'
import LoadingPercentageButton from '../../../../components/Common/LoadingPercentageButton/LoadingPercentageButton'
import styles from './StudentStaffTable.module.css'
import BulkDownloadModal from '../BulkDownloadModal/BulkDownloadModal'

const StudentStaffTable = ({
  rows,
  filters,
  updateFilter,
  triggerBulkDownload,
  loadingButtonVisible,
}) => {
  const {t} = useTranslation()
  const {userType} = useParams()
  const [showFilterModal, setShowFilter] = useState()
  const [selectedRows, setSelectedRows] = useState([])
  const [isLayoutSelectorOpen, toggleLayoutSelector] = useState('')
  const instituteType = useSelector(
    (store) => store.instituteInfo.institute_type
  )
  const {heirarchy, handleSelection, allselectedSections} =
    useInstituteHeirarchy({
      allSelected: false,
    })

  const onSelectAll = (isSelected) => {
    const selected = []
    if (isSelected) {
      rows.forEach((item) => selected.push(item.id))
    }
    setSelectedRows(selected)
  }

  const onSelectRow = (id, checked) => {
    const newSelectedRows = [...selectedRows]
    if (checked) newSelectedRows.push(id)
    else if (newSelectedRows.indexOf(id) > -1) {
      newSelectedRows.splice(newSelectedRows.indexOf(id), 1)
    }
    setSelectedRows(newSelectedRows)
  }

  return (
    <div>
      <BulkDownloadModal
        isOpen={isLayoutSelectorOpen}
        onClose={() => toggleLayoutSelector(false)}
        triggerBulkDownload={(layoutHtml) => {
          triggerBulkDownload(selectedRows, layoutHtml)
          setSelectedRows([])
        }}
      />
      <div className={styles.filterRow}>
        <SearchBar
          placeholder={t('seachByName')}
          handleChange={({value}) => {
            updateFilter('searchFilter', value)
          }}
          value={filters.searchFilter}
        />
        <div>
          {userType === STUDENT && (
            <>
              <Button
                prefixIcon="filter"
                type={BUTTON_CONSTANTS.TYPE.OUTLINE}
                onClick={() => setShowFilter(true)}
              >
                {t('filters')}
              </Button>
              <Modal
                isOpen={showFilterModal}
                size={MODAL_CONSTANTS.SIZE.MEDIUM}
                onClose={() => setShowFilter(false)}
                header={`${t('filter')}: ${t('classSection')}`}
                classes={{
                  modal: styles.modal,
                  content: styles.modalContent,
                  footer: styles.modalFooter,
                }}
                actionButtons={[
                  {
                    body: t('close'),
                    onClick: () => setShowFilter(false),
                    type: 'outline',
                  },
                  {
                    body: t('apply'),
                    onClick: () => {
                      updateFilter('checkboxFilter', allselectedSections)
                      setShowFilter(false)
                    },
                  },
                ]}
              >
                <ClassHeirarchy
                  heirarchy={heirarchy?.department}
                  handleSelection={handleSelection}
                />
              </Modal>
            </>
          )}

          {loadingButtonVisible ? (
            <LoadingPercentageButton small />
          ) : (
            <Button
              prefixIcon="download"
              prefixIconVersion={BUTTON_CONSTANTS.ICON_VERSION.FILLED}
              classes={{prefixIcon: styles.downloadIcon}}
              onClick={() => {
                // triggerBulkDownload(selectedRows)
                toggleLayoutSelector(!isLayoutSelectorOpen)
              }}
              isDisabled={selectedRows.length < 2}
            >
              {t('download')}
            </Button>
          )}
        </div>
      </div>
      <div className={styles.tableContainer}>
        <Table
          virtualized
          cols={TABLE_COLS[userType](instituteType)}
          rows={rows}
          isSelectable={true}
          onSelectAll={onSelectAll}
          onSelectRow={onSelectRow}
          selectedRows={selectedRows}
          autoSize
          classes={{
            table: styles.table,
          }}
        />
      </div>
    </div>
  )
}

export default StudentStaffTable
