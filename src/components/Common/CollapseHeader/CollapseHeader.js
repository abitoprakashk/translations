import React from 'react'

export default function CollapseHeader({title, collapse, setCollapse}) {
  return (
    <div
      className={`flex items-center justify-between cursor-pointer ${
        collapse ? '' : 'pb-3'
      }`}
      onClick={() => setCollapse(!collapse)}
    >
      <div className="tm-h7">{title}</div>
      <img
        className="w-3 h-3 mt-0.5"
        src={
          collapse
            ? 'https://storage.googleapis.com/tm-assets/icons/primary/right-arrow-primary.svg'
            : 'https://storage.googleapis.com/tm-assets/icons/primary/down-arrow-primary.svg'
        }
        alt="arrow"
      />
    </div>
  )
}
