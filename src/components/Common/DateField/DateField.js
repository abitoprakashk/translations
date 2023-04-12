import React from 'react'
import {useSelector} from 'react-redux'
import {Input} from '@teachmint/common'
import {DateTime} from 'luxon'
import {getDateNewFormat} from './../../../utils/Helpers'
import styles from './DateField.module.css'
import classNames from 'classnames'

export default function DateField({
  placeholder,
  value,
  handleChange,
  fieldName,
  disabled,
  max,
  min,
  eventName,
  eventKey,
  classes = {},
}) {
  const {eventManager} = useSelector((state) => state)
  return (
    <div>
      <Input
        type="date"
        classes={{
          wrapper: classNames(styles.dateWrapper, classes?.dateWrapper),
        }}
        placeholder={placeholder}
        value={new Date(value)}
        fieldName={fieldName}
        onChange={(obj) =>
          handleChange(
            obj.fieldName,
            DateTime.fromJSDate(obj.value).toFormat('yyyy-MM-dd')
          )
        }
        maxDate={max ? new Date(max) : undefined}
        disabled={disabled}
        minDate={min ? new Date(min) : undefined}
        onBlur={() =>
          eventName &&
          eventManager.send_event(eventName, {
            [eventKey]: value ? getDateNewFormat(value) : '',
          })
        }
      />
    </div>
  )
}
