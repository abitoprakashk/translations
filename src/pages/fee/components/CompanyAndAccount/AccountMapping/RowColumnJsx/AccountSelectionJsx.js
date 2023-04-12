import React from 'react'
import styles from './RowColumnJsx.module.css'
import {Dropdown, Para} from '@teachmint/krayon'
import classNames from 'classnames'
import {COL_TYPE} from '../../companyAccConstants'

export default function AccountSelectionJsx({
  row,
  accountsList = [],
  handleOnChangeAccount = () => {},
  isEditOrCreateNew,
}) {
  if (
    [COL_TYPE.CLASS, COL_TYPE.SECTION, COL_TYPE.FEE_TYPE].includes(
      row.colType
    ) &&
    !row?.addClassFeeType &&
    !row?.addSection &&
    !row?.addSectionFeeType
  ) {
    if (!isEditOrCreateNew) {
      const accountName = row.account_id
        ? accountsList?.filter((acc) => acc?._id === row.account_id)[0]?.name ||
          ''
        : ''
      return <div className={styles.label}>{accountName}</div>
    } else {
      return (
        <Dropdown
          classes={{
            wrapperClass: styles.dropDownWrapper,
            dropdownClass: classNames({
              [styles.dropdownOptionWidthFitContent]: row.account_id,
            }),
          }}
          fieldName="accountField"
          onChange={(obj) => handleOnChangeAccount(obj, row)}
          options={accountsList.map((item) => {
            return {
              label: (
                <div
                  className={classNames(
                    styles.flexColumn,
                    styles.dropdownOptionEllipsis
                  )}
                  title={item?.name}
                >
                  {item?.name}
                  <Para>
                    <small>{item?.compName}</small>
                  </Para>
                </div>
              ),
              value: item?._id,
            }
          })}
          selectedOptions={row.account_id}
          title=""
        />
      )
    }
  } else {
    return <div></div>
  }
}
