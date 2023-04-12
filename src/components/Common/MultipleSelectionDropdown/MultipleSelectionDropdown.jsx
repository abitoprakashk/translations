import classNames from 'classnames'
import React, {useRef, useState} from 'react'
import {produce} from 'immer'
import {useOutsideClickHandler} from '@teachmint/common'
export default function MultipleSelectionDropdown({
  title,
  value,
  fieldName,
  handleChange,
  placeholder,
}) {
  const [showDropdown, setShowDropdown] = useState(false)

  const handleDropdownChange = (key) => {
    const index = value?.findIndex((x) => x.key == key)
    const list = produce(value, (draft) => {
      // if select ALl present
      if (draft[index]?.selectAll) {
        const preserveOriginalValue = draft[index].selected
        draft.forEach((item, i) => {
          draft[i].selected = preserveOriginalValue ? false : true
        })
      } else {
        draft[index].selected = !draft[index].selected
      }
      return draft
    })

    handleChange(fieldName, list)
  }

  const wrapperRef = useRef(null)
  useOutsideClickHandler(wrapperRef, () => {
    setShowDropdown(false)
  })

  return (
    <div className="relative cursor-pointer mt-1" ref={wrapperRef}>
      <div
        className="tm-input-field flex justify-between items-center"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="tm-para tm-para-14">{placeholder || title}</div>
        <img
          src="https://storage.googleapis.com/tm-assets/icons/primary/down-arrow-primary.svg"
          alt=""
          className={classNames('w-3 h-3', {
            'transform rotate-180': showDropdown,
          })}
        />
      </div>
      <div className="flex flex-wrap mt-2">
        {value
          ?.filter(({selected, selectAll}) => selected && !selectAll)
          .map(({key, value}) => (
            <div
              key={key}
              className="py-0.5 px-2 mr-2 mb-2 rounded-lg tm-bgcr-gy-3 flex items-center"
              onClick={() => handleDropdownChange(key)}
            >
              <div className="tm-para tm-para-12">{value}</div>
              <img
                src="https://storage.googleapis.com/tm-assets/icons/secondary/cross-bg-secondary.svg"
                alt=""
                className="w-3 h-3 ml-1"
              />
            </div>
          ))}
      </div>

      {showDropdown && (
        <div className="tm-search-dropdown absolute top-14 left-0 w-full bg-white overflow-y-auto">
          {value?.map(({key, value, selected}) => (
            <div
              className={`cursor-pointer py-3 px-4 tm-border1-bottom flex items-center ${
                selected ? 'tm-bgcr-gy-3' : ''
              }`}
              key={key}
              onClick={() => handleDropdownChange(key)}
            >
              <input type="checkbox" checked={selected} id={key} readOnly />
              <label className="ml-1.5 cursor-pointer tm-para tm-para-14 ">
                {value}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
