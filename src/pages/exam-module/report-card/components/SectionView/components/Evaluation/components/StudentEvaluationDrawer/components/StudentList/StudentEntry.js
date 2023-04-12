import React, {useEffect, useState} from 'react'
import {
  AVATAR_CONSTANTS,
  Icon,
  IconFrame,
  ICON_CONSTANTS,
  ICON_FRAME_CONSTANTS,
  KebabMenu,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import UserInfo from '../../../../../../../../../../../components/Common/Krayon/UserInfo'
import MetricInput from '../MetricInput/MetricInput'

import styles from './StudentList.module.css'
import {IS_MOBILE} from '../../../../../../../../../../../constants'
import {EVALUATION_TYPE} from '../../../../../../../../constants'
import RemarkModal from './RemarkModal'
import {createPortal} from 'react-dom'
import {useTranslation} from 'react-i18next'

const isValid = (value, min, max) =>
  value === undefined || value == '' || (Number(value) >= min && value <= max)

const isDecimal = (value) => !Number.isInteger(Number(value))

const StudentEntry = ({
  data = {},
  value = {},
  setValue,
  setAttendance,
  totalMetric,
  type,
}) => {
  const {name, roll_number, img_url} = data

  const [showModal, setShowModal] = useState(false)
  const {t} = useTranslation()

  useEffect(() => {
    if (type != EVALUATION_TYPE.ATTENDANCE) return
    if (
      !isValid(
        value?.value,
        type == EVALUATION_TYPE.SCHOLASTIC ? -totalMetric : 0,
        totalMetric
      )
    ) {
      setValue({
        value: value?.value,
        studentIId: data.iid,
        error: !isValid(
          value?.value,
          type == EVALUATION_TYPE.SCHOLASTIC ? -totalMetric : 0,
          totalMetric
        ),
      })
    } else {
      setValue({
        value: value?.value,
        studentIId: data.iid,
        error: false,
      })
    }
  }, [totalMetric])

  return (
    <tr>
      <td className={styles.colRollNo}>{roll_number || '-'}</td>
      <td>
        <UserInfo
          name={name}
          avatarSize={IS_MOBILE ? false : AVATAR_CONSTANTS.SIZE.MEDIUM}
          designation={
            value?.isAbsent ? (
              <span className={styles.absentText}>{t('absent')}</span>
            ) : null
          }
          profilePic={img_url}
          className={styles.fullWidth}
        />
        {(type == EVALUATION_TYPE.REMARKS || type == EVALUATION_TYPE.RESULTS) &&
          value?.value && (
            <Para
              className={styles.remarks}
              weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
            >
              “{value?.value}”
            </Para>
          )}
      </td>

      {type == EVALUATION_TYPE.SCHOLASTIC && (
        <>
          <td className={styles.colInput}>
            <div className={styles.marginTop}>
              <MetricInput
                suffix="marks"
                value={value?.value}
                setValue={({value, fieldName}) =>
                  setValue({
                    value,
                    studentIId: fieldName,
                    error: !isValid(value, -totalMetric, totalMetric),
                  })
                }
                fieldName={data.iid}
                type="number"
                // negative is allowed
                min={-totalMetric}
                max={totalMetric}
                infoType={value?.error ? 'error' : undefined}
                isDisabled={value?.isAbsent}
              />
            </div>
          </td>
          <td width={40}>
            <KebabMenu
              isVertical
              options={[
                {
                  content: value?.isAbsent
                    ? 'Mark as present'
                    : 'Mark as absent',
                  handleClick: () =>
                    setAttendance({
                      studentIId: data.iid,
                      isAbsent: !value?.isAbsent,
                    }),
                },
              ]}
            />
          </td>
        </>
      )}

      {type == EVALUATION_TYPE.CO_SCHOLASTIC && (
        <>
          <td className={styles.colInput}>
            <div className={styles.marginTop}>
              <MetricInput
                value={value?.value}
                setValue={({value, fieldName}) =>
                  setValue({
                    value,
                    studentIId: fieldName,
                    error: false,
                  })
                }
                fieldName={data.iid}
                infoType={value?.error ? 'error' : undefined}
                isDisabled={value?.isAbsent}
                maxLength={10}
              />
            </div>
          </td>
        </>
      )}

      {type == EVALUATION_TYPE.ATTENDANCE && (
        <>
          <td className={styles.colInput}>
            <div className={styles.marginTop}>
              <MetricInput
                suffix="days"
                value={value?.value}
                setValue={({value, fieldName}) =>
                  setValue({
                    value,
                    studentIId: fieldName,
                    error: !isValid(value, 0, totalMetric) || isDecimal(value),
                  })
                }
                fieldName={data.iid}
                type="number"
                min={0}
                max={totalMetric}
                infoType={value?.error ? 'error' : undefined}
                isDisabled={value?.isAbsent}
                step={1}
              />
            </div>
          </td>
        </>
      )}

      {(type == EVALUATION_TYPE.REMARKS || type == EVALUATION_TYPE.RESULTS) && (
        <td className={styles.colRemark}>
          <IconFrame
            size={ICON_FRAME_CONSTANTS.SIZES.LARGE}
            type={ICON_FRAME_CONSTANTS.TYPES.PRIMARY}
            className={styles.editRemark}
            onClick={() => setShowModal(true)}
          >
            <Icon
              name={value?.value ? 'edit2' : 'add'}
              type={ICON_CONSTANTS.TYPES.PRIMARY}
              size={ICON_CONSTANTS.SIZES.XX_SMALL}
            />
          </IconFrame>

          {showModal &&
            createPortal(
              <RemarkModal
                type={type}
                showModal={showModal}
                value={value?.value}
                setShowModal={setShowModal}
                setValue={(text) =>
                  setValue({
                    value: text,
                    studentIId: data.iid,
                    error: false,
                  })
                }
              />,
              document.getElementById('evaluationDrawerModals')
            )}
        </td>
      )}
    </tr>
  )
}

export default React.memo(StudentEntry)
