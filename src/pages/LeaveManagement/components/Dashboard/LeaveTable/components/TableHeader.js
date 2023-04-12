import React from 'react'

function TableHeader({colStyles, tableheader}) {
  return (
    <>
      {tableheader.map((item, index) => (
        <div style={colStyles[index]} key={item.title}>
          {item.title}
        </div>
      ))}
    </>
  )
}

export default TableHeader
