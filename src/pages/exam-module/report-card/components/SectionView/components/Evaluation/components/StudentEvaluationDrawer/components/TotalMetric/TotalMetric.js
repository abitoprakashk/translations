import React, {useEffect, useImperativeHandle, useMemo, useState} from 'react'
import {Button, BUTTON_CONSTANTS} from '@teachmint/krayon'

import styles from './TotalMetric.module.css'
import MetricInput from '../MetricInput/MetricInput'
import {useTranslation} from 'react-i18next'
import Permission from '../../../../../../../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../../../../../../utils/permission.constants'
import {EVALUATION_TYPE} from '../../../../../../../../constants'
import classNames from 'classnames'

const btnClasses = {button: styles.btn}

const TotalMetric = (
  {value, onSave, type = 'marks', allValues, max = null},
  ref
) => {
  const [editing, setEditing] = useState(false)
  const [total, setTotal] = useState(value)

  const {t} = useTranslation()

  useImperativeHandle(ref, () => ({
    setTotal,
  }))

  useEffect(() => {
    setTotal(value)
  }, [value])

  const isValid = useMemo(() => {
    return (
      Number.isInteger(total) &&
      total >= 0 &&
      (max !== null ? total <= max : true) &&
      !Object.values(allValues).some(({value}) => value && value > total)
    )
  }, [total, allValues])

  const stringType = type == EVALUATION_TYPE.SCHOLASTIC ? 'marks' : 'days'

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.overlay]: isNaN(value) || value == 0,
      })}
    >
      <span className={styles.label}>
        Total {stringType == 'days' ? 'working' : ''} {stringType}:
      </span>
      {editing ? (
        <MetricInput
          suffix={stringType}
          value={total}
          white
          type="number"
          onChange={({value}) => {
            setTotal(value ? Number(value) : value)
          }}
          min={0}
          max={max}
          infoType={isValid ? undefined : 'error'}
          step={1}
        />
      ) : (
        <span className={styles.value}>
          {total} {stringType}
        </span>
      )}
      <div className={styles.marginLeftAuto}>
        <Permission
          permissionId={
            type == EVALUATION_TYPE.SCHOLASTIC
              ? PERMISSION_CONSTANTS.reportCardEvaluationController_sectionUpdateTotalMarks_update
              : PERMISSION_CONSTANTS.reportCardEvaluationController_sectionUpdateAttendanceTotalDays_update
          }
        >
          <Button
            type={BUTTON_CONSTANTS.TYPE.TEXT}
            onClick={() => {
              setEditing(!editing)
              if (editing) onSave(total)
            }}
            classes={btnClasses}
            isDisabled={!isValid}
          >
            {editing ? t('save') : t('edit')}
          </Button>
        </Permission>
      </div>
    </div>
  )
}

export default React.memo(React.forwardRef(TotalMetric))
