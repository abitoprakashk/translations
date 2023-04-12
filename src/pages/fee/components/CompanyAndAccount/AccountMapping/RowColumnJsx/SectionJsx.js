import React from 'react'
import styles from './RowColumnJsx.module.css'
import {Button} from '@teachmint/krayon'
import {
  ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES,
  ADD_REMOVE,
  COL_TYPE,
  TRANSLATIONS_CA,
} from '../../companyAccConstants'
import classNames from 'classnames'
import PrefixIcon from '../../helpers'

export default function SectionJsx({
  row,
  selectedBasis = '',
  handleAddRemoveClassSectionFeeType = () => {},
  isEditOrCreateNew,
}) {
  if (row.colType === COL_TYPE.SECTION) {
    const sectionClassName = classNames(
      {
        [styles.selectionAppiled]: row?.addSectionFeeType,
        [styles.selectionNotAppiled]: !row?.addSectionFeeType,
        [styles.selectionAppiledLastChild]: row?.isLastChild,
      },
      styles.higher,
      styles.spaceBetween
    )
    return (
      <div className={sectionClassName}>
        <div className={styles.label}>
          {row?.class?.name} - {row?.name}
        </div>{' '}
        {isEditOrCreateNew &&
          selectedBasis === ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES.ALL && (
            <>
              <div>
                <Button
                  classes={{}}
                  onClick={() =>
                    handleAddRemoveClassSectionFeeType({
                      rowData: row,
                      addRemove: ADD_REMOVE.SECTION_FEE_TYPE,
                    })
                  }
                  type="text"
                  prefixIcon={
                    !row?.addSectionFeeType
                      ? PrefixIcon({
                          styles,
                        })
                      : ''
                  }
                  category={row?.addSectionFeeType ? 'destructive' : 'primary'}
                >
                  {row?.addSectionFeeType
                    ? TRANSLATIONS_CA.removeFeeType
                    : TRANSLATIONS_CA.feeType}
                </Button>
              </div>
            </>
          )}
      </div>
    )
  } else {
    return ''
  }
}
