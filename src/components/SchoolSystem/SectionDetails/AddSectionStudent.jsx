import React from 'react'
import styles from './SectionDetails.module.css'
import {Button, ButtonDropdown, BUTTON_CONSTANTS} from '@teachmint/krayon'
import Permission from '../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../utils/permission.constants'
import * as SHC from '../../../utils/SchoolSetupConstants'
import {useTranslation} from 'react-i18next'
import classNames from 'classnames'
import {useSelector} from 'react-redux'
import {getActiveStudents} from '../../../redux/reducers/CommonSelectors'

export default function AddSectionStudent({
  setActiveTab,
  handleChange,
  place = 'bottom',
}) {
  const {t} = useTranslation()
  const {instituteAcademicSessionInfo} = useSelector((state) => state)
  const instituteStudentList = getActiveStudents(true)
  const unAssignedStudents = instituteStudentList?.filter(
    (item) => !item.classroom
  )?.length

  const options = []
  if (instituteAcademicSessionInfo?.length > 1)
    options.push({id: 'IMPORT_STUDENT', label: t('importStudent')})
  if (unAssignedStudents)
    options.push({id: 'UNASSIGNED_STUDENT', label: t('fromDirectory')})
  options.push({id: 'ADD_STUDENT', label: t('fromCsv')})

  return (
    <div className={styles.addStudentDiv}>
      <Permission
        permissionId={
          PERMISSION_CONSTANTS.instituteClassController_assignSectionStudent_update
        }
      >
        <Button
          type={BUTTON_CONSTANTS.TYPE.TEXT}
          onClick={() => {
            setActiveTab('ADD_STUDENT')
            handleChange(SHC.ACT_SEC_CLASS_ASSIGN_STUDENTS)
          }}
          classes={{button: styles.addStudentButton}}
        >
          {t('addStudentsPlus')}
        </Button>
      </Permission>
      <Permission
        permissionId={
          PERMISSION_CONSTANTS.instituteClassController_assignSectionStudent_update
        }
      >
        <ButtonDropdown
          options={options}
          buttonObj={{
            children: t('importButton'),
            suffixIcon: 'arrowDropDown',
            type: BUTTON_CONSTANTS.TYPE.TEXT,
            classes: {button: styles.importButton},
          }}
          handleOptionClick={({value}) => {
            setActiveTab(value)
            handleChange(SHC.ACT_SEC_CLASS_ASSIGN_STUDENTS)
          }}
          classes={{
            dropdownContainer: classNames(styles.dropdownContainer, {
              [styles.bottom]: place === 'bottom',
              [styles.right]: place === 'right',
            }),
            wrapper: styles.buttonDropdown,
            optionStyle: styles.optionStyle,
          }}
        />
      </Permission>
    </div>
  )
}
