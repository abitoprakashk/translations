import filterBlue from '../../../../../assets/images/icons/filterBlue.svg'
import filterWhite from '../../../../../assets/images/icons/filterWhite.svg'
import styles from './StudentProfileFilter.module.css'
import InstituteTree from '../../tfi-common/InstituteTree/InstituteTree'
import {INSTITUTE_HIERARCHY_TYPES} from '../../../fees.constants'
import {useEffect, useState} from 'react'
import {Button} from '@teachmint/common'
import classnames from 'classnames'
import {useTranslation} from 'react-i18next'

export default function StudentProfileFilter({
  filterOptions,
  setFilterOptions,
  handleChange,
}) {
  const {t} = useTranslation()

  const hierarchyTypes = [
    INSTITUTE_HIERARCHY_TYPES.DEPARTMENT,
    INSTITUTE_HIERARCHY_TYPES.STANDARD,
    INSTITUTE_HIERARCHY_TYPES.SECTION,
  ]
  const [showFilter, setShowFilter] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedNodes, setSelectedNodes] = useState({})

  useEffect(() => {
    setFilterOptions({...filterOptions, search: search})
  }, [search])

  return (
    <>
      <div className="tm-border-radius1 mb-3">
        <div className={styles.filterAndSearchBar}>
          <button
            className={classnames(
              showFilter ? 'fill' : 'border',
              styles.addFilter
            )}
            onClick={(e) => {
              e.preventDefault()
              setShowFilter(!showFilter)
            }}
          >
            <img
              src={showFilter ? filterWhite : filterBlue}
              alt={'Add Filters'}
              className={classnames(styles.cstFilterIcon)}
            />
            {t('addFilters')}
          </button>
          <div className={styles.searchContainer}>
            <img
              src="https://storage.googleapis.com/tm-assets/icons/secondary/search-secondary.svg"
              className={styles.searchIcon}
            />
            <input
              type="text"
              value={filterOptions.search}
              // placeholder={DISCOUNT.searchPlaceholder}
              placeholder={t('searchPlaceholder')}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.input}
            />
          </div>
        </div>
      </div>
      {showFilter && (
        <div className={styles.filterSection}>
          <div className={styles.instituteTree}>
            <InstituteTree
              preSelectedNodes={selectedNodes}
              getSelectedNodes={setSelectedNodes}
              hierarchyTypes={hierarchyTypes}
            />
          </div>
          <div className={styles.filterBtns}>
            <Button type={'border'} onClick={() => setShowFilter(false)}>
              {/* {DISCOUNT.btnTextCancel} */}
              {t('cancel')}
            </Button>
            <Button
              type={'fill'}
              onClick={() => {
                setFilterOptions({
                  ...filterOptions,
                  selectedNodes: selectedNodes,
                })
                handleChange('students', [])
                setShowFilter(false)
              }}
            >
              {/* {DISCOUNT.btnTextApplyFilter} */}
              {t('applyFilter')}
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
