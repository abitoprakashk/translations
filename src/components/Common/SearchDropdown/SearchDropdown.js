import React, {useState, useEffect} from 'react'

export default function SearchDropdown({
  placeholder,
  value,
  handleChange,
  fieldName,
  dropdownItems,
}) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [filteredList, setFilteredList] = useState([])

  useEffect(() => {
    if (String(value).length === 0) setFilteredList([])
    else
      setFilteredList([
        value,
        ...dropdownItems.filter((option) =>
          option.toLowerCase().includes(value.toLowerCase())
        ),
      ])
  }, [value])

  window.addEventListener('click', () => {
    if (showDropdown) setShowDropdown(false)
  })

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => handleChange(fieldName, e.target.value)}
        onFocus={() => setShowDropdown(true)}
        className="tm-input-field"
        value={value}
        maxLength={100}
      />
      {showDropdown && (
        <div className="tm-search-dropdown absolute top-full left-0 w-full bg-white overflow-auto">
          <ul className="m-0 p-0 list-none">
            {filteredList.map((result, index) => (
              <li
                className="cursor-pointer py-3 px-4"
                key={index}
                onClick={() => {
                  setShowDropdown(false)
                  handleChange(fieldName, result)
                }}
              >
                {result}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
