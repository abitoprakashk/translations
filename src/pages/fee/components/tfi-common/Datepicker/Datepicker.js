import classNames from 'classnames'
import {useEffect, useState} from 'react'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './Datepicker.module.css'
import {
  frequencies,
  getFormattedFrequencyDate,
} from '../../../../../utils/Helpers'

const Datepicker = ({
  index,
  showMonthDropdown,
  showYearDropdown,
  showFrequency,
  showDatepicker,
  setShowDatepicker,
  handleChange,
  defaultFrequency = null,
  defaultStartDate = null,
  minDate = null,
  maxDate = null,
}) => {
  const [frequency, setFrequency] = useState(defaultFrequency)
  const [startDate, setStartDate] = useState(defaultStartDate)
  const [selectedDate, setSelectedDate] = useState(null)
  const [error, setError] = useState(null)

  const handleLocalChange = (name, value, index) => {
    name === 'frequency' ? setFrequency(value) : setStartDate(value)
    handleChange({target: {name: name, value: value}}, index)
  }

  useEffect(() => {
    if (frequency !== null && startDate) {
      setSelectedDate(getFormattedFrequencyDate(startDate, frequency))
    }
  }, [])

  const setDate = () => {
    if (frequency === null) {
      setError('Please select frequency')
    } else if (!startDate) {
      setError('Please select date')
    } else {
      setSelectedDate(getFormattedFrequencyDate(startDate, frequency))
      setShowDatepicker(false)
      setError('')
    }
  }

  return (
    <>
      <input
        readOnly
        defaultValue={selectedDate}
        type="text"
        className={classNames(styles.input)}
        onFocus={() => setShowDatepicker(true)}
        placeholder="Select One"
      />
      {showDatepicker && (
        <div className={styles.dropdown}>
          <div className={styles.filters}>
            {showFrequency && (
              <div>
                <section>
                  {frequencies.map((label, key) => {
                    return (
                      <div
                        className={frequency === key ? styles.active : ''}
                        key={key}
                        onClick={() =>
                          handleLocalChange('frequency', key, index)
                        }
                      >
                        {label}
                      </div>
                    )
                  })}
                </section>
              </div>
            )}
            <div className={classNames(styles.flex, styles.flexCol)}>
              <ReactDatePicker
                inline
                selected={startDate}
                dateFormat="yyyy-mm-dd"
                scrollableYearDropdown
                minDate={minDate}
                maxDate={maxDate}
                onChange={(date) =>
                  handleLocalChange('start_date', date, index)
                }
                dropdownMode="select"
                showMonthDropdown={showMonthDropdown}
                showYearDropdown={showYearDropdown}
              />
              <div className="tm-para4 mt-1 h-4 tm-color-red">{error}</div>
              <div className={styles.saveBtn}>
                <button
                  type="button"
                  className={styles.btnFill}
                  onClick={setDate}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

Datepicker.defaultProps = {
  showMonthDropdown: true,
  showYearDropdown: true,
  showFrequency: false,
}

export default Datepicker
