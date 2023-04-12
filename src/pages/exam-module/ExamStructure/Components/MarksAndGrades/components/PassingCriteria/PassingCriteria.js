import {Input} from '@teachmint/common'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import classNames from 'classnames'

import ToggleSwitch from '../../../../../../../components/Common/ToggleSwitch/ToggleSwitch'
import styles from './PassingCriteria.module.css'
import {useMemo} from 'react'
import {events} from '../../../../../../../utils/EventsConstants'

const PassingCriteria = ({
  isGrade,
  setIsMarksToGrade,
  grades,
  passingValue,
  setPassingValue,
}) => {
  const {t} = useTranslation()
  const {eventManager} = useSelector((state) => state)

  const options = useMemo(() => {
    let tmp = []
    grades.forEach((item) => {
      if (item.name?.trim() && item.max > 0 && item.min >= 0)
        tmp.push({value: item.name, label: item.name})
    })
    return tmp
  }, [grades])

  const handleChange = ({value}) => {
    if (isGrade) {
      setPassingValue(grades.find((item) => item.name === value))
    } else {
      setPassingValue(value)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.mainContainer}>
        <div>
          <div className={styles.textSection}>{t('showConvertedGrade')}</div>

          <div className={styles.subtext}>{t('turnThisSetting')}</div>
        </div>
        <div className={classNames(styles.section, styles.toggleSwitchWrapper)}>
          <ToggleSwitch
            value={isGrade}
            handleChange={() => {
              eventManager.send_event(events.EXAM_STRUCTURE_GRADE_CLICKED_TFI, {
                is_grade: !isGrade ? 'Yes' : 'No',
              })
              setIsMarksToGrade(!isGrade)
            }}
          />
          <span
            className={classNames(styles.boolean, {
              [styles.success]: isGrade,
              [styles.error]: !isGrade,
            })}
          >
            {isGrade ? 'Yes' : 'No'}
          </span>
        </div>
        <div>
          <div className={styles.section}>
            <span className={styles.title}>
              {isGrade ? t('passingGrade') : t('passingPercentage')}
            </span>
            <div className={styles.selectWrapper}>
              <Input
                type={isGrade ? 'select' : 'number'}
                options={options}
                value={isGrade ? passingValue?.name : passingValue}
                onChange={handleChange}
                classes={{wrapper: styles.gradeSelection}}
                suffix="%"
                maxLength="3"
              />
            </div>
          </div>
          <div className={styles.subtext}>{t('passingGradeSubText')}</div>
        </div>
      </div>
    </div>
  )
}

export default PassingCriteria
