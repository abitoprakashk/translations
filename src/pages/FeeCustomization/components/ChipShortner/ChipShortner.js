import {Chips} from '@teachmint/krayon'
import React, {useMemo, useState} from 'react'
import {useTranslation} from 'react-i18next'
import styles from './ChipShortner.module.css'

const MAX_CHIP_COUNT = 3

function ChipShortner({chipList, onChange, maxChips = MAX_CHIP_COUNT}) {
  const {t} = useTranslation()
  const [showMore, setshowMore] = useState(false)
  const _chipList = useMemo(
    () => (showMore ? chipList : chipList.slice(0, maxChips)),
    [chipList, maxChips, showMore]
  )
  const count = useMemo(
    () => chipList.length - _chipList.length,
    [chipList, _chipList]
  )
  return (
    <>
      <Chips onChange={onChange} chipList={_chipList} />
      {chipList.length > maxChips ? (
        showMore ? (
          <span className={styles.highlight} onClick={() => setshowMore(false)}>
            {t('viewLess')}
          </span>
        ) : (
          <span className={styles.highlight} onClick={() => setshowMore(true)}>
            {t('numItemsMore', {count})}
          </span>
        )
      ) : null}
    </>
  )
}

export default React.memo(ChipShortner)
