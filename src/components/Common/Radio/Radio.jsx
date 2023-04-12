import React from 'react'

export default function Radio({options, selectedId, handleChange}) {
  return (
    <div className="flex rounded-sm tm-bgcr-gy-3 w-fit p-0.5">
      {options.map(({id, label}) => (
        <div
          key={id}
          onClick={() => handleChange(id)}
          className={`py-1 px-2 rounded-sm cursor-pointer ${
            selectedId === id
              ? ' tm-hdg-12 bg-white tm-cr-bl-2'
              : 'tm-para tm-para-12'
          }`}
        >
          {label}
        </div>
      ))}
    </div>
  )
}
