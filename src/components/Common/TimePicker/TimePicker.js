import React, {useState, useEffect} from 'react'
import moment from 'moment'

export default function TimePickerWrapper({time, setTime, index, base}) {
  const [hour, setHour] = useState('')
  const [mins, setMins] = useState('')
  const [ampm, setAmpm] = useState('')

  useEffect(() => {
    setGlobalTimeToLocal()
  }, [time])

  const setGlobalTimeToLocal = () => {
    if (time) {
      time = moment(time, 'hh:mm A')
      setHour(time.format('hh'))
      setMins(time.format('mm'))
      setAmpm(time.format('A'))
    }
  }

  const handleChange = (type, value) => {
    value = String(value).trim()

    switch (type) {
      case 'hour': {
        value = value === '' ? '' : new Number(value)
        if (value === '' || (!isNaN(value) && value <= 12)) {
          setHour(value)
          if (value !== '' && value > 0) {
            setTime(`${value}:${mins} ${ampm}`, index, base)
          }
        }
        break
      }
      case 'mins': {
        value = value === '' ? '' : new Number(value)
        if (value === '' || (!isNaN(value) && value < 60)) {
          setMins(value)
          if (value !== '' && value >= 0)
            setTime(
              `${hour}:${value < 9 ? `0${value}` : value} ${ampm}`,
              index,
              base
            )
        }
        break
      }
      case 'ampm': {
        setTime(`${hour}:${mins} ${value}`, index, base)
        break
      }
      default:
        break
    }
  }

  return (
    <div className="tm-input-timepicker flex">
      <div className="tm-input-timepicker-hm">
        <input
          type="text"
          placeholder="HH"
          value={hour}
          onBlur={setGlobalTimeToLocal}
          onChange={(e) => handleChange('hour', e.target.value)}
        />
        <span>:</span>
        <input
          type="text"
          placeholder="MM"
          value={mins}
          onBlur={setGlobalTimeToLocal}
          onChange={(e) => handleChange('mins', e.target.value)}
        />
      </div>
      <select
        className="tm-input-select tm-color-text-primary pl-3"
        value={ampm}
        onChange={(e) => handleChange('ampm', e.target.value)}
      >
        {['AM', 'PM'].map((item) => (
          <option value={item} className="py-2" key={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  )
}
