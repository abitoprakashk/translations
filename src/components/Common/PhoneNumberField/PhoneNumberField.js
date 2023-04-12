import React, {useState, useEffect} from 'react'
import {BROWSER_STORAGE_KEYS} from '../../../constants/institute.constants'
import {utilsGetFlag} from '../../../routes/dashboard'
import {getFromLocalStorage, setToLocalStorage} from '../../../utils/Helpers'

export default function PhoneNumberField({
  value,
  handleChange,
  fieldName,
  countryCodeItem,
  placeholder,
  disabled = false,
  editable = false,
}) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [flagData, setFlagData] = useState([])

  window.addEventListener('click', () => {
    if (showDropdown) setShowDropdown(false)
  })

  useEffect(() => {
    // Check if flag list avalible in localstorage
    const countryCodeLocalstoageList = getFromLocalStorage(
      BROWSER_STORAGE_KEYS.COUNTRY_CODE_LIST
    )

    if (countryCodeLocalstoageList)
      setFlagData(JSON.parse(countryCodeLocalstoageList))
    else getflags()
  }, [])

  const getflags = () => {
    utilsGetFlag().then(({status, obj}) => {
      if (status) {
        // Set item to localstorage
        setToLocalStorage(
          BROWSER_STORAGE_KEYS.COUNTRY_CODE_LIST,
          JSON.stringify(obj)
        )
        setFlagData(obj)
      }
    })
  }

  const getImg = (selected) => {
    let ele = flagData.find((ele) => ele.ISD_Code === selected)
    return ele && ele.flag_url
  }

  return (
    <div className="tm-input-phone flex relative bg-white">
      <div className="flex relative items-center cursor-pointer pl-4">
        <img
          src={getImg(countryCodeItem.value)}
          alt="flag"
          className="tm-flag-img"
        ></img>
        <div className="mx-1 tm-h6">+{countryCodeItem.value}</div>
        <img
          src="https://storage.googleapis.com/tm-assets/icons/secondary/down-arrow-secondary.svg"
          alt=""
          className="w-2 h-2"
        />

        {showDropdown && flagData && (
          <div className="tm-search-dropdown absolute left-0 w-full bg-white overflow-auto">
            {flagData.map(({ISD_Code, flag_url, _id}) => (
              <div
                key={_id}
                onClick={() => {
                  setShowDropdown(false)
                  handleChange('countryCode', ISD_Code)
                }}
                className="p-2 tm-border1-dark-bottom"
              >
                <div className="flex items-center justify-between">
                  <img src={flag_url} alt={_id} className="tm-flag-img"></img>
                  <div className="tm-h6">+{ISD_Code}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <input
        type="number"
        className="phone-number ml-2 tm-h6"
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleChange(fieldName, e.target.value)}
        id="phone-number-field"
      />
      {disabled && (
        <div className="absolute w-full h-full tm-bg-white-50 flex justify-end items-start px-2">
          {editable && (
            <img
              src="https://storage.googleapis.com/tm-assets/icons/blue/edit-blue.svg"
              alt=""
              className="w-5 h-5 cursor-pointer"
            />
          )}
        </div>
      )}
    </div>
  )
}
