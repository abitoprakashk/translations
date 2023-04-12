import React from 'react'
import {Icon} from '@teachmint/common'

export default function AlternateSearchBox({
  value,
  placeholder,
  handleSearchFilter,
}) {
  return (
    <div className="flex py-2 px-4 items-center rounded-full tm-bgcr-gy-3">
      <Icon color="secondary" name="search" size="xs" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        className="tm-w-full tm-para tm-para-14 outline-none py-1 pl-1 tm-bgcr-gy-3"
        onInput={(e) => handleSearchFilter(e.target.value.trimLeft())}
      />

      {value && (
        <img
          src="https://storage.googleapis.com/tm-assets/icons/secondary/cross-bg-secondary.svg"
          className="w-4 h-4 mr-1 cursor-pointer"
          alt="Search"
          onClick={() => handleSearchFilter('')}
        />
      )}
    </div>
  )
}
