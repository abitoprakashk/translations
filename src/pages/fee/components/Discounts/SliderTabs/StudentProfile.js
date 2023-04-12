import {Table} from '@teachmint/common'
import {DISCOUNT} from '../../../intl'
import userDefaultImg from '../../../../../assets/images/icons/user-profile.svg'
import {useFeeDiscount} from '../../../redux/feeDiscounts.selectors'
import {useFeeStructure} from '../../../redux/feeStructure/feeStructureSelectors'
import styles from './StudentProfile.module.css'
import StudentProfileFilter from './StudentProfileFilter'
import classNames from 'classnames'
import {useMemo, useState} from 'react'
import {useTranslation} from 'react-i18next'
import useInstituteAssignedStudents from '../../../../../pages/AttendanceReport/pages/StudentWiseAttendance/hooks/useInstituteAssignedStudents'

export default function StudentProfile({formValues, formErrors, handleChange}) {
  const {t} = useTranslation()

  const [selectedRows, setSelectedRows] = useState(new Set(formValues.students))
  const [filterOptions, setFilterOptions] = useState({
    search: '',
    selectedNodes: {},
  })
  const {feeTypes} = useFeeStructure()
  const {discountStudentsList: discountStudents, discountStudentsListLoading} =
    useFeeDiscount()
  let isSelectable = true
  const instituteActiveStudentList = useInstituteAssignedStudents()

  const discountStudentsList = useMemo(() => {
    let filteredList = []
    if (instituteActiveStudentList) {
      const discountStudentsMap = Object.assign(
        {},
        ...discountStudents.map((x) => ({[x._id]: x}))
      )

      instituteActiveStudentList.forEach((ele) => {
        if (ele._id in discountStudentsMap) {
          filteredList.push({...discountStudentsMap[ele._id], ...ele})
        }
      })
      return filteredList
    } else {
      return []
    }
  }, [discountStudents, instituteActiveStudentList])

  const checkForApplicableFilters = (student) => {
    if (
      filterOptions.search === '' &&
      Object.keys(filterOptions.selectedNodes).length === 0
    )
      return true
    else {
      const containsSearch =
        student?.name
          ?.toLowerCase()
          .includes(filterOptions.search.toLowerCase()) ||
        student?.enrollment_number
          ?.toLowerCase()
          .includes(filterOptions.search.toLowerCase()) ||
        student?.phone_number
          ?.toLowerCase()
          .includes(filterOptions.search.toLowerCase()) ||
        student?.email
          ?.toLowerCase()
          .includes(filterOptions.search.toLowerCase())
      const containsSections = Object.keys(
        filterOptions.selectedNodes
      ).includes(student.section_id)
      if (
        filterOptions.search !== '' &&
        Object.keys(filterOptions.selectedNodes).length > 0 &&
        containsSearch &&
        containsSections
      ) {
        return true
      } else if (filterOptions.search !== '' && containsSearch) {
        return true
      } else if (
        Object.keys(filterOptions.selectedNodes).length > 0 &&
        containsSections
      ) {
        return true
      }
    }
    return false
  }

  const cols = [
    // {key: 'enrollmentNo', label: 'Enrollment No.'},
    // {key: 'studentDetails', label: 'Student Details'},
    // {key: 'section', label: 'Class'},
    // {key: 'discount', label: 'Discount'},
    {key: 'enrollmentNo', label: t('enrollment')},
    {key: 'studentDetails', label: t('studentDetails')},
    {key: 'section', label: t('class')},
    {key: 'discount', label: t('discount')},
  ]

  let rows = []
  if (discountStudentsList.length === 0) {
    isSelectable = false
    rows.push({
      studentDetails: DISCOUNT.noDiscountFound,
    })
  } else {
    rows = discountStudentsList
      ?.filter((student) => {
        return checkForApplicableFilters(student)
      })
      ?.map((student) => {
        return {
          id: student._id,
          enrollmentNo: student.enrollment_number
            ? student.enrollment_number
            : 'N/A',
          studentDetails: (
            <div className={styles.studentDetails}>
              <img
                className={styles.img}
                src={student.pic_url || userDefaultImg}
              />
              <div>
                <div className={styles.name}>{student.name}</div>
                <div className={styles.phoneNumber}>
                  {student?.enrollment_number ||
                    student?.phone_number ||
                    student?.email}
                </div>
              </div>
            </div>
          ),
          section: student?.sectionName,
          discount: (
            <>
              {student.applied_discount.length > 0 && (
                <>
                  {student.applied_discount.slice(0, 2).join(', ')}
                  {student.applied_discount.length > 2 && (
                    <span className={styles.desc}>
                      +{student.applied_discount.length - 2} more
                    </span>
                  )}
                </>
              )}
              {student.applied_discount.length === 0 && 'N/A'}
            </>
          ),
        }
      })
  }

  const handleRowSelect = (rowId, checked) => {
    const newSet = new Set(selectedRows)
    checked ? newSet.add(rowId) : newSet.delete(rowId)
    setSelectedRows(newSet)
    handleChange('students', Array.from(newSet))
  }

  const handleSelectAll = (checked) => {
    const newSet = new Set(checked ? rows.map((r) => r.id) : [])
    setSelectedRows(newSet)
    handleChange('students', Array.from(newSet))
  }

  return (
    <div className={styles.profileTabContent}>
      <label className={styles.label}>
        {/* {DISCOUNT.studentProfileLabelPrefix +
          formValues.name +
          DISCOUNT.studentProfileLabelSuffix} */}
        {t('selectStudentsForThePrefix') +
          formValues.name +
          t('studentProfileLabelSuffix')}
      </label>
      <div className={styles.feeTypes}>
        {/* {DISCOUNT.studentProfileTabHeaderText} */}
        {t('studentProfileTabHeaderText')}
        <div className="ml-5 lh-20">
          <ul style={{listStyleType: 'disc'}}>
            {formValues.fee_types.map((type) => {
              return (
                <li key={type}>{feeTypes.find((t) => t._id === type).name}</li>
              )
            })}
          </ul>
        </div>
      </div>
      <div className={styles.studentProfileSection}>
        {formErrors.students && (
          <div className="mb-5 h-4 tm-color-red">{formErrors.students}</div>
        )}
        <StudentProfileFilter
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
          handleChange={handleChange}
        />
        {discountStudentsListLoading && (
          <div className={classNames('loader', styles.relative)}></div>
        )}
        {!discountStudentsListLoading && (
          <Table
            rows={rows}
            cols={cols}
            selectable={isSelectable}
            selectedRows={selectedRows}
            onSelectRow={handleRowSelect}
            onSelectAll={handleSelectAll}
            uniqueKey="id"
          />
        )}
      </div>
    </div>
  )
}
