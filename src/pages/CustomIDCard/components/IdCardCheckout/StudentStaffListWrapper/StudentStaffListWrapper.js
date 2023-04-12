import {
  Alert,
  ALERT_CONSTANTS,
  Button,
  BUTTON_CONSTANTS,
  Heading,
  Modal,
  MODAL_CONSTANTS,
  Para,
  SearchBar,
  Table,
  PARA_CONSTANTS,
  HEADING_CONSTANTS,
  Badges,
  BADGES_CONSTANTS,
} from '@teachmint/krayon'
import classNames from 'classnames'
import React, {useContext, useEffect, useMemo, useState} from 'react'
import {useTranslation} from 'react-i18next'
import ClassHeirarchy from '../../../../../components/Common/ClassHeirarchy/ClassHeirarchy'
import UserDetailsRow from '../../../../../components/Common/UserDetailsRow/UserDetailsRow'
import {
  getActiveStudents,
  roleListSelector,
} from '../../../../../redux/reducers/CommonSelectors'
import useStaffListHook from '../../../../../utils/CustomHooks/useStaffListHook'
import useInstituteHeirarchy from '../../../../AttendanceReport/pages/StudentWiseAttendance/hooks/useInstituteHeirarchy'
import useFilter from '../../../../CustomCertificate/components/UserListAndFilters/useFilter'
import {STAFF, STUDENT} from '../../../CustomId.constants'
import {getSelectedTemplateForUser} from '../../../redux/CustomId.selector'
import {ID_STAFF_COLS, ID_STUDENT_COLS} from './StudentStaffList.constants'
import styles from './StudentStaffListWrapper.module.css'
import {IdCardCheckoutContext} from '../IdCardCheckoutStates/IdCardCheckout.context'
import {IDCheckoutActions} from '../IdCardCheckoutStates/IdCardCheckout.reducer'
import {Trans} from 'react-i18next'
import {getRoleName} from '../../../../../utils/StaffUtils'
import globalActions from '../../../../../redux/actions/global.actions'
import {useDispatch} from 'react-redux'

const TemplateCard = ({
  templateImg,
  label,
  selectCount,
  total,
  onClick,
  isActive,
}) => {
  return (
    <div
      className={classNames(styles.templateCard, {
        [styles.activeTemplateCard]: isActive,
      })}
      onClick={onClick}
    >
      <div className={styles.img}>
        <img src={templateImg} alt="" />
      </div>
      <div>
        <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
          {label}
        </Heading>
        <Para
          textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
        >{`${selectCount}/${total} selected`}</Para>
      </div>
    </div>
  )
}

const StudentStaffListWrapper = () => {
  const {t} = useTranslation()
  const [activeTab, setActiveTab] = useState(STUDENT)
  const [showFilterModal, setShowFilter] = useState()
  const {idCardCheckoutData, internalDispatch} = useContext(
    IdCardCheckoutContext
  )
  const {data: staffTemplate} = getSelectedTemplateForUser('staff')
  const {data: studentTemplate} = getSelectedTemplateForUser('student')

  const dispatch = useDispatch()

  const [filters, setSelectedFilter] = useState({
    searchFilter: '',
    checkboxFilter: [],
  })
  const {heirarchy, handleSelection, allselectedSections} =
    useInstituteHeirarchy({
      allSelected: false,
    })

  useEffect(() => {
    dispatch(globalActions.idCardCheckoutPreviewUrls.reset())
    internalDispatch({
      type: IDCheckoutActions.TOGGLE_BACK_BUTTON_DISABILITY,
      data: true,
    })
    return () => {
      internalDispatch({
        type: IDCheckoutActions.TOGGLE_BACK_BUTTON_DISABILITY,
        data: false,
      })
    }
  }, [])

  useEffect(() => {
    const count =
      idCardCheckoutData?.selectedStudents.length +
      idCardCheckoutData?.selectedStaff.length
    internalDispatch({
      type: IDCheckoutActions.TOGGLE_NEXT_BUTTON_DISABILITY,
      data: count <= 49,
    })
  }, [idCardCheckoutData?.selectedStudents, idCardCheckoutData?.selectedStaff])

  const getSelectedRows = () => {
    if (activeTab === STUDENT) return idCardCheckoutData.selectedStudents
    else return idCardCheckoutData.selectedStaff
  }

  const studentList = getActiveStudents(true)
  const {activeStaffList} = useStaffListHook()
  const data = activeTab === STUDENT ? studentList : activeStaffList
  const rolesList = roleListSelector()

  const updateFilter = (type, value) => {
    setSelectedFilter({...filters, [type]: value})
  }

  const searchFilter = useFilter({
    data,
    keyToFilter: ['name', 'phone_number'],
    filterValue: filters.searchFilter,
  })

  const checkboxFilter = useFilter({
    data: searchFilter,
    keyToFilter: 'details.sections',
    filterValue: filters.checkboxFilter,
  })

  const getIMISFields = (template) => {
    return template?.fields?.IMIS || []
  }

  const getUsedFieldsForUser = (template) => {
    let fieldsUsedInTemplate = [
      ...getIMISFields(template?.front_template),
      ...getIMISFields(template?.back_template),
    ]
    return fieldsUsedInTemplate
  }

  const formatStudentData = () => {
    const data = checkboxFilter.map((item) => {
      const missingFields = getUsedFieldsForUser(studentTemplate).filter(
        (field) => {
          return !item[field.id]
        }
      ).length
      return {
        id: item._id,
        personalInfo: (
          <UserDetailsRow
            data={item}
            name={item.name}
            phoneNumber={item.phone_number}
            img={item.img_url}
          />
        ),
        class: (
          <Badges
            label={
              (item?.hierarchy_nodes?.length && item?.hierarchy_nodes[0]) ||
              'NA'
            }
            showIcon={false}
            size={BADGES_CONSTANTS.SIZE.SMALL}
            className={styles.badge}
          />
        ),
        missingFields: (
          <>
            {missingFields ? (
              <Alert
                type={ALERT_CONSTANTS.TYPE.WARNING}
                hideClose={true}
                className={styles.alert}
                content={
                  <Trans key={'countInfoMissing'}>
                    {{missingFields}} info missing
                  </Trans>
                }
              />
            ) : (
              ''
            )}
          </>
        ),
      }
    })
    return data
  }

  const formatStaffData = () => {
    const data = checkboxFilter
      .filter((i) => i.verification_status != 4)
      .map((item) => {
        const missingFields = getUsedFieldsForUser(staffTemplate).filter(
          (field) => {
            return !item[field.id]
          }
        ).length
        return {
          id: item._id,
          personalInfo: (
            <UserDetailsRow
              data={item}
              name={item.name}
              phoneNumber={item.phone_number}
              img={item.img_url}
            />
          ),
          role: (
            <Badges
              label={getRoleName(item, rolesList)}
              showIcon={false}
              size={BADGES_CONSTANTS.SIZE.SMALL}
              className={styles.badge}
            />
          ),
          missingFields: (
            <>
              {missingFields ? (
                <Alert
                  type={ALERT_CONSTANTS.TYPE.WARNING}
                  hideClose={true}
                  className={styles.alert}
                  content={
                    <Trans key={'countInfoMissing'}>
                      {{missingFields}} info missing
                    </Trans>
                  }
                />
              ) : (
                ''
              )}
            </>
          ),
        }
      })
    return data
  }

  const getRows = () => {
    if (activeTab === STUDENT) {
      return formatStudentData()
    } else return formatStaffData()
  }
  const rows = useMemo(() => getRows(), [filters, data])

  const onSelectAll = (isSelected) => {
    const action =
      activeTab === STUDENT
        ? IDCheckoutActions.UPDATE_STUDENT_LIST
        : IDCheckoutActions.UPDATE_STAFF_LIST

    const selected = []
    if (isSelected) {
      rows.forEach((item) => selected.push(item.id))
    }
    internalDispatch({
      type: action,
      data: selected,
    })
  }

  const onSelectRow = (id, checked) => {
    const action =
      activeTab === STUDENT
        ? IDCheckoutActions.UPDATE_STUDENT_LIST
        : IDCheckoutActions.UPDATE_STAFF_LIST

    const selectedRows =
      activeTab === STUDENT
        ? idCardCheckoutData.selectedStudents
        : idCardCheckoutData.selectedStaff
    const newSelectedRows = [...selectedRows]
    if (checked) newSelectedRows.push(id)
    else if (newSelectedRows.indexOf(id) > -1) {
      newSelectedRows.splice(newSelectedRows.indexOf(id), 1)
    }
    internalDispatch({
      type: action,
      data: newSelectedRows,
    })
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.idCardPreviewCards}>
        {studentTemplate && (
          <TemplateCard
            onClick={() => {
              setActiveTab(STUDENT)
            }}
            templateImg={studentTemplate?.front_template.thumbnail_url}
            label={t('customId.idCardForStudent')}
            isActive={activeTab == STUDENT}
            total={studentList.length}
            selectCount={idCardCheckoutData.selectedStudents.length}
          />
        )}
        {staffTemplate && (
          <TemplateCard
            onClick={() => {
              setActiveTab(STAFF)
            }}
            templateImg={staffTemplate?.front_template.thumbnail_url}
            label={t('customId.idCardForStaff')}
            isActive={activeTab == STAFF}
            total={activeStaffList.length}
            selectCount={idCardCheckoutData.selectedStaff.length}
          />
        )}
      </div>
      <div className={styles.tableBlock}>
        <div className={styles.searchBlock}>
          <SearchBar
            placeholder={t('seachByName')}
            handleChange={({value}) => {
              updateFilter('searchFilter', value)
            }}
            value={filters.searchFilter}
          />
          {activeTab === STUDENT && (
            <>
              <Button
                prefixIcon="filter"
                type={BUTTON_CONSTANTS.TYPE.OUTLINE}
                onClick={() => setShowFilter(true)}
              >
                {t('filters')}
              </Button>
              <Modal
                isOpen={showFilterModal}
                size={MODAL_CONSTANTS.SIZE.SMALL}
                onClose={() => setShowFilter(false)}
                header={`${t('filter')}: ${t('classSection')}`}
                classes={{
                  modal: styles.modal,
                  content: styles.modalContent,
                  footer: styles.modalFooter,
                }}
                actionButtons={[
                  {
                    body: t('close'),
                    onClick: () => setShowFilter(false),
                    type: 'outline',
                  },
                  {
                    body: t('apply'),
                    onClick: () => {
                      updateFilter('checkboxFilter', allselectedSections)
                      setShowFilter(false)
                    },
                  },
                ]}
              >
                <ClassHeirarchy
                  heirarchy={heirarchy?.department}
                  handleSelection={handleSelection}
                />
              </Modal>
            </>
          )}
        </div>
        <div className={styles.tableContainer}>
          <Table
            virtualized
            cols={activeTab == STUDENT ? ID_STUDENT_COLS() : ID_STAFF_COLS()}
            rows={rows}
            isSelectable={true}
            onSelectAll={onSelectAll}
            onSelectRow={onSelectRow}
            selectedRows={getSelectedRows()}
            autoSize
            classes={{
              table: styles.table,
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default StudentStaffListWrapper
