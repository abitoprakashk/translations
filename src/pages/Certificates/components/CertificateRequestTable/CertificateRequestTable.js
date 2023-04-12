import React from 'react' //{useState}
// import {Icon} from '@teachmint/common'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import styles from './CertificateRequestTable.module.css'

// const Accordion = ({openByDefault = true, title, children, cols}) => {
//   const [open, setOpen] = useState(openByDefault)

//   return (
//     <>
//       <tr className={styles.accordion_row} onClick={() => setOpen(!open)}>
//         {cols.map((item, index) => {
//           if (index == 0) return <td className={styles.cell}> {title} </td>
//           else if (index == cols.length - 1)
//             return (
//               <td className={styles.cell}>
//                 <div className={styles.down_arrow}>
//                   <Icon name={'downArrow'} size="" />
//                 </div>
//               </td>
//             )
//           else return <td className={styles.cell}></td>
//         })}
//       </tr>
//       {open && <>{children}</>}
//     </>
//   )
// }

function CertificateRequestTable(props) {
  const {
    cols,
    rows,
    // uniqueKey,
    className,
    // children,
    hideTableHeader,
    selectable,
    onSelectAll,
    selectedRows,
    ...rest
  } = props
  const selectAll = (e) => {
    onSelectAll(e.target.checked)
  }

  return (
    <table className={classNames(styles.table, className)} {...rest}>
      <thead
        className={classNames({
          [styles.hidden]: hideTableHeader,
        })}
      >
        <tr>
          {selectable && (
            <td className={styles.headerCell}>
              <input
                type="checkbox"
                onChange={selectAll}
                checked={rows.length > 0 && selectedRows.size === rows.length}
              />
            </td>
          )}
          {cols.map((col, i) => (
            <td
              className={classNames(
                styles.headerCell,
                i === 0 ? styles.stickHeadData : ''
              )}
              key={col.label || col.key}
            >
              {col.label || col.key}
            </td>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.keys(rows).map((key) => {
          return (
            <>
              {rows[key].map((item) => {
                return (
                  <tr key={item._id}>
                    {cols.map((col, k) => (
                      <td
                        key={col.key}
                        className={classNames(
                          styles.cell,
                          col.className,
                          k === 0 ? styles.stickData : ''
                        )}
                      >
                        {item[col.key]}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </>
          )
        })}
      </tbody>
    </table>
  )
}

CertificateRequestTable.propTypes = {
  cols: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string,
    })
  ),
  rows: PropTypes.object,
  className: PropTypes.string,
  hideTableHeader: PropTypes.bool,
  // selectedRows: PropTypes. //TODO find proptype for a shape
  children: PropTypes.element,
  virtualized: PropTypes.bool,
}

CertificateRequestTable.defaultProps = {
  cols: [],
  rows: {},
  className: '',
  hideTableHeader: false,
  children: null,
}

export default CertificateRequestTable
