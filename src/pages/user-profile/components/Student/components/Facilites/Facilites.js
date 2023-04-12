import React from 'react'
import {Input, ToggleSwitch} from '@teachmint/common'
import styles from './Facilites.module.css'

import {MEAL_TYPE} from '../../../../constants'

const Facilites = ({facilites = {}, setFacilites, reduxData = {}}) => {
  const handleChange = ({fieldName, value}) => {
    setFacilites({...facilites, [fieldName]: value})
  }

  return (
    <>
      <div className={styles.heading}>
        Transport
        <span className={styles.toggle}>
          <ToggleSwitch
            id="transport"
            checked={facilites.isTransportRequired}
            onChange={(checked) =>
              handleChange({fieldName: 'isTransportRequired', value: checked})
            }
          />
        </span>
      </div>
      <div className={styles.gridOfTwoForDesktopOnly}>
        <Input
          type="text"
          title="Pick /Drop Location"
          fieldName="transportWaypoint"
          value={facilites.transportWaypoint}
          onChange={handleChange}
          classes={{title: 'tm-para'}}
        />
        <Input
          type={
            reduxData.transportDistance && reduxData.transportDistance.trim()
              ? 'readonly'
              : 'text'
          }
          title="Distance"
          fieldName="transportDistance"
          value={facilites.transportDistance}
          onChange={handleChange}
          classes={{title: 'tm-para'}}
        />
      </div>
      <div className={styles.divider} />
      <div className={styles.heading}>
        Hostel
        <span className={styles.toggle}>
          <ToggleSwitch
            id="hostel"
            checked={facilites.isHostelRequired}
            onChange={(checked) =>
              handleChange({fieldName: 'isHostelRequired', value: checked})
            }
          />
        </span>
      </div>
      <div className={styles.gridOfTwo}>
        <Input
          type="text"
          title="Room Number"
          fieldName="roomNumber"
          value={facilites.roomNumber}
          onChange={handleChange}
          classes={{title: 'tm-para'}}
        />
        <Input
          type="text"
          title="Block Number"
          fieldName="blockNumber"
          value={facilites.blockNumber}
          onChange={handleChange}
          classes={{title: 'tm-para'}}
        />
      </div>
      <div className={styles.divider} />
      <div className={styles.heading}>
        Meal
        <span className={styles.toggle}>
          <ToggleSwitch
            id="meal"
            checked={facilites.isMealRequired}
            onChange={(checked) =>
              handleChange({fieldName: 'isMealRequired', value: checked})
            }
          />
        </span>
      </div>
      <div className={styles.gridOfTwoForDesktopOnly}>
        <Input
          type="select"
          title="Meal Option"
          fieldName="meal"
          value={facilites.meal}
          options={MEAL_TYPE}
          onChange={handleChange}
          classes={{title: 'tm-para'}}
        />
      </div>
    </>
  )
}

export default Facilites
