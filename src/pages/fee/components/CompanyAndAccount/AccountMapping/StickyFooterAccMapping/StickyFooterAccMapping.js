import React from 'react'
import styles from './../AccountMapping.module.css'
import {Button, PlainCard} from '@teachmint/krayon'
import {TRANSLATIONS_CA} from '../../companyAccConstants'

export default function StickyFooterAccMapping({
  handleCancelEditCreateNew = () => {},
  handleSaveBtnClick = () => {},
}) {
  return (
    <PlainCard className={styles.saveCancelBtnSection}>
      <Button classes={{}} onClick={handleCancelEditCreateNew} type="outline">
        {TRANSLATIONS_CA.cancel}
      </Button>

      <Button classes={{}} onClick={() => handleSaveBtnClick()}>
        {TRANSLATIONS_CA.save}
      </Button>
    </PlainCard>
  )
}
