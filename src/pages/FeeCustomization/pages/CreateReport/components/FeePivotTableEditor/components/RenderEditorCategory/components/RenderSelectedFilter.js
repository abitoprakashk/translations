import {Para} from '@teachmint/krayon'
import classNames from 'classnames'
import {memo} from 'react'
import {useTranslation} from 'react-i18next'
import ChipShortner from '../../../../../../../components/ChipShortner/ChipShortner'
import {
  FILTER_OPTIONS,
  FILTER_OPTIONS_CONSTANTS,
} from '../../../../../../../constants/feeCustomization.editor.constants'
import styles from '../RenderEditorCategory.module.css'

const RenderSelectedFilter = memo(
  ({selectedFilterValues, handleChipCancel}) => {
    const {t} = useTranslation()
    return Object.keys(selectedFilterValues).map((key) => {
      const chipList = () => {
        if (key === FILTER_OPTIONS_CONSTANTS.SECTION) {
          return selectedFilterValues[key].map((singleClass) => ({
            id: singleClass._id,
            label: `${singleClass.standard} ${singleClass.name}`,
          }))
        } else {
          return selectedFilterValues[key].map(({label, value}) => ({
            id: value,
            label,
          }))
        }
      }

      return selectedFilterValues[key]?.length ? (
        <div key={key} className={classNames('flex flex-wrap items-center')}>
          <Para className={styles.filterTitle}>
            {t(FILTER_OPTIONS[key].titleKey)}
          </Para>
          <ChipShortner
            onChange={(selectedValue) => {
              handleChipCancel({key, selectedValue})
            }}
            maxChips={3}
            chipList={chipList()}
          />
        </div>
      ) : null
    })
  }
)
RenderSelectedFilter.displayName = 'RenderSelectedFilter'
export default RenderSelectedFilter
