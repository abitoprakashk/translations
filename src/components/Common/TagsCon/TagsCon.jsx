import React from 'react'

export default function TagsCon({items}) {
  return (
    <div className="flex flex-row mt-2 flex-wrap">
      {items?.map((item) => (
        <div className="tm-subject-tag mr-2 mb-2" key={item}>
          {item}
        </div>
      ))}
    </div>
  )
}
