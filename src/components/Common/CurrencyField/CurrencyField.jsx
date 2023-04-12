import {useEffect, useState} from 'react'
import classNames from 'classnames'
import styles from './CurrencyField.module.css'
import {Icon} from '@teachmint/common'
import {useRef} from 'react'
import {useOutsideClickHandler} from '@teachmint/common'

function CurrencyField({
  onChange,
  value,
  className,
  dropdownItems,
  searchBar = false,
}) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [flagData, setFlagData] = useState({})
  const [currencyData, setCurrencyData] = useState([])
  const [searchText, setSearchText] = useState('')
  const wrapperRef = useRef(null)

  useEffect(() => {
    setFlagData(dropdownItems.find(({code}) => code === value))
  }, [value, dropdownItems])

  useEffect(() => {
    setCurrencyData(dropdownItems)
  }, [dropdownItems])

  const handleChange = (text) => {
    const filteredData = dropdownItems?.filter((item) =>
      (item.key + ' ' + item.code).toLowerCase().includes(text.toLowerCase())
    )
    setCurrencyData(filteredData)
  }
  useOutsideClickHandler(wrapperRef, () => {
    setShowDropdown(false)
  })

  return (
    <div className={classNames(styles.wrapper, className)} ref={wrapperRef}>
      <div
        className={styles.currencyDiv}
        onClick={() => {
          setShowDropdown(!showDropdown)
        }}
      >
        <div className={styles.currencyName}>
          {flagData?.key} {flagData?.code ? `(${flagData?.code})` : ''}
        </div>
        <Icon className={styles.downArrow} name="downArrow" size="xxs" />
      </div>
      {showDropdown && currencyData && (
        <div className={styles.optionDiv}>
          {searchBar && (
            <input
              type="text"
              className={classNames(styles.searchBar)}
              value={searchText}
              placeholder="Search for currency..."
              onChange={(e) => {
                setSearchText(e.target.value)
                handleChange(e.target.value)
              }}
            />
          )}
          <div className={styles.currencyDropdown}>
            {currencyData.map(({key, code}) => (
              <div
                key={code}
                onClick={() => {
                  onChange('currency', code)
                  setSearchText('')
                  handleChange('')
                  setShowDropdown(false)
                }}
                className={styles.currencyOptionDiv}
              >
                <div className={styles.currencyOption}>
                  <div className={styles.currencyName}>
                    {key} ({code})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CurrencyField
