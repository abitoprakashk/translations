import React, {useCallback} from 'react'
import {EmptyState} from '@teachmint/krayon'
import styles from './StudentList.module.css'
import StudentEntry from './StudentEntry'
import {useHistory} from 'react-router-dom'
import {sidebarData} from '../../../../../../../../../../../utils/SidebarItems'
import classNames from 'classnames'
import {IS_MOBILE} from '../../../../../../../../../../../constants'
import {EVALUATION_TYPE} from '../../../../../../../../constants'
import {useTranslation} from 'react-i18next'

const StudentList = ({
  list = [],
  metric = {},
  queryActive = false,
  setMetric,
  totalMetric,
  type = EVALUATION_TYPE.SCHOLASTIC,
  onClose,
}) => {
  const history = useHistory()
  const {t} = useTranslation()

  const setValue = useCallback(
    ({value, studentIId, error}) => {
      setMetric((_metric) => ({
        ..._metric,
        [studentIId]: {
          ..._metric?.[studentIId],
          value,
          error,
        },
      }))
    },
    [setMetric]
  )

  const setAttendance = useCallback(
    ({studentIId, isAbsent}) => {
      setMetric((_metric) => ({
        ..._metric,
        [studentIId]: {
          ..._metric?.[studentIId],
          isAbsent,
          ...(isAbsent ? {value: '', error: false} : {}),
        },
      }))
    },
    [setMetric]
  )

  return (
    <table
      className={classNames(styles.table, {
        [styles.mobile]: IS_MOBILE,
        [styles.bordered]:
          type == EVALUATION_TYPE.REMARKS || type == EVALUATION_TYPE.RESULTS,
      })}
    >
      <thead>
        <tr>
          <th className={styles.colRollNo}>Roll No.</th>
          <th>Name</th>
          {type == EVALUATION_TYPE.SCHOLASTIC && (
            <th
              colSpan={2}
              className={classNames(styles.colInput, styles.marksHeading)}
            >
              Marks (out of {totalMetric})
            </th>
          )}
          {type == EVALUATION_TYPE.CO_SCHOLASTIC && (
            <th
              colSpan={2}
              className={classNames(styles.colInput, styles.marksHeading)}
            >
              {t('grade')}
            </th>
          )}
          {type == EVALUATION_TYPE.ATTENDANCE && (
            <th
              colSpan={2}
              className={classNames(styles.colInput, styles.marksHeading)}
            >
              Present (out of {totalMetric})
            </th>
          )}
          {type == EVALUATION_TYPE.REMARKS && (
            <th className={styles.colRemark}>Remark</th>
          )}
          {type == EVALUATION_TYPE.RESULTS && (
            <th className={styles.colRemark}>Result</th>
          )}
        </tr>
      </thead>
      <tbody>
        {list.length > 0 &&
          list.map((data) => (
            <StudentEntry
              key={data.iid}
              data={data}
              value={metric[data.iid]}
              setValue={setValue}
              setAttendance={setAttendance}
              totalMetric={totalMetric}
              type={type}
            />
          ))}
        {!queryActive && list.length == 0 && (
          <tr>
            <td colSpan={3}>
              <EmptyState
                iconName="people"
                content={t('noStudentAddedInClass')}
                button={{
                  category: 'primary',
                  children: t('goToClassroomSetup'),
                  onClick: () => {
                    history.push(sidebarData.SCHOOL_SETUP.route)
                    onClose()
                  },
                  size: 'm',
                }}
                classes={{
                  wrapper: styles.emptyWrapper,
                }}
              />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default React.memo(StudentList)
