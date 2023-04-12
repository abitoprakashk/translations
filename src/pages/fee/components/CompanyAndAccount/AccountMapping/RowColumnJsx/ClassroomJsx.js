import React from 'react'
import styles from './RowColumnJsx.module.css'
import {Button, Divider} from '@teachmint/krayon'
import {
  ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES,
  ADD_REMOVE,
  COL_TYPE,
  TRANSLATIONS_CA,
} from '../../companyAccConstants'
import PrefixIcon from '../../helpers'

export default function ClassroomJsx({
  row = {},
  handleAddRemoveClassSectionFeeType = () => {},
  selectedBasis = '',
  isEditOrCreateNew,
}) {
  if (row.colType === COL_TYPE.CLASS) {
    const rowData = {
      label: row?.name,
      className:
        row?.addSection || row?.addClassFeeType
          ? `${styles.selectionAppiled} ${styles.higher}`
          : `${styles.selectionNotAppiled} ${styles.higher}`,
      buttons: {
        section: {
          label: row?.addSection
            ? TRANSLATIONS_CA.removeSection
            : TRANSLATIONS_CA.section,
          onClick: () =>
            handleAddRemoveClassSectionFeeType({
              rowData: row,
              addRemove: ADD_REMOVE.CLASS_SECTION,
            }),
          type: 'text',
          category: row?.addSection ? 'destructive' : 'primary',
          prefixIcon: row?.addSection ? '' : 'mergeType',
          classes: {prefixIcon: styles.rotatePrefixIcon},
          isVisible:
            isEditOrCreateNew &&
            [
              ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES.ALL,
              ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES.CLASS,
            ].includes(selectedBasis),
        },
        feeType: {
          label: row?.addClassFeeType
            ? TRANSLATIONS_CA.removeFeeType
            : TRANSLATIONS_CA.feeType,
          onClick: () =>
            handleAddRemoveClassSectionFeeType({
              rowData: row,
              addRemove: ADD_REMOVE.CLASS_FEE_TYPE,
            }),
          type: 'text',
          category: row?.addClassFeeType ? 'destructive' : 'primary',
          prefixIcon: row?.addClassFeeType ? '' : 'mergeType',
          classes: '',
          isVisible:
            isEditOrCreateNew &&
            !row?.addSection &&
            selectedBasis === ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES.ALL,
        },
      },
      isDividerVisible:
        isEditOrCreateNew &&
        !row?.addSection &&
        [ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES.ALL].includes(selectedBasis),
    }

    const sectionBtnIcon = {}
    const feeTypeBtnIcon = {}
    if (!row?.addSection || !row?.addClassFeeType) {
      const prefixIcon = PrefixIcon({
        styles,
      })
      if (!row?.addSection) {
        sectionBtnIcon.prefixIcon = prefixIcon
      }
      if (!row?.addClassFeeType) {
        feeTypeBtnIcon.prefixIcon = prefixIcon
      }
    }

    return (
      <div className={`${rowData?.className} ${styles.nameAndBtnSection}`}>
        <div className={styles.label}>{rowData?.label}</div>
        <div className={styles.spaceBetween}>
          {rowData?.buttons?.section?.isVisible && (
            <div>
              <Button
                type="text"
                classes={{...rowData?.buttons?.section?.classes}}
                onClick={rowData?.buttons?.section?.onClick}
                category={rowData?.buttons?.section.category}
                {...sectionBtnIcon}
              >
                {rowData?.buttons?.section?.label}
              </Button>
            </div>
          )}
          {rowData?.isDividerVisible && (
            <Divider isVertical length="36px" spacing="10px" thickness="1px" />
          )}

          {rowData?.buttons?.feeType?.isVisible && (
            <div>
              <Button
                type="text"
                classes={rowData?.buttons?.feeType?.classes}
                onClick={rowData?.buttons?.feeType?.onClick}
                category={rowData?.buttons?.feeType.category}
                {...feeTypeBtnIcon}
              >
                {rowData?.buttons?.feeType?.label}
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  } else {
    return ''
  }
}
