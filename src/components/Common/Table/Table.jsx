import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import styles from './Table.module.css'

const Table = ({cols, rows, className, children, ...rest}) => {
  if (children) {
    const headerTds = children[0].props.children.props.children
    const tbodyTrs = children[1].props.children
    const headerJSX = (
      <thead>
        <tr>
          {headerTds.map((tdEl, i) => (
            <td className={styles.headerCell} key={i}>
              {tdEl.props.children}
            </td>
          ))}
        </tr>
        x
      </thead>
    )
    const bodyJSX = (
      <tbody>
        {tbodyTrs.map((trEl, i) => (
          <tr key={i}>
            {trEl.props.children.map((tdEl, k) => (
              <td key={k} className={styles.cell}>
                {tdEl.props.children}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    )

    return (
      <table className={classNames(styles.table, className)} {...rest}>
        {headerJSX}
        {bodyJSX}
      </table>
    )
  }

  // const [selectedRows, setSelectedRows] = useState(
  //   Array(rows.length)
  //     .fill(false)
  //     .reduce((res, e, i) => ({...res, [i]: e}), {})
  // )

  // const selectAll = (e) => {
  //   const newSelectedRows = {}
  //   for (let i = 0; i < rows.length; i += 1) {
  //     newSelectedRows[i] = e.target.checked
  //   }
  //   setSelectedRows(newSelectedRows)
  //   const selectedRowsList = Object.entries(newSelectedRows)
  //     .filter((entry) => entry[1])
  //     .map((entry) => entry[0])
  //   onRowSelect(selectedRowsList)
  // }

  // const selectRow = (e, rowIndex) => {
  //   const newSelectedRows = {...selectedRows, [rowIndex]: e.target.checked}
  //   setSelectedRows(newSelectedRows)
  //   const selectedRowsList = Object.entries(newSelectedRows)
  //     .filter((entry) => entry[1])
  //     .map((entry) => entry[0])
  //   onRowSelect(selectedRowsList)
  // }

  return (
    <table className={classNames(styles.table, className)} {...rest}>
      <thead>
        <tr>
          {cols.map(({key, label}) => (
            <td className={styles.headerCell} key={key}>
              {label}
            </td>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row?.id}>
            {cols.map((col, k) => (
              <td key={k} className={classNames(styles.cell, col.className)}>
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

Table.propTypes = {
  cols: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string,
    })
  ),
  rows: PropTypes.arrayOf(PropTypes.object),
  className: PropTypes.string,
}

Table.defaultProps = {
  cols: [],
  rows: [],
  className: '',
}

export default Table
