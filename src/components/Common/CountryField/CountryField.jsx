import {useEffect, useState} from 'react'
import classNames from 'classnames'
import styles from './CountryField.module.css'
import {Icon} from '@teachmint/common'
import {useRef} from 'react'
import {useOutsideClickHandler} from '@teachmint/common'

function CountryField({
  onChange,
  value,
  className,
  dropdownItems,
  searchBar = false,
}) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [flagData, setFlagData] = useState({})
  const [countryData, setCountryData] = useState([])
  const [searchText, setSearchText] = useState('')
  const wrapperRef = useRef(null)

  useEffect(() => {
    setFlagData(dropdownItems.find(({country}) => country === value))
  }, [value, dropdownItems])

  useEffect(() => {
    setCountryData(dropdownItems)
  }, [dropdownItems])

  const handleChange = (text) => {
    const filteredData = dropdownItems?.filter((item) =>
      item.country.toLowerCase().includes(text.toLowerCase())
    )
    setCountryData(filteredData)
  }
  useOutsideClickHandler(wrapperRef, () => {
    setShowDropdown(false)
  })

  return (
    <div className={classNames(styles.wrapper, className)} ref={wrapperRef}>
      <div
        className={styles.countryFlagDiv}
        onClick={() => {
          setShowDropdown(!showDropdown)
        }}
      >
        <img src={flagData?.flag_url} className={styles.flagImg} />
        <div className={styles.countryName}>{flagData?.country}</div>
        <Icon className={styles.downArrow} name="downArrow" size="xxs" />
      </div>
      {showDropdown && countryData && (
        <div className={styles.optionDiv}>
          {searchBar && (
            <input
              type="text"
              className={classNames(styles.searchBar)}
              value={searchText}
              placeholder="Search for country..."
              onChange={(e) => {
                setSearchText(e.target.value)
                handleChange(e.target.value)
              }}
            />
          )}
          <div className={styles.flagDropdown}>
            {countryData.map(({country, flag_url, _id}) => (
              <div
                key={_id}
                onClick={() => {
                  onChange('country', country)
                  setSearchText('')
                  handleChange('')
                  setShowDropdown(false)
                }}
                className={styles.flagOptionDiv}
              >
                <div className={styles.flagOption}>
                  <img src={flag_url} alt="flag" className={styles.flagImg} />
                  <div className={styles.countryName}>{country}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CountryField
