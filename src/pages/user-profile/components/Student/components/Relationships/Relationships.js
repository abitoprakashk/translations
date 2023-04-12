import React, {useState} from 'react'
import {Input, ToggleSwitch, Chips} from '@teachmint/common'
import styles from './Relationships.module.css'

import {SIBLING} from '../../../../constants'

const Relationships = ({relationships = {}, setRelationships}) => {
  const [searchStr, setSearchStr] = useState('')
  const [selectedStudentList, setSelectedStudentList] = useState([])

  const handleSearch = ({value}) => {
    setSearchStr(value)
    setSelectedStudentList([...selectedStudentList, value])
  }

  const handleChange = ({fieldName, value}) => {
    setRelationships({...relationships, [fieldName]: value})
  }

  //     const handleChipsChange = (obj) => {

  //   }

  return (
    <>
      <div className={styles.heading}>
        {SIBLING}
        <span className={styles.toggle}>
          <ToggleSwitch
            id="transport"
            checked={relationships.hasSiblings}
            onChange={(checked) =>
              handleChange({fieldName: 'hasSiblings', value: checked})
            }
          />
        </span>
      </div>
      <div className={styles.gridOfTwoForDesktopOnly}>
        <Input
          type="select"
          title="Search Student"
          fieldName="searchStr"
          value={searchStr}
          onChange={handleSearch}
          classes={{title: 'tm-para'}}
        />
        <Chips options={selectedStudentList} />
        {/* onChange={handleChipsChange} /> */}
      </div>
      <div className={styles.divider} />
      <div className={styles.heading}>
        Staff Child
        <span className={styles.toggle}>
          <ToggleSwitch
            id="staffChild"
            checked={relationships.isStaffChild}
            onChange={(checked) =>
              handleChange({fieldName: 'isStaffChild', value: checked})
            }
          />
        </span>
      </div>
      <div className={styles.divider} />
      <div className={styles.heading}>
        Defence Child
        <span className={styles.toggle}>
          <ToggleSwitch
            id="defenceChild"
            checked={relationships.isDefenceChild}
            onChange={(checked) =>
              handleChange({fieldName: 'isDefenceChild', value: checked})
            }
          />
        </span>
      </div>
    </>
  )
}

export default Relationships
