import {Button} from '@teachmint/krayon'
import classNames from 'classnames'
import React from 'react'
import {COL_TYPE, GROUPS_KEYS, TRANSLATIONS_CA} from '../../companyAccConstants'
import styles from './RowColumnJsx.module.css'

export default function FeeTypeJsx({
  row = {},
  handleGroupeByBtnClicked = () => {},
  isEditOrCreateNew,
}) {
  const groupBySubType =
    row.colType === COL_TYPE.SECTION && row?.addSectionFeeType
      ? GROUPS_KEYS.GROUPED_BY_SECTION
      : GROUPS_KEYS.GROUPED_BY_CLASS

  const feeTypeClassName = classNames(
    {
      [styles.selectionAppiledLastChild]: row?.isLastChild,
    },
    styles.higher,
    styles.label,
    styles.selectionNotAppiled,
    styles.spaceBetween
  )

  if (row?.colType === COL_TYPE.FEE_TYPE) {
    let name = row?.name
    if (row?.class?.name || row?.section?.name) {
      name = (
        <span>
          {row?.class?.name} {row?.section?.name} - {row?.name}{' '}
        </span>
      )
    }

    return <div className={feeTypeClassName}>{name}</div>
  } else if (
    isEditOrCreateNew &&
    ((row.colType === COL_TYPE.SECTION && row?.addSectionFeeType) ||
      (row.colType === COL_TYPE.CLASS && row?.addClassFeeType))
  ) {
    return (
      <div
        className={`${styles.selectionAppiled} ${styles.higher} ${styles.flexEnd}`}
      >
        <div>
          <Button
            classes={{}}
            onClick={() =>
              handleGroupeByBtnClicked(`feeType:${groupBySubType}`, row)
            }
            prefixIcon="mergeType"
            type="text"
          >
            {TRANSLATIONS_CA.groupFeeTypes}
          </Button>
        </div>
      </div>
    )
  } else {
    return ''
  }
}
