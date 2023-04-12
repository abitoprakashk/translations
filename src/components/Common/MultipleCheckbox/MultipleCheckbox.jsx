import React from 'react'

export default function MultipleCheckbox({items, handleChange}) {
  return (
    <div className="bg-white tm-border-radius1 tm-border1-dark">
      {items.map(({num, title, checked}) => (
        <div key={num} className="flex items-center">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => handleChange(num, e.target.checked)}
            className="mx-4"
            readOnly
          />
          <div
            className={`w-full py-4 pr-4 ${
              num === items.length - 1 ? '' : 'tm-border1-dark-bottom'
            } ${checked ? 'tm-hdg tm-hdg-16' : 'tm-para tm-para-16'}
            `}
          >
            {title}
          </div>
        </div>
      ))}
    </div>
  )
}
