import React from 'react'
import {useTranslation} from 'react-i18next'
import styles from './ListItem.module.css'
import {
  Badges,
  Heading,
  Icon,
  ICON_CONSTANTS,
  PlainCard,
  Para,
} from '@teachmint/krayon'
import SubjectTooltipOptions from '../../../../../../components/SchoolSystem/SectionDetails/SubjectTooltipOptions'

export default function ListItem({
  text = '',
  description = '',
  options = [],
  isSelected = false,
  isDisabled = false,
  handleChange,
  listIndex,
  classes = {},
  ...otherProps
}) {
  const {t} = useTranslation()

  return (
    <PlainCard
      className={`${styles.section} ${isSelected ? styles.active : ''} ${
        classes?.section
      }`}
      {...otherProps}
    >
      <div className={styles.headingWrapper}>
        <Heading className={styles.heading} textSize="xx_s" title={text}>
          {text}
        </Heading>
        {description && <Para textSize="m">{description}</Para>}
      </div>
      <div className={styles.rightSection}>
        {isDisabled && <Badges label="Disabled" showIcon={false} />}
        <SubjectTooltipOptions
          subjectItem={listIndex}
          options={options.map((item) => {
            return {
              ...item,
              labelStyle: styles[item?.labelStyle] || '',
              label: t(item.label),
            }
          })}
          trigger={
            <div className={styles.ellipsisIcon}>
              <Icon
                name="ellipsisVertical"
                type={ICON_CONSTANTS.TYPES.SECONDARY}
                size={ICON_CONSTANTS.SIZES.MEDIUM}
              />
            </div>
          }
          handleChange={handleChange}
        />
      </div>
      {/* </div> */}
    </PlainCard>
  )
}
