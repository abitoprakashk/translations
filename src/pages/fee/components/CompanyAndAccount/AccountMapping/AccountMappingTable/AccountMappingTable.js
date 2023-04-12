import {Button, Table} from '@teachmint/krayon'
import styles from './AccountMappingTable.module.css'
import rowColumnJsxStyles from '../RowColumnJsx/RowColumnJsx.module.css'
import React, {useMemo} from 'react'
import {
  ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES,
  ACCOUNT_MAPPING_TABLE_COLS,
  ACCOUNT_MAPPING_TABLE_COLS_KEYS,
  TRANSLATIONS_CA,
} from '../../companyAccConstants'
import ClassroomJsx from '../RowColumnJsx/ClassroomJsx'
import FeeTypeJsx from '../RowColumnJsx/FeeTypeJsx'
import SectionJsx from '../RowColumnJsx/SectionJsx'
import AccountSelectionJsx from '../RowColumnJsx/AccountSelectionJsx'

export default function AccountMappingTable({
  myData = [],
  selectedBasis = '',
  handleGroupeByBtnClicked = () => {},
  handleFeeTypeSelectionEdit = () => {},
  handleOnChangeAccount = () => {},
  handleAddRemoveClassSectionFeeType = () => {},
  accountsList = [],
  appliedFilter = [],
  isEditOrCreateNew,
}) {
  const rowData = useMemo(() => {
    if (!myData && myData.length === 0) return
    let flatFilterIds = Object.values(appliedFilter)?.flat()
    return myData
      .filter((row) => {
        return flatFilterIds.length > 0
          ? row.id.split(',').some((item) => flatFilterIds.includes(item)) ||
              flatFilterIds.includes(row.account_id)
          : true
      })
      .map((row) => {
        return {
          id: row?.id,
          [ACCOUNT_MAPPING_TABLE_COLS_KEYS.CLASS]:
            selectedBasis !== ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES.FEE_TYPE ? (
              <ClassroomJsx
                row={row}
                handleAddRemoveClassSectionFeeType={
                  handleAddRemoveClassSectionFeeType
                }
                selectedBasis={selectedBasis}
                isEditOrCreateNew={isEditOrCreateNew}
              />
            ) : (
              ''
            ),
          [ACCOUNT_MAPPING_TABLE_COLS_KEYS.SECTION]:
            selectedBasis !== ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES.FEE_TYPE ? (
              <SectionJsx
                handleAddRemoveClassSectionFeeType={
                  handleAddRemoveClassSectionFeeType
                }
                row={row}
                selectedBasis={selectedBasis}
                isEditOrCreateNew={isEditOrCreateNew}
              />
            ) : (
              ''
            ),
          [ACCOUNT_MAPPING_TABLE_COLS_KEYS.FEE_TYPE]: (
            <FeeTypeJsx
              row={row}
              handleGroupeByBtnClicked={handleGroupeByBtnClicked}
              selectedBasis={selectedBasis}
              isEditOrCreateNew={isEditOrCreateNew}
            />
          ),
          [ACCOUNT_MAPPING_TABLE_COLS_KEYS.ACCOUNT]: (
            <AccountSelectionJsx
              row={row}
              handleOnChangeAccount={handleOnChangeAccount}
              accountsList={accountsList}
              selectedBasis={selectedBasis}
              isEditOrCreateNew={isEditOrCreateNew}
            />
          ),
        }
      })
  }, [myData, appliedFilter])

  const cols = useMemo(() => {
    if (!myData) return
    let isAdded = myData.filter(
      (item) =>
        item?.addClassFeeType || item?.addSection || item?.addSectionFeeType
    )
    let sectionAdded =
      isAdded.length > 0
        ? myData.filter((item) => item?.addSection).length > 0
        : false
    let feeTypeAdded =
      isAdded.length > 0
        ? myData.filter(
            (item) => item?.addSectionFeeType || item?.addClassFeeType
          ).length > 0
        : false

    let cols = ACCOUNT_MAPPING_TABLE_COLS.map((item) => {
      if (item.key === ACCOUNT_MAPPING_TABLE_COLS_KEYS.CLASS) {
        return {
          ...item,
          label: (
            <div className={styles.headJsxSection}>
              <div className={styles.headJsxSectionLabel}>{item?.label}</div>
              <div>
                {isEditOrCreateNew && (
                  <Button
                    classes={{}}
                    onClick={() =>
                      handleGroupeByBtnClicked(
                        ACCOUNT_MAPPING_TABLE_COLS_KEYS.CLASS
                      )
                    }
                    prefixIcon="mergeType"
                    type="text"
                  >
                    {TRANSLATIONS_CA.groupClasses}
                  </Button>
                )}
              </div>
            </div>
          ),
        }
      } else if (item.key === ACCOUNT_MAPPING_TABLE_COLS_KEYS.FEE_TYPE) {
        return {
          ...item,
          label: (
            <div className={styles.headJsxSection}>
              <div className={styles.flexStart}>
                <div className={styles.headJsxSectionLabel}>{item?.label}</div>
                {isEditOrCreateNew && (
                  <Button
                    classes={{}}
                    onClick={handleFeeTypeSelectionEdit}
                    type={'text'}
                    prefixIcon="edit2"
                    size={'s'}
                  ></Button>
                )}
              </div>
              {isEditOrCreateNew &&
                [ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES.FEE_TYPE].includes(
                  selectedBasis
                ) && (
                  <div>
                    <Button
                      classes={{}}
                      onClick={() =>
                        handleGroupeByBtnClicked('feeType:groupedByFeeType')
                      }
                      prefixIcon="mergeType"
                      type="text"
                    >
                      {TRANSLATIONS_CA.groupFeeTypes}
                    </Button>
                  </div>
                )}
            </div>
          ),
        }
      }
      return item
    }).filter((item) => {
      if (
        [ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES.CLASS].includes(selectedBasis)
      ) {
        return item.key !== ACCOUNT_MAPPING_TABLE_COLS_KEYS.FEE_TYPE
      } else if (
        [ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES.FEE_TYPE].includes(selectedBasis)
      ) {
        return (
          item.key !== ACCOUNT_MAPPING_TABLE_COLS_KEYS.CLASS &&
          item.key !== ACCOUNT_MAPPING_TABLE_COLS_KEYS.SECTION
        )
      } else if (
        [ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES.ALL].includes(selectedBasis)
      ) {
        return true
      } else {
        return true
      }
    })
    if (
      ![ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES.FEE_TYPE].includes(selectedBasis)
    ) {
      cols = cols
        .filter((item) =>
          !sectionAdded
            ? item.key !== ACCOUNT_MAPPING_TABLE_COLS_KEYS.SECTION
            : true
        )
        .filter((item) =>
          !feeTypeAdded
            ? item.key !== ACCOUNT_MAPPING_TABLE_COLS_KEYS.FEE_TYPE
            : true
        )
    }
    return cols
  }, [myData, isEditOrCreateNew])
  return (
    <div className={styles.tableSection}>
      <Table
        uniqueKey={'rowUuid'}
        rows={rowData}
        cols={cols}
        classes={{table: rowColumnJsxStyles.rowColumnJsx}}
      />
    </div>
  )
}
