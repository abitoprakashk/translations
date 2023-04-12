import {PlainCard} from '@teachmint/krayon'
import React from 'react'
import UserSelection from '../../../../../../components/Common/UserSelection/UserSelection'
import styles from './ManualManagePassengers.module.css'

export default function ManualManagePassengers({
  passengersData,
  setPassengersData,
  allotedPassengerIds,
}) {
  return (
    <PlainCard className={styles.wrapper}>
      <UserSelection
        data={passengersData}
        handleChange={setPassengersData}
        showSelectAll={true}
        disabledIds={allotedPassengerIds}
      />
    </PlainCard>
  )
}
