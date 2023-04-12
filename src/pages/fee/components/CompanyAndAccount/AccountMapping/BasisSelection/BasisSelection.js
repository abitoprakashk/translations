import React from 'react'
import styles from './BasisSelection.module.css'
import {Button, PlainCard, RadioGroup} from '@teachmint/krayon'
import {
  ACCOUNT_MAPPING_BASIS_OPTIONS,
  TRANSLATIONS_CA,
} from '../../companyAccConstants'
import Permission from '../../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'

export default function BasisSelection({
  selectedOption,
  handleChange = () => {},
  handleProceedBtnClick = () => {},
}) {
  return (
    <PlainCard className={styles.card}>
      <div>{TRANSLATIONS_CA.iWantToMapAccountsOnTheBasisOf}</div>
      <div className={styles.radioGroupSection}>
        <RadioGroup
          handleChange={(obj) => handleChange(obj)}
          selectedOption={selectedOption}
          options={ACCOUNT_MAPPING_BASIS_OPTIONS}
        />
      </div>
      <Permission
        permissionId={
          PERMISSION_CONSTANTS.accountMappingController_upsert_update
        }
      >
        <Button width={'full'} onClick={handleProceedBtnClick}>
          {TRANSLATIONS_CA.proceed}
        </Button>
      </Permission>
    </PlainCard>
  )
}
