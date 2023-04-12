import React from 'react'
import styles from './tableHeader.module.css'
import {CONST_HEADER_TYPES} from '../../../../../../constants/inventory.constants'
import classNames from 'classnames'

export default function TableHeaders({headersList}) {
  const maxWidth = Math.floor(100 / (headersList.length + 2))
  return (
    <ul className={styles.headerRowWrapper}>
      {headersList.map((header, i) => {
        return (
          <TableHeaderColumnUI
            key={`${header.id}${i}`}
            {...header}
            width={maxWidth}
          />
        )
      })}
    </ul>
  )
}

function TableHeaderColumnUI(props) {
  switch (props.type) {
    case CONST_HEADER_TYPES.CUSTOM:
      return (
        <li
          key={props.id}
          className={classNames(styles.headerColumn, {
            [props.className]: props.className,
          })}
          style={{minWidth: `${props.width}%`}}
        >
          {props.structure}
        </li>
      )
    case CONST_HEADER_TYPES.NORMAL:
      return (
        <li
          key={props.id}
          className={classNames(styles.headerColumn, {
            [props.className]: props.className,
          })}
          style={{minWidth: `${props.width}%`}}
        >
          {props.title ? props.title : ''}
        </li>
      )
    default:
      return null
  }
}
